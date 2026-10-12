import { CHAPTER_BY_ID, CHAPTERS, CHAPTER_START, plain, splitSentences } from '../content';
import type { Block, Side } from '../content/types';
import { PARENT_NOTES } from '../content/parentNotes';
import { useAppState, setProgress, getState } from '../lib/store';
import { award } from '../lib/achievements';
import { emit } from '../lib/bus';
import { Rich, Sentences } from './Rich';
import { Quiz } from './Quiz';
import { Interactive } from '../interactives/registry';

export interface PageProps {
  index: number;            // page index in PAGES
  side: Side;
  chapterId: string;
  highlight: string | null; // narration key currently being spoken
  face: 'left' | 'right' | 'single';
  pageNumber: number;
}

const TEXT_TYPES = new Set(['lead', 'p', 'h', 'fact', 'ask', 'mum', 'mystery', 'note', 'parent']);

/** Narration units for one page: one per sentence, with stable keys shared with the renderer. */
export function unitsForSide(index: number, side: Side, parentNotes: boolean, chapterId: string) {
  const out: { key: string; text: string }[] = [];
  side.blocks.forEach((b, bi) => {
    const raw = blockRaw(b);
    if (raw === null) return;
    if (b.t === 'parent' && !parentNotes) return;
    splitSentences(raw).forEach((s, j) => out.push({ key: `${index}:${bi}:${j}`, text: plain(s) }));
  });
  void chapterId;
  return out;
}

function blockRaw(b: Block): string | null {
  if (TEXT_TYPES.has(b.t)) return (b as { text: string }).text;
  if (b.t === 'anchor') return `${b.when}. ${b.where}.`;
  return null;
}

