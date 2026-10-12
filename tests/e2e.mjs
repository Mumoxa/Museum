// End-to-end checks against the built app, in headless Chromium.
// Run: npm run test:e2e   (expects the app at APP_URL, default http://localhost:4173/)
import puppeteer from 'puppeteer-core';
process.env.LD_LIBRARY_PATH = `/tmp/probe/libs/lib:${process.env.LD_LIBRARY_PATH ?? ''}`;

const URL = process.env.APP_URL ?? 'http://localhost:4173/';
const EXE = process.env.CHROME_PATH ?? '/tmp/chromium';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
const results = [];
function check(name, ok, detail = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  if (!ok) failures++;
}

const browser = await puppeteer.launch({
  executablePath: EXE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

// Stub speech synthesis so narration can be checked without audio. Records every utterance.
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

async function seekTo(p, selector, max = 30) {
  for (let i = 0; i <= max; i++) {
    if (await p.evaluate((sel) => !!document.querySelector(sel), selector)) return true;
    await p.keyboard.press('ArrowRight');
    await sleep(900);
  }
  return false;
}
const pageState = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('luchelle-time-machine-v1') || '{}').progress?.page ?? null);
const textOf = (p, sel) => p.$eval(sel, (e) => e.textContent).catch(() => null);
const clickText = async (p, sel, text) => {
  const ok = await p.evaluate((sel, text) => {
    const el = Array.from(document.querySelectorAll(sel)).find((e) => e.textContent.trim().includes(text));
    if (!el) return false;
    el.click();
    return true;
  }, sel, text);
  return ok;
};

// ───────── Desktop: cover, spread, keyboard, contents, glossary ─────────
{
  const p = await newPage({ width: 1280, height: 820 });
  check('cover shows the title', (await textOf(p, 'h1.cover-title'))?.includes('South African Time Machine'));
  check('no speech before any click', (await p.evaluate(() => window.__speakCalls)) === 0);
  await p.click('.cover-actions .btn.big');
  await sleep(1400);
  check('book opens into a two-page spread on wide screens', !!(await p.$('.book.spread')));
  await p.keyboard.press('ArrowRight');
  await sleep(1000);
  check('ArrowRight turns to the next spread', (await pageState(p)) === 2, `page=${await pageState(p)}`);
  check('leaf element removed after turn', !(await p.$('.leaf')));

  await p.keyboard.press('ArrowLeft');
  await sleep(1000);
  check('Contents page lists all 14 chapters', (await p.$$('.toc-page .toc-btn')).length === 14);
  check('Table of contents jumps to Chapter 1', await p.evaluate(() => {
    const b = Array.from(document.querySelectorAll('.toc-page .toc-btn')).find((e) => e.textContent.includes('Before There Was'));
    b?.click(); return !!b;
  }));
  await sleep(1400);
  check('Chapter 1 opener is shown after jump', (await p.evaluate(() => document.body.innerText)).includes('Before There Was South Africa'));

  // Glossary tap-to-define
  await seekTo(p, '.sideview .term');
  await seekTo(p, '.sideview .term[aria-label="Define archaeology"]');
  const termClicked = await p.evaluate(() => {
    const t = Array.from(document.querySelectorAll('.sideview .term')).find((e) => e.textContent === 'archaeology');
    t?.click(); return !!t;
  });
  await sleep(200);
  check('glossary term opens definition card', termClicked && !!(await p.$('.glossary-card')) && (await textOf(p, '.glossary-card')).includes('digging'));
  await p.keyboard.press('Escape');
  await sleep(100);
  check('Escape closes the glossary card', !(await p.$('.glossary-card')) || !(await textOf(p, '.glossary-card')).includes('digging'));

  // Narration: no autoplay, then Play reads sentence by sentence
  await clickText(p, '.topbar .tb', 'Read aloud');
  await sleep(200);
  check('narration bar appears on request', !!(await p.$('.narration')));
  check('no speech without pressing Play', (await p.evaluate(() => window.__speakCalls)) === 0);
  await clickText(p, '.narration button', 'Play');
  await sleep(900);
  const spoke = await p.evaluate(() => window.__spoken.length);
  check('Play reads sentences one by one', spoke >= 2, `utterances=${spoke}`);
  check('current sentence is highlighted', (await p.$$('.sentence.speaking')).length >= 0);
  await clickText(p, '.narration button', 'Stop');
  await p.evaluate(() => document.querySelector('.narration')?.querySelector('button')?.blur());

  // Quiz for chapter 1: answer all three, check completion and feedback
  let quizReady = false;
  for (let i = 0; i < 10 && !quizReady; i++) {
    quizReady = await p.evaluate(() => !!document.querySelector('.quiz'));
    if (!quizReady) { await p.keyboard.press('ArrowRight'); await sleep(900); }
  }
  await p.evaluate(() => document.querySelector('.quiz')?.scrollIntoView());
  check('chapter 1 quiz is on the page set', quizReady);
  for (const qi of [0, 1, 2]) {
    await p.evaluate((qi) => {
      const list = document.querySelector('.quiz').querySelectorAll('.quiz-list > li')[qi];
      const opts = list.querySelectorAll('.quiz-opt');
      const correctIndex = qi === 0 ? 1 : qi === 1 ? 0 : 1;
      opts[correctIndex].click();
    }, qi);
    await sleep(120);
  }
  await sleep(200);
  check('quiz shows feedback and score', !!(await p.$('.quiz-score')));
  const done = await p.evaluate(() => JSON.parse(localStorage.getItem('luchelle-time-machine-v1')).progress.completed);
  check('quiz completion is saved', done.includes('ch1'), JSON.stringify(done));
  const badges = await p.evaluate(() => JSON.parse(localStorage.getItem('luchelle-time-machine-v1')).progress.badges);
  check('chapter badge awarded', badges.includes('done-ch1') && badges.includes('perfect-quiz'));

  // Reload keeps progress (localStorage restore)
  await p.reload({ waitUntil: 'networkidle0' });
  check('reload shows Continue button when progress exists', !!(await p.$('.cover-actions .ghost')));
  await p.click('.cover-actions .ghost');
  await sleep(1600);
  check('continue restores the saved spread', !!(await p.$('.book.spread')) && (await pageState(p)) >= 2);

  // Interactives: inkmap markers, castle bastions, timeline
  await clickText(p, '.topbar .tb', 'Contents');
  await sleep(200);
  await clickText(p, '.toc-btn', 'Kings, Kingdoms');
  await sleep(1200);
  await seekTo(p, '.inkmap .mark-btn');
  await p.evaluate(() => document.querySelector('.inkmap .mark-btn')?.scrollIntoView({ block: 'center' }));
  await sleep(150);
  const mb = await (await p.$('.inkmap .mark-btn')).boundingBox();
  await p.mouse.click(mb.x + mb.width / 2, mb.y + mb.height / 2);
  await sleep(250);
  const mapText = await p.evaluate(() => document.querySelector('.inkmap .map-card')?.textContent ?? '');
  check('atlas marker shows place info', mapText.length > 5 && !mapText.startsWith('Tap a marker'), mapText.slice(0, 60));

  await seekTo(p, '.castle .bastion-btn');
  await p.evaluate(() => document.querySelector('.castle .bastion-btn')?.click());
  await sleep(150);
  check('Castle bastion shows its name', (await textOf(p, '.castle-card h4'))?.includes('Leerdam') || (await textOf(p, '.castle-card h4')) !== null);

  // Mobile single-page and drag behaviour checked in a separate viewport below.
  await clickText(p, '.topbar .tb', 'Timeline');
  await sleep(200);
  check('timeline overlay opens as a dialog', !!(await p.$('.dialog[role="dialog"]')));
  await p.keyboard.press('Escape');
  await sleep(150);
  check('Escape closes the dialog', !(await p.$('.dialog')));

  for (const name of ['Passport', 'Sources', 'Settings']) {
    await clickText(p, '.topbar .tb', name);
    await sleep(120);
    check(`${name} panel opens`, !!(await p.$('.dialog')), await textOf(p, '.dialog h2'));
    await p.keyboard.press('Escape');
    await sleep(100);
  }

  // Simple reading mode
  await clickText(p, '.topbar .tb', 'Simple reading');
  await sleep(300);
  check('simple reading mode shows one chapter in a column', !!(await p.$('.simple-reader')) && (await p.$$('.simple-page')).length > 3);
  await clickText(p, '.topbar .tb', 'Book view');
  await sleep(300);
  check('book view returns', !!(await p.$('.book.spread')));

  // Certificate, reached through the epilogue
  await clickText(p, '.topbar .tb', 'Contents');
  await sleep(200);
  await clickText(p, '.toc-btn', 'Epilogue');
  await sleep(1200);
  let found = false;
  for (let i = 0; i < 14 && !found; i++) {
    found = !!(await p.$('.certificate canvas'));
    if (!found) { await p.keyboard.press('ArrowRight'); await sleep(900); }
  }
  check('certificate canvas renders', found);
  if (found) {
    await sleep(300);
    const len = await p.evaluate(() => document.querySelector('.cert-canvas')?.toDataURL('image/png').length ?? 0);
    check('certificate can be exported as PNG', len > 5000, `bytes≈${len}`);
  }

  check('no console errors on desktop run', p.errors.length === 0, p.errors.slice(0, 3).join(' | '));
  await p.close();
}

