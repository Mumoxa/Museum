// Content model for the storybook. Every historical claim lives in a Side's blocks
// and can be traced to a source id in sources.ts.

export type Block =
  | { t: 'lead'; text: string }
  | { t: 'p'; text: string }
  | { t: 'h'; text: string }
  | { t: 'fig'; src: string; alt: string; caption: string; credit: string; license: string; url: string; artistic?: boolean; wide?: boolean }
  | { t: 'fact'; text: string; source?: string }
  | { t: 'ask'; text: string }
  | { t: 'mum'; text: string }
  | { t: 'parent'; text: string }
  | { t: 'anchor'; when: string; where: string }
  | { t: 'mystery'; text: string }
  | { t: 'quiz' }
  | { t: 'interactive'; name: string; title?: string; note?: string }
  | { t: 'tellmore'; items: { q: string; a: string }[] }
  | { t: 'note'; text: string }
  | { t: 'toc' };

export interface Side {
  title?: string;
  kind: 'opener' | 'page' | 'interactive' | 'quiz' | 'handoff' | 'cover' | 'end';
  blocks: Block[];
  sources?: string[];
}

export interface QuizQ {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Chapter {
  id: string;
  num: string;        // "Prologue", "1", ... "Epilogue"
  title: string;
  subtitle: string;
  accent: string;     // chapter ink accent (muted)
  mood: string;       // short editorial tagline for the cover card
  quiz: QuizQ[];
  sources: string[];
  sides: Side[];
}
