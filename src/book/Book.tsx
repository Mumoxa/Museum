import { useEffect, useRef, useState } from 'react';
import { PAGES, type Page } from '../content';
import { SideView } from './SideView';
import { useAppState, setProgress, prefersReducedMotion } from '../lib/store';
import { pageTurn } from '../lib/sfx';
import { award } from '../lib/achievements';
import { on } from '../lib/bus';

export const TURN_MS = 720;
const WIDE_QUERY = '(min-width: 900px) and (min-height: 560px)';

/** True when the book shows two pages side by side. */
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

/** The right-hand page index of the spread that contains `page`. Right pages are even. */
export function spreadRight(page: number): number {
  return page - (page % 2);
}

/** Pages visible on screen for the given page state. */
export function visibleIndices(page: number, wide: boolean): number[] {
  if (!wide) return [page];
  const r = spreadRight(page);
  return [r - 1, r].filter((i) => i >= 0 && i < PAGES.length);
}

function nextReadable(from: number, dir: 1 | -1): number | null {
  let i = from + dir;
  while (i >= 0 && i < PAGES.length) {
    if (!PAGES[i].blank) return i;
    i += dir;
  }
  return null;
}

interface Turn {
  dir: 1 | -1;
  target: number;
  p: number;
  settling: boolean;
}

