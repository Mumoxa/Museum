import { CHAPTER_START } from '../content';
import { emit } from '../lib/bus';

const STEPS = [
  { year: 'Over 100,000 years ago', text: 'Painted ochre and shell beads at Blombos Cave.', ch: 'ch1' },
  { year: 'About 900–1300', text: 'The hill of the jackal and the golden rhinoceros at Mapungubwe.', ch: 'ch2' },
  { year: '1652', text: 'Van Riebeeck lands at Table Bay, and the first settlement begins.', ch: 'ch4' },
  { year: '1795–1814', text: 'The Cape changes hands between the Dutch, the French-backed Batavian Republic and the British.', ch: 'ch7' },
  { year: '1879–1902', text: 'Isandlwana, the South African War, and the camps.', ch: 'ch8' },
  { year: '1910', text: 'Four colonies become one Union, for white voters only.', ch: 'ch9' },
  { year: '1976–1990', text: 'Soweto, Robben Island, and the release of Nelson Mandela.', ch: 'ch10' },
  { year: '1994–2026', text: 'The first democratic election, the Constitution, and the open questions of today.', ch: 'ch11' },
];

export function Journey() {
  return (
    <ol className="journey">
      {STEPS.map((s, i) => (
        <li key={s.year}>
          <button type="button" className="journey-step" onClick={() => emit('goto', CHAPTER_START[s.ch])}>
            <span className="jy-num" aria-hidden="true">{i + 1}</span>
            <span className="jy-year">{s.year}</span>
            <span className="jy-text">{s.text}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
