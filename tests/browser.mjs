// Where the test browser comes from, for both the e2e suite and the screenshot tool.
//
// The sandbox this project is developed in has no system Chromium and no way to
// install one, so the browser is assembled from the @sparticuz/chromium package:
//
//   node tests/install-browser.mjs      # writes /tmp/mchr/chromium
//
// That package ships a Chromium build plus the Amazon Linux shared libraries it
// needs. It does not ship NSPR (libnspr4/libplc4/libplds4), which Chromium only
// needs for certificate handling, so tests/install-browser.mjs compiles a small
// shim for those three. The book reads over plain HTTP from localhost, so no TLS
// path is ever exercised. On a normal machine with Chrome installed, none of this
// matters: set CHROME_PATH and the system browser is used as is.
import { existsSync } from 'node:fs';

export const BROWSER_DIR = process.env.BROWSER_DIR ?? '/tmp/mchr';

const CANDIDATES = [
  process.env.CHROME_PATH,
  `${BROWSER_DIR}/chromium`,
  '/tmp/chromium',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export function findChrome() {
  const exe = CANDIDATES.find((p) => existsSync(p));
  if (!exe) {
    console.error(`No Chromium binary found. Tried:\n  ${CANDIDATES.join('\n  ')}`);
    console.error('Run node tests/install-browser.mjs, or set CHROME_PATH.');
    console.error('Without a browser, `npm run test:smoke` and `npm run test:contract` still check the structure.');
    return null;
  }
  if (existsSync(`${BROWSER_DIR}/lib`)) {
    process.env.LD_LIBRARY_PATH = `${BROWSER_DIR}/lib:${process.env.LD_LIBRARY_PATH ?? ''}`;
  }
  return exe;
}

/* Flags that make a Lambda-shaped Chromium behave like a normal headless one. */
export const LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--no-zygote',
  '--force-color-profile=srgb',
  '--disable-features=DialMediaRouteProvider,Translate,MediaRouter',
  '--font-render-hinting=none',
];