export function Book({ highlight, onTurnKey }: { highlight: string | null; onTurnKey?: () => void }) {
  const page = useAppState((s) => s.progress.page);
  const motion = useAppState((s) => s.settings.motion);
  const sound = useAppState((s) => s.settings.sound);
  const volume = useAppState((s) => s.settings.soundVolume);
  const wide = useWide();
  const reduced = prefersReducedMotion(motion);
  const R = wide ? spreadRight(page) : page;
  const [turn, setTurn] = useState<Turn | null>(null);
  const turnRef = useRef<Turn | null>(null);
  turnRef.current = turn;
  const bookRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x0: number; y0: number; dir: 1 | -1; active: boolean; width: number } | null>(null);
  const focusAfter = useRef(false);

  // Commit a finished turn: update the saved page and play the optional sound.
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

  // Spread-mode turns. In single-page mode, changes are immediate and animated by CSS instead.
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
      setProgress((p) => ({ page: t, seen: [...p.seen, t].slice(-400) }));
      if (sound) pageTurn(volume);
      award('first-turn');
      focusAfter.current = true;
      onTurnKey?.();
      return;
    }
    const target = canTurn(dir);
    if (target === null) return;
    onTurnKey?.();
    if (reduced) { commit(target); return; }
    setTurn({ dir, target, p: 0, settling: false });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTurn((t) => (t ? { ...t, p: 1, settling: true } : t));
    }));
  }

  // When a turn settles, wait for the CSS transition to finish, then commit or cancel.
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

  // Keyboard: arrows and page keys, unless the reader is typing.
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

  // Jumps from the contents, timeline and other panels.
  useEffect(() => on('goto', (index: number) => {
    setTurn(null);
    setProgress({ page: wide ? spreadRight(index) : index });
    focusAfter.current = true;
  }), [wide]);

  // Move focus to the new page heading after keyboard or button navigation.
  useEffect(() => {
    if (!focusAfter.current) return;
    focusAfter.current = false;
    const el = bookRef.current?.querySelector<HTMLElement>('[data-page] [data-focus-title]');
    el?.focus({ preventScroll: true });
  }, [R, page]);

  // Pointer: drag a page to turn it, or tap the bottom outer corners.
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (turnRef.current || !bookRef.current) return;
    const t = e.target as HTMLElement;
    if (t.closest('button, a, input, textarea, select, label, details, summary, [role="tab"]')) return;
    const rect = bookRef.current.getBoundingClientRect();
    const half = rect.left + rect.width / 2;
    const dir: 1 | -1 = e.clientX > half ? 1 : -1;
    drag.current = { x0: e.clientX, y0: e.clientY, dir, active: false, width: wide ? rect.width / 2 : rect.width };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || !wide) return;   // single-page swipes are judged on release
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.active) {
      if (Math.abs(dx) < 10 || Math.abs(dy) > Math.abs(dx)) return;
      const target = canTurn(d.dir);
      if (target === null || turnRef.current) { drag.current = null; return; }
      d.active = true;
      onTurnKey?.();
      setTurn({ dir: d.dir, target, p: 0, settling: false });
    }
    const raw = d.dir === 1 ? -dx / d.width : dx / d.width;
    const p = Math.max(0, Math.min(1, raw));
    setTurn((t) => (t ? { ...t, p } : t));
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    drag.current = null;
    if (!d || !bookRef.current) return;
    if (!wide) {
      // Single page: a horizontal swipe of at least 50px turns the page.
      const dx = e.clientX - d.x0;
      const dy = e.clientY - d.y0;
      if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        startTurn(dx < 0 ? 1 : -1);
        return;
      }
    }
    if (!d.active) {
      // A tap: turn only from the bottom outer corners.
      const rect = bookRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inBottom = y > rect.height * 0.8;
      if (inBottom && x > rect.width * 0.86) startTurn(1);
      else if (inBottom && x < rect.width * 0.14) startTurn(-1);
      return;
    }
    const t = turnRef.current;
    if (!t) return;
    setTurn({ ...t, p: t.p > 0.5 ? 1 : 0, settling: true });
  }

  const hasLeft = R - 1 >= 0;
  const turning = wide && turn !== null;
  const leftStatic = turning ? (turn!.dir === 1 ? R - 1 : R - 3) : R - 1;
  const rightStatic = turning ? (turn!.dir === 1 ? R + 2 : R) : R;
  const leafFront = turning ? (turn!.dir === 1 ? R : R - 1) : -1;
  const leafBack = turning ? (turn!.dir === 1 ? R + 1 : R - 2) : -1;
  const p = turn?.p ?? 0;
  const dir = turn?.dir ?? 1;
  const transition = turn?.settling && !reduced ? `transform ${TURN_MS}ms cubic-bezier(.22,.7,.18,1)` : 'none';
  const shade = Math.sin(Math.PI * p) * 0.55;

  const pageClass = wide ? 'book spread' : 'book single';
  const singleKey = `${page}`;
  const single = page >= 0 && page < PAGES.length ? page : 0;

  return (
    <div
      ref={bookRef}
      className={`${pageClass} ${reduced ? 'no-anim' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { drag.current = null; if (turnRef.current && !turnRef.current.settling) setTurn(null); }}
    >
      <div className="book-board" aria-hidden="false">
        {wide ? (
          <>
            <div className="sheet left-sheet">
              <PageFace index={leftStatic} face="left" highlight={highlight} endpaper={leftStatic < 0} />
            </div>
            <div className="sheet right-sheet">
              <PageFace index={rightStatic} face="right" highlight={highlight} />
            </div>
            <div className="spine" aria-hidden="true" />
            {turning && (
              <div
                className={`leaf ${dir === 1 ? 'to-left' : 'to-right'}`}
                style={{
                  transform: `rotateY(${dir === 1 ? -180 * p : 180 * p}deg)`,
                  transition,
                }}
                aria-hidden="true"
              >
                <div className="face front">
                  <PageFace index={leafFront} face={dir === 1 ? 'right' : 'left'} highlight={null} endpaper={leafFront < 0} />
                </div>
                <div className="face back">
                  <PageFace index={leafBack} face={dir === 1 ? 'left' : 'right'} highlight={null} endpaper={leafBack < 0} />
                </div>
                <div className="turn-shade" style={{ opacity: shade }} />
              </div>
            )}
          </>
        ) : (
          <div className="sheet single-sheet" key={singleKey} data-anim={reduced ? 'none' : 'slide'}>
            <PageFace index={single} face="single" highlight={highlight} />
          </div>
        )}
      </div>
      <div className="corner-hint left" aria-hidden="true" />
      <div className="corner-hint right" aria-hidden="true" />
      <div className="sr-only" aria-live="polite">
        {wide
          ? `Pages ${R} and ${R + 1 < PAGES.length ? R + 1 : R}`
          : PAGES[page]?.side.title ? `Page: ${PAGES[page].side.title}` : 'Page'}
      </div>
      <div className="book-nav" role="group" aria-label="Turn pages">
        <button type="button" className="nav-btn" onClick={() => startTurn(-1)} disabled={wide ? !hasLeft && R - 2 < 0 : nextReadable(page, -1) === null}>
          <span aria-hidden="true">←</span> Previous {wide ? 'spread' : 'page'}
        </button>
        <button type="button" className="nav-btn primary" onClick={() => startTurn(1)} disabled={wide ? R + 2 >= PAGES.length : nextReadable(page, 1) === null}>
          Next {wide ? 'spread' : 'page'} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function PageFace({ index, face, highlight, endpaper }: { index: number; face: 'left' | 'right' | 'single'; highlight: string | null; endpaper?: boolean }) {
  const page: Page | undefined = PAGES[index];
  if (!page || page.blank) {
    return <div className={`paper blank ${endpaper ? 'endpaper' : ''} face-${face}`} aria-hidden="true" />;
  }
  return (
    <div className={`paper face-${face} ${page.chapter ? `ch-${page.chapter}` : ''}`} data-page={index}>
      <SideView
        index={index}
        side={page.side}
        chapterId={page.chapter}
        highlight={highlight}
        face={face}
        pageNumber={page.pageNo}
      />
    </div>
  );
}
