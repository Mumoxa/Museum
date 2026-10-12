#!/usr/bin/env node
/* ============================================================================
   VISUAL WALK
   ----------------------------------------------------------------------------
   Paints every screen of the book in a real browser and writes a PNG per screen
   to /tmp/shots. This exists because the server-rendered smoke suite can check
   structure but not layout, and because "it compiles" is not the same as "it
   looks right".

   Run:  npm run shots                (dev server on 5173)
         APP_URL=http://localhost:4173/ npm run shots
   Then open the folder and look at them, which is the entire point.
   ========================================================================= */
import puppeteer from 'puppeteer-core';
import { mkdirSync, existsSync } from 'node:fs';
import { findChrome, LAUNCH_ARGS } from '../tests/browser.mjs';

const OUT = process.env.SHOT_DIR ?? '/tmp/shots';
const URL = process.env.APP_URL ?? 'http://localhost:5173/';
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2 };
const DESK = { width: 1366, height: 900, deviceScaleFactor: 1 };

const exe = findChrome();
if (!exe) process.exit(2);
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: LAUNCH_ARGS });
let shot = 0;
const problems = [];

async function open(viewport, { seed, motion } = {}) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  page.on('pageerror', (e) => problems.push(`${e}`.slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error') problems.push(m.text().slice(0, 160)); });
  if (seed || motion) {
    await page.evaluateOnNewDocument((s, mo) => {
      const KEY = 'luchelle-time-machine-v1';
      let cur = {};
      try { cur = JSON.parse(localStorage.getItem(KEY) ?? '{}'); } catch { /* first run */ }
      const next = { ...cur, ...s };
      if (s.progress) next.progress = { ...(cur.progress ?? {}), ...s.progress };
      if (s.settings) next.settings = { ...(cur.settings ?? {}), ...s.settings };
      if (mo) next.settings = { ...(next.settings ?? {}), motion: mo };
      localStorage.setItem(KEY, JSON.stringify(next));
    }, seed ?? {}, motion ?? null);
  }
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function capture(page, name) {
  shot += 1;
  const file = `${OUT}/${String(shot).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path: file });
  console.log(`  ${file}`);
}

/* Click something that may take a moment to arrive. */
async function click(page, selector, wait = 450) {
  await page.waitForSelector(selector, { timeout: 15000 });
  await page.click(selector);
  await sleep(wait);
}

/* Opening the book: 1180ms of animation, then the reader arrives. A reader with
   no bookmark is walked through the map first; one with a bookmark lands on
   their page. Both paths are photographed. */
const OPEN_MS = 1500;
const FIRST = { progress: { page: 0, seen: [] } };

async function openBook(page) {
  await click(page, '.cover-actions .btn-solid', OPEN_MS);
}

/* -- 1. The cover ----------------------------------------------------------- */
{
  const page = await open(PHONE);
  await capture(page, 'cover-phone');
  await page.close();
}
{
  const page = await open(DESK);
  await capture(page, 'cover-desktop');
  await page.close();
}

/* -- 2. The arrival: light, then the map unfolding, then chapter one -------- */
{
  const page = await open(PHONE, { seed: FIRST });
  await click(page, '.cover-actions .btn-solid', 400);
  await capture(page, 'arrival-1-light-flood');
  await sleep(700);
  await capture(page, 'arrival-2-board-open');
  await sleep(1200);
  await capture(page, 'arrival-3-map-unfolding');
  await sleep(2600);
  await capture(page, 'arrival-4-prologue');
  await page.close();
}

/* -- 3. The atlas: plates, a cluster, an era drawer ------------------------- */
{
  const page = await open(DESK, { seed: FIRST });
  await openBook(page);
  await sleep(3800);
  await capture(page, 'atlas-country-desktop');
  const tags = await page.$$('.level-switch .tag');
  if (tags[1]) { await tags[1].click(); await sleep(900); await capture(page, 'atlas-cape'); }
  const cluster = await page.$('.site.is-cluster .site-hit');
  if (cluster) { await cluster.click(); await sleep(600); await capture(page, 'atlas-cluster-sheet'); }
  const row = await page.$('.cluster-row');
  if (row) { await row.click(); await sleep(700); await capture(page, 'atlas-era-drawer'); }
  await page.close();
}
{
  const page = await open(PHONE, { seed: FIRST });
  await openBook(page);
  await sleep(3800);
  await capture(page, 'atlas-country-phone');
  const cluster = await page.$('.site.is-cluster .site-hit');
  if (cluster) { await cluster.click(); await sleep(700); await capture(page, 'atlas-cluster-phone'); }
  await page.close();
}

/* -- 4. A chapter opener with its plate, and a find ------------------------- */
for (const [name, vp] of [['phone', PHONE], ['desktop', DESK]]) {
  const page = await open(vp, { seed: { progress: { page: 39, seen: [39] } } });
  await openBook(page);
  await capture(page, `chapter-5-opener-${name}`);
  const find = await page.$('.relic-find');
  if (find) { await find.click(); await sleep(900); await capture(page, `chapter-5-find-${name}`); }
  await page.keyboard.press('Escape');
  await sleep(300);
  await page.keyboard.press('ArrowRight');
  await sleep(1000);
  await capture(page, `chapter-5-page-2-${name}`);
  await page.close();
}

/* -- 5. A quiz, answered wrong and then right ------------------------------- */
{
  const page = await open(PHONE, { seed: { progress: { page: 8, seen: [8] } } });
  await openBook(page);
  for (let i = 0; i < 12; i += 1) {
    if (await page.$('.quiz')) break;
    await page.keyboard.press('ArrowRight');
    await sleep(900);
  }
  if (await page.$('.quiz')) {
    await capture(page, 'quiz-question');
    await page.$$eval('.quiz input[type=radio]', (els) => els[0] && els[0].click());
    await sleep(600);
    await capture(page, 'quiz-answered');
  } else {
    problems.push('quiz page never appeared while paging forward from chapter 1');
  }
  await page.close();
}

/* -- 6. The chrome ---------------------------------------------------------- */
{
  const page = await open(PHONE, { seed: { progress: { page: 39, seen: Array.from({ length: 60 }, (_, i) => i) } } });
  await openBook(page);
  await click(page, '.tools .tool:nth-child(2)', 700);
  await capture(page, 'panel-contents');
  await page.keyboard.press('Escape');
  await sleep(400);
  await click(page, '.tools .tool:nth-child(3)', 900);
  await capture(page, 'panel-passport');
  await page.close();
}
{
  const page = await open(PHONE, { seed: { progress: { page: 8, seen: [8] } } });
  await openBook(page);
  await click(page, '.tools .tool:nth-child(4)', 900);
  await capture(page, 'narration-bar');
  await page.close();
}
{
  const page = await open(PHONE, { seed: { settings: { simple: true }, progress: { page: 39, seen: [39] } } });
  await openBook(page);
  await capture(page, 'plain-reading');
  await page.close();
}
{
  const page = await open(PHONE, { seed: { settings: { lamp: 'dim' }, progress: { page: 39, seen: [39] } } });
  await openBook(page);
  await capture(page, 'lamp-dim');
  await page.close();
}
{
  const page = await open(PHONE, { motion: 'reduced', seed: { progress: { page: 39, seen: [39] } } });
  await click(page, '.cover-actions .btn-solid', 300);
  await capture(page, 'reduced-motion');
  await page.close();
}

await browser.close();
console.log(`\n${shot} screens written to ${OUT}`);
if (problems.length) {
  console.log(`\n${problems.length} console problem(s):`);
  for (const p of [...new Set(problems)].slice(0, 20)) console.log(`  ${p}`);
}
if (!existsSync(`${OUT}/01-cover-phone.png`)) process.exit(1);
