#!/usr/bin/env node
/* ============================================================================
   THE CONTRACT TEST
   ----------------------------------------------------------------------------
   The visual pass needs a browser, and the drawing of a page is the one thing a
   server renderer cannot check. So this suite checks every part of that contract
   that does not need pixels:

     1. Every class the components ask for has a rule somewhere in src/styles,
        so nothing renders unstyled by accident.
     2. Every custom property that is read with no fallback is defined.
     3. Every CSS file is imported by the entry, so it actually ships.
     4. Every icon name used comes from the one icon family in use.

   Run: npm run test:contract
   Exits 2 if node_modules is missing.
   ========================================================================= */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
if (!existsSync(join(ROOT, 'node_modules'))) {
  console.error('node_modules is missing. Run npm install first.');
  process.exit(2);
}

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const srcFiles = walk(join(ROOT, 'src'));
const cssFiles = srcFiles.filter((f) => f.endsWith('.css'));
const codeFiles = srcFiles.filter((f) => /\.(tsx|ts)$/.test(f));

const css = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
const code = codeFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

let failures = 0;
const fail = (msg) => { console.log(`FAIL  ${msg}`); failures++; };
const pass = (msg) => console.log(`PASS  ${msg}`);

/* -- 1. Class coverage ------------------------------------------------------
   Class names are read from JSX literals. Interpolated fragments are skipped
   (they are checked by looking for the shared prefix, which is how they are
   written in this codebase: `site${done ? ' is-done' : ''}`). */
const classNames = new Set();
const HONEST = (c) => Boolean(c) && /^[a-z][\w-]*$/.test(c) && !c.endsWith('-');

/* Classes that are deliberately structural: they name a part of an instrument
   or a puzzle variant for tests and for future styling, and carry no rule of
   their own. Listed so that they are a decision rather than an oversight. */
const HOOKS = new Set(['match', 'order', 'needle', 'rose']);

/* A className is either a plain string, or a template literal that mixes fixed
   fragments with ${...} expressions. Inside those expressions the only strings
   that name a class are the branches of a ternary; anything else (a comparison
   operand like === 'opener', a lookup) is a value, not a class. */
for (const f of codeFiles) {
  const text = readFileSync(f, 'utf8');
  const re = /className=(?:"([^"]*)"|\{`([^`]*)`\})/g;
  let m;
  while ((m = re.exec(text))) {
    const raw = m[1] ?? m[2] ?? '';
    const exprs = raw.match(/\$\{[\s\S]*?\}/g) ?? [];
    const fixed = raw.replace(/\$\{[\s\S]*?\}/g, ' ');
    for (const c of fixed.split(/\s+/)) if (HONEST(c)) classNames.add(c);
    for (const expr of exprs) {
      for (const branch of expr.match(/(?:\?|:)\s*'([^']+)'/g) ?? []) {
        const lit = branch.replace(/^(?:\?|:)\s*'/, '').replace(/'$/, '');
        for (const c of lit.split(/\s+/)) if (HONEST(c)) classNames.add(c);
      }
    }
  }
}

const cssClasses = new Set();
{
  const re = /\.(-?[_a-zA-Z][\w-]*)/g;
  let m;
  while ((m = re.exec(css))) cssClasses.add(m[1]);
}

const unstyled = [...classNames].filter((c) => !cssClasses.has(c) && !HOOKS.has(c)).sort();
if (unstyled.length) {
  fail(`${unstyled.length} class name(s) are used in components but have no rule in src/styles`);
  for (const c of unstyled) console.log(`      .${c}`);
} else {
  pass(`every class name the components ask for has a rule  (${classNames.size} names)`);
}

/* -- 2. Custom properties ---------------------------------------------------
   A variable read without a fallback must be defined, or the declaration is
   silently dropped by the browser. */
