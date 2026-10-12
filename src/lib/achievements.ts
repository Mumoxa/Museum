import { getState, setProgress } from './store';
import { emit } from './bus';
import { CHAPTERS } from '../content';

export interface Badge {
  id: string;
  label: string;
  hint: string;
}

export const BADGES: Badge[] = [
  { id: 'opened', label: 'Book Opener', hint: 'Open My History Book for the first time.' },
  { id: 'first-turn', label: 'First Turn', hint: 'Turn your first page.' },
  { id: 'narrator', label: 'Story Listener', hint: 'Have a page read aloud.' },
  { id: 'glossary-5', label: 'Word Collector', hint: 'Tap and define five words.' },
  { id: 'bookmark', label: 'Bookmarker', hint: 'Save a bookmark.' },
  { id: 'quiz-first', label: 'First Answer', hint: 'Answer your first quiz question.' },
  { id: 'perfect-quiz', label: 'Sharp Mind', hint: 'Get every quiz question right in one chapter.' },
  { id: 'puzzle-first', label: 'Puzzler', hint: 'Solve a puzzle.' },
  { id: 'explorer', label: 'Map Explorer', hint: 'Use a map or the timeline.' },
  { id: 'democracy', label: 'Architect of Democracy', hint: 'Balance the democracy builder.' },
  { id: 'all-chapters', label: 'Time Traveller', hint: 'Finish every chapter quiz.' },
  ...CHAPTERS.map((c) => ({
    id: `done-${c.id}`,
    label: c.num === 'Prologue' ? 'Prologue Reader' : c.num === 'Epilogue' ? 'Epilogue Reader' : `Chapter ${c.num} Explorer`,
    hint: `Finish the quiz for "${c.title}".`,
  })),
];

export function award(id: string) {
  const s = getState();
  if (s.progress.badges.includes(id)) return;
  setProgress({ badges: [...s.progress.badges, id] });
  const b = BADGES.find((x) => x.id === id);
  if (b) emit('toast', `Badge earned: ${b.label}`);
}
