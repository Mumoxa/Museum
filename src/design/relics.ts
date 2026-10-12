import { PAGES, CHAPTER_START, CHAPTERS } from '../content';
import { ERA_BY_ID, type EraRelic } from './era';

/* ============================================================================
   WHERE THE FINDS LIVE
   ----------------------------------------------------------------------------
   Every chapter has one page that carries its illustrated plate: the opener
   if the era has an illustration, otherwise the first page of that chapter
   that prints a real photograph. That page is where the reader can find and
   keep the chapter's objects. Deterministic, so progress always points at a
   page that still exists.
   ========================================================================= */

function chapterRange(id: string): [number, number] {
  const start = CHAPTER_START[id] ?? 0;
  const idx = CHAPTERS.findIndex((c) => c.id === id);
  const end = idx >= 0 && idx + 1 < CHAPTERS.length ? CHAPTER_START[CHAPTERS[idx + 1].id] : PAGES.length;
  return [start, end === start ? PAGES.length : end];
}

/** The page index that carries this chapter's findable objects, or null. */
export function relicPageFor(id: string): number | null {
  const era = ERA_BY_ID[id];
  if (!era || era.relics.length === 0) return null;
  const [start, end] = chapterRange(id);
  if (era.plate) {
    /* The opener always exists and always prints the plate. */
    for (let i = start; i < end; i++) if (PAGES[i].side.kind === 'opener') return i;
  }
  for (let i = start; i < end; i++) {
    if (!PAGES[i].blank && PAGES[i].side.blocks.some((b) => b.t === 'fig')) return i;
  }
  return null;
}

export function relicsFor(id: string): EraRelic[] {
  return ERA_BY_ID[id]?.relics ?? [];
}

/** The illustration for a chapter opener, if the era has one. */
export function eraPlateSrc(id: string): string | null {
  const era = ERA_BY_ID[id];
  if (!era?.plate) return null;
  return `${import.meta.env.BASE_URL}images/art/eras/${era.plate}`;
}
