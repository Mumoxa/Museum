/* ============================================================================
   BROWSER-FREE SMOKE TEST
   ----------------------------------------------------------------------------
   Renders every page of the book, the atlas, every panel and every interactive
   through React's server renderer. It cannot check layout or animation, but it
   does catch a broken render tree, a missing illustration, an unreachable find,
   or a chapter whose plate has gone missing, on all 116 pages, in a second.
   ========================================================================= */
import { renderToString } from 'react-dom/server';
import type { ReactElement } from 'react';
import { Reader } from '../src/book/Reader';
import { PageView } from '../src/book/PageView';
import { Atlas } from '../src/atlas/Atlas';
import { Passport } from '../src/chrome/Passport';
import { PanelHost } from '../src/chrome/Ledger';
import { PlainReader } from '../src/chrome/PlainReader';
import { buildAtlas } from '../src/atlas/plate';
import { setProgress, setSettings, resetAll } from '../src/lib/store';
import { PAGES, CHAPTER_START } from '../src/content';
import { ERAS } from '../src/design/era';
import { BADGES } from '../src/lib/achievements';
import { relicPageFor, eraPlateSrc } from '../src/design/relics';

let failures = 0;
function check(name: string, ok: boolean, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
}
function render(name: string, el: ReactElement): string {
  try {
    return renderToString(el);
  } catch (e) {
    failures++;
    console.log(`FAIL  ${name}: ${(e as Error).message}`);
    return '';
  }
}
const occurrences = (html: string, needle: string) => html.split(needle).length - 1;

/* ── Geometry ────────────────────────────────────────────────────────────── */
const geo = buildAtlas();
check('the country plate draws neighbours and South Africa', geo.land.length > 5000 && geo.focus.length > 1000);
check('the country plate draws an engraved sea', geo.sea.startsWith('M'));
check('the country plate plots the places that are not in an inset', Object.keys(geo.points).length === 4, Object.keys(geo.points).join(','));
check('the Cape plate plots its five places', Object.keys(geo.zones.cape.points).length >= 5);
check('the Highveld plate plots its four places', Object.keys(geo.zones.highveld.points).length === 4);
check('mountain ranges are drawn as ridges', geo.mountains.length >= 10, `${geo.mountains.length}`);
check('the Cape groups the places inside one city', geo.zones.cape.clusters.some((c) => c.ids.length >= 3));
check('every cluster points at real chapters', [...geo.clusters, ...geo.zones.cape.clusters, ...geo.zones.highveld.clusters].every((c) => c.ids.every((id) => ERAS.some((e) => e.id === id))));

/* ── Content and illustration coverage ───────────────────────────────────── */
const relicEras = ERAS.filter((e) => e.relics.length > 0);
check('every era with finds has a page to hide them on', relicEras.every((e) => relicPageFor(e.id) !== null), relicEras.filter((e) => relicPageFor(e.id) === null).map((e) => e.id).join(',') || 'all placed');
check('every era with an illustration has a real file name', ERAS.filter((e) => e.plate).every((e) => (eraPlateSrc(e.id) ?? '').endsWith('.jpg')));
check('every find names a source', ERAS.every((e) => e.relics.every((r) => typeof r.source === 'string' && r.source.length > 2)));
check('every find sits inside its plate', ERAS.every((e) => e.relics.every((r) => r.x > 2 && r.x < 98 && r.y > 2 && r.y < 98)));
check('every era has a distinct tint', new Set(ERAS.map((e) => e.tint.deep)).size === ERAS.length);

/* ── Every page renders ──────────────────────────────────────────────────── */
let rendered = 0;
let withFinds = 0;
let withPlates = 0;
for (let i = 0; i < PAGES.length; i++) {
  if (PAGES[i].blank) continue;
  setProgress({ page: i });
  const html = render(`page ${i} (${PAGES[i].side.title ?? 'untitled'})`, <Reader highlight={null} />);
  rendered++;
  if (occurrences(html, 'relic-find') > 0 || occurrences(html, 'inline-relic') > 0) withFinds++;
  if (occurrences(html, 'class="relic-anchor"') > 0) withPlates++;
}
const realPages = PAGES.filter((p) => !p.blank).length;
check('every page of the book renders', rendered === realPages, `${rendered}/${realPages}`);
check('the illustrated plates appear on chapter openers', withPlates === ERAS.filter((e) => e.plate).length, `${withPlates} plates`);
check('the find points appear on exactly the chapters that have finds', withFinds === relicEras.length, `${withFinds} pages with finds`);

/* ── Chapter 5: plate, photo, find points, night blocks ──────────────────── */
setProgress({ page: CHAPTER_START.ch5 });
setSettings({ parentNotes: true });
const ch5 = render('ch5 opener', <PageView index={CHAPTER_START.ch5} side={PAGES[CHAPTER_START.ch5].side} chapterId="ch5" highlight={null} face="single" pageNumber={PAGES[CHAPTER_START.ch5].pageNo} />);
check('an opener prints the illustrated plate', occurrences(ch5, 'era-castle.jpg') === 1);
check('an opener prints the real photograph as well', occurrences(ch5, 'fig-frame') >= 2);
check('an opener offers its two finds', occurrences(ch5, 'relic-find') === 2);
check('an opener prints the when-and-where dateline', occurrences(ch5, 'anchor') >= 1);
check('the running head carries the chapter', ch5.includes('Chapter 5'));

/* ── Prologue has finds but no illustration: they must fall back ────────── */
const proPage = relicPageFor('prologue');
setProgress({ page: proPage ?? 0 });
const pro = render('prologue find page', <PageView index={proPage ?? 0} side={PAGES[proPage ?? 0].side} chapterId="prologue" highlight={null} face="single" pageNumber={PAGES[proPage ?? 0].pageNo} />);
check('finds fall back to a page with a photograph', occurrences(pro, 'inline-relic') === 2);

/* ── Panels ──────────────────────────────────────────────────────────────── */
setProgress({ page: CHAPTER_START.ch2 });
setSettings({ parentNotes: false });
check('the atlas renders', occurrences(render('atlas', <Atlas onClose={() => {}} />), 'class="site') >= 4);
const passport = render('passport', <Passport />);
check('the passport prints a stamp for every chapter and every badge', occurrences(passport, 'stamp-card') === ERAS.length + BADGES.length, `${occurrences(passport, 'stamp-card')} of ${ERAS.length + BADGES.length}`);
check('the passport lists a cabinet row for every find', occurrences(passport, 'shelf-row') === ERAS.reduce((n, e) => n + e.relics.length, 0));
for (const panel of ['contents', 'timeline', 'passport', 'sources', 'settings'] as const) {
  const html = render(`panel ${panel}`, <PanelHost panel={panel} onClose={() => {}} sourceIds={panel === 'sources' ? ['saho_landact'] : []} />);
  check(`the ${panel} panel renders`, html.length > 400);
}

/* ── Plain reading mode ─────────────────────────────────────────────────── */
setProgress({ page: CHAPTER_START.ch8 });
const plain = render('plain reading', <PlainReader page={CHAPTER_START.ch8} highlight={null} />);
check('plain reading shows a whole chapter as sections', occurrences(plain, 'plain-section') > 3, `${occurrences(plain, 'plain-section')} sections`);
check('plain reading keeps the era tint', plain.includes('--era-mid'));

resetAll();
console.log(`\n${failures === 0 ? 'All smoke checks passed.' : `${failures} smoke checks failed.`}`);
process.exit(failures ? 1 : 0);
