import { useState } from 'react';
import { useAppState, setProgress } from '../lib/store';
import { award } from '../lib/achievements';

type Box = 'legislature' | 'executive' | 'judiciary';
const BOXES: { id: Box; label: string; sub: string }[] = [
  { id: 'legislature', label: 'Parliament', sub: 'Makes laws and checks the executive' },
  { id: 'executive', label: 'The President and Cabinet', sub: 'Carries out and administers laws' },
  { id: 'judiciary', label: 'The courts', sub: 'Interprets the law and checks it against the Constitution' },
];
const CHIPS: { id: string; text: string; box: Box }[] = [
  { id: 'laws', text: 'Makes new laws', box: 'legislature' },
  { id: 'carry', text: 'Carries out and runs the laws', box: 'executive' },
  { id: 'const', text: 'Decides whether a law fits the Constitution', box: 'judiciary' },
  { id: 'elect', text: 'Elects the President', box: 'legislature' },
  { id: 'impeach', text: 'Can start an impeachment process against the President', box: 'legislature' },
];

export function Democracy() {
  const placed = useAppState((s) => s.progress.democracy);
  const [pick, setPick] = useState<string | null>(null);
  const done = Object.keys(placed).length;
  const correct = CHIPS.every((c) => placed[c.id] === c.box);

  function place(box: Box) {
    if (!pick) return;
    setProgress((p) => ({ democracy: { ...p.democracy, [pick]: box } }));
    setPick(null);
    const next = { ...placed, [pick]: box };
    const ok = CHIPS.every((c) => next[c.id] === c.box) && Object.keys(next).length === CHIPS.length;
    if (ok) award('democracy');
  }

  return (
    <div className="democracy">
      <p className="muted">Choose a power, then choose the box where it belongs. Works with a mouse, a touch screen or a keyboard.</p>
      <div className="dem-chips" role="group" aria-label="Powers to place">
        {CHIPS.filter((c) => !(c.id in placed)).map((c) => (
          <button key={c.id} type="button" className={`chip power ${pick === c.id ? 'on' : ''}`} aria-pressed={pick === c.id} onClick={() => setPick(pick === c.id ? null : c.id)}>
            {c.text}
          </button>
        ))}
        {done === CHIPS.length && <p className="ok">All powers are placed.</p>}
      </div>
      <div className="dem-boxes">
        {BOXES.map((b) => (
          <section key={b.id} className={`dem-box ${pick ? 'ready' : ''}`} aria-label={b.label}>
            <h4>{b.label}</h4>
            <p className="muted">{b.sub}</p>
            <button type="button" className="ghost small" disabled={!pick} onClick={() => place(b.id)}>
              {pick ? `Put “${CHIPS.find((c) => c.id === pick)!.text}” here` : 'Choose a power first'}
            </button>
            <ul>
              {CHIPS.filter((c) => placed[c.id] === b.id).map((c) => (
                <li key={c.id} className={c.box === b.id ? 'good' : 'bad'}>
                  {c.text} {c.box === b.id ? '✓' : '✗'}
                  <button type="button" className="ghost tiny" onClick={() => setProgress((p) => { const d = { ...p.democracy }; delete d[c.id]; return { democracy: d }; })}>Move back</button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {correct && <p className="ok" role="status"><strong>Balanced.</strong> Each power has a job, and each one can check the others.</p>}
      {!correct && done === CHIPS.length && <p className="nope" role="status">Some powers are in the wrong box. Use “Move back” and try again.</p>}
      <p className="caption-small">Simplified for a child. The Constitution sets out the details, such as the National Council of Provinces and the role of the Chief Justice.</p>
    </div>
  );
}
