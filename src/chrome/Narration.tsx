import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { narrator, type NarrationUnit, type StoryMood } from '../lib/narration';
import { useAppState, setSettings } from '../lib/store';
import { award } from '../lib/achievements';

// Narration state as a single string so React can compare snapshots cheaply.
function snapshot() {
  return `${narrator.status}|${narrator.currentKey ?? ''}|${narrator.error ?? ''}|${narrator.index}|${narrator.units.length}`;
}

export function useNarrator() {
  const snap = useSyncExternalStore((cb) => narrator.subscribe(cb), snapshot, snapshot);
  const [status, currentKey, error, index, total] = snap.split('|');
  return {
    status: status as 'idle' | 'playing' | 'paused',
    currentKey: currentKey || null,
    error: error || null,
    index: Number(index),
    total: Number(total),
  };
}

export function NarrationBar({ units, onClose, label }: { units: NarrationUnit[]; onClose: () => void; label: string }) {
  const n = useNarrator();
  const rate = useAppState((s) => s.settings.rate);
  const voiceURI = useAppState((s) => s.settings.voiceURI);
  const applied = useRef(false);
  const [voiceList, setVoiceList] = useState(() => narrator.voices());
  const [mood, setMood] = useState<StoryMood>('adventure');

  useEffect(() => {
    if (!narrator.supported) return;
    const refresh = () => setVoiceList(narrator.voices());
    window.speechSynthesis.addEventListener?.('voiceschanged', refresh);
    refresh();
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', refresh);
  }, []);

  useEffect(() => {
    if (!applied.current) {
      narrator.setRate(rate);
      narrator.setVoiceByURI(voiceURI);
      applied.current = true;
    }
  }, [rate, voiceURI]);

  // Stop narration when this bar closes.
  useEffect(() => () => narrator.stop(), []);

  const hasText = units.length > 0;
  const playing = n.status === 'playing';
  const paused = n.status === 'paused';

  if (!narrator.supported) {
    return (
      <section className="narration" aria-label="Read aloud">
        <p className="nope">This browser cannot read the page aloud. The words are all on the page for you to read. Try Chrome, Edge, Safari or Firefox if you would like narration.</p>
        <button type="button" className="ghost small" onClick={onClose}>Hide</button>
      </section>
    );
  }

  return (
    <section className="narration" aria-label="Read aloud controls">
      <div className="narr-title">
        <strong>Storytime narrator</strong>
        <span className="muted"> {label} · Expressive storytelling with breathing pauses</span>
      </div>
      <div className="narr-btns" role="group" aria-label="Narration controls">
        {!playing && !paused && (
          <button type="button" className="btn small" disabled={!hasText} onClick={() => { narrator.start(units); award('narrator'); }}>
            Play
          </button>
        )}
        {playing && <button type="button" className="btn small" onClick={() => narrator.pause()}>Pause</button>}
        {paused && <button type="button" className="btn small" onClick={() => narrator.resume()}>Resume</button>}
        <button type="button" className="ghost small" disabled={!hasText && n.status === 'idle'} onClick={() => { narrator.start(units); award('narrator'); }}>Replay</button>
        <button type="button" className="ghost small" disabled={n.status === 'idle'} onClick={() => narrator.stop()}>Stop</button>
      </div>
      <div className="narr-story-options">
        <label className="select-label">
          Storytelling style
          <select value={mood} onChange={(e) => { const value = e.target.value as StoryMood; setMood(value); narrator.setMood(value); }}>
            <option value="adventure">Exciting adventure</option>
            <option value="gentle">Warm bedtime story</option>
            <option value="calm">Calm discovery</option>
          </select>
        </label>
        <label className="select-label">
          Narrator voice
          <select value={voiceURI} onChange={(e) => { setSettings({ voiceURI: e.target.value }); narrator.setVoiceByURI(e.target.value); }}>
            <option value="">Best available voice (automatic)</option>
            {voiceList.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} ({voice.lang}){!voice.localService ? ' · Enhanced' : ''}
            </option>)}
          </select>
        </label>
      </div>
      <p className="narr-voice-note">Voice quality depends on the voices installed in this browser. For a richer sound, try an enhanced or natural-sounding English voice in the list. No recording is sent to our servers.</p>
      <label className="select-label">
        Speed
        <select value={rate} onChange={(e) => { const r = Number(e.target.value); setSettings({ rate: r }); narrator.setRate(r); }}>
          {[0.75, 0.85, 0.9, 1, 1.1, 1.2].map((r) => <option key={r} value={r}>{r}×</option>)}
        </select>
      </label>
      <p className="narr-status" role="status" aria-live="polite">
        {n.error
          ? n.error
          : playing
            ? `Reading sentence ${Math.min(n.index + 1, n.total)} of ${n.total}.`
            : paused
              ? 'Paused.'
              : hasText
                ? 'Ready. Narration only starts when you press Play.'
                : 'There is no text to read on this page.'}
      </p>
      <button type="button" className="ghost small" onClick={() => { narrator.stop(); onClose(); }}>Hide the reader</button>
    </section>
  );
}