export function SideView({ index, side, chapterId, highlight, face, pageNumber }: PageProps) {
  const parentNotes = useAppState((s) => s.settings.parentNotes);
  const bookmarks = useAppState((s) => s.progress.bookmarks);
  const chapter = CHAPTER_BY_ID[chapterId];
  const isBookmarked = bookmarks.some((b) => b.page === index);
  const headingId = `h-${index}`;
  const sourceIds = side.sources ?? chapter?.sources ?? [];
  const Heading = 'h2' as const;

  // Interactives and quiz pages need the full width of the page.
  const wide = side.kind === 'interactive' || side.kind === 'quiz';
  const label = side.title ?? (chapter ? chapter.title : 'Page');

  return (
    <article
      className={`sideview kind-${side.kind} ${wide ? 'wide' : ''} face-${face} ${chapter ? `ch-${chapter.id}` : ''}`}
      aria-labelledby={side.title ? headingId : undefined}
      aria-label={side.title ? undefined : label}
      data-page={index}
      style={chapter ? { ['--accent' as string]: chapter.accent } : undefined}
    >
      <header className="runninghead">
        <span>{chapter ? (chapter.num === 'Prologue' || chapter.num === 'Epilogue' ? chapter.num : `Chapter ${chapter.num}`) + ' · ' + chapter.title : 'Contents'}</span>
        <span className="pageno" aria-hidden="true">{pageNumber}</span>
      </header>

      {side.title && (
        <Heading id={headingId} className={side.kind === 'opener' ? 'opener-title' : 'side-title'} tabIndex={-1} data-focus-title>
          {side.title}
        </Heading>
      )}

      {side.blocks.map((b, bi) => (
        <BlockView
          key={bi}
          block={b}
          keyPrefix={`${index}:${bi}`}
          highlight={highlight}
          chapterId={chapterId}
          parentNotes={parentNotes}
          pageIndex={index}
        />
      ))}

      {!side.blocks.some((b) => b.t === 'toc') && <footer className="sidefoot">
        {sourceIds.length > 0 && (
          <button type="button" className="ghost small" onClick={() => emit('sources', sourceIds)}>
            Sources for this page
          </button>
        )}
        <button
          type="button"
          className="ghost small"
          aria-pressed={isBookmarked}
          onClick={() => {
            const s = getState();
            if (isBookmarked) {
              setProgress({ bookmarks: s.progress.bookmarks.filter((b) => b.page !== index) });
            } else {
              setProgress({ bookmarks: [...s.progress.bookmarks, { page: index, label: side.title ?? label }] });
              award('bookmark');
            }
          }}
        >
          {isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
        </button>
      </footer>}
    </article>
  );
}

function BlockView({ block: b, keyPrefix, highlight, chapterId, parentNotes, pageIndex }: {
  block: Block;
  keyPrefix: string;
  highlight: string | null;
  chapterId: string;
  parentNotes: boolean;
  pageIndex: number;
}) {
  switch (b.t) {
    case 'lead':
      return <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} className="lead" />;
    case 'p':
      return <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} />;
    case 'h':
      return <h3 className="subhead">{b.text}</h3>;
    case 'note':
      return (
        <aside className="note" aria-label="Note">
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} />
        </aside>
      );
    case 'anchor':
      return (
        <div className="anchor" aria-label={`When and where: ${b.when}, ${b.where}`}>
          <span className="anchor-when"><span className="label">When</span> {b.when}</span>
          <span className="anchor-where"><span className="label">Where</span> {b.where}</span>
        </div>
      );
    case 'fig':
      return (
        <figure className={`fig ${b.wide ? 'wide' : ''} ${b.artistic ? 'artistic' : ''}`}>
          <img src={b.src} alt={b.alt} loading="lazy" decoding="async" />
          <figcaption>
            <span className="cap">{b.caption}</span>{' '}
            <span className="credit">
              Photo: {b.credit}, {b.license}.{' '}
              <a href={b.url} target="_blank" rel="noopener noreferrer">View the source on Wikimedia Commons</a>
            </span>
          </figcaption>
        </figure>
      );
    case 'fact':
      return (
        <aside className="fact" aria-label="Did you know?">
          <p className="fact-label">Did you know?</p>
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} />
          {b.source && (
            <button type="button" className="ghost small" onClick={() => emit('sources', [b.source])}>See the source</button>
          )}
        </aside>
      );
    case 'ask':
      return (
        <section className="ask" aria-label="What would you ask?">
          <h3 className="ask-label">What would you ask?</h3>
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} />
          <AskNote pageIndex={pageIndex} />
        </section>
      );
    case 'mum':
      return (
        <section className="mum" aria-label="Question for Mum or Dad">
          <h3 className="mum-label">Question for Mum or Dad</h3>
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} />
        </section>
      );
    case 'parent':
      if (!parentNotes) return null;
      return (
        <section className="parent" aria-label="Parent note">
          <h3 className="parent-label">Parent note</h3>
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} />
        </section>
      );
    case 'mystery':
      return (
        <section className="mystery" aria-label="Mystery">
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} className="mystery-text" />
        </section>
      );
    case 'quiz': {
      const chapter = CHAPTER_BY_ID[chapterId];
      if (!chapter) return null;
      return (
        <>
          <Quiz chapterId={chapterId} questions={chapter.quiz} />
          {parentNotes && PARENT_NOTES[chapterId] && (
            <section className="parent" aria-label="Parent notes">
              <h3 className="parent-label">Parent notes</h3>
              <p>{PARENT_NOTES[chapterId]}</p>
            </section>
          )}
        </>
      );
    }
    case 'interactive':
      return (
        <section className="interactive-block" aria-label={b.title ?? 'Activity'}>
          {b.title && <h3 className="subhead">{b.title}</h3>}
          <Interactive name={b.name} note={b.note} chapterId={chapterId} pageIndex={pageIndex} />
        </section>
      );
    case 'toc':
      return (
        <ol className="toc-page">
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <button type="button" className="toc-btn" onClick={() => emit('goto', CHAPTER_START[c.id])}>
                <span className="toc-num">{c.num === 'Prologue' || c.num === 'Epilogue' ? c.num : `Chapter ${c.num}`}</span>
                <span className="toc-title">{c.title}</span>
              </button>
            </li>
          ))}
        </ol>
      );
    case 'tellmore':
      return (
        <div className="tellmore">
          {b.items.map((it, i) => (
            <details key={i} className="tm">
              <summary>Tell me more: {it.q}</summary>
              <p><Rich text={it.a} /></p>
            </details>
          ))}
        </div>
      );
    default:
      return null;
  }
}

function AskNote({ pageIndex }: { pageIndex: number }) {
  const value = useAppState((s) => s.progress.questions[String(pageIndex)] ?? '');
  return (
    <div className="ask-note">
      <label htmlFor={`q-${pageIndex}`}>Write your question here (saved on this device only)</label>
      <textarea
        id={`q-${pageIndex}`}
        rows={2}
        value={value}
        maxLength={400}
        onChange={(e) => setProgress((p) => ({ questions: { ...p.questions, [String(pageIndex)]: e.target.value } }))}
      />
    </div>
  );
}
