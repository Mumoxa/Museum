# Tests

Four commands. The first three need nothing but `npm install`; the fourth needs a browser.

| Command | What it checks | Needs |
|---|---|---|
| `npm run test:smoke` | Renders all 116 pages, the atlas, every panel and every device through React's server renderer. 32 structural facts: plate counts, find pages, clusters, tints, plain reading. | node |
| `npm run test:contract` | Reads the source as text: every class used has a rule, every custom property read without a fallback is defined, every stylesheet is imported, one icon family, no banned patterns, the shape lock holds. | node |
| `npm run typecheck` | TypeScript, no emit. | node |
| `npm run test:e2e` | Drives the real interface in headless Chromium: 61 checks. | a browser |
| `npm run shots` | Photographs 23 screens into `/tmp/shots`, for looking at. | a browser |

`npm run test` runs the smoke and contract suites together.

## The browser

`tests/browser.mjs` finds a browser in this order:

1. `$CHROME_PATH`
2. `/tmp/mchr/chromium` (assembled below)
3. `/tmp/chromium`
4. a system `chromium`, `chromium-browser`, `google-chrome` or `google-chrome-stable`

If there is none, the e2e suite exits 2 with instructions instead of passing
silently. On a normal machine with Chrome installed, only `CHROME_PATH` matters.

### Assembling one from the package

The development sandbox has no system browser and no way to install one, so
`@sparticuz/chromium` (already a devDependency) provides one:

```
node tests/install-browser.mjs      # writes /tmp/mchr/chromium
```

That package ships a Chromium build plus the Amazon Linux shared libraries it
needs. It does not ship NSPR (`libnspr4`, `libplc4`, `libplds4`), which Chromium
only loads for certificate work over TLS, so the installer compiles a 116 symbol
shim for those three and puts it in `/tmp/mchr/lib`. The tests run against a
local plain HTTP server, so no TLS path is ever exercised. On any normal machine
this step is unnecessary.

## Against which server

`test:e2e` and `shots` default to `http://localhost:4173/` (the preview build).
To run against the dev server instead:

```
npm run dev
APP_URL=http://localhost:5173/ npm run test:e2e
APP_URL=http://localhost:5173/ npm run shots
```

Use `npm run preview` for the production build: it is the same base path the
deployed site uses, so it catches base-path mistakes the dev server hides.
