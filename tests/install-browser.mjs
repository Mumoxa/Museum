#!/usr/bin/env node
/* ============================================================================
   ASSEMBLE A TEST BROWSER
   ----------------------------------------------------------------------------
   Unpacks the Chromium that ships inside the @sparticuz/chromium package into
   /tmp/mchr, and compiles the three NSPR libraries it expects but does not
   carry. Nothing here is needed on a machine that already has Chrome; this
   exists so that the visual pass and the e2e suite can run in a bare sandbox.

   Run: node tests/install-browser.mjs
   ========================================================================= */
import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { brotliDecompressSync } from 'node:zlib';
import { join } from 'node:path';

const OUT = process.env.BROWSER_DIR ?? '/tmp/mchr';
const PKG = 'node_modules/@sparticuz/chromium/bin';

if (!existsSync(PKG)) {
  console.error(`${PKG} is missing. Run npm install first.`);
  process.exit(2);
}
if (existsSync(join(OUT, 'chromium')) && existsSync(join(OUT, 'lib', 'libnspr4.so'))) {
  console.log(`browser already assembled at ${OUT}`);
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
mkdirSync(join(OUT, 'lib'), { recursive: true });

const unpack = (src, out) => {
  const t = Date.now();
  writeFileSync(join(OUT, out), brotliDecompressSync(readFileSync(join(PKG, src))));
  console.log(`  ${out}  ${((Date.now() - t) / 1000).toFixed(1)}s`);
};

console.log('unpacking chromium');
unpack('chromium.br', 'chromium');
chmodSync(join(OUT, 'chromium'), 0o755);
for (const [src, out] of [['al2.tar.br', 'al2.tar'], ['swiftshader.tar.br', 'swiftshader.tar']]) unpack(src, out);

for (const tar of ['al2.tar', 'swiftshader.tar']) {
  execFileSync('tar', ['-xf', tar], { cwd: OUT, stdio: 'inherit' });
}
console.log('  libraries  ', execFileSync('ls', ['lib'], { cwd: OUT }).toString().trim().split('\n').length, 'from the package');

/* NSPR: referenced by libnss3 for certificate work, absent from the package.
   Chromium only touches it when it has to verify TLS, which a test against a
   local http server never does, so the symbols exist to satisfy the loader. */
const missing = ['libnspr4', 'libplc4', 'libplds4'];
const nm = execFileSync('bash', ['-c',
  `nm -D --undefined-only ${join(OUT, 'lib', 'libnss3.so')} ${join(OUT, 'lib', 'libnssutil3.so')} ${join(OUT, 'lib', 'libsoftokn3.so')} ${join(OUT, 'chromium')} 2>/dev/null | awk '$1 == "U" {print $2}' | sed 's/@.*//' | sort -u | grep -E "^_?(PL_|PR_)"`,
]).toString().trim().split('\n').filter(Boolean);
const symbols = [...new Set([...missing.map(() => []).flat(), ...nm, 'PL_CompareValues'])].sort();
writeFileSync(join(OUT, 'nspr_shim.c'), symbols.map((s) => `void ${s}(void) {}`).join('\n') + '\n');
for (const lib of missing) {
  execFileSync('gcc', ['-shared', '-fPIC', '-O1', `-Wl,-soname,${lib}.so`, '-o', join(OUT, 'lib', `${lib}.so`), join(OUT, 'nspr_shim.c')]);
}
console.log(`  nspr shim  ${symbols.length} symbols -> ${missing.join(', ')}`);
console.log(`browser ready: ${OUT}/chromium`);
