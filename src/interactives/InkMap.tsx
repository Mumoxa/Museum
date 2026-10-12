import { useMemo, useState } from 'react';
import { geoMercator, geoPath, geoCircle } from 'd3-geo';
import { world50, SOUTH_AFRICA, LESOTHO, ESWATINI, boxFeature } from './geo';
import { award } from '../lib/achievements';

interface Mark {
  id: string;
  name: string;
  lon: number;
  lat: number;
  kind: 'kingdom' | 'place' | 'event';
  area?: number;      // approximate area radius in degrees (kingdoms)
  text: string;
  cape?: boolean;
}

export const MARKS: Mark[] = [
  { id: 'mapungubwe', name: 'Mapungubwe Hill', lon: 29.25, lat: -22.2, kind: 'kingdom', area: 0.9, text: 'The hill of the jackal. A kingdom lived around it from about the 900s, and people left around 1300. Its golden rhinoceros was found in 1933.' },
  { id: 'zimbabwe', name: 'Great Zimbabwe', lon: 30.93, lat: -20.27, kind: 'kingdom', area: 0.6, text: 'A stone-walled centre in today’s Zimbabwe, which grew wealthy through trade. It is a reminder that Africa had many great cities, not only one.' },
  { id: 'thaba', name: 'Thaba Bosiu', lon: 27.5, lat: -29.2, kind: 'kingdom', area: 0.5, text: 'A flat-topped mountain fortress of the Basotho nation, chosen by Moshoeshoe I for its defences.' },
  { id: 'zulu', name: 'Zulu heartland', lon: 31.0, lat: -28.4, kind: 'kingdom', area: 1.6, text: 'The Zulu kingdom grew in the early 1800s under Shaka. This shaded area is approximate and changed over time.' },
  { id: 'isandlwana', name: 'Isandlwana', lon: 30.6, lat: -28.35, kind: 'event', text: 'Site of the battle on 22 January 1879, where over 1,300 British and African auxiliary soldiers were killed.' },
  { id: 'kimberley', name: 'Kimberley', lon: 24.77, lat: -28.74, kind: 'event', text: 'Diamond mines grew here in the 1870s, drawing workers and companies from across the world.' },
  { id: 'joburg', name: 'Witwatersrand gold fields', lon: 28.04, lat: -26.2, kind: 'event', text: 'Gold was found here in 1886. Johannesburg grew around the mines.' },
  { id: 'soweto', name: 'Soweto', lon: 27.86, lat: -26.27, kind: 'event', text: 'The township where students protested on 16 June 1976, and where Hector Pieterson was shot.' },
  { id: 'pretoria', name: 'Union Buildings, Pretoria', lon: 28.22, lat: -25.75, kind: 'event', text: 'Built to house the government of the Union. Nelson Mandela was inaugurated here on 10 May 1994.' },
  { id: 'sharpeville', name: 'Sharpeville', lon: 27.85, lat: -26.69, kind: 'event', text: 'The site of the police shootings on 21 March 1960, when 69 people were killed according to official figures.' },
  { id: 'tablebay', name: 'Table Bay and the Castle', lon: 18.43, lat: -33.92, kind: 'place', cape: true, text: 'Van Riebeeck arrived here on 6 April 1652. The Castle of Good Hope was built from 1666 and finished in 1679.' },
  { id: 'robben', name: 'Robben Island', lon: 18.37, lat: -33.81, kind: 'place', cape: true, text: 'Used for exile, a leprosy settlement, a prison and now a museum and World Heritage Site.' },
  { id: 'blombos', name: 'Blombos Cave', lon: 21.22, lat: -34.42, kind: 'place', cape: true, text: 'Home to beads, engraved ochre and a drawing made tens of thousands of years ago.' },
  { id: 'muizenberg', name: 'Muizenberg (False Bay)', lon: 18.47, lat: -34.11, kind: 'event', cape: true, text: 'The British landed nearby in 1795, and defeated the Dutch defenders at the Battle of Muizenberg.' },
  { id: 'table', name: 'Table Mountain', lon: 18.4, lat: -33.96, kind: 'place', cape: true, text: 'The flat-topped mountain above the bay. The first Dutch settlers would have seen it from the ships.' },
];

const REGION = { lon: [11, 42, -36, -15] as const };    // Southern Africa view
const CAPE = { lon: [17.4, 22.0, -35.0, -33.0] as const };

export function InkMap({ note }: { note?: string }) {
  const initialCape = note === 'cape';
  const [cape, setCape] = useState(initialCape);
  const [sel, setSel] = useState<Mark | null>(null);
  const W = 640;
  const H = cape ? 470 : 470;

  const { projection, path } = useMemo(() => {
    const b = cape ? CAPE : REGION;
    const [x0, x1, y0, y1] = b.lon;
    const projection = geoMercator().fitExtent([[12, 12], [W - 12, H - 12]], boxFeature(x0, x1, y0, y1));
    const path = geoPath(projection);
    return { projection, path };
  }, [cape]);

  const marks = MARKS.filter((m) => (cape ? m.cape : true));
  const countries = world50.features;

  return (
    <div className="inkmap">
      <div className="map-tools" role="group" aria-label="Map view">
        <button type="button" className="chip" aria-pressed={!cape} onClick={() => { setCape(false); setSel(null); }}>Southern Africa</button>
        <button type="button" className="chip" aria-pressed={cape} onClick={() => { setCape(true); setSel(null); }}>Cape coast</button>
      </div>
      <div className="map-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="inkmap-title inkmap-desc" className="map-svg">
          <title id="inkmap-title">Map of {cape ? 'the Cape coast' : 'southern Africa'} with places from this chapter</title>
          <desc id="inkmap-desc">Tap or select a marker to read about the place. Shaded areas are approximate.</desc>
          <rect width={W} height={H} className="sea" />
          {countries.map((f, i) => {
            const id = String(f.id ?? '');
            const isSA = id === SOUTH_AFRICA;
            const isNeighbour = id === LESOTHO || id === ESWATINI;
            const d = path(f as never) ?? '';
            return <path key={i} d={d} className={isSA ? 'land sa' : isNeighbour ? 'land nb' : 'land'} />;
          })}
          {!cape && MARKS.filter((m) => m.kind === 'kingdom' && m.area).map((m) => {
            const circle = geoCircle().center([m.lon, m.lat]).radius(m.area!)();
            return <path key={m.id} d={path(circle as never) ?? ''} className="area" />;
          })}
          {marks.map((m) => {
            const p = projection([m.lon, m.lat]);
            if (!p) return null;
            const [x, y] = p;
            const active = sel?.id === m.id;
            return (
              <g key={m.id} transform={`translate(${x},${y})`} className={`mark ${m.kind} ${active ? 'active' : ''}`}>
                <circle r={active ? 9 : 6} />
                <text x={10} y={4}>{m.name}</text>
                <foreignObject x={-14} y={-14} width={28} height={28}>
                  <button
                    type="button"
                    className="mark-btn"
                    aria-label={`${m.name}: ${m.text}`}
                    aria-pressed={active}
                    onClick={() => { setSel(m); award('explorer'); }}
                  />
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="map-card" aria-live="polite">
        {sel ? (
          <>
            <h4>{sel.name}</h4>
            <p>{sel.text}</p>
          </>
        ) : (
          <p>Tap a marker to learn about that place. Shaded areas show roughly where a kingdom was centred. Borders change over time, so use the shading as a guide, not a fixed line.</p>
        )}
      </div>
      <p className="caption-small">Base map: Natural Earth country boundaries (public domain) via the world-atlas package. Shaded areas are approximate.</p>
    </div>
  );
}
