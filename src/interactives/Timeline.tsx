import { useState } from 'react';
import { CHAPTER_START, CHAPTERS } from '../content';
import { emit } from '../lib/bus';
import { award } from '../lib/achievements';

// Non-linear scale: deep time is logarithmic, the first thousand years are compressed,
// and the modern period (1000 CE to 2026) is linear. The bands are labelled on screen.
export function xOf(year: number): number {
  if (year <= -1000) {
    const a = Math.log10(-year), lo = 3, hi = Math.log10(300000);
    return 0.45 * ((hi - a) / (hi - lo));
  }
  if (year <= 1000) return 0.45 + 0.1 * ((year + 1000) / 2000);
  return 0.55 + 0.45 * ((year - 1000) / 1026);
}

export const EVENTS: { year: number; label: string; ch: string }[] = [
  { year: -100000, label: 'Ochre paint kit made at Blombos Cave', ch: 'ch1' },
  { year: -75000, label: 'Engraved ochre and shell beads at Blombos', ch: 'ch1' },
  { year: -73000, label: 'Cross-hatched drawing on a stone flake', ch: 'ch1' },
  { year: 900, label: 'Mapungubwe kingdom grows (from about this time)', ch: 'ch2' },
  { year: 1300, label: 'Mapungubwe abandoned (around 1300)', ch: 'ch2' },
  { year: 1488, label: 'Bartolomeu Dias rounds the Cape', ch: 'ch3' },
  { year: 1498, label: 'Vasco da Gama reaches Calicut in India', ch: 'ch3' },
  { year: 1652, label: 'Van Riebeeck lands at Table Bay', ch: 'ch4' },
  { year: 1666, label: 'Castle of Good Hope construction begins', ch: 'ch5' },
  { year: 1795, label: 'British first occupy the Cape', ch: 'ch7' },
  { year: 1834, label: 'Slavery ends in the Cape (apprenticeship until 1838)', ch: 'ch7' },
  { year: 1879, label: 'Isandlwana (22 January)', ch: 'ch8' },
  { year: 1899, label: 'South African War begins', ch: 'ch8' },
  { year: 1910, label: 'Union of South Africa (31 May)', ch: 'ch9' },
  { year: 1913, label: 'Natives Land Act (19 June)', ch: 'ch9' },
  { year: 1948, label: 'National Party wins; apartheid laws follow', ch: 'ch9' },
  { year: 1960, label: 'Sharpeville shootings (21 March)', ch: 'ch10' },
  { year: 1961, label: 'Republic declared', ch: 'ch9' },
  { year: 1976, label: 'Soweto uprising (16 June)', ch: 'ch10' },
  { year: 1990, label: 'Nelson Mandela released (11 February)', ch: 'ch10' },
  { year: 1994, label: 'First democratic election (27 April)', ch: 'ch11' },
  { year: 1996, label: 'Constitution adopted by Parliament (8 May)', ch: 'ch11' },
  { year: 2002, label: 'Constitutional Court TAC ruling (5 July)', ch: 'ch12' },
  { year: 2024, label: 'The ANC loses its majority in the national election', ch: 'ch12' },
  { year: 2026, label: 'October 2026: where this book ends', ch: 'epilogue' },
];

export function Timeline({ compact }: { compact?: boolean }) {
  const [sel, setSel] = useState<number>(EVENTS.length - 1);
  const ev = EVENTS[sel];
  const W = 1000;
  const x = (y: number) => 20 + xOf(y) * (W - 40);
  return (
    <div className={`timeline ${compact ? 'compact' : ''}`}>
      <svg viewBox={`0 0 ${W} ${compact ? 120 : 170}`} role="img" aria-label="Timeline from deep time to 2026. Tap a marker for details." className="tl-svg">
        <rect x={20} y={compact ? 60 : 84} width={W - 40} height={6} rx={3} className="tl-bar" />
        <rect x={x(-300000)} y={compact ? 48 : 72} width={x(-1000) - x(-300000)} height={30} className="band deep" />
        <rect x={x(-1000)} y={compact ? 48 : 72} width={x(1000) - x(-1000)} height={30} className="band mid" />
        <rect x={x(1000)} y={compact ? 48 : 72} width={x(2026) - x(1000)} height={30} className="band modern" />
        <text x={x(-300000) + 4} y={compact ? 44 : 66} className="band-label">Deep time (log scale)</text>
        <text x={x(-1000) + 4} y={compact ? 44 : 66} className="band-label">First millennia (compressed)</text>
        <text x={x(1000) + 4} y={compact ? 44 : 66} className="band-label">1000 to 2026 (linear)</text>
        {EVENTS.map((e, i) => {
          const cx = x(e.year);
          const cy = compact ? 63 : 87;
          const above = i % 2 === 0;
          return (
            <g key={i} className={i === sel ? 'tl-ev on' : 'tl-ev'}>
              <line x1={cx} x2={cx} y1={cy} y2={above ? cy - 14 : cy + 14} />
              <circle cx={cx} cy={cy} r={i === sel ? 8 : 5} />
              <foreignObject x={cx - 10} y={cy - 10} width={20} height={20}>
                <button type="button" className="tl-btn" aria-label={`${e.label} (${e.year < 0 ? Math.abs(e.year) + ' BCE' : e.year})`} aria-pressed={i === sel} onClick={() => { setSel(i); award('explorer'); }} />
              </foreignObject>
            </g>
          );
        })}
      </svg>
      <div className="tl-card" aria-live="polite">
        <p><strong>{ev.year < 0 ? `${Math.abs(ev.year).toLocaleString('en-ZA')} years ago` : ev.year === 2026 ? 'October 2026' : ev.year}</strong> · {ev.label}</p>
        <button type="button" className="ghost small" onClick={() => emit('goto', CHAPTER_START[ev.ch])}>
          Go to {CHAPTERS.find((c) => c.id === ev.ch)?.num === 'Epilogue' ? 'the Epilogue' : `Chapter ${CHAPTERS.find((c) => c.id === ev.ch)?.num ?? ''}`}
        </button>
      </div>
      <p className="caption-small">Years before 1000 CE are not drawn to one scale. Deep time is logarithmic; the first millennia are compressed.</p>
    </div>
  );
}
