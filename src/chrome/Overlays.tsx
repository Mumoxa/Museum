import { useEffect, useRef, useState } from 'react';
import { Stamp } from '@phosphor-icons/react';
import { GLOSSARY } from '../content/glossary';
import { on } from '../lib/bus';
import { setProgress, getState, useAppState } from '../lib/store';
import { award } from '../lib/achievements';

/* ============================================================================
   THE RELIC DRAWER
   ----------------------------------------------------------------------------
   One surface for two jobs. Tapping a dotted word in the text opens it as a
   definition. Tapping a find-point on a plate opens it as a specimen label.
   It always sits low on the screen, on the dark ground, so the page above it
   stays visible and the reader never loses their place.
   ========================================================================= */

interface DrawerBody {
  kind: 'word' | 'find';
  title: string;
  say?: string;
  body: string;
  source?: string;
  found?: boolean;
}

export function RelicDrawer() {
  const [item, setItem] = useState<DrawerBody | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const returnRef = useRef<HTMLElement | null>(null);

  useEffect(() => on('glossary', (term: string) => {
    returnRef.current = document.activeElement as HTMLElement | null;
    const entry = GLOSSARY[term];
    setItem({
      kind: 'word',
      title: term,
      say: entry?.say,
      body: entry?.def ?? 'This word has no note yet.',
    });
    const s = getState();
    if (!s.progress.glossary.includes(term)) {
      const next = [...s.progress.glossary, term];
      setProgress({ glossary: next });
      if (next.length >= 5) award('glossary-5');
    }
  }), []);

  useEffect(() => { if (item) closeRef.current?.focus(); }, [item]);

  function close() {
    setItem(null);
    returnRef.current?.focus?.();
  }

  if (!item) return null;

  return (
    <aside
      className="relic-drawer"
      role="dialog"
      aria-modal="false"
      aria-labelledby="drawer-title"
      onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
    >
      <div className="relic-drawer-head">
        <h2 id="drawer-title" className="relic-drawer-term">{item.title}</h2>
        {item.say && <span className="relic-drawer-say">Say it: {item.say}</span>}
      </div>
      <p className="relic-drawer-body">{item.body}</p>
      <div className="relic-drawer-foot">
        <span>{item.kind === 'word' ? 'Dotted words are explained in plain language.' : 'Collected in your cabinet.'}</span>
        <button ref={closeRef} type="button" className="ghost small" onClick={close}>
          Back to the page
        </button>
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------------------------
   Toasts: a brass nameplate, not a chat bubble. Real events only.
   -------------------------------------------------------------------------- */
export function Toasts() {
  const [items, setItems] = useState<{ id: number; text: string }[]>([]);
  useEffect(() => on('toast', (text: string) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs.slice(-2), { id, text }]);
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4200);
  }), []);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="toast">
          <Stamp size={16} weight="fill" aria-hidden="true" />
          {t.text}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The find counter: a thin brass line across the top of the app, driven by
   saved progress rather than by decoration.
   -------------------------------------------------------------------------- */
export function FindThread() {
  const found = useAppState((s) => s.progress.relics.length);
  const completed = useAppState((s) => s.progress.completed.length);
  const bookmark = useAppState((s) => s.progress.bookmarks.length);
  const total = 30;
  const progress = Math.min(1, (found + completed * 2 + Math.min(bookmark, 6)) / (total + 24 + 6));
  return <div className="thread" style={{ transform: `scaleX(${Math.max(0.012, progress)})` }} aria-hidden="true" />;
}

/** Kept for the older import path used elsewhere in the app. */
export const GlossaryCard = RelicDrawer;
