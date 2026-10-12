// Restrained sound effects, generated with the Web Audio API so no audio files are needed.
// Sounds only play after a user action and only when the sound setting is on.

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** A soft paper-like swish for a page turn. */
export function pageTurn(volume: number) {
  const c = context();
  if (!c) return;
  const duration = 0.32;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * duration), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * (1 - t * 0.5);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(900, c.currentTime);
  filter.frequency.linearRampToValueAtTime(2200, c.currentTime + duration);
  filter.Q.value = 0.8;
  const gain = c.createGain();
  gain.gain.value = Math.max(0, Math.min(1, volume)) * 0.5;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

/** Two soft notes, for a correct quiz answer or a badge. */
export function chime(volume: number, rising = true) {
  const c = context();
  if (!c) return;
  const notes = rising ? [523.25, 659.25] : [392, 330];
  notes.forEach((f, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    const t0 = c.currentTime + i * 0.13;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.25), t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + 0.65);
  });
}
