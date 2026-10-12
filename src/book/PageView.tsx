import { useMemo, useState, type CSSProperties } from 'react';
import {
  BookmarkSimple,
  Quotes,
  MagnifyingGlass,
  UsersThree,
  Compass as CompassIcon,
  LinkSimple,
  Sparkle,
  CheckCircle,
  ArrowSquareOut,
} from '@phosphor-icons/react';
import { CHAPTER_BY_ID, CHAPTERS, CHAPTER_START, plain, splitSentences } from '../content';
import type { Block, Side } from '../content/types';
import { PARENT_NOTES } from '../content/parentNotes';
import { useAppState, setProgress, getState } from '../lib/store';
import { award } from '../lib/achievements';
import { emit } from '../lib/bus';
import { chime } from '../lib/sfx';
import { ERA_BY_ID, eraVars, type EraRelic } from '../design/era';
import { relicPageFor, eraPlateSrc } from '../design/relics';
import { Rich, Sentences } from './Rich';
import { Quiz } from './Quiz';
import { Interactive } from '../interactives/registry';

export interface PageProps {
  index: number;
  side: Side;
  chapterId: string;
  highlight: string | null;
  /** 'left' and 'right' for a two-page spread, 'single' on a phone. */
  face: 'left' | 'right' | 'single';
  pageNumber: number;
}

const TEXT_TYPES = new Set(['lead', 'p', 'h', 'fact', 'ask', 'mum', 'mystery', 'note', 'parent']);

/** Narration units for one page, with stable keys shared with the renderer. */
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

export function PageView({ index, side, chapterId, highlight, face, pageNumber }: PageProps) {
  const parentNotes = useAppState((s) => s.settings.parentNotes);
  const bookmarks = useAppState((s) => s.progress.bookmarks);
  const chapter = CHAPTER_BY_ID[chapterId];
  const era = ERA_BY_ID[chapterId];
  const isBookmarked = bookmarks.some((b) => b.page === index);
  const wide = side.kind === 'interactive' || side.kind === 'quiz';
  const label = side.title ?? chapter?.title ?? 'Page';
  const headingId = `h-${index}`;
  const sourceIds = side.sources ?? chapter?.sources ?? [];
  const Heading = 'h2' as const;

  const plateSrc = useMemo(
    () => (side.kind === 'opener' ? eraPlateSrc(chapterId) : null),
    [side.kind, chapterId],
  );
  const relicPage = useMemo(() => relicPageFor(chapterId), [chapterId]);
  const relics = era?.relics ?? [];
  const showRelics = relics.length > 0 && relicPage === index;

  /* The plate is the first figure on an opener, whether it is the era
     illustration or a real photograph from the page. */
  const firstFig = side.blocks.find((b) => b.t === 'fig') as Extract<Block, { t: 'fig' }> | undefined;

  return (
    <article
      className={`page on-paper face-${face} kind-${side.kind}${wide ? ' wide' : ''}`}
      aria-labelledby={side.title ? headingId : undefined}
      aria-label={side.title ? undefined : label}
      data-page={index}
    >
      <header className="running">
        <span className="running-era">
          {era && <span className="running-swatch" aria-hidden="true" />}
          {chapter
            ? chapter.num === 'Prologue' || chapter.num === 'Epilogue'
              ? chapter.num
              : `Chapter ${chapter.num}`
            : 'Contents'}
          {/* The title earns its place on a spread. On a phone column it would
              wrap to two lines and the locator bar already names the chapter. */}
          {chapter && <span className="running-title">{chapter.title}</span>}
        </span>
        <span className="folio" aria-hidden="true">{pageNumber}</span>
      </header>

      {side.title && (
        <Heading
          id={headingId}
          className={`page-title ${side.kind === 'opener' ? 'opener-title' : ''}`}
          tabIndex={-1}
          data-focus-title
        >
          {side.title}
        </Heading>
      )}

      {side.kind === 'opener' && chapter && (
        <p className="page-kicker">
          {chapter.num === 'Prologue' || chapter.num === 'Epilogue' ? chapter.num : `Chapter ${chapter.num}`}
        </p>
      )}

      {plateSrc && (
        <figure className="fig bleed">
          <div className="fig-frame">
            <EraPlate
              src={plateSrc}
              alt={era?.plateAlt ?? ''}
              relics={showRelics ? relics : []}
              index={index}
            />
          </div>
          {/* The illustration says what it is, briefly, in print. The long
              description lives in the alt text, where it is useful, rather than
              in a caption a reader has to wade through. */}
          <figcaption>
            <span className="cap-text">Painted for this book, not a photograph. Real photographs from this chapter follow.</span>
          </figcaption>
        </figure>
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
          pageTitle={side.title}
          relics={showRelics && !plateSrc && b === firstFig ? relics : []}
        />
      ))}

      {!side.blocks.some((b) => b.t === 'toc') && (
        <PageFoot
          index={index}
          isBookmarked={isBookmarked}
          label={side.title ?? label}
          sourceIds={sourceIds}
        />
      )}
    </article>
  );
}