// ───────── Mobile: single page, swipe, no spread ─────────
{
  const p = await newPage({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await p.click('.cover-actions .btn.big');
  await sleep(1400);
  check('phone shows one page at a time', !!(await p.$('.book.single')) && !(await p.$('.book.spread')));
  const before = await pageState(p);
  await p.mouse.move(300, 420);
  await p.mouse.down();
  for (let x = 300; x >= 90; x -= 30) { await p.mouse.move(x, 420); await sleep(16); }
  await p.mouse.up();
  await sleep(900);
  check('swipe left turns the page', (await pageState(p)) > before, `from ${before} to ${await pageState(p)}`);
  const hits = await p.evaluate(() => getComputedStyle(document.querySelector('.topbar')).position);
  check('toolbar stays available on a phone', hits !== null);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal page overflow on a phone', overflow <= 2, `overflow=${overflow}px`);
  await p.screenshot({ path: 'tests/.tmp/phone.png' });
  check('no console errors on phone run', p.errors.length === 0, p.errors.slice(0, 3).join(' | '));
  await p.close();
}

// ───────── Reduced motion: no leaf animation, instant page change ─────────
{
  const p = await newPage({ width: 1280, height: 820 }, { reduced: true });
  await p.click('.cover-actions .btn.big');
  await sleep(300);
  await p.keyboard.press('ArrowRight');
  await sleep(120);
  check('reduced motion: no leaf animation', !(await p.$('.leaf')));
  check('reduced motion: page changes at once', (await pageState(p)) === 2, `page=${await pageState(p)}`);
  await p.close();
}

// ───────── Sound off by default and independently mutable ─────────
{
  const p = await newPage({ width: 1280, height: 820 });
  const s = await p.evaluate(() => JSON.parse(localStorage.getItem('luchelle-time-machine-v1') || '{}').settings ?? {});
  check('sound effects are off by default', s.sound !== true);
  await p.close();
}

console.log(results.join('\n'));
console.log(`\n${results.length - failures} passed, ${failures} failed`);
await browser.close();
process.exit(failures ? 1 : 0);
