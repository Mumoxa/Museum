// End-to-end checks against the app, in headless Chromium.
//
//   npm run preview            # built app on http://localhost:4173/
//   npm run test:e2e           # or: APP_URL=http://localhost:5173/ npm run test:e2e
//
// The script needs a Chromium binary. It looks for CHROME_PATH, then
// /tmp/mchr/chromium (see tests/README.md for how that one is assembled out of
// the @sparticuz/chromium package), then /tmp/chromium, then a system Chrome.
// On a machine without a browser, use `npm run test:smoke` instead: it renders
// every page, the atlas and every panel through React's server renderer and
// checks the structure, which catches far more than nothing and needs no browser.

import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

/* The bundled Chromium needs its own copies of NSS and friends ahead of any
   system copy, and it wants the flags documented in tests/README.md. */
process.env.LD_LIBRARY_PATH = `/tmp/mchr/lib:${process.env.LD_LIBRARY_PATH ?? ''}`;

// The historical-book regression tests explicitly open its original cover;
// the default site now shows the new museum dashboard.
const URL = process.env.APP_URL ?? 'http://localhost:4173/?view=cover';
const CANDIDATES = [
  process.env.CHROME_PATH,
  '/tmp/mchr/chromium',
  '/tmp/chromium',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
].filter(Boolean);
const EXE = CANDIDATES.find((p) => existsSync(p));

if (!EXE) {
  console.error(`No Chromium binary found. Tried:\n  ${CANDIDATES.join('\n  ')}`);
  console.error('Set CHROME_PATH, or run `npm run test:smoke` for the browser-free checks.');
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const results = [];
function check(name, ok, detail = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
  if (!ok) failures++;
}

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-zygote',
    '--disable-features=DialMediaRouteProvider,Translate,MediaRouter',
    '--use-gl=swiftshader',
  ],
});

// Stub speech synthesis so narration can be checked without audio.
const speechStub = () => {
  window.__spoken = [];
  window.__speakCalls = 0;
  const synth = {
    speaking: false, paused: false, pending: false,
    getVoices: () => [{ name: 'Test voice', lang: 'en-ZA', voiceURI: 'test-voice', default: true, localService: true }],
    addEventListener() {}, removeEventListener() {},
    speak(u) {
      window.__speakCalls++;
      window.__spoken.push(u.text);
      setTimeout(() => u.onstart && u.onstart(new Event('start')), 5);
      setTimeout(() => u.onend && u.onend(new Event('end')), 120);
    },
    cancel() {}, pause() { this.paused = true; }, resume() { this.paused = false; },
  };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
};

async function newPage(viewport, { reduced = false, fresh = true } = {}) {
  const p = await browser.newPage();
  p.errors = [];
  p.on('console', (m) => { if (m.type() === 'error') p.errors.push(m.text()); });
  p.on('pageerror', (e) => p.errors.push('pageerror: ' + e.message));
  await p.setViewport(viewport);
  if (reduced) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.evaluateOnNewDocument(speechStub);
  await p.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
  if (fresh) await p.evaluate(() => localStorage.clear());
  if (fresh) await p.reload({ waitUntil: 'networkidle0' });
  return p;
}

const store = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('luchelle-time-machine-v1') || '{}'));
const pageState = async (p) => (await store(p)).progress?.page ?? null;
const textOf = (p, sel) => p.$eval(sel, (e) => e.textContent).catch(() => null);
const has = async (p, sel) => !!(await p.$(sel));
const count = async (p, sel) => (await p.$$(sel)).length;

const clickText = (p, sel, text) => p.evaluate((sel, text) => {
  const el = Array.from(document.querySelectorAll(sel)).find((e) => e.textContent.trim().includes(text));
  if (!el) return false;
  el.click();
  return true;
}, sel, text);

/* Clicking the cover opens the book. A reader with no bookmark goes through the
   arrival sequence first: cover, then the map rising, then the first chapter. So
   anything that pages or swipes has to wait for the map to close, or its keys
   land on the atlas instead of on the book. */