/* ---------------------------------------------------------------------------
   The era plate, with its find-points sitting at real positions on the image.
   -------------------------------------------------------------------------- */
function EraPlate({
  src, alt, relics, index,
}: { src: string; alt: string; relics: EraRelic[]; index: number }) {
  const found = useAppState((s) => s.progress.relics);
  const [flashed, setFlashed] = useState<string | null>(null);
  const sound = useAppState((s) => s.settings.sound);
  const volume = useAppState((s) => s.settings.soundVolume);
  const [open, setOpen] = useState<string | null>(null);

  function find(r: EraRelic) {
    const s = getState();
    const already = s.progress.relics.includes(r.id);
    if (!already) {
      setProgress((p) => ({ relics: [...p.relics, r.id] }));
      const total = Object.values(ERA_BY_ID).flatMap((e) => e.relics).length;
      if (s.progress.relics.length + 1 >= total) window.setTimeout(() => award('curator'), 500);
      award('first-find');
      if (sound) chime(volume, true);
      setFlashed(r.id);
      window.setTimeout(() => setFlashed(null), 1700);
    }
    setOpen((o) => (o === r.id ? null : r.id));
  }

  const active = relics.find((r) => r.id === open);

  return (
    <div className="relic-anchor">
      <img src={src} alt={alt} loading="eager" decoding="async" data-relic-page={index} />
      {relics.map((r) => {
        const got = found.includes(r.id);
        return (
          <button
            key={r.id}
            type="button"
            className={`relic-find${got ? ' is-found' : ''}`}
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            aria-label={got ? `${r.name}. Already found. Tap to read about it again.` : `Look closely: something is hidden here. Find the ${r.name}.`}
            aria-expanded={open === r.id}
            onClick={() => find(r)}
          >
            <span aria-hidden="true" />
          </button>
        );
      })}
      {flashed && <span className="relic-flash" aria-hidden="true" />}
      {active && (
        <div className="relic-card" role="status">
          <span className="relic-stamp" aria-hidden="true">
            {found.includes(active.id) ? <CheckCircle size={24} weight="fill" /> : <MagnifyingGlass size={24} weight="bold" />}
          </span>
          <div>
            <span className="relic-tag" data-found={found.includes(active.id) ? '1' : '0'}>
              {found.includes(active.id) ? 'In your collection' : 'Something to find'}
            </span>
            <h4>{active.name}</h4>
            <p>{active.note}</p>
            <button type="button" className="tag btn-sm" onClick={() => emit('sources', [active.source])}>
              <LinkSimple size={14} weight="bold" aria-hidden="true" />
              Check the evidence
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Blocks
   -------------------------------------------------------------------------- */
function BlockView({
  block: b, keyPrefix, highlight, chapterId, parentNotes, pageIndex, relics, pageTitle,
}: {
  block: Block;
  keyPrefix: string;
  highlight: string | null;
  chapterId: string;
  parentNotes: boolean;
  pageIndex: number;
  relics: EraRelic[];
  pageTitle?: string;
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
        <aside className="note">
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
        <figure className={`fig ${b.wide ? 'wide' : ''}`}>
          <div className="fig-frame">
            <img src={b.src} alt={b.alt} loading="lazy" decoding="async" />
          </div>
          <figcaption>
            <span className="cap-text">{b.caption}</span>
            <span className="credit">
              Photograph by {b.credit}, {b.license}.{' '}
              <a href={b.url} target="_blank" rel="noopener noreferrer">
                View the Commons record<ArrowSquareOut size={12} weight="bold" aria-hidden="true" style={{ display: 'inline', marginLeft: 3 }} />
              </a>
            </span>
          </figcaption>
          {relics.length > 0 && (
            <div className="relic-inline">
              {relics.map((r) => (
                <InlineRelic key={r.id} relic={r} />
              ))}
            </div>
          )}
        </figure>
      );

    case 'fact':
      return (
        <aside className="night night-fact" aria-label="Did you know">
          <p className="night-label">
            <Sparkle size={15} weight="fill" aria-hidden="true" />
            Did you know
          </p>
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} />
          {b.source && (
            <button type="button" className="tag btn-sm" onClick={() => emit('sources', [b.source])}>
              <LinkSimple size={14} weight="bold" aria-hidden="true" />
              Where this comes from
            </button>
          )}
        </aside>
      );

    case 'ask':
      return (
        <section className="night" aria-label="What would you ask">
          <p className="night-label">
            <Quotes size={15} weight="fill" aria-hidden="true" />
            What would you ask?
          </p>
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} className="night-question" />
          <AskNote pageIndex={pageIndex} />
        </section>
      );

    case 'mum':
      return (
        <section className="night night-mum" aria-label="Question for Mum or Dad">
          <p className="night-label">
            <UsersThree size={15} weight="fill" aria-hidden="true" />
            Ask Mum or Dad
          </p>
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} />
        </section>
      );

    case 'parent':
      if (!parentNotes) return null;
      return (
        <aside className="parent" aria-label="Note for a grown-up">
          <p className="parent-label">For the grown-up reading along</p>
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} />
        </aside>
      );

    case 'mystery':
      return (
        <section className="night night-mystery" aria-label="The mystery">
          <p className="night-label">
            <CompassIcon size={15} weight="fill" aria-hidden="true" />
            A mystery to carry
          </p>
          <Sentences raw={b.text} keyPrefix={keyPrefix} highlight={highlight} className="night-question" />
        </section>
      );

    case 'quiz': {
      const chapter = CHAPTER_BY_ID[chapterId];
      if (!chapter) return null;
      return (
        <>
          <Quiz chapterId={chapterId} questions={chapter.quiz} pageTitle={pageTitle} />
          {parentNotes && PARENT_NOTES[chapterId] && (
            <aside className="parent" aria-label="Notes for a grown-up">
              <p className="parent-label">For the grown-up reading along</p>
              <p>{PARENT_NOTES[chapterId]}</p>
            </aside>
          )}
        </>
      );
    }

    case 'interactive':
      return (
        <section className="device bleed" aria-label={b.title ?? 'Activity'}>
          {b.title && <h3 className="subhead device-title">{b.title}</h3>}
          <Interactive name={b.name} note={b.note} chapterId={chapterId} pageIndex={pageIndex} />
        </section>
      );

    case 'toc':
      return (
        <ol className="toc-page">
          {CHAPTERS.map((c) => {
            const era = ERA_BY_ID[c.id];
            return (
              <li key={c.id} style={eraVars(c.id) as CSSProperties}>
                <button type="button" className="toc-btn" onClick={() => emit('goto', CHAPTER_START[c.id])}>
                  <span className="toc-num">{c.num === 'Prologue' || c.num === 'Epilogue' ? c.num : c.num}</span>
                  <span>
                    <span className="toc-title">{c.title}</span>
                    <span className="toc-mood">{era?.mood ?? c.mood}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      );

    case 'tellmore':
      return (
        <div className="tellmore">
          {b.items.map((it, i) => (
            <details key={i} className="tm">
              <summary>Tell me more: {it.q}</summary>
              <div className="tm-body"><p><Rich text={it.a} /></p></div>
            </details>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/** Finds attached to a real photograph rather than an illustration. */
function InlineRelic({ relic }: { relic: EraRelic }) {
  const found = useAppState((s) => s.progress.relics);
  const got = found.includes(relic.id);
  return (
    <button
      type="button"
      className={`tag btn-sm inline-relic${got ? ' is-found' : ''}`}
      aria-pressed={got}
      onClick={() => {
        if (!got) {
          setProgress((p) => ({ relics: [...p.relics, relic.id] }));
          award('first-find');
        }
        emit('sources', [relic.source]);
      }}
    >
      {got ? <CheckCircle size={14} weight="fill" aria-hidden="true" /> : <MagnifyingGlass size={14} weight="bold" aria-hidden="true" />}
      {relic.name}
    </button>
  );
}

function AskNote({ pageIndex }: { pageIndex: number }) {
  const value = useAppState((s) => s.progress.questions[String(pageIndex)] ?? '');
  return (
    <div className="ask-note">
      <label htmlFor={`q-${pageIndex}`}>Write your question here. It stays on this device.</label>
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

function PageFoot({
  index, isBookmarked, label, sourceIds,
}: { index: number; isBookmarked: boolean; label: string; sourceIds: string[] }) {
  return (
    <footer className="pagefoot">
      {sourceIds.length > 0 && (
        <button type="button" className="tag btn-sm" onClick={() => emit('sources', sourceIds)}>
          <LinkSimple size={14} weight="bold" aria-hidden="true" />
          Where these facts come from
        </button>
      )}
      <button
        type="button"
        className="tag btn-sm"
        aria-pressed={isBookmarked}
        onClick={() => {
          const s = getState();
          if (isBookmarked) {
            setProgress({ bookmarks: s.progress.bookmarks.filter((b) => b.page !== index) });
          } else {
            setProgress({ bookmarks: [...s.progress.bookmarks, { page: index, label }] });
            award('bookmark');
          }
        }}
      >
        <BookmarkSimple size={14} weight={isBookmarked ? 'fill' : 'bold'} aria-hidden="true" />
        {isBookmarked ? 'Bookmarked' : 'Save this page'}
      </button>
    </footer>
  );
}
