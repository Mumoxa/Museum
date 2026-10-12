import { useEffect, useRef, type ReactNode } from 'react';

// A modal panel with focus moved into it on open, Escape to close, and focus returned on close.
export function Dialog({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  useEffect(() => {
    returnTo.current = document.activeElement as HTMLElement | null;
    const first = ref.current?.querySelector<HTMLElement>('h2, button, [href], input, select, textarea');
    (ref.current?.querySelector<HTMLElement>('h2') ?? first)?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      if (e.key === 'Tab' && ref.current) {
        const f = Array.from(ref.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, select, textarea, [tabindex="0"]'));
        if (f.length === 0) return;
        const a = f[0], b = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
      }
    }
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      returnTo.current?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className={`dialog ${wide ? 'dialog-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-head">
          <h2 id="dialog-title" tabIndex={-1}>{title}</h2>
          <button type="button" className="ghost small" onClick={onClose}>Close</button>
        </div>
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  );
}
