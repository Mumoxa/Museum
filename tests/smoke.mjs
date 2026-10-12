// Runs the browser-free smoke test: bundle the entry with esbuild, then run it
// under Node with React's server renderer.
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(mkdtempSync(resolve(tmpdir(), 'museum-smoke-')), 'smoke.cjs');

await build({
  entryPoints: [resolve(here, 'smoke.entry.tsx')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: out,
  logLevel: 'error',
  loader: { '.css': 'empty' },
  define: { 'import.meta.env': JSON.stringify({ BASE_URL: '/' }) },
});

const run = spawnSync(process.execPath, [out], { stdio: 'inherit' });
process.exit(run.status ?? 1);
