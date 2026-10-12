import { useState } from 'react';
import { emit } from '../lib/bus';
import { CHAPTER_START } from '../content';
import { award } from '../lib/achievements';

const DIRS = [
  { label: 'Deep past', chapter: 'ch1', angle: 0, text: 'Stone tools, painted caves and the first people of this land.' },
  { label: 'Mapungubwe', chapter: 'ch2', angle: 45, text: 'A kingdom of gold and a hill of the jackal.' },
  { label: 'Ships', chapter: 'ch3', angle: 90, text: 'Spices, sea roads and a race around Africa.' },
  { label: 'The Cape', chapter: 'ch4', angle: 135, text: 'Three ships in Table Bay in 1652.' },
  { label: 'The Union', chapter: 'ch9', angle: 180, text: 'A new country, with unfair rules.' },
  { label: 'Freedom', chapter: 'ch10', angle: 225, text: 'Protests, prison and the long road to freedom.' },
  { label: 'Democracy', chapter: 'ch11', angle: 270, text: 'The 1994 election and a Constitution for everyone.' },
  { label: 'Today', chapter: 'ch12', angle: 315, text: 'What we know, and what is still open.' },
];

export function Compass() {
  const [i, setI] = useState(0);
  const d = DIRS[i];
  return (
    <div className="compass">
      <svg viewBox="-110 -110 220 220" role="img" aria-label={`Time-compass pointing to ${d.label}`} className="compass-svg">
        <circle r={100} className="compass-ring" />
        {DIRS.map((x, k) => {
          const rad = ((x.angle - 90) * Math.PI) / 180;
          return (
            <text key={k} x={Math.cos(rad) * 82} y={Math.sin(rad) * 82 + 4} textAnchor="middle" className={k === i ? 'compass-label on' : 'compass-label'}>
              {x.label.split(' ')[0]}
            </text>
          );
        })}
        <g transform={`rotate(${d.angle})`} className="needle" style={{ transition: 'transform 0.6s ease' }}>
          <path d="M0,-70 L12,0 L0,70 L-12,0 Z" className="needle-n" />
          <circle r={6} className="needle-hub" />
        </g>
      </svg>
      <div className="compass-controls" role="group" aria-label="Choose an era">
        {DIRS.map((x, k) => (
          <button key={x.label} type="button" className="chip" aria-pressed={k === i} onClick={() => setI(k)}>{x.label}</button>
        ))}
      </div>
      <p className="compass-text" aria-live="polite"><strong>{d.label}:</strong> {d.text}</p>
      <button
        type="button"
        className="btn"
        onClick={() => { award('explorer'); emit('goto', CHAPTER_START[d.chapter]); }}
      >
        Go to this chapter
      </button>
    </div>
  );
}
