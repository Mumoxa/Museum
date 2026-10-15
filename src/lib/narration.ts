// Expressive, device-local storytelling using the Web Speech API.
// Native speech quality varies by browser and installed voices. No data leaves
// this device, and nothing is spoken without a reader pressing Play.

export interface NarrationUnit {
  key: string;
  text: string;
}
type Listener = () => void;
export type StoryMood = 'gentle' | 'adventure' | 'calm';

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  const lang = v.lang.toLowerCase();
  let score = 0;
  if (lang.startsWith('en')) score += 100;
  if (/en-za|en-gb|en-au|en-nz/.test(lang)) score += 16;
  if (/natural|neural|premium|enhanced|high quality/.test(name)) score += 75;
  if (/microsoft/.test(name)) score += 22;
  if (/google/.test(name)) score += 16;
  if (/samantha|serena|sonia|libby|aria|jenny|olivia|karen|moira|ava/.test(name)) score += 14;
  if (/compact|espeak|robot|festival/.test(name)) score -= 65;
  if (!v.localService) score += 6;
  if (v.default) score += 5;
  return score;
}

function pauseAfter(text: string, mood: StoryMood): number {
  const t = text.trim();
  let ms = /[?!]["'”’)]?$/.test(t) ? 410 : /[.!]["'”’)]?$/.test(t) ? 285 : 200;
  if (/\b(suddenly|but then|imagine|did you know|what if|one day)\b/i.test(t)) ms += 135;
  if (t.length < 55) ms += 100;
  if (mood === 'calm') ms += 120;
  if (mood === 'adventure') ms = Math.max(175, ms - 55);
  return ms;
}

export class Narrator {
  readonly supported: boolean;
  status: 'idle' | 'playing' | 'paused' = 'idle';
  currentKey: string | null = null;
  error: string | null = null;
  units: NarrationUnit[] = [];
  index = 0;
  rate = .9;
  voice: SpeechSynthesisVoice | null = null;
  mood: StoryMood = 'adventure';
  private explicitURI = '';
  private token = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private waiting = false;
  private listeners = new Set<Listener>();

  constructor() {
    this.supported = typeof window !== 'undefined' &&
      'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    if (this.supported) {
      // On many phones and on Chrome, voice names load AFTER the page mounts.
      window.speechSynthesis.addEventListener?.('voiceschanged', () => {
        this.pickVoice();
        this.emit();
      });
      this.pickVoice();
    }
  }
  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
  private emit() { this.listeners.forEach((l) => l()); }

  voices(): SpeechSynthesisVoice[] {
    if (!this.supported) return [];
    const all = window.speechSynthesis.getVoices();
    const english = all.filter((v) => v.lang.toLowerCase().startsWith('en'));
    return (english.length ? english : all).slice().sort((a, b) =>
      scoreVoice(b) - scoreVoice(a) || a.name.localeCompare(b.name));
  }
  private pickVoice() {
    const options = this.voices();
    this.voice = options.find((v) => v.voiceURI === this.explicitURI) || options[0] || null;
  }
  setVoiceByURI(uri: string) {
    this.explicitURI = uri;
    this.pickVoice();
    if (this.status === 'playing') this.restartCurrent();
    this.emit();
  }
  setMood(mood: StoryMood) {
    this.mood = mood;
    if (this.status === 'playing') this.restartCurrent();
    this.emit();
  }
  setRate(rate: number) {
    this.rate = Math.min(1.3, Math.max(.7, rate));
    if (this.status === 'playing') this.restartCurrent();
    this.emit();
  }
  start(units: NarrationUnit[], fromKey?: string) {
    if (!this.supported) return;
    const from = fromKey ? Math.max(0, units.findIndex((u) => u.key === fromKey)) : 0;
    this.stopInternal();
    this.units = units;
    this.index = from;
    this.error = null;
    if (units.length === 0) { this.emit(); return; }
    this.pickVoice();
    this.status = 'playing';
    this.speakCurrent();
  }
  replay(units: NarrationUnit[]) { this.start(units); }
  pause() {
    if (!this.supported || this.status !== 'playing') return;
    this.status = 'paused';
    if (this.waiting) {
      this.clearTimer();
    } else window.speechSynthesis.pause();
    this.emit();
  }
  resume() {
    if (!this.supported || this.status !== 'paused') return;
    this.status = 'playing';
    if (this.waiting) {
      this.waiting = false;
      this.speakCurrent();
    } else window.speechSynthesis.resume();
    this.emit();
  }
  stop() { this.stopInternal(); this.emit(); }
  private clearTimer() {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }
  private stopInternal() {
    ++this.token;
    this.clearTimer();
    this.waiting = false;
    if (this.supported) window.speechSynthesis.cancel();
    this.status = 'idle';
    this.currentKey = null;
  }
  private restartCurrent() {
    ++this.token;
    this.clearTimer();
    this.waiting = false;
    window.speechSynthesis.cancel();
    this.speakCurrent();
  }
  private speakCurrent() {
    if (this.status !== 'playing') return;
    const unit = this.units[this.index];
    if (!unit) { this.stopInternal(); this.emit(); return; }
    this.waiting = false;
    const token = ++this.token;
    const utterance = new SpeechSynthesisUtterance(unit.text);
    const expressive = this.mood === 'adventure';
    utterance.rate = this.rate * (this.mood === 'calm' ? .92 : 1);
    // A touch of brightness for an inviting narrator without cartoonish distortion.
    utterance.pitch = expressive
      ? (/\?$/.test(unit.text.trim()) ? 1.12 : /!$/.test(unit.text.trim()) ? 1.15 : 1.045)
      : this.mood === 'gentle' ? 1.015 : 1;
    utterance.volume = 1;
    utterance.lang = this.voice?.lang || 'en-GB';
    if (this.voice) utterance.voice = this.voice;
    utterance.onstart = () => {
      if (token !== this.token) return;
      this.currentKey = unit.key;
      this.emit();
    };
    utterance.onend = () => {
      if (token !== this.token) return;
      this.index++;
      this.currentKey = null;
      if (this.index >= this.units.length) {
        this.stopInternal(); this.emit(); return;
      }
      this.waiting = true;
      const pause = pauseAfter(unit.text, this.mood);
      this.timer = setTimeout(() => {
        if (token !== this.token || this.status !== 'playing') return;
        this.timer = null;
        this.speakCurrent();
      }, pause);
      this.emit();
    };
    utterance.onerror = (event) => {
      if (token !== this.token) return;
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      this.error = 'This voice could not play. Try another voice from the selector or continue reading.';
      this.stopInternal();
      this.emit();
    };
    window.speechSynthesis.speak(utterance);
    this.emit();
  }
  progress() { return { done: Math.min(this.index, this.units.length), total: this.units.length }; }
}
export const narrator = new Narrator();
