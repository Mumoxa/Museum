import { useMemo, useState } from 'react';
import { geoMercator, geoPath, geoCircle } from 'd3-geo';
import { world50, SOUTH_AFRICA, LESOTHO, ESWATINI, boxFeature } from './geo';
import { award } from '../lib/achievements';

// "Who controlled this area?" compares control over time. Control is not the same as ownership,
// and many places were shared, contested or changed hands several times. The shapes are schematic.

type Era = { id: string; label: string };
const ERAS: Era[] = [
  { id: 'c1000', label: 'About 1000' },
  { id: 'c1840', label: '1840' },
  { id: 'c1910', label: '1910' },
  { id: 'c1994', label: '1994' },
];

interface Region {
  id: string;
  name: string;
  shape?: [number, number][];  // schematic polygon (lon, lat)
  circle?: { lon: number; lat: number; r: number };
  control: Record<string, string>;
  caveat?: string;
}

const REGIONS: Region[] = [
  {
    id: 'mapungubwe', name: 'Limpopo valley (Mapungubwe)',
    circle: { lon: 29.25, lat: -22.2, r: 0.9 },
    control: {
      c1000: 'The Mapungubwe kingdom, centred on the hill.',
      c1840: 'Scattered communities; no single state.',
      c1910: 'Part of the Transvaal colony; land controlled by the Union government.',
      c1994: 'Part of Limpopo Province, under the democratic government.',
    },
    caveat: 'Around 1300 the hill was abandoned; people moved to new areas.',
  },
  {
    id: 'zulu', name: 'KwaZulu (Zulu lands)',
    shape: [[30.0, -26.8], [32.2, -26.8], [32.3, -28.4], [31.5, -28.8], [30.2, -28.1]],
    control: {
      c1000: 'Communities in small chiefdoms.',
      c1840: 'The Zulu kingdom; leadership changed in the 1840s.',
      c1910: 'Part of the Union, within the former colony of Natal.',
      c1994: 'Part of KwaZulu-Natal Province.',
    },
    caveat: 'The Zulu kingdom was partly broken up after 1879, and its lands were later governed under colonial and apartheid laws.',
  },
  {
    id: 'basotho', name: 'Lesotho (Basotho lands)',
    shape: [[27.0, -28.6], [28.6, -28.6], [29.4, -29.0], [29.4, -30.6], [28.2, -30.6], [27.0, -29.8]],
    control: {
      c1000: 'Communities in small groups.',
      c1840: 'The Basotho nation under Moshoeshoe I.',
      c1910: 'A British territory (Basutoland), outside the Union.',
      c1994: 'The independent Kingdom of Lesotho (independent 1966).',
    },
    caveat: 'Basutoland was a British protectorate, not part of the Union. Lesotho became independent in 1966.',
  },
  {
    id: 'boer', name: 'Transvaal and Free State (Boer republics)',
    shape: [[26.5, -22.0], [31.0, -22.4], [31.8, -24.0], [30.5, -26.0], [28.5, -27.0], [26.0, -26.0]],
    control: {
      c1000: 'Communities in small chiefdoms.',
      c1840: 'Boer groups and African chiefdoms, without a single state until 1852.',
      c1910: 'The Transvaal, now a colony in the Union.',
      c1994: 'Part of Gauteng, Limpopo and North West provinces.',
    },
    caveat: 'Boer republics governed white settlers, and their laws excluded the African majority from political power.',
  },
  {
    id: 'cape', name: 'Cape Colony',
    shape: [[16.5, -28.6], [21.0, -28.5], [27.0, -30.5], [27.8, -33.5], [25.0, -34.2], [18.5, -34.4], [17.0, -32.0]],
    control: {
      c1000: 'Khoekhoe and San communities.',
      c1840: 'The British Cape Colony.',
      c1910: 'The Cape Province of the Union.',
      c1994: 'The Western and Eastern Cape provinces, and Northern Cape.',
    },
    caveat: 'Cape Colony boundaries changed many times during the 1800s.',
  },
];

const ERA_SHAPE_NOTE: Record<string, string> = {
  c1000: 'Only the Mapungubwe core is shown, approximately.',
  c1840: 'Schematic polygons show approximate areas.',
  c1910: 'The map shows the country outline. Provinces are listed in the cards.',
  c1994: 'The map shows the country outline. Provinces are listed in the cards.',
};

export function Territory() {
  const [era, setEra] = useState('c1840');
  const [region, setRegion] = useState<string>('basotho');
  const W = 560, H = 430;
  const { projection, path } = useMemo(() => {
    const projection = geoMercator().fitExtent([[10, 10], [W - 10, H - 10]], boxFeature(14, 34, -36, -20));
    return { projection, path: geoPath(projection) };
  }, []);
  const cur = REGIONS.find((r) => r.id === region)!;

  return (
    <div className="territory">
      <div className="map-tools" role="group" aria-label="Choose a time">
        {ERAS.map((e) => (
          <button key={e.id} type="button" className="chip" aria-pressed={era === e.id} onClick={() => { setEra(e.id); award('explorer'); }}>{e.label}</button>
        ))}
      </div>
      <div className="map-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="terr-title" className="map-svg">
          <title id="terr-title">{`Schematic map of southern Africa in ${ERAS.find((e) => e.id === era)?.label ?? ""}`}</title>
          <rect width={W} height={H} className="sea" />
          {world50.features.map((f, i) => {
            const id = String(f.id ?? '');
            return <path key={i} d={path(f as never) ?? ''} className={id === SOUTH_AFRICA ? 'land sa' : id === LESOTHO || id === ESWATINI ? 'land nb' : 'land'} />;
          })}
          {REGIONS.map((r) => {
            const active = r.id === region;
            if (r.shape) {
              const d = 'M' + r.shape.map((c) => (projection(c) ?? [0, 0]).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z';
              return <path key={r.id} d={d} className={`zone ${active ? 'on' : ''}`} onClick={() => setRegion(r.id)} />;
            }
            if (r.circle) {
              const c = geoCircle().center([r.circle.lon, r.circle.lat]).radius(r.circle.r)();
              return <path key={r.id} d={path(c as never) ?? ''} className={`zone ${active ? 'on' : ''}`} onClick={() => setRegion(r.id)} />;
            }
            return null;
          })}
        </svg>
      </div>
      <div className="region-chips" role="group" aria-label="Choose an area">
        {REGIONS.map((r) => (
          <button key={r.id} type="button" className="chip" aria-pressed={r.id === region} onClick={() => setRegion(r.id)}>{r.name}</button>
        ))}
      </div>
      <div className="map-card" aria-live="polite">
        <h4>{cur.name}: who controlled it around {ERAS.find((e) => e.id === era)?.label}?</h4>
        <p><strong>{cur.control[era]}</strong></p>
        {cur.caveat && <p className="caveat">Caveat: {cur.caveat}</p>}
        <p className="caveat">{ERA_SHAPE_NOTE[era]}</p>
      </div>
      <p className="caption-small">Shapes are schematic and simplified; they are not survey boundaries. Control, ownership and influence are different things, so read the caveats.</p>
    </div>
  );
}
