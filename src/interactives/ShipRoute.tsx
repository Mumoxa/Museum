import { useEffect, useMemo, useRef, useState } from 'react';
import { geoEquirectangular, geoPath, geoInterpolate } from 'd3-geo';
import { world110, boxFeature } from './geo';
import { useAppState } from '../lib/store';
import { award } from '../lib/achievements';

type LonLat = [number, number];

const ROUTES: Record<string, { name: string; color: string; points: LonLat[]; text: string }> = {
  portugal: {
    name: 'Portuguese route (Dias 1488, da Gama 1497–98)',
    color: '#8a3b2a',
    points: [[-9.14, 38.72], [-9.5, 33], [-13, 22], [-5, 4], [4, -18], [18.4, -34.3], [33, -26], [40.6, -10.5], [52, -2], [72, 12], [75.8, 11.25]],
    text: 'Portuguese ships sailed around the Cape and along the east coast of Africa, reaching Calicut in India in May 1498.',
  },
  dutch: {
    name: 'Dutch route (1652)',
    color: '#2f5d7c',
    points: [[4.8, 52.9], [-9.5, 39], [-17, 25], [-1, 2], [6, -16], [12, -28], [18.4, -33.9]],
    text: 'The Dutch ships sailed from the Netherlands, down the Atlantic coast, to the Cape. They could stop at Table Bay for fresh water and food.',
  },
};

// Position along a multi-point route for t in [0,1], spread evenly by segment.
function along(points: LonLat[], t: number): LonLat {
  const segs = points.length - 1;
  const f = Math.min(0.999999, Math.max(0, t)) * segs;
  const i = Math.floor(f);
  const local = f - i;
  return geoInterpolate(points[i], points[i + 1])(local) as LonLat;
}

export function ShipRoute() {
  const [route, setRoute] = useState<'portugal' | 'dutch'>('portugal');
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useAppState((s) => s.settings.motion);
  const raf = useRef<number | null>(null);
  const W = 640, H = 360;

  const proj = useMemo(() => geoEquirectangular().fitExtent([[10, 10], [W - 10, H - 10]], boxFeature(-22, 95, -40, 62)), []);
  const path = useMemo(() => geoPath(proj), [proj]);
  const r = ROUTES[route];

  const linePath = useMemo(() => {
    const coords = r.points.map((p) => proj(p) ?? [0, 0]);
    return 'M' + coords.map((c) => c.map((v) => v.toFixed(1)).join(',')).join('L');
  }, [r, proj]);

  const shipXY = proj(along(r.points, t)) ?? [0, 0];

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((prev) => {
        const next = prev + dt / 9;
        if (next >= 1) { setPlaying(false); return 1; }
        return next;
      });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing]);

  useEffect(() => { if (t >= 1) award('explorer'); }, [t]);

  const countries = world110.features;
  return (
    <div className="shiproute">
      <div className="map-tools" role="group" aria-label="Choose a route">
        {(Object.keys(ROUTES) as ('portugal' | 'dutch')[]).map((k) => (
          <button key={k} type="button" className="chip" aria-pressed={route === k} onClick={() => { setRoute(k); setT(0); setPlaying(false); }}>
            {ROUTES[k].name}
          </button>
        ))}
      </div>
      <div className="map-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="route-title" className="map-svg">
          <title id="route-title">Map of the sea route: {r.name}</title>
          <rect width={W} height={H} className="sea" />
          {countries.map((f, i) => <path key={i} d={path(f as never) ?? ''} className="land" />)}
          <path d={linePath} className="route-line" stroke={r.color} />
          <circle cx={shipXY[0]} cy={shipXY[1]} r={6} className="ship" fill={r.color} />
          <text x={(proj([18.4, -33.9]) ?? [0, 0])[0] + 8} y={(proj([18.4, -33.9]) ?? [0, 0])[1] + 4} className="place-label">Cape</text>
          <text x={(proj([75.8, 11.25]) ?? [0, 0])[0] - 40} y={(proj([75.8, 11.25]) ?? [0, 0])[1] - 6} className="place-label">Calicut</text>
        </svg>
      </div>
      <div className="player">
        <button type="button" className="btn small" onClick={() => {
          if (t >= 1) setT(0);
          if (reduced === 'reduced') { setT(1); return; }
          setPlaying((p) => !p);
        }}>
          {playing ? 'Pause' : t >= 1 ? 'Replay' : 'Play the voyage'}
        </button>
        <label className="range-label">
          Voyage progress
          <input type="range" min={0} max={1} step={0.001} value={t} onChange={(e) => { setT(Number(e.target.value)); setPlaying(false); }} />
        </label>
      </div>
      <p className="map-card" aria-live="polite">{r.text}</p>
      <p className="caption-small">Base map: Natural Earth country boundaries (public domain) via the world-atlas package. Routes are simplified.</p>
    </div>
  );
}
