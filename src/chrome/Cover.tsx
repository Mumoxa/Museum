import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ArrowClockwise } from '@phosphor-icons/react';
import { prefersReducedMotion, useAppState } from '../lib/store';

/* ============================================================================
   THE COVER
   ----------------------------------------------------------------------------
   A closed book on a desk at night, under one lamp. Touching it makes the
   title glimmer, then the board swings open and the room floods with warm
   light. That flood is the transition into the book: the cover animates out,
   and the reader animates in underneath it, so the two movements read as one.
   ========================================================================= */

export function Cover({ onOpen, hasProgress, onContinue }: {
  onOpen: () => void;
  hasProgress: boolean;
  onContinue: () => void;
}) {
  const [opening, setOpening] = useState(false);
  const [lit, setLit] = useState(false);
  const motion = useAppState((s) => s.settings.motion);
  const reduced = prefersReducedMotion(motion);
  const timer = useRef<number | null>(null);

  /* The title catches the light a moment after the cover appears. */
  useEffect(() => {
    const t = window.setTimeout(() => setLit(true), reduced ? 0 : 420);
    return () => window.clearTimeout(t);
  }, [reduced]);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  function open(continueFrom: boolean) {
    if (opening) return;
    setOpening(true);
    setLit(true);
    const done = () => (continueFrom ? onContinue() : onOpen());
    timer.current = window.setTimeout(done, reduced ? 60 : 1180);
  }

  const motes = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({
      left: `${(i * 37) % 96 + 2}%`,
      bottom: `${(i * 23) % 40}%`,
      delay: `${(i * 0.9) % 11}s`,
      duration: `${13 + ((i * 7) % 9)}s`,
      size: i % 4 === 0 ? 3 : 2,
    })),
    [],
  );

  return (
    <main id="book" className="cover-stage" tabIndex={-1}>
      <div className="cover-desk" aria-hidden="true" />
      {!reduced && (
        <div className="motes" aria-hidden="true">
          {motes.map((m, i) => (
            <span
              key={i}
              className="mote"
              style={{
                left: m.left,
                bottom: m.bottom,
                width: m.size,
                height: m.size,
                animationDelay: m.delay,
                animationDuration: m.duration,
              }}
            />
          ))}
        </div>
      )}

      <div className="cover-book" aria-hidden={opening}>
        <div className="cover-block" aria-hidden="true" />
        <div className="cover-front" data-opening={opening ? '1' : undefined}>
          <div className="cover-top">
            <p className="cover-press">A history book you can turn</p>
          </div>

          <div className="cover-mid">
            <h1 className="cover-title" data-lit={lit ? '1' : '0'}>
              Luchelle&rsquo;s
              <br />
              Museum
            </h1>
            <div className="cover-rule" aria-hidden="true" />
            <p className="cover-sub">
              A journey through the people, places and events that shaped our country
            </p>
          </div>

          <p className="cover-foot">South African Time Machine</p>
        </div>
      </div>

      <div className="cover-actions">
        <button
          type="button"
          className="btn btn-solid btn-lg"
          onClick={() => open(false)}
          disabled={opening}
          autoFocus
        >
          <BookOpen size={19} weight="bold" aria-hidden="true" />
          Open the book
        </button>
        {hasProgress && (
          <button type="button" className="btn btn-ghost" onClick={() => open(true)} disabled={opening}>
            <ArrowClockwise size={17} weight="bold" aria-hidden="true" />
            Carry on from my bookmark
          </button>
        )}
        <p className="cover-hint">
          No accounts, no adverts. Your place, your finds and your quiz answers stay on this device.
        </p>
      </div>

      {opening && !reduced && <div className="cover-flood" aria-hidden="true" />}
    </main>
  );
}
