import { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { CHAPTERS, CHAPTER_START, CHAPTER_BY_ID, PAGES } from '../content';
import { PageView } from '../book/PageView';
import { setProgress } from '../lib/store';
import { ERA_BY_ID, eraVars } from '../design/era';
import type { CSSProperties } from 'react';

/* ============================================================================
   PLAIN READING
   ----------------------------------------------------------------------------
   Some readers want the whole chapter in one scrolling column with no page
   turning at all. This is the same content, the same typography and the same
   rules, laid out as an ordinary long document. It is a real reading mode,
   not a fallback: nothing is removed.
   ========================================================================= */

export function PlainReader({ page, highlight }: { page: number; highlight: string | null }) {
  const [picking, setPicking] = useState(false);
  const current = PAGES[page]?.chapter || 'prologue';
  const idx = Math.max(0, CHAPTERS.findIndex((c) => c.id === current));
  const chapter = CHAPTERS[idx];
  const start = CHAPTER_START[chapter.id];
  const nextStart = idx + 1 < CHAPTERS.length ? CHAPTER_START[CHAPTERS[idx + 1].id] : PAGES.length;
  const indices: number[] = [];
  for (let i = start; i < nextStart; i++) if (!PAGES[i].blank) indices.push(i);
  const era = ERA_BY_ID[chapter.id];

  function go(id: string) {
    setPicking(false);
    setProgress({ page: CHAPTER_START[id] });
  }

  const label = (num: string) => (num === 'Prologue' || num === 'Epilogue' ? num : `Chapter ${num}`);

  return (
    <div className="plain" style={eraVars(chapter.id) as CSSProperties}>
      <div className="plain-head">
        {/* The chapter picker is a list, not a form control: a book with eleven
            chapters should not be selected from a dropdown. */}
        <details className="picker" open={picking} onToggle={(e) => setPicking((e.target as HTMLDetailsElement).open)}>
          <summary>
            <span className="picker-where">{label(chapter.num)}</span>
            <span className="picker-now">{chapter.title}</span>
            <CaretDown className="picker-caret" size={16} weight="bold" aria-hidden="true" />
          </summary>
          <ol className="picker-list">
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={c.id === chapter.id ? 'picker-row is-here' : 'picker-row'}
                  aria-current={c.id === chapter.id ? 'page' : undefined}
                  onClick={() => go(c.id)}
                >
                  <span className="picker-num">{c.num === 'Prologue' || c.num === 'Epilogue' ? c.num.slice(0, 3) : c.num}</span>
                  <span className="picker-name">{c.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </details>
        <div className="plain-turns">
          <button type="button" className="ghost small" disabled={idx <= 0} onClick={() => go(CHAPTERS[idx - 1].id)}>
            Previous chapter
          </button>
          <button
            type="button"
            className="ghost small"
            disabled={idx >= CHAPTERS.length - 1}
            onClick={() => go(CHAPTERS[idx + 1].id)}
          >
            Next chapter
          </button>
        </div>
      </div>

      <h1 className="page-title opener-title">{chapter.title}</h1>
      <p className="page-kicker">{label(chapter.num)}</p>
      <p className="muted">{CHAPTER_BY_ID[chapter.id].subtitle}</p>
      {era?.mood && <p className="muted caption-small">{era.mood}</p>}

      {indices.map((i) => (
        <section key={i} className="plain-section" id={`plain-${i}`}>
          <PageView
            index={i}
            side={PAGES[i].side}
            chapterId={chapter.id}
            highlight={highlight}
            face="single"
            pageNumber={PAGES[i].pageNo}
          />
        </section>
      ))}
    </div>
  );
}
