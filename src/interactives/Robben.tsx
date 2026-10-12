import { useState } from 'react';
import { award } from '../lib/achievements';

const PERIODS = [
  { id: 'exile', label: '1658 · Exile', text: 'The Dutch sent Autshumato, a Khoekhoe interpreter, to the island. He escaped after about a year and a half. The island was also used as a place of exile for many others over the years.' },
  { id: 'leprosy', label: '1800s–1931 · Settlement', text: 'The island became a settlement for people with leprosy, who were separated from their families. The settlement closed in 1931.' },
  { id: 'prison', label: '1961–1991 · Prison', text: 'The island became a maximum-security prison for political opponents of apartheid. Political prisoners were kept apart and worked in the lime quarry. Nelson Mandela was held from 1964 to 1982, in cell 5 of Section B.' },
  { id: 'museum', label: '1996–1999 · Museum and heritage', text: 'The prison closed in 1996 and Robben Island Museum was set up in 1997. The island was inscribed as a UNESCO World Heritage Site in 1999.' },
];

export function Robben() {
  const [sel, setSel] = useState(PERIODS[2].id);
  const cur = PERIODS.find((p) => p.id === sel)!;
  return (
    <div className="robben">
      <div className="photo-hotspot">
        <img src={`${import.meta.env.BASE_URL}images/photos/cape-town-robben-island.jpg`} alt="Cape Town and Table Bay seen from Table Mountain, with Robben Island visible as a small island on the left." loading="lazy" />
        <button
          type="button"
          className="hotspot"
          style={{ left: '9%', top: '17%' }}
          aria-label="Robben Island: tap to read about the island"
          onClick={() => { setSel('prison'); award('explorer'); }}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <p className="caption-small">Photo: Andreas Tusche, CC BY-SA 3.0, Wikimedia Commons. Robben Island is the small island in the bay, marked with the hotspot.</p>
      <div className="robben-tl" role="tablist" aria-label="Periods of Robben Island’s history">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={p.id === sel}
            className={`robben-tab ${p.id === sel ? 'on' : ''}`}
            onClick={() => { setSel(p.id); award('explorer'); }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="map-card" role="tabpanel" aria-live="polite">
        <p>{cur.text}</p>
      </div>
    </div>
  );
}
