import { useSyncExternalStore } from 'react';

// Small external store persisted to localStorage. No accounts, no network.
export type MotionSetting = 'system' | 'reduced' | 'full';

export interface Settings {
  motion: MotionSetting;
  sound: boolean;          // restrained page-turn and quiz sounds
  soundVolume: number;     // 0-1
  parentNotes: boolean;    // show "Parent notes" blocks
  voiceURI: string;        // '' = browser default
  rate: number;            // narration speed
  simple: boolean;         // plain scrolling reading mode
  scale: 'normal' | 'large';
  lamp: 'warm' | 'cool' | 'dim';   // the temperature of the light on the page
}

export interface Progress {
  page: number;                          // index of the current right-hand page (or single page)
  bookmarks: { page: number; label: string }[];
  quiz: Record<string, Record<number, number>>;   // chapterId -> questionIndex -> chosen option
  completed: string[];                   // chapter ids
  seen: number[];                        // page indexes that have been reached
  name: string;                          // name on the certificate
  badges: string[];                      // achievement ids
  glossary: string[];                    // defined terms
  puzzles: Record<string, boolean>;      // puzzle id -> solved
  democracy: Record<string, string>;     // democracy builder placements
  questions: Record<string, string>;     // the reader's own "What would you ask?" notes, keyed by page
  relics: string[];                      // object ids found and kept
  visited: string[];                     // chapter ids opened on the expedition map
  streak: number;                        // consecutive correct quiz answers
  bestStreak: number;
}

export interface AppState {
  settings: Settings;
  progress: Progress;
}

const KEY = 'luchelle-time-machine-v1';

export const DEFAULT_SETTINGS: Settings = {
  motion: 'system',
  sound: false,
  soundVolume: 0.35,
  parentNotes: false,
  voiceURI: '',
  rate: 1,
  simple: false,
  scale: 'normal',
  lamp: 'warm',
};

export const DEFAULT_PROGRESS: Progress = {
  page: 0,
  bookmarks: [],
  quiz: {},
  completed: [],
  seen: [],
  name: 'Luchelle',
  badges: [],
  glossary: [],
  puzzles: {},
  democracy: {},
  questions: {},
  relics: [],
  visited: [],
  streak: 0,
  bestStreak: 0,
};

function load(): AppState {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return {
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
        progress: { ...DEFAULT_PROGRESS, ...(parsed.progress ?? {}) },
      };
    }
  } catch {
    // Corrupt or unavailable storage: start fresh rather than crash.
  }
  return { settings: { ...DEFAULT_SETTINGS }, progress: { ...DEFAULT_PROGRESS } };
}

let state: AppState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked (private mode): the book still works for this visit.
  }
}

export function getState(): AppState {
  return state;
}

export function update(fn: (s: AppState) => AppState) {
  state = fn(state);
  persist();
  listeners.forEach((l) => l());
}

export function setSettings(patch: Partial<Settings>) {
  update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

export function setProgress(patch: Partial<Progress> | ((p: Progress) => Partial<Progress>)) {
  update((s) => ({
    ...s,
    progress: { ...s.progress, ...(typeof patch === 'function' ? patch(s.progress) : patch) },
  }));
}

export function resetAll() {
  state = { settings: { ...DEFAULT_SETTINGS }, progress: { ...DEFAULT_PROGRESS } };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

/** Resolves the motion preference, honouring the operating system by default. */
export function prefersReducedMotion(setting: MotionSetting): boolean {
  if (setting === 'reduced') return true;
  if (setting === 'full') return false;
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