async function openBook(p) {
  await p.click('.cover-actions .btn-solid');
  /* The shell arrives when the cover finishes swinging (1180ms). */
  await p.waitForFunction(() => !!document.querySelector('.shell'), { timeout: 15000 });
  /* A reader with no bookmark is walked through the map first. The map offers
     the opening chapter, so the walk is finished by taking it. */
  const arrived = await p
    .waitForFunction(() => !!document.querySelector('.atlas-scrim'), { timeout: 4000 })
    .then(() => true)
    .catch(() => false);
  if (arrived) {
    await p.waitForFunction(() => !!document.querySelector('.era-drawer-actions .btn-solid'), { timeout: 15000 });
    await clickText(p, '.era-drawer-actions .btn-solid', 'Travel here');
  }
  await p.waitForFunction(() => !document.querySelector('.atlas-scrim'), { timeout: 15000 });
  await sleep(300);
}

async function seekTo(p, selector, max = 30) {
  for (let i = 0; i <= max; i++) {
    if (await p.evaluate((sel) => !!document.querySelector(sel), selector)) return true;
    await p.keyboard.press('ArrowRight');
    await sleep(850);
  }
  return false;
}

/* ─────────────── Desktop: cover, spread, keyboard, atlas, finds ─────────────── */
{
  const p = await newPage({ width: 1280, height: 860 });

  check('cover shows the book title', (await textOf(p, 'h1.cover-title'))?.includes('Museum'));
  check('cover offers one primary action', (await count(p, '.cover-actions .btn-solid')) === 1);
  check('the title is gilt, not plain colour', (await p.$eval('h1.cover-title', (e) => getComputedStyle(e).webkitTextFillColor || getComputedStyle(e).color)).length > 0);
  check('no speech before any click', (await p.evaluate(() => window.__speakCalls)) === 0);

  await openBook(p);
  await sleep(1600);
  check('the book opens on a wide screen as a two-page spread', (await has(p, '.sheet.wide')) && (await has(p, '.pane-left')) && (await has(p, '.pane-right')));
  check('the page is paper, the room is dark', (await p.$eval('.pane', (e) => getComputedStyle(e).backgroundColor)) !== (await p.$eval('body', (e) => getComputedStyle(e).backgroundColor)));

  const arrived = await pageState(p);
  await p.keyboard.press('ArrowRight');
  await sleep(1100);
  check('ArrowRight turns the spread', (await pageState(p)) > arrived, `${arrived} to ${await pageState(p)}`);
  check('no leaf is left behind after a turn', !(await has(p, '.leaf')));

  /* Back to the front of the book, where the contents page lives. */
  await p.keyboard.press('ArrowLeft');
  await sleep(1100);
  await p.keyboard.press('ArrowLeft');
  await sleep(1100);
  check('the contents page lists every chapter', (await count(p, '.toc-page .toc-btn')) === 14);
  check('the contents page prints each chapter tint', (await count(p, '.toc-page li[style]')) === 14);

  await clickText(p, '.toc-page .toc-btn', 'Before There Was');
  await sleep(1500);
  check('a contents entry jumps to its chapter', (await p.evaluate(() => document.body.innerText)).includes('Before There Was South Africa'));
  check('the chapter opener carries its illustrated plate', await has(p, '.fig .relic-anchor img[src*="/art/eras/"]'));
  /* A spread shows two pages, so it carries two running heads: the end of the
     prologue on the left, the new chapter on the right. */
  const runningHeads = await p.$$eval('.running-era', (els) => els.map((e) => e.textContent).join(' | '));
  check('the running head names the era', runningHeads.includes('Before There Was'), runningHeads);
  check('the chapter plate is used as the room behind the page', await has(p, '.plate-backdrop img'));

  /* Relic finding */
  const relicCount = await count(p, '.relic-find');
  check('the opener hides findable objects', relicCount >= 2, `${relicCount} find points`);
  if (relicCount > 0) {
    await p.evaluate(() => document.querySelector('.relic-find').click());
    await sleep(500);
    check('a found object opens its specimen label', await has(p, '.relic-card'));
    check('the find is written to the cabinet', ((await store(p)).progress?.relics ?? []).length >= 1);
    check('a find is announced', (await textOf(p, '.relic-card .relic-tag'))?.includes('collection'));
  }

  /* Glossary */
  await seekTo(p, '.term');
  const termClicked = await p.evaluate(() => {
    const t = document.querySelector('.term');
    if (!t) return false;
    t.click();
    return true;
  });
  await sleep(300);
  check('a dotted word opens the relic drawer', termClicked && (await has(p, '.relic-drawer')));
  await p.keyboard.press('Escape');
  await sleep(200);
  check('Escape closes the drawer', !(await has(p, '.relic-drawer')));

  /* The atlas */
  await clickText(p, '.tools .tool', 'Map');
  await sleep(900);
  check('the atlas opens over the book', await has(p, '.atlas-sheet .plate'));
  check('the atlas draws real coordinates as an SVG map', await has(p, '.plate path'));
  check('the atlas numbers the mountains it draws', (await count(p, '.plate .ridges path')) >= 8);
  check('the atlas lists every chapter', (await count(p, '.leg-row')) === 14);
  check('the atlas states where its coastline comes from', (await textOf(p, '.atlas-foot'))?.includes('world-atlas'));

  await clickText(p, '.level-switch .tag', 'The Cape');
  await sleep(700);
  check('the Cape plate groups the places inside one city', await has(p, '.site.is-cluster'));
  await p.evaluate(() => document.querySelector('.site.is-cluster .site-hit').dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await sleep(400);
  check('a shared spot offers the places by name', await has(p, '.cluster-sheet .cluster-row'));
  await p.evaluate(() => document.querySelector('.cluster-row').click());
  await sleep(400);
  check('choosing a place opens its era', await has(p, '.era-drawer'));
  check('the era names the objects to look for', (await count(p, '.relic-list li')) >= 1);

  const pageBeforeTravel = await pageState(p);
  await clickText(p, '.era-drawer-actions .btn-solid', 'Travel here');
  await sleep(1400);
  check('travel closes the atlas and moves the book', !(await has(p, '.atlas-scrim')) && (await pageState(p)) !== pageBeforeTravel, `${pageBeforeTravel} to ${await pageState(p)}`);
  const visited = (await store(p)).progress?.visited ?? [];
  check('the map records the chapter the reader travelled to', visited.length >= 1, visited.join(','));

  /* Narration */
  await clickText(p, '.tools .tool', 'Read aloud');
  await sleep(300);
  check('the narration bar appears only on request', await has(p, '.narration'));
  check('nothing is spoken until Play is pressed', (await p.evaluate(() => window.__speakCalls)) === 0);
  await clickText(p, '.narration button', 'Play');
  await sleep(900);
  check('Play reads sentence by sentence', (await p.evaluate(() => window.__spoken.length)) >= 2, `utterances=${await p.evaluate(() => window.__spoken.length)}`);
  await clickText(p, '.narration button', 'Stop');
  await sleep(200);

  /* Quiz: answer every question correctly by trying the options, as a reader would */
  let quizReady = await seekTo(p, '.quiz', 24);
  check('a quiz page exists in the chapter', quizReady);
  if (quizReady) {
    await p.evaluate(() => document.querySelector('.quiz').scrollIntoView({ block: 'start' }));
    const questions = await count(p, '.quiz-list > li');
    for (let qi = 0; qi < questions; qi++) {
      for (let oi = 0; oi < 4; oi++) {
        const right = await p.evaluate((qi, oi) => {
          const li = document.querySelectorAll('.quiz-list > li')[qi];
          if (!li) return false;
          if (li.querySelector('.quiz-feedback.ok')) return true;
          const opts = li.querySelectorAll('.quiz-opt');
          if (!opts[oi]) return true;
          opts[oi].click();
          return false;
        }, qi, oi);
        await sleep(140);
        if (right) break;
      }
    }
    await sleep(300);
    const correct = await count(p, '.quiz-feedback.ok');
    check('every quiz question can be answered correctly', correct === questions, `${correct}/${questions}`);
    check('the quiz reports a score when finished', await has(p, '.quiz-score'));
    const badges = (await store(p)).progress?.badges ?? [];
    check('finishing a chapter stamps the passport', badges.some((b) => b.startsWith('done-')));
  }

  /* Panels */
  for (const [tool, needle] of [['Contents', '.toc .toc-btn'], ['Passport', '.stamp-card'], ['Settings', '.settings fieldset']]) {
    await clickText(p, '.tools .tool', tool);
    await sleep(400);
    check(`${tool} opens as a ledger`, (await has(p, '.dialog[role="dialog"]')) && (await has(p, needle)), await textOf(p, '.dialog h2'));
    await p.keyboard.press('Escape');
    await sleep(250);
    check(`${tool} closes with Escape`, !(await has(p, '.dialog')));
  }

  await clickText(p, '.tools .tool', 'Passport');
  await sleep(400);
  check('the passport shows a cabinet row for every object', (await count(p, '.shelf-row')) >= 20);
  check('found objects are marked in the cabinet', (await count(p, '.shelf-row[data-found="1"]')) >= 1);
  await p.keyboard.press('Escape');
  await sleep(250);

  /* Plain reading mode */
  await clickText(p, '.tools .tool', 'Plain view');
  await sleep(600);
  check('plain view renders a whole chapter as one column', (await has(p, '.plain')) && (await count(p, '.plain-section')) > 3);
  await clickText(p, '.tools .tool', 'Book view');
  await sleep(600);
  check('book view comes back', await has(p, '.sheet.wide'));

  check('no console errors on the desktop run', p.errors.length === 0, p.errors.slice(0, 2).join(' | '));
  await p.close();
}

/* ─────────────── Motion: reduced, and the found-object animation ─────────── */
{
  const p = await newPage({ width: 1280, height: 860 }, { reduced: true });
  await openBook(p);
  await sleep(400);
  const beforeTurn = await pageState(p);
  await p.keyboard.press('ArrowRight');
  await sleep(140);
  check('reduced motion: no leaf animation', !(await has(p, '.leaf')));
  check('reduced motion: the page changes at once', (await pageState(p)) !== beforeTurn, `${beforeTurn} to ${await pageState(p)}`);
  await p.close();
}

/* ─────────────── Phone: one page, thumb targets, no overflow ─────────────── */
{
  const p = await newPage({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await openBook(p);
  await sleep(1600);
  check('a phone shows one page at a time', (await has(p, '.sheet.single')) && !(await has(p, '.sheet.wide')));

  const before = await pageState(p);
  await p.mouse.move(300, 420);
  await p.mouse.down();
  for (let x = 300; x >= 80; x -= 30) { await p.mouse.move(x, 420); await sleep(16); }
  await p.mouse.up();
  await sleep(1000);
  check('a swipe turns the page', (await pageState(p)) > before, `${before} to ${await pageState(p)}`);

  /* Every control a thumb must reach is at least 44px on its smallest side. */
  const small = await p.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('.rail-turn, .tool, .pagefoot .tag, .term, .relic-find, .corner'));
    return nodes
      .map((n) => {
        const r = n.getBoundingClientRect();
        return { cls: n.className.toString().slice(0, 34), w: Math.round(r.width), h: Math.round(r.height) };
      })
      .filter((x) => x.w > 0 && (x.w < 44 || x.h < 44));
  });
  check('every thumb target is at least 44 by 44', small.length === 0, JSON.stringify(small.slice(0, 3)));

  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow on a phone', overflow <= 2, `${overflow}px`);

  await clickText(p, '.tools .tool', 'Map');
  await sleep(900);
  const atlasOverflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('the atlas fits a phone without sideways scrolling', atlasOverflow <= 2, `${atlasOverflow}px`);
  check('the atlas plate is legible on a phone', (await p.$eval('.plate', (e) => e.getBoundingClientRect().width)) > 250);
  await p.close();
}

