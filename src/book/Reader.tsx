import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PAGES, type Page } from '../content';
import { PageView } from './PageView';
import { useAppState, setProgress, prefersReducedMotion } from '../lib/store';
import { pageTurn } from '../lib/sfx';
import { award } from '../lib/achievements';
import { on, emit } from '../lib/bus';
import { ERA_BY_ID, eraVars } from '../design/era';
import { eraPlateSrc } from '../design/relics';

/* ============================================================================
   THE READER
   ----------------------------------------------------------------------------
   A book that behaves like a book. On a phone it is one page with a lift-and-
   slide turn you can drag. On a wide screen it is a true two-page spread with
   a leaf that follows your finger in 3D and casts a moving shade across the
   paper. Keyboard, buttons, corner taps and swipes all reach the same
   controller, and the controller is published on the event bus so the HUD can
   drive it too.
   ========================================================================= */

export const TURN_MS = 760;
const WIDE_QUERY = '(min-width: 940px) and (min-height: 600px)';

export function useWide(): boolean {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(WIDE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const h = () => setWide(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return wide;
}

/** The right-hand page index of the spread containing `page`. */
export function spreadRight(page: number): number {
  return page - (page % 2);
}

export function visibleIndices(page: number, wide: boolean): number[] {
  if (!wide) return [page];
  const r = spreadRight(page);
  return [r - 1, r].filter((i) => i >= 0 && i < PAGES.length);
}

export function nextReadable(from: number, dir: 1 | -1): number | null {
  let i = from + dir;
  while (i >= 0 && i < PAGES.length) {
    if (!PAGES[i].blank) return i;
    i += dir;
  }
  return null;
}

/** Asks the reader to turn. Used by the HUD rail and the keyboard. */
export function requestTurn(dir: 1 | -1) {
  emit('turn', dir);
}

interface Turn {
  dir: 1 | -1;
  target: number;
  p: number;
  settling: boolean;
}

export function Reader({ highlight }: { highlight: string | null }) {
  const page = useAppState((s) => s.progress.page);
  const motion = useAppState((s) => s.settings.motion);
  const sound = useAppState((s) => s.settings.sound);
  const volume = useAppState((s) => s.settings.soundVolume);
  const wide = useWide();
  const reduced = prefersReducedMotion(motion);
  const R = wide ? spreadRight(page) : page;
  const [turn, setTurn] = useState<Turn | null>(null);
  const [lastDir, setLastDir] = useState<1 | -1>(1);
  const turnRef = useRef<Turn | null>(null);
  turnRef.current = turn;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x0: number; y0: number; dir: 1 | -1; active: boolean; width: number } | null>(null);
  const focusAfter = useRef(false);

  function commit(target: number) {
    setTurn(null);
    setProgress((p) => ({
      page: target,
      seen: Array.from(new Set([...p.seen, target, target + 1])).slice(-400),
    }));
    if (sound) pageTurn(volume);
    award('first-turn');
    focusAfter.current = true;
  }

  function canTurn(dir: 1 | -1): number | null {
    const target = dir === 1 ? R + 2 : R - 2;
    if (target < 0 || target >= PAGES.length) return null;
    return target;
  }

  function startTurn(dir: 1 | -1) {
    if (turnRef.current) return;
    if (!wide) {
      const t = nextReadable(page, dir);
      if (t === null) return;
      if (reduced) { setProgress({ page: t }); return; }
      setLastDir(dir);
      setProgress((p) => ({ page: t, seen: [...p.seen, t].slice(-400) }));
      if (sound) pageTurn(volume);
      award('first-turn');
      focusAfter.current = true;
      return;
    }
    const target = canTurn(dir);
    if (target === null) return;
    if (reduced) { commit(target); return; }
    setTurn({ dir, target, p: 0, settling: false });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTurn((t) => (t ? { ...t, p: 1, settling: true } : t));
    }));
  }

  useEffect(() => {
    if (!turn || !turn.settling) return;
    const id = window.setTimeout(() => {
      const t = turnRef.current;
      if (!t) return;
      if (t.p >= 0.5) commit(t.target);
      else setTurn(null);
    }, TURN_MS + 40);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn?.settling, turn?.target]);

  /* Keyboard. Arrows, page keys and space all turn. */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); startTurn(1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); startTurn(-1); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, R, wide, reduced, sound, volume]);

  /* Turns asked for from anywhere else in the app. */
  useEffect(() => on('turn', (dir: 1 | -1) => startTurn(dir)), [page, R, wide, reduced, sound, volume]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Jumps from the atlas, the contents and the timeline. */
  useEffect(() => on('goto', (index: number) => {
    setTurn(null);
    setProgress({ page: wide ? spreadRight(index) : index });
    focusAfter.current = true;
  }), [wide]);

  useEffect(() => {
    if (!focusAfter.current) return;
    focusAfter.current = false;
    const el = stageRef.current?.querySelector<HTMLElement>('[data-page] [data-focus-title]');
    el?.focus({ preventScroll: true });
  }, [R, page]);

  /* Pointer: drag a leaf on a wide screen; swipe anywhere on a phone. */
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (turnRef.current || !stageRef.current) return;
    const t = e.target as HTMLElement;
    if (t.closest('button, a, input, textarea, select, label, details, summary, [role="tab"], svg')) return;
    const rect = stageRef.current.getBoundingClientRect();
    const half = rect.left + rect.width / 2;
    const dir: 1 | -1 = e.clientX > half ? 1 : -1;
    drag.current = { x0: e.clientX, y0: e.clientY, dir, active: false, width: wide ? rect.width / 2 : rect.width };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || !wide) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.active) {
      if (Math.abs(dx) < 12 || Math.abs(dy) > Math.abs(dx)) return;
      const target = canTurn(d.dir);
      if (target === null || turnRef.current) { drag.current = null; return; }
      d.active = true;
      setTurn({ dir: d.dir, target, p: 0, settling: false });
    }
    const raw = d.dir === 1 ? -dx / d.width : dx / d.width;
    setTurn((t) => (t ? { ...t, p: Math.max(0, Math.min(1, raw)) } : t));
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    drag.current = null;
    if (!d || !stageRef.current) return;
    if (!wide) {
      const dx = e.clientX - d.x0;
      const dy = e.clientY - d.y0;
      if (Math.abs(dx) >= 46 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        startTurn(dx < 0 ? 1 : -1);
      }
      return;
    }
    if (!d.active) {
      /* A tap on the outer third of a page turns it, like a real book
         corner. The middle third stays free for reading and tapping. */
      const rect = stageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      if (x > 0.86) startTurn(1);
      else if (x < 0.14) startTurn(-1);
      return;
    }
    const t = turnRef.current;
    if (!t) return;
    setTurn({ ...t, p: t.p > 0.5 ? 1 : 0, settling: true });
  }

  const turning = wide && turn !== null;
  const leftStatic = turning ? (turn!.dir === 1 ? R - 1 : R - 3) : R - 1;
  const rightStatic = turning ? (turn!.dir === 1 ? R + 2 : R) : R;
  const leafFront = turning ? (turn!.dir === 1 ? R : R - 1) : -1;
  const leafBack = turning ? (turn!.dir === 1 ? R + 1 : R - 2) : -1;
  const p = turn?.p ?? 0;
  const dir = turn?.dir ?? 1;
  const transition = turn?.settling && !reduced ? `transform ${TURN_MS}ms cubic-bezier(.44,.05,.2,1)` : 'none';
  const shade = Math.sin(Math.PI * p) * 0.5;

  const current = PAGES[page];
  const chapterId = current?.chapter || 'prologue';
  const era = ERA_BY_ID[chapterId];
  const plateSrc = eraPlateSrc(chapterId);
  const [enterKey, setEnterKey] = useState(0);
  useEffect(() => { setEnterKey((k) => k + 1); }, [page]);

  return (
    <div
      ref={stageRef}
      className={`stage${reduced ? ' no-anim' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { drag.current = null; if (turnRef.current && !turnRef.current.settling) setTurn(null); }}
      style={eraVars(chapterId) as CSSProperties}
    >
      {plateSrc && (
        <div className="plate-backdrop" aria-hidden="true" key={chapterId}>
          <img src={plateSrc} alt="" />
        </div>
      )}

      <div className={`sheet ${wide ? 'wide' : 'single'}`}>
        {wide ? (
          <>
            <div className="pane pane-left">
              <PaneFace index={leftStatic} face="left" highlight={highlight} />
            </div>
            <div className="pane pane-right">
              <PaneFace index={rightStatic} face="right" highlight={highlight} />
            </div>
            {turning && (
              <div
                className={`leaf ${dir === 1 ? 'to-left' : 'to-right'}`}
                style={{ transform: `rotateY(${dir === 1 ? -180 * p : 180 * p}deg)`, transition }}
                aria-hidden="true"
              >
                <div className="leaf-face leaf-front">
                  <PaneFace index={leafFront} face={dir === 1 ? 'right' : 'left'} highlight={null} />
                </div>
                <div className="leaf-face leaf-back">
                  <PaneFace index={leafBack} face={dir === 1 ? 'left' : 'right'} highlight={null} />
                </div>
                <div className="leaf-shade" style={{ opacity: shade }} />
              </div>
            )}
          </>
        ) : (
          <div
            className="pane pane-single"
            key={enterKey}
            data-enter={reduced ? '0' : 'turn'}
            style={{ ['--turn-from' as string]: lastDir === -1 ? '-22px' : '22px' }}
          >
            <PaneFace index={page} face="single" highlight={highlight} />
          </div>
        )}
      </div>

      {/* Corner affordances: real buttons in the outer thirds, so the tap
          target is explicit and a screen reader can reach it. */}
      {!wide && (
        <>
          <button type="button" className="corner corner-prev" onClick={() => startTurn(-1)} aria-label="Previous page">
            <span aria-hidden="true" />
          </button>
          <button type="button" className="corner corner-next" onClick={() => startTurn(1)} aria-label="Next page">
            <span aria-hidden="true" />
          </button>
        </>
      )}

      <div className="sr-only" aria-live="polite">
        {wide
          ? `Showing pages ${Math.max(1, leftStatic)} and ${Math.max(1, rightStatic)}`
          : PAGES[page]?.side.title ? `Page: ${PAGES[page].side.title}` : 'Page'}
      </div>
    </div>
  );
}

function PaneFace({ index, face, highlight }: { index: number; face: 'left' | 'right' | 'single'; highlight: string | null }) {
  const page: Page | undefined = PAGES[index];
  if (!page || page.blank) {
    return <div className={`page blank-page face-${face}`} aria-hidden="true" />;
  }
  return (
    <PageView
      index={index}
      side={page.side}
      chapterId={page.chapter}
      highlight={highlight}
      face={face}
      pageNumber={page.pageNo}
    />
  );
}
