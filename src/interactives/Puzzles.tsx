import { useMemo, useState } from 'react';
import { MATCH_SETS, ORDER_SETS } from '../content/puzzles';
import { useAppState, setProgress, getState } from '../lib/store';
import { award } from '../lib/achievements';
import { chime } from '../lib/sfx';

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function markSolved(id: string) {
  const s = getState();
  if (!s.progress.puzzles[id]) setProgress((p) => ({ puzzles: { ...p.puzzles, [id]: true } }));
  award('puzzle-first');
}

export function MatchPuzzle({ note }: { note?: string }) {
  const set = MATCH_SETS[note ?? ''];
  const sound = useAppState((s) => s.settings.sound);
  const volume = useAppState((s) => s.settings.soundVolume);
  const options = useMemo(() => (set ? seededShuffle(set.pairs.map((p) => p.right), set.id.length * 7 + 3) : []), [set]);
  const [choice, setChoice] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  if (!set) return <p>This activity is not available.</p>;
  const correct = set.pairs.map((p, i) => choice[i] === p.right).filter(Boolean).length;
  const all = Object.keys(choice).length === set.pairs.length;

  return (
    <div className="puzzle match">
      <p className="puzzle-prompt">{set.prompt}</p>
      <ul className="match-list">
        {set.pairs.map((p, i) => (
          <li key={p.left}>
            <label htmlFor={`m-${set.id}-${i}`}>{p.left}</label>
            <select id={`m-${set.id}-${i}`} value={choice[i] ?? ''} onChange={(e) => { setChecked(false); setChoice({ ...choice, [i]: e.target.value }); }}>
              <option value="">Choose…</option>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            {checked && choice[i] !== undefined && (
              <span className={choice[i] === p.right ? 'ok' : 'nope'} role="status">{choice[i] === p.right ? ' Correct' : ` Not quite: ${p.right}`}</span>
            )}
          </li>
        ))}
      </ul>
      <div className="puzzle-actions">
        <button type="button" className="btn small" disabled={!all} onClick={() => {
          setChecked(true);
          if (correct === set.pairs.length) { markSolved(set.id); if (sound) chime(volume, true); }
        }}>Check my answers</button>
        {checked && <span role="status">{correct} of {set.pairs.length} correct.</span>}
      </div>
      {checked && correct === set.pairs.length && <p className="ok">{set.explain}</p>}
    </div>
  );
}

export function OrderPuzzle({ note }: { note?: string }) {
  const set = ORDER_SETS[note ?? ''];
  const sound = useAppState((s) => s.settings.sound);
  const volume = useAppState((s) => s.settings.soundVolume);
  const start = useMemo(() => (set ? seededShuffle(set.items, 11) : []), [set]);
  const [order, setOrder] = useState<string[]>(start);
  const [result, setResult] = useState<'none' | 'right' | 'wrong'>('none');
  if (!set) return <p>This activity is not available.</p>;

  function move(i: number, d: -1 | 1) {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const next = order.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setResult('none');
  }

  return (
    <div className="puzzle order">
      <p className="puzzle-prompt">{set.prompt}</p>
      <ol className="order-list">
        {order.map((item, i) => (
          <li key={item}>
            <span className="order-text">{item}</span>
            <span className="order-btns">
              <button type="button" className="ghost tiny" aria-label={`Move “${item}” up`} onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
              <button type="button" className="ghost tiny" aria-label={`Move “${item}” down`} onClick={() => move(i, 1)} disabled={i === order.length - 1}>▼</button>
            </span>
          </li>
        ))}
      </ol>
      <div className="puzzle-actions">
        <button type="button" className="btn small" onClick={() => {
          const right = order.every((x, i) => x === set.items[i]);
          setResult(right ? 'right' : 'wrong');
          if (right) { markSolved(set.id); if (sound) chime(volume, true); }
        }}>Check the order</button>
        <button type="button" className="ghost small" onClick={() => { setOrder(seededShuffle(set.items, Date.now() % 1000)); setResult('none'); }}>Shuffle</button>
      </div>
      {result === 'right' && <p className="ok" role="status">Correct. {set.explain}</p>}
      {result === 'wrong' && <p className="nope" role="status">Not yet. Move the cards and check again.</p>}
    </div>
  );
}
