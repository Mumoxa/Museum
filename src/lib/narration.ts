// Narration with the browser's Web Speech API (speechSynthesis).
// One utterance per sentence, so highlighting is accurate and a failure
// affects one sentence rather than the whole page. Nothing starts on its own.

export interface NarrationUnit {
  key: string;   // unique id for highlighting, e.g. "12:3:2"
  text: string;
}

type Listener = () => void;

export class Narrator {
  readonly supported: boolean;
  status: 'idle' | 'playing' | 'paused' = 'idle';
  currentKey: string | null = null;
  error: string | null = null;
  units: NarrationUnit[] = [];
  index = 0;
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  private token = 0;
  private listeners = new Set<Listener>();

  constructor() {
    this.supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  voices(): SpeechSynthesisVoice[] {
    if (!this.supported) return [];
    const all = window.speechSynthesis.getVoices();
    const english = all.filter((v) => v.lang.toLowerCase().startsWith('en'));
    return (english.length ? english : all).slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  setVoiceByURI(uri: string) {
    this.voice = this.voices().find((v) => v.voiceURI === uri) ?? null;
  }

  setRate(rate: number) {
    this.rate = rate;
    // If speaking, restart the current sentence so the new speed applies at once.
    if (this.status === 'playing') this.restartCurrent();
    this.emit();
  }

  /** Start reading the given units from the first one. Must be called from a click. */
  start(units: NarrationUnit[], fromKey?: string) {
    if (!this.supported) return;
    const from = fromKey ? Math.max(0, units.findIndex((u) => u.key === fromKey)) : 0;
    this.stopInternal();
    this.units = units;
    this.index = from;
    this.error = null;
    if (units.length === 0) {
      this.status = 'idle';
      this.emit();
      return;
    }
    this.status = 'playing';
    this.speakCurrent();
  }

  replay(units: NarrationUnit[]) {
    this.start(units, undefined);
  }

  pause() {
    if (!this.supported || this.status !== 'playing') return;
    window.speechSynthesis.pause();
    this.status = 'paused';
    this.emit();
  }

  resume() {
    if (!this.supported || this.status !== 'paused') return;
    window.speechSynthesis.resume();
    this.status = 'playing';
    this.emit();
  }

  stop() {
    this.stopInternal();
    this.emit();
  }

  private stopInternal() {
    this.token++;
    if (this.supported) window.speechSynthesis.cancel();
    this.status = 'idle';
    this.currentKey = null;
  }

  private restartCurrent() {
    this.token++;
    window.speechSynthesis.cancel();
    this.speakCurrent();
  }

  private speakCurrent() {
    const unit = this.units[this.index];
    if (!unit) {
      this.stopInternal();
      this.emit();
      return;
    }
    const token = ++this.token;
    const u = new SpeechSynthesisUtterance(unit.text);
    u.rate = this.rate;
    u.pitch = 1;
    u.lang = this.voice?.lang || 'en-GB';
    if (this.voice) u.voice = this.voice;
    u.onstart = () => {
      if (token !== this.token) return;
      this.currentKey = unit.key;
      this.emit();
    };
    u.onend = () => {
      if (token !== this.token) return;
      this.index += 1;
      this.speakCurrent();
    };
    u.onerror = (e) => {
      if (token !== this.token) return;
      // "interrupted" and "canceled" come from our own stop/restart, not from a fault.
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      this.error = 'The browser could not read this sentence aloud. You can keep reading the page.';
      this.stopInternal();
      this.emit();
    };
    window.speechSynthesis.speak(u);
    this.emit();
  }

  /** Units remaining on the page, from the current position (for the progress label). */
  progress(): { done: number; total: number } {
    return { done: Math.min(this.index, this.units.length), total: this.units.length };
  }
}

export const narrator = new Narrator();
