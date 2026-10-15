import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  MapTrifold,
  ListBullets,
  Stamp,
  SpeakerHigh,
  SlidersHorizontal,
  CaretLeft,
  CaretRight,
  BookOpen,
} from '@phosphor-icons/react';
import { PAGES, CHAPTERS, CHAPTER_BY_ID, CHAPTER_START } from './content';
import { Reader, useWide, visibleIndices, nextReadable, requestTurn } from './book/Reader';
import { unitsForSide } from './book/PageView';
import { PlainReader } from './chrome/PlainReader';
import { Cover } from './chrome/Cover';
import { NarrationBar, useNarrator } from './chrome/Narration';
import { PanelHost, type PanelName } from './chrome/Ledger';
import { RelicDrawer, Toasts, FindThread } from './chrome/Overlays';

import { ERA_BY_ID, eraVars } from './design/era';
import { useAppState, setProgress, setSettings, prefersReducedMotion } from './lib/store';
import { award } from './lib/achievements';
import { narrator } from './lib/narration';
import { on } from './lib/bus';

/* The atlas carries the world map data with it, so it is only fetched when
   the reader asks for the map. */
const Atlas = lazy(() => import('./atlas/Atlas').then((m) => ({ default: m.Atlas })));

export function LegacyApp() {
  const [opened, setOpened] = useState(() => new URLSearchParams(window.location.search).get('view') !== 'cover');
  const [panel, setPanel] = useState<PanelName | null>(() => new URLSearchParams(window.location.search).get('view') === 'passport' ? 'passport' : null);
  const [atlas, setAtlas] = useState(() => new URLSearchParams(window.location.search).get('view') === 'atlas');
  /* True only for the first arrival: the cover hands over to the map, and the
     map opens the first chapter, so the reader is walked through the doorway
     instead of being dropped in front of it. */
  const [arrival, setArrival] = useState(false);
  const [sourceIds, setSourceIds] = useState<string[]>([]);
  const [narrationOpen, setNarrationOpen] = useState(false);

  const page = useAppState((s) => s.progress.page);
  const seen = useAppState((s) => s.progress.seen.length);
  const simple = useAppState((s) => s.settings.simple);
  const scale = useAppState((s) => s.settings.scale);
  const lamp = useAppState((s) => s.settings.lamp);
  const motion = useAppState((s) => s.settings.motion);
  const parentNotes = useAppState((s) => s.settings.parentNotes);
  const relics = useAppState((s) => s.progress.relics.length);
  const completed = useAppState((s) => s.progress.completed.length);
  const wide = useWide();
  const reduced = prefersReducedMotion(motion);
  const narr = useNarrator();

  const indices = useMemo(
    () => (simple ? plainChapterIndices(page) : visibleIndices(page, wide)),
    [simple, page, wide],
  );
  const units = useMemo(
    () => indices.flatMap((i) => unitsForSide(i, PAGES[i].side, parentNotes, PAGES[i].chapter)),
    [indices, parentNotes],
  );
  const label = indices.length > 1
    ? `Pages ${PAGES[indices[0]]?.pageNo ?? ''} to ${PAGES[indices[indices.length - 1]]?.pageNo}`
    : `Page ${PAGES[page]?.pageNo ?? ''}`;

  /* Drawers, and jumps coming from anywhere in the book. */
  useEffect(() => on('sources', (ids: string[]) => { setSourceIds(ids); setPanel('sources'); }), []);
  useEffect(() => on('goto', () => { setPanel(null); setAtlas(false); setArrival(false); }), []);
  useEffect(() => on('atlas', () => setAtlas(true)), []);

  useEffect(() => { narrator.stop(); }, [page]);

  const current = PAGES[page];
  const chapterId = current?.chapter || 'prologue';
  const chapter = CHAPTER_BY_ID[chapterId];
  const era = ERA_BY_ID[chapterId];

  useEffect(() => {
    if (!opened) return;
    document.title = chapter
      ? `${chapter.title}: Luchelle's Museum`
      : "Luchelle's Museum";
  }, [opened, chapter]);

  useEffect(() => {
    if (!opened) return;
    if (seen > 0 || page > 0) award('opened');
  }, [opened, seen, page]);

  /* Follow the device colour scheme only far enough to keep the environment
     comfortable; the page itself is always lit. */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.lamp = lamp;
    root.dataset.scale = scale;
  }, [lamp, scale]);

  const hasProgress = seen > 0 || page > 0;
  const total = PAGES.filter((p) => !p.blank).length;
  const readProgress = Math.min(100, Math.round(((completed / CHAPTERS.length) * 60) + ((seen / total) * 40)));
  const canPrev = nextReadable(page, -1) !== null || (!wide ? false : page > 1);
  const canNext = nextReadable(page, 1) !== null;

  if (!opened) {
    return (
      <>
        <Cover
          hasProgress={hasProgress}
          /* The door-opening sequence belongs to a first arrival. A reader who
             already has a bookmark goes straight back to their page; the map is
             one tap away in the tools and says so. */
          onOpen={() => {
            setOpened(true);
            award('opened');
            if (!hasProgress) { setArrival(true); setAtlas(true); }
          }}
          onContinue={() => setOpened(true)}
        />
        <Toasts />
      </>
    );
  }

  return (
    <div
      className={`shell${reduced ? ' reduce-motion' : ''}`}
      style={eraVars(chapterId)}
      data-lamp={lamp}
    >
      <FindThread />
      <a className="skip-link" href="#book">Skip to the book</a>

      {/* The locator: what page am I on, and where in the country. */}
      <header className="locator">
        <span className="locator-mark" aria-hidden="true">
          <BookOpen size={17} weight="bold" />
        </span>
        <div style={{ minWidth: 0 }}>
          <span className="locator-word">Luchelle&rsquo;s Museum</span>
          <span className="locator-where">
            {chapter
              ? `${chapter.num === 'Prologue' || chapter.num === 'Epilogue' ? chapter.num : `Chapter ${chapter.num}`} · ${chapter.title}`
              : 'The book is open'}
          </span>
        </div>
        {/* A running head carries the place, not a percentage. The one meter in
            the interface is the hairline in the rail. */}
      </header>

      <main id="book" tabIndex={-1}>
        {simple
          ? <PlainReader page={page} highlight={narr.currentKey} />
          : <Reader highlight={narr.currentKey} />}
      </main>

      {narrationOpen && (
        <NarrationBar units={units} label={label} onClose={() => setNarrationOpen(false)} />
      )}

      {/* The rail: the two turns a reader uses constantly, big, on the outer
          edges where a thumb already rests, with the page state between them. */}
      <nav className="rail" aria-label="Turn pages">
        <button
          type="button"
          className="rail-turn"
          onClick={() => requestTurn(-1)}
          disabled={!canPrev}
          aria-label="Previous page"
        >
          <CaretLeft size={24} weight="bold" aria-hidden="true" />
        </button>
        <div className="rail-centre">
          <span className="rail-title">{label}</span>
          <div
            className="rail-track"
            role="progressbar"
            aria-label="Chapter progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={readProgress}
          >
            <span style={{ width: `${readProgress}%` }} />
          </div>
        </div>
        <button
          type="button"
          className="rail-turn"
          onClick={() => requestTurn(1)}
          disabled={!canNext}
          aria-label="Next page"
        >
          <CaretRight size={24} weight="bold" aria-hidden="true" />
        </button>
      </nav>

      {/* The tools: everything else, in one strip, above the turn rail and out
          of the reading path. */}
      <div className="tools" role="group" aria-label="Book tools">
        <button type="button" className="tool" onClick={() => setAtlas(true)}>
          <MapTrifold size={20} weight="bold" aria-hidden="true" />
          <span>Map</span>
        </button>
        <button type="button" className="tool" onClick={() => setPanel('contents')}>
          <ListBullets size={20} weight="bold" aria-hidden="true" />
          <span>Contents</span>
        </button>
        <button type="button" className="tool" onClick={() => setPanel('passport')}>
          <Stamp size={20} weight="bold" aria-hidden="true" />
          <span>Passport</span>
          {relics > 0 && <span className="tool-count num" aria-hidden="true">{relics}</span>}
        </button>
        <button type="button" className="tool" aria-pressed={narrationOpen} onClick={() => setNarrationOpen((o) => !o)}>
          <SpeakerHigh size={20} weight="bold" aria-hidden="true" />
          <span>Read aloud</span>
        </button>
        <button type="button" className="tool" aria-pressed={simple} onClick={() => setSettings({ simple: !simple })}>
          <ListBullets size={20} weight="bold" aria-hidden="true" />
          <span>{simple ? 'Book view' : 'Plain view'}</span>
        </button>
        <button type="button" className="tool" onClick={() => setPanel('settings')}>
          <SlidersHorizontal size={20} weight="bold" aria-hidden="true" />
          <span>Settings</span>
        </button>
      </div>

      {atlas && (
        <Suspense fallback={<div className="atlas-scrim" role="status"><p className="atlas-loading">Unfolding the map</p></div>}>
          <Atlas onClose={() => setAtlas(false)} arrival={arrival} />
        </Suspense>
      )}
      {panel && <PanelHost panel={panel} onClose={() => setPanel(null)} sourceIds={sourceIds} />}
      <RelicDrawer />
      <Toasts />

      <footer className="app-foot">
        <span>
          Photographs: Wikimedia Commons, each with its licence on the page. Illustrations drawn for this book.
        </span>
        <button type="button" className="ghost tiny" onClick={() => setPanel('sources')}>
          Every source
        </button>
      </footer>

      <span className="sr-only" aria-live="polite">
        {narr.status === 'playing' ? 'Reading aloud' : ''}
      </span>
    </div>
  );
}

/** In plain reading mode, a chapter is shown end to end. */
function plainChapterIndices(page: number): number[] {
  const id = PAGES[page]?.chapter || 'prologue';
  const idx = Math.max(0, CHAPTERS.findIndex((c) => c.id === id));
  const start = CHAPTER_START[CHAPTERS[idx].id];
  const end = idx + 1 < CHAPTERS.length ? CHAPTER_START[CHAPTERS[idx + 1].id] : PAGES.length;
  const out: number[] = [];
  for (let i = start; i < end; i++) if (!PAGES[i].blank) out.push(i);
  return out;
}
