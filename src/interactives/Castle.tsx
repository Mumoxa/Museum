import { useState } from 'react';
import { award } from '../lib/achievements';

const BASTIONS = [
  { name: 'Leerdam', title: 'Lord of Leerdam', text: 'Named in 1679 after one of William III’s titles. Each bastion had its own garrison, ammunition store and workshops, so the fort could keep defending from every corner.' },
  { name: 'Buuren', title: 'Lord of Buuren', text: 'Named in 1679 after another title of William III. Defenders on this bastion could fire along the walls to cover the ground in front of their neighbours.' },
  { name: 'Katzenellenbogen', title: 'Count of Katzenellenbogen', text: 'Named in 1679 after a title of William III.' },
  { name: 'Nassau', title: 'Count of Nassau', text: 'Named in 1679 after the House of Nassau, the family of William III.' },
  { name: 'Oranje', title: 'Prince of Orange', text: 'Named in 1679 after the Prince of Orange, William III himself. All five names honour William III, who was also Stadtholder of the Dutch Republic.' },
];

// Positions on a pentagon, Leerdam on the left and the rest clockwise.
function pos(k: number) {
  const a = ((180 + k * 72) * Math.PI) / 180;
  return { x: 150 + 105 * Math.cos(a), y: 150 + 105 * Math.sin(a) };
}

export function Castle() {
  const [sel, setSel] = useState<number | null>(null);
  const pts = BASTIONS.map((_, k) => pos(k));
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
  const cur = sel !== null ? BASTIONS[sel] : null;
  return (
    <div className="castle">
      <svg viewBox="0 0 300 300" role="group" aria-label="Plan of the Castle of Good Hope with five bastions" className="castle-svg">
        <path d={d} className="wall" />
        <circle cx={150} cy={150} r={40} className="courtyard" />
        <text x={150} y={154} textAnchor="middle" className="courtyard-label">Courtyard</text>
        <rect x={72} y={92} width={16} height={12} className="gate" transform="rotate(-36 80 98)" />
        <text x={38} y={84} className="gate-label">Gate (1682)</text>
        {pts.map((p, k) => (
          <g key={k} className="bastion-group">
            <circle cx={p.x} cy={p.y} r={sel === k ? 17 : 14} className={sel === k ? 'bastion on' : 'bastion'} />
            <text x={p.x} y={p.y + 4} textAnchor="middle" className="bastion-num">{k + 1}</text>
            <foreignObject x={p.x - 18} y={p.y - 18} width={36} height={36}>
              <button
                type="button"
                className="bastion-btn"
                aria-pressed={sel === k}
                aria-label={`Bastion ${k + 1}: ${BASTIONS[k].name}`}
                onClick={() => { setSel(k); award('explorer'); }}
              />
            </foreignObject>
          </g>
        ))}
      </svg>
      <div className="castle-card" aria-live="polite">
        {cur ? (
          <>
            <h4>{sel! + 1}. {cur.name} <span className="muted">({cur.title})</span></h4>
            <p>{cur.text}</p>
          </>
        ) : (
          <p>Tap a numbered bastion to see its name and what it was for. The diagram is simplified, so it shows the plan’s logic rather than an exact survey.</p>
        )}
      </div>
      <ul className="castle-list">
        {BASTIONS.map((b, k) => (
          <li key={b.name}><button type="button" className="chip" aria-pressed={sel === k} onClick={() => setSel(k)}>{k + 1}. {b.name}</button></li>
        ))}
      </ul>
    </div>
  );
}