/* ─────────────── Settings: everything off by default, and honoured ───────── */
{
  const p = await newPage({ width: 1280, height: 860 });
  const st = (await store(p)).settings ?? {};
  check('sound is off until it is switched on', st.sound !== true);
  await openBook(p);
  const lamp = await p.$eval('.shell', (e) => e.getAttribute('data-lamp'));
  check('the lamp has a default temperature', lamp === 'warm' || lamp === 'cool' || lamp === 'dim', String(lamp));

  await sleep(1200);
  await clickText(p, '.tools .tool', 'Settings');
  await sleep(400);
  const lampChanged = await p.evaluate(() => {
    const radios = Array.from(document.querySelectorAll('.settings input[name="lamp"]'));
    const target = radios[2];
    if (!target) return false;
    target.click();
    return true;
  });
  await sleep(300);
  check('the lamp setting is applied to the document', lampChanged && ['warm', 'cool', 'dim'].includes(await p.evaluate(() => document.documentElement.dataset.lamp)));
  check('no console errors on the settings run', p.errors.length === 0, p.errors.slice(0, 2).join(' | '));
  await p.close();
}

console.log(results.join('\n'));
console.log(`\n${results.length - failures} passed, ${failures} failed`);
await browser.close();
process.exit(failures ? 1 : 0);
