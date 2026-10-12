import { CHAPTERS, CHAPTER_START, CHAPTER_BY_ID, PAGES } from '../content';
import { SideView } from '../book/SideView';
import { setProgress } from '../lib/store';
import { emit } from '../lib/bus';

// Simplified reading mode: one chapter at a time, top to bottom, with no page-turn effects.
export function SimpleReader({ page, highlight }: { page: number; highlight: string | null }) {
  const current = PAGES[page]?.chapter || 'prologue';
  const idx = CHAPTERS.findIndex((c) => c.id === current);
  const chapter = CHAPTERS[Math.max(0, idx)];
  const start = CHAPTER_START[chapter.id];
  const nextStart = idx + 1 < CHAPTERS.length ? CHAPTER_START[CHAPTERS[idx + 1].id] : PAGES.length;
  const indices: number[] = [];
  for (let i = start; i < nextStart; i++) if (!PAGES[i].blank) indices.push(i);

  function go(id: string) {
    setProgress({ page: CHAPTER_START[id] });
    emit('goto-simple', id);
  }

  return (
    <div className="simple-reader">
      <div className="simple-nav" role="navigation" aria-label="Chapter navigation">
        <button type="button" className="ghost small" disabled={idx <= 0} onClick={() => go(CHAPTERS[idx - 1].id)}>← Previous chapter</button>
        <label className="select-label">
          Chapter
          <select value={chapter.id} onChange={(e) => go(e.target.value)}>
            {CHAPTERS.map((c) => (
              <option key={c.id} value={c.id}>{c.num === 'Prologue' || c.num === 'Epilogue' ? c.num : `Chapter ${c.num}`}: {c.title}</option>
            ))}
          </select>
        </label>
        <button type="button" className="ghost small" disabled={idx >= CHAPTERS.length - 1} onClick={() => go(CHAPTERS[idx + 1].id)}>Next chapter →</button>
      </div>
      <h1 className="simple-title">{chapter.num === 'Prologue' || chapter.num === 'Epilogue' ? chapter.num : `Chapter ${chapter.num}`}: {chapter.title}</h1>
      <p className="muted">{CHAPTER_BY_ID[chapter.id].subtitle}</p>
      {indices.map((i) => (
        <div key={i} className="simple-page" id={`simple-${i}`}>
          <SideView index={i} side={PAGES[i].side} chapterId={chapter.id} highlight={highlight} face="single" pageNumber={PAGES[i].pageNo} />
        </div>
      ))}
    </div>
  );
}
