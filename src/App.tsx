import { useEffect, useMemo, useState } from 'react';
import { PAGES, CHAPTERS, CHAPTER_START, CHAPTER_BY_ID } from './content';
import { Book, useWide, visibleIndices } from './book/Book';
import { unitsForSide } from './book/SideView';
import { SimpleReader } from './chrome/SimpleReader';
import { Cover } from './chrome/Cover';
import { NarrationBar, useNarrator } from './chrome/Narration';
import { PanelHost, type PanelName } from './chrome/Panels';
import { GlossaryCard, Toasts } from './chrome/Overlays';
import { useAppState, setProgress, setSettings, prefersReducedMotion } from './lib/store';
import { award } from './lib/achievements';
import { narrator } from './lib/narration';
import { on } from './lib/bus';

function chapterIndices(page: number): number[] {
  const id = PAGES[page]?.chapter || 'prologue';
  const idx = Math.max(0, CHAPTERS.findIndex((c) => c.id === id));
  const start = CHAPTER_START[CHAPTERS[idx].id];
  const end = idx + 1 < CHAPTERS.length ? CHAPTER_START[CHAPTERS[idx + 1].id] : PAGES.length;
  const out: number[] = [];
  for (let i = start; i < end; i++) if (!PAGES[i].blank) out.push(i);
  return out;
}

export function App() {
  const [opened, setOpened] = useState(false);
  const [panel, setPanel] = useState<PanelName | null>(null);
  const [sourceIds, setSourceIds] = useState<string[]>([]);
  const [narrationOpen, setNarrationOpen] = useState(false);
  const page = useAppState((s) => s.progress.page);
  const seen = useAppState((s) => s.progress.seen.length);
  const simple = useAppState((s) => s.settings.simple);
  const largeText = useAppState((s) => s.settings.largeText);
  const motion = useAppState((s) => s.settings.motion);
  const parentNotes = useAppState((s) => s.settings.parentNotes);
  const wide = useWide();
  const reduced = prefersReducedMotion(motion);
  const narr = useNarrator();

  const indices = useMemo(
    () => (simple ? chapterIndices(page) : visibleIndices(page, wide)),
    [simple, page, wide],
  );
  const units = useMemo(
    () => indices.flatMap((i) => unitsForSide(i, PAGES[i].side, parentNotes, PAGES[i].chapter)),
    [indices, parentNotes],
  );
  const label = indices.length > 1 || simple
    ? `Pages ${PAGES[indices[0]]?.pageNo ?? ''}${indices.length > 1 ? ` to ${PAGES[indices[indices.length - 1]]?.pageNo}` : ''}`
    : `Page ${PAGES[page]?.pageNo ?? ''}`;

  // Panels and jumps from elsewhere in the book.
  useEffect(() => on('sources', (ids: string[]) => { setSourceIds(ids); setPanel('sources'); }), []);
  useEffect(() => on('goto', () => setPanel(null)), []);

  // Stop reading when the page changes, so the narration never reads the wrong page.
  useEffect(() => { narrator.stop(); }, [page]);

  // Keep the document title and the reading progress in step with the page.
  const current = PAGES[page];
  useEffect(() => {
    if (!opened) return;
    const chapter = current?.chapter ? CHAPTER_BY_ID[current.chapter] : null;
    document.title = chapter ? `${chapter.title} · Luchelle’s South African Time Machine` : 'Luchelle’s South African Time Machine';
  }, [opened, current]);

  useEffect(() => {
    if (!opened) return;
    if (seen > 0 || page > 0) award('opened');
  }, [opened, seen, page]);

  const hasProgress = seen > 0 || page > 0;

  if (!opened) {
    return (
      <>
        <Cover
          hasProgress={hasProgress}
          onOpen={() => { setOpened(true); award('opened'); }}
          onContinue={() => setOpened(true)}
        />
        <Toasts />
      </>
    );
  }

  const pageNo = PAGES[page]?.pageNo ?? 1;
  const total = PAGES.filter((p) => !p.blank).length;
  const chapterId = current?.chapter || 'prologue';
  const chapter = CHAPTER_BY_ID[chapterId];

  return (
    <div className={`app ${largeText ? 'large-text' : ''} ${reduced ? 'reduce-motion' : ''} ${simple ? 'simple-on' : ''} ${narrationOpen ? 'has-narration' : ''}`}>
      <a className="skip-link" href="#book">Skip to the book</a>
      <header className="topbar">
        <div className="brand">
          <span className="brand-name">Luchelle’s South African Time Machine</span>
          <span className="brand-where">{chapter ? (chapter.num === 'Prologue' || chapter.num === 'Epilogue' ? chapter.num : `Chapter ${chapter.num}`) + ': ' + chapter.title : ''}</span>
        </div>
        <nav className="toolbar" aria-label="Book tools">
          <button type="button" className="tb" onClick={() => setPanel('contents')} aria-haspopup="dialog">Contents</button>
          <button type="button" className="tb" onClick={() => setPanel('timeline')} aria-haspopup="dialog">Timeline</button>
          <button type="button" className="tb" onClick={() => setPanel('passport')} aria-haspopup="dialog">Passport</button>
          <button type="button" className="tb" onClick={() => setPanel('sources')} aria-haspopup="dialog">Sources</button>
          <button type="button" className="tb" aria-pressed={narrationOpen} onClick={() => setNarrationOpen((o) => !o)}>Read aloud</button>
          <button type="button" className="tb" aria-pressed={simple} onClick={() => setSettings({ simple: !simple })}>
            {simple ? 'Book view' : 'Simple reading'}
          </button>
          <button type="button" className="tb" onClick={() => setPanel('settings')} aria-haspopup="dialog">Settings</button>
        </nav>
        <div className="progress-wrap">
          <span className="progress-text">Page {pageNo} · {seen > 0 ? `${Math.min(100, Math.round((seen / total) * 100))}% explored` : 'Start here'}</span>
          <div className="progress" role="progressbar" aria-label="Pages reached" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.round((page / PAGES.length) * 100))}>
            <span style={{ width: `${Math.min(100, Math.round((page / PAGES.length) * 100))}%` }} />
          </div>
        </div>
      </header>

      <main id="book" tabIndex={-1} className={`reader ${narrationOpen ? "has-narration" : ""}`}>
        {simple ? (
          <SimpleReader page={page} highlight={narr.currentKey} />
        ) : (
          <Book highlight={narr.currentKey} />
        )}
      </main>

      {narrationOpen && (
        <NarrationBar units={units} label={label} onClose={() => setNarrationOpen(false)} />
      )}
      {panel && <PanelHost panel={panel} onClose={() => setPanel(null)} sourceIds={sourceIds} />}
      <GlossaryCard />
      <Toasts />
      <footer className="app-foot">
        <span>Photos: Wikimedia Commons, each with its licence on the page.</span>
        <button type="button" className="ghost tiny" onClick={() => setPanel('sources')}>All sources and credits</button>
      </footer>
      <span className="sr-only" aria-live="polite">{narr.status === 'playing' ? 'Reading aloud' : ''}</span>
    </div>
  );
}
