import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useAppState } from '../lib/store';
import { Globe } from '../interactives/Globe';

// The closed book. "Open My History Book" turns the cover, then reveals the first spread.
export function Cover({ onOpen, hasProgress, onContinue }: { onOpen: () => void; hasProgress: boolean; onContinue: () => void }) {
  const [opening, setOpening] = useState(false);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const motion = useAppState((s) => s.settings.motion);
  const reduced = prefersReducedMotion(motion);

  function open(continueFrom: boolean) {
    if (opening) return;
    setOpening(true);
    const done = () => (continueFrom ? onContinue() : onOpen());
    const el = coverRef.current;
    if (reduced || !el || !el.animate) { done(); return; }
    const anim = el.animate(
      [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-168deg)' }],
      { duration: 1100, easing: 'cubic-bezier(.55,.05,.2,1)', fill: 'forwards' },
    );
    anim.onfinish = done;
  }

  return (
    <main id="book" className="cover-screen" tabIndex={-1}>
      <Starfield reduced={reduced} />
      <div className="cover-stage">
        <div className="cover-book" aria-hidden={opening}>
          <div className="cover-back" />
          <div className="cover-front" ref={coverRef}>
            <div className="cover-emblem"><Globe /></div>
            <p className="cover-kicker">A storybook for Luchelle</p>
            <h1 className="cover-title">Luchelle’s South African Time Machine</h1>
            <p className="cover-sub">A journey through the people, places and events that shaped our country</p>
            <div className="cover-foot">A history book you can turn</div>
          </div>
        </div>
        <div className="cover-actions">
          <button type="button" className="btn big" onClick={() => open(false)} disabled={opening} autoFocus>
            Open My History Book
          </button>
          {hasProgress && (
            <button type="button" className="ghost" onClick={() => open(true)} disabled={opening}>
              Continue where you left off
            </button>
          )}
          <p className="cover-note">The book works without accounts. Your place, bookmarks and quiz answers are stored only on this device.</p>
        </div>
      </div>
    </main>
  );
}

function Starfield({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let stars: { x: number; y: number; r: number; s: number; ph: number }[] = [];
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      c.style.width = `${window.innerWidth}px`;
      c.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((window.innerWidth * window.innerHeight) / 5000);
      stars = Array.from({ length: Math.min(260, count) }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.4 + 0.2,
        s: Math.random() * 0.02 + 0.004,
        ph: Math.random() * Math.PI * 2,
      }));
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const st of stars) {
        const a = reduced ? 0.7 : 0.45 + 0.4 * Math.sin(t * st.s + st.ph);
        ctx.beginPath();
        ctx.fillStyle = `rgba(244,236,216,${a.toFixed(3)})`;
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    resize();
    draw(0);
    if (!reduced) raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [reduced]);
  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