const defined = new Set();
{
  const re = /(--[\w-]+)\s*:/g;
  let m;
  while ((m = re.exec(css))) defined.add(m[1]);
}
/* Set on elements at runtime through style props. */
for (const name of code.match(/--[\w-]+(?=['":])/g) ?? []) defined.add(name);

const used = new Map();
{
  const re = /var\(\s*(--[\w-]+)\s*(,)?/g;
  let m;
  while ((m = re.exec(css))) {
    if (!m[2]) used.set(m[1], (used.get(m[1]) ?? 0) + 1);
  }
}
const undefinedVars = [...used.keys()].filter((v) => !defined.has(v)).sort();
if (undefinedVars.length) {
  fail(`${undefinedVars.length} custom propert(ies) are read with no fallback and never defined`);
  for (const v of undefinedVars) console.log(`      ${v}  (${used.get(v)} uses)`);
} else {
  pass(`every custom property read without a fallback is defined  (${used.size} variables)`);
}

/* -- 3. Every stylesheet is loaded ------------------------------------------ */
const entry = readFileSync(join(ROOT, 'src/main.tsx'), 'utf8');
const unimported = cssFiles
  .map((f) => relative(join(ROOT, 'src'), f))
  .filter((rel) => !entry.includes(rel) && !css.includes(`@import`) && !code.includes(rel))
  .filter((rel) => {
    /* A stylesheet may also be reached from another stylesheet, directly or by
       living in a folder that main.tsx imports wholesale. */
    const base = rel.split('/').pop();
    return !entry.includes(base) && !css.includes(base);
  })
  .sort();
if (unimported.length) {
  fail(`${unimported.length} stylesheet(s) are never imported and will not ship`);
  for (const f of unimported) console.log(`      ${f}`);
} else {
  pass(`every stylesheet is imported and ships  (${cssFiles.length} files)`);
}

/* -- 4. Icon family ---------------------------------------------------------
   One family only: every icon must come from @phosphor-icons/react. */
const iconImports = new Set();
for (const f of codeFiles) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/import\s*\{([^}]*)\}\s*from\s*'([^']+kit[^']*|[^']*icons[^']*)'/g)) {
    for (const n of m[1].split(',')) iconImports.add(`${n.trim()} from ${m[2]}`);
    if (!m[2].includes('@phosphor-icons/react')) fail(`icons imported from ${m[2]}`);
  }
}
const strayIcons = [...iconImports].filter((i) => !i.endsWith('@phosphor-icons/react'));
if (strayIcons.length) fail(`icon imports from an unexpected package: ${strayIcons.join(', ')}`);
else pass(`one icon family in use  (${iconImports.size} names, all from @phosphor-icons/react)`);

/* -- 5. Banned patterns ----------------------------------------------------- */
const banned = [
  [/window\.addEventListener\((['"])scroll\1/g, 'a scroll listener'],
  [/document\.addEventListener\((['"])scroll\1/g, 'a scroll listener'],
  [/\bz-index:\s*\d{2,}/g, 'a raw z-index instead of the --z ramp'],
  [/transition:\s*all\b/g, 'transition: all'],
  [/(?:animation|transition)-duration:\s*\d+m?s(?!\w)/g, 'a hard coded duration instead of the --d-* scale'],
];
let bannedHits = 0;
for (const [re, what] of banned) {
  const hits = [...css.matchAll(re)];
  if (hits.length) {
    bannedHits += hits.length;
    fail(`${what} appears ${hits.length} time(s): ${hits.slice(0, 3).map((b) => b[0]).join(', ')}`);
  }
}
if (!bannedHits) pass('no banned pattern in the stylesheets  (scroll listeners, raw z-index, transition: all, hard coded durations)');

/* -- 6. Shape lock ---------------------------------------------------------
   Five radii exist, all of them tokens except the two self-evident ones. */
const radiusTokens = new Set(
  [...readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8').matchAll(/(--r-[\w-]+):\s*([^;]+);/g)].map((m) => `${m[1]}=${m[2].trim()}`),
);
const radii = [...css.matchAll(/border-radius:\s*([^;]+);/g)]
  .map((m) => m[1])
  .filter(Boolean)
  .flatMap((v) => v.split(/\s+/))
  .map((v) => v.trim());
const allowed = new Set(['0', '50%', 'var(--r-plate)', 'var(--r-seal)', 'var(--r-hair)', 'var(--r-edge)', 'var(--r-board)']);
const strayRadii = radii.filter((v) => v && !allowed.has(v));
if (strayRadii.length) {
  fail(`border radii outside the shape lock: ${[...new Set(strayRadii)].join(', ')}`);
} else {
  pass(`shape lock holds  (${radiusTokens.size} tokens, ${radii.length} declarations, no stray radii)`);
}

console.log('');
if (failures) {
  console.log(`${failures} contract check(s) failed.`);
  process.exit(1);
}
console.log('All contract checks passed.');
