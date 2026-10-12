import { useEffect, useRef, useState } from 'react';
import { GLOSSARY } from '../content/glossary';
import { on } from '../lib/bus';
import { setProgress, getState } from '../lib/store';
import { award } from '../lib/achievements';

// Glossary card: a bottom sheet that defines a tapped term.
export function GlossaryCard() {
  const [term, setTerm] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const returnRef = useRef<HTMLElement | null>(null);

  useEffect(() => on('glossary', (t: string) => {
    returnRef.current = document.activeElement as HTMLElement | null;
    setTerm(t);
    const s = getState();
    if (!s.progress.glossary.includes(t)) {
      const next = [...s.progress.glossary, t];
      setProgress({ glossary: next });
      if (next.length >= 5) award('glossary-5');
    }
  }), []);

  useEffect(() => {
    if (term) closeRef.current?.focus();
  }, [term]);

  if (!term) return null;
  const entry = GLOSSARY[term];
  function close() {
    setTerm(null);
    returnRef.current?.focus?.();
  }
  return (
    <aside className="glossary-card" role="dialog" aria-modal="false" aria-labelledby="gl-title" onKeyDown={(e) => { if (e.key === 'Escape') close(); }}>
      <div className="gl-head">
        <h2 id="gl-title" className="gl-term">{term}</h2>
        {entry?.say && <span className="gl-say" aria-label={`Say it like: ${entry.say}`}>{entry.say}</span>}
        <button ref={closeRef} type="button" className="ghost small" onClick={close}>Close</button>
      </div>
      <p>{entry?.def ?? 'No definition yet.'}</p>
      <p className="caption-small">Words are defined in plain language. Press Escape or Close to return to the page.</p>
    </aside>
  );
}

export function Toasts() {
  const [items, setItems] = useState<{ id: number; text: string }[]>([]);
  useEffect(() => on('toast', (text: string) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, text }]);
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3600);
  }), []);
  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => <div key={t.id} className="toast">{t.text}</div>)}
    </div>
  );
}
