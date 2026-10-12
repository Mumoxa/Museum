import type { Block, Chapter, Side } from './types';
import { part1 } from './part1';
import { part2 } from './part2';
import { part3 } from './part3';
import { part4 } from './part4';

export const CHAPTERS: Chapter[] = [...part1, ...part2, ...part3, ...part4];

export interface Page {
  side: Side;
  chapter: string;          // chapter id ('' for the front matter)
  pageNo: number;           // printed page number (0 for blank)
  blank?: boolean;
}

const contentsSide: Side = { kind: 'page', title: 'Contents', blocks: [{ t: 'toc' }] };

// Build the flat list of pages. Every chapter opens on a right-hand page,
// so a blank page is inserted when needed. Index 0 is the contents page.
export const PAGES: Page[] = [];
export const CHAPTER_START: Record<string, number> = {};

PAGES.push({ side: contentsSide, chapter: '', pageNo: 1 });
for (const ch of CHAPTERS) {
  if (PAGES.length % 2 === 1) {
    PAGES.push({ side: { kind: 'page', blocks: [] }, chapter: ch.id, pageNo: 0, blank: true });
  }
  CHAPTER_START[ch.id] = PAGES.length;
  ch.sides.forEach((s, i) => {
    PAGES.push({ side: s, chapter: ch.id, pageNo: PAGES.length + 1 });
    void i;
  });
}
const endSide: Side = {
  kind: 'end',
  title: 'The Back Endpaper',
  blocks: [
    { t: 'lead', text: 'Thank you for reading, Luchelle. Keep the book open for your next question.' },
    { t: 'p', text: 'Your certificate, passport and bookmarks are saved on this device. You can also find every source and credit in the Sources panel.' },
  ],
};
if (PAGES.length % 2 === 1) PAGES.push({ side: { kind: 'page', blocks: [] }, chapter: 'epilogue', pageNo: 0, blank: true });
PAGES.push({ side: endSide, chapter: 'epilogue', pageNo: PAGES.length + 1 });
PAGES.push({ side: { kind: 'page', blocks: [] }, chapter: 'epilogue', pageNo: 0, blank: true });

export const CHAPTER_BY_ID: Record<string, Chapter> = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));

/** Plain text of a block, for narration and search. */
export function blockText(b: Block): string {
  switch (b.t) {
    case 'lead': case 'p': case 'h': case 'fact': case 'ask': case 'mum': case 'parent': case 'mystery': case 'note':
      return b.text;
    case 'fig': return b.caption;
    case 'anchor': return `${b.when}. ${b.where}.`;
    default: return '';
  }
}

/** Split raw text (glossary markup kept) into sentences. Used for rendering and highlighting. */
export function splitSentences(raw: string): string[] {
  const clean = raw.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const out: string[] = [];
  const re = /[^.!?]+[.!?]+["”’)]*\s*|[^.!?]+$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(clean))) {
    const s = m[0].trim();
    if (s) out.push(s);
  }
  return out;
}

/** Remove glossary markup so the text reads naturally aloud. */
export function plain(raw: string): string {
  return raw.replace(/\[\[([^\]]+)\]\]/g, '$1').replace(/\s+/g, ' ').trim();
}

export const PARENT_BLOCK_TYPES = ['parent'] as const;
