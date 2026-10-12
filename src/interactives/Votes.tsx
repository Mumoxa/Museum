import { useState } from 'react';
import { award } from '../lib/achievements';

const STOPS = [
  { year: '1910', who: 'White men in national elections. In the Cape, a small number of men of other races who met property and education rules could also vote.', note: 'The Union is formed on 31 May 1910.' },
  { year: '1930', who: 'White women are added. Most women of other races still cannot vote in national elections.', note: 'The franchise is widened for white women only.' },
  { year: '1961', who: 'Still only white voters. The republic is declared after a referendum open only to white voters.', note: 'South Africa leaves the Commonwealth and becomes a republic.' },
  { year: '1994', who: 'Every adult citizen aged 18 or over, of every race, can vote.', note: 'The election is held from 26 to 29 April 1994, with 27 April as the main day.' },
];

export function Votes() {
  const [i, setI] = useState(0);
  const s = STOPS[i];
  return (
    <div className="votes">
      <div className="votes-slider">
        <label htmlFor="votes-range">Choose a year: <strong>{s.year}</strong></label>
        <input id="votes-range" type="range" min={0} max={STOPS.length - 1} step={1} value={i} onChange={(e) => { setI(Number(e.target.value)); award('explorer'); }} aria-valuetext={s.year} />
        <div className="votes-ticks" aria-hidden="true">
          {STOPS.map((x) => <span key={x.year}>{x.year}</span>)}
        </div>
      </div>
      <div className="map-card" aria-live="polite">
        <h4>Who could vote in national elections?</h4>
        <p>{s.who}</p>
        <p className="muted">{s.note}</p>
      </div>
      <p className="caption-small">The franchise rules were complex in some years. This summary is simplified to show the main changes.</p>
    </div>
  );
}
