import { useEffect, useRef, useSyncExternalStore } from 'react';
import { narrator, type NarrationUnit } from '../lib/narration';
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
        <strong>Read aloud</strong>
        <span className="muted"> {label}</span>
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
      <label className="select-label">
        Speed
        <select value={rate} onChange={(e) => { const r = Number(e.target.value); setSettings({ rate: r }); narrator.setRate(r); }}>
          {[0.75, 0.9, 1, 1.15, 1.3].map((r) => <option key={r} value={r}>{r}×</option>)}
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
