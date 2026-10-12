import { useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import type { GeoProjection } from 'd3-geo';
import { world50, boxFeature, SOUTH_AFRICA, LESOTHO, ESWATINI } from '../interactives/geo';

/* ============================================================================
   THE ATLAS PLATE
   ----------------------------------------------------------------------------
   This is not a drawing of a map. It is a map: the coastline, the borders and
   every site position come from real geographic data (Natural Earth via
   world-atlas, public domain, projected with d3-geo). Mountains are placed at
   the true coordinates of real ranges and drawn as engraved ridge marks. The
   plate states its own provenance in the caption.

   Two crowded corners of the country get their own enlarged plates, which is
   what a real atlas does instead of stacking six labels on top of one another:
   the Cape Peninsula, and the Highveld around Johannesburg and Pretoria.
   ========================================================================= */

const NEIGHBOURS = new Set([
  '516', // Namibia
  '072', // Botswana
  '716', // Zimbabwe
  '508', // Mozambique
  LESOTHO,
  ESWATINI,
  SOUTH_AFRICA,
]);

export type Zone = 'cape' | 'highveld';

export interface Site {
  id: string;
  label: string;
  lon: number;
  lat: number;
  /** Draw on the enlarged plate instead of the country plate. */
  zone?: Zone;
}

/* Real coordinates for every stop on the expedition. */
export const SITES: Site[] = [
  { id: 'prologue', label: 'The bookshelf', lon: 18.424, lat: -33.925, zone: 'cape' },
  { id: 'ch4', label: 'Table Bay, 1652', lon: 18.434, lat: -33.906, zone: 'cape' },
  { id: 'ch5', label: 'The Castle', lon: 18.427, lat: -33.926, zone: 'cape' },
  { id: 'ch6', label: 'Robben Island', lon: 18.371, lat: -33.806, zone: 'cape' },
  { id: 'ch7', label: 'Simon’s Town', lon: 18.434, lat: -34.193, zone: 'cape' },
  { id: 'ch12', label: 'Parliament', lon: 18.425, lat: -33.926, zone: 'cape' },
  { id: 'ch1', label: 'Blombos Cave', lon: 21.216, lat: -34.417 },
  { id: 'ch2', label: 'Mapungubwe', lon: 29.250, lat: -22.200 },
  { id: 'ch3', label: 'The sea route', lon: 32.600, lat: -33.400 },
  { id: 'ch8', label: 'The gold reef', lon: 28.050, lat: -26.204, zone: 'highveld' },
  { id: 'ch9', label: 'Union Buildings', lon: 28.191, lat: -25.740, zone: 'highveld' },
  { id: 'ch10', label: 'Soweto', lon: 27.854, lat: -26.268, zone: 'highveld' },
  { id: 'ch11', label: 'Constitution Hill', lon: 28.028, lat: -26.188, zone: 'highveld' },
  { id: 'epilogue', label: 'The centre of it all', lon: 26.214, lat: -29.118 },
];

/** Real mountain positions, drawn as engraved ridge marks. */
const RANGES: { lon: number; lat: number; scale: number }[] = [
  { lon: 29.30, lat: -29.05, scale: 1.1 },   // Drakensberg, northern
  { lon: 29.15, lat: -29.45, scale: .98 },
  { lon: 28.85, lat: -28.65, scale: .92 },
  { lon: 28.70, lat: -31.10, scale: .95 },   // Drakensberg, southern
  { lon: 27.85, lat: -30.60, scale: .78 },   // Witteberge
  { lon: 19.90, lat: -33.70, scale: .8 },    // Cape Fold, Hex River
  { lon: 20.55, lat: -33.30, scale: .72 },
  { lon: 21.50, lat: -33.90, scale: .72 },   // Swartberg
  { lon: 23.10, lat: -34.00, scale: .68 },
  { lon: 29.70, lat: -22.90, scale: .72 },   // Soutpansberg
  { lon: 27.90, lat: -24.60, scale: .66 },   // Waterberg
  { lon: 17.10, lat: -28.20, scale: .62 },   // Richtersveld
  { lon: 30.60, lat: -25.40, scale: .6 },    // Mpumalanga escarpment
];

export const ZONES: Record<Zone, {
  name: string;
  note: string;
  box: [number, number, number, number];
  w: number;
  h: number;
  ridges: { lon: number; lat: number; name: string }[];
}> = {
  cape: {
    name: 'The Cape',
    note: 'The same country, one small corner enlarged. Half of this story happens here.',
    box: [18.28, 18.92, -34.32, -33.68],
    w: 300,
    h: 320,
    ridges: [{ lon: 18.404, lat: -33.958, name: 'Table Mountain' }],
  },
  highveld: {
    name: 'The Highveld',
    note: 'Johannesburg and Pretoria, where five of your chapters happen, inside one small square.',
    box: [27.60, 28.55, -26.50, -25.55],
    w: 300,
    h: 300,
    ridges: [{ lon: 27.86, lat: -25.86, name: 'Magaliesberg' }],
  },
};

const MAIN_BOX: [number, number, number, number] = [16.0, 33.6, -35.4, -21.6];

function project(box: [number, number, number, number], w: number, h: number, pad: number): GeoProjection {
  return geoMercator().fitExtent([[pad, pad], [w - pad, h - pad]], boxFeature(box[0], box[1], box[2], box[3]) as never);
}

/**
 * A three-peak engraved ridge mark centred on a real peak position. The mark
 * unfolds upward from its own base line, so it reads as paper relief rising.
 */
function ridge(x: number, y: number, s: number): string {
  const w = 15 * s;
  const h = 12 * s;
  const p = (fx: number, fy: number) => `${(x + w * fx).toFixed(2)} ${(y - h * fy).toFixed(2)}`;
  return [
    `M ${p(-1, 0)}`,
    `L ${p(-0.72, 0.5)}`,
    `L ${p(-0.52, 0.22)}`,
    `L ${p(-0.3, 0.86)}`,
    `L ${p(-0.08, 0.34)}`,
    `L ${p(0.16, 1)}`,
    `L ${p(0.42, 0.44)}`,
    `L ${p(0.62, 0.66)}`,
    `L ${p(1, 0)}`,
    'Z',
  ].join(' ');
}

export interface ZoneGeometry {
  name: string;
  note: string;
  w: number;
  h: number;
  land: string;
  enclaves: string;
  points: Record<string, { x: number; y: number }>;
  clusters: Cluster[];
  ridges: { d: string; x: number; y: number; name: string }[];
}

export interface Cluster {
  /** Projected position of the cluster centre. */
  x: number;
  y: number;
  /** Site ids at this position. More than one means the atlas groups them. */
  ids: string[];
}

export interface AtlasGeometry {
  sea: string;
  land: string;
  focus: string;
  enclaves: string;
  mountains: { d: string; x: number; y: number }[];
  points: Record<string, { x: number; y: number }>;
  clusters: Cluster[];
  zones: Record<Zone, ZoneGeometry>;
  w: number;
  h: number;
}

/**
 * Groups sites that would print on top of one another into a single marker.
 * This is what an atlas does with four places inside one city: one mark, and
 * the places listed by name. Radius is in plate pixels, so it adapts to the
 * enlargement factor of the plate.
 */
function clusterPoints(points: Record<string, { x: number; y: number }>, radius: number): Cluster[] {
  const out: Cluster[] = [];
  Object.entries(points).forEach(([id, p]) => {
    const near = out.find((c) => Math.hypot(c.x - p.x, c.y - p.y) <= radius);
    if (near) {
      near.ids.push(id);
      near.x = (near.x * (near.ids.length - 1) + p.x) / near.ids.length;
      near.y = (near.y * (near.ids.length - 1) + p.y) / near.ids.length;
    } else {
      out.push({ x: p.x, y: p.y, ids: [id] });
    }
  });
  return out;
}

function buildZone(zone: Zone): ZoneGeometry {
  const cfg = ZONES[zone];
  const proj = project(cfg.box, cfg.w, cfg.h, 18);
  const path = geoPath(proj);
  const sa = world50.features.find((f) => String(f.id) === SOUTH_AFRICA);
  const land = sa ? (path(sa) ?? '') : '';
  const enclaves = world50.features
    .filter((f) => String(f.id) === LESOTHO || String(f.id) === ESWATINI)
    .map((f) => path(f))
    .filter(Boolean)
    .join(' ');

  const points: Record<string, { x: number; y: number }> = {};
  SITES.forEach((s) => {
    if (s.zone !== zone) return;
    const p = proj([s.lon, s.lat]);
    if (p) points[s.id] = { x: p[0], y: p[1] };
  });

  const ridges = cfg.ridges.map((r) => {
    const p = proj([r.lon, r.lat]);
    return p ? { d: ridge(p[0], p[1], 1), x: p[0], y: p[1], name: r.name } : null;
  }).filter(Boolean) as ZoneGeometry['ridges'];

  return {
    name: cfg.name,
    note: cfg.note,
    w: cfg.w,
    h: cfg.h,
    land,
    enclaves,
    points,
    clusters: clusterPoints(points, 26),
    ridges,
  };
}

/** Builds every path once for the given plate size. */
export function buildAtlas(w = 1000, h = 780): AtlasGeometry {
  const proj = project(MAIN_BOX, w, h, 26);
  const path = geoPath(proj);

  const features = world50.features.filter((f) => NEIGHBOURS.has(String(f.id)));
  const focus = features.filter((f) => String(f.id) === SOUTH_AFRICA);

  const land = features.map((f) => path(f)).filter(Boolean).join(' ');
  const sea = path({ type: 'Sphere' } as never) ?? `M0 0 H${w} V${h} H0 Z`;
  /* Lesotho and Eswatini are drawn again on top, so the two countries inside
     South Africa's outline read as countries rather than as holes. */
  const enclaves = world50.features
    .filter((f) => String(f.id) === LESOTHO || String(f.id) === ESWATINI)
    .map((f) => path(f))
    .filter(Boolean)
    .join(' ');

  const mountains = RANGES.map((r) => {
    const p = proj([r.lon, r.lat]);
    return p ? { d: ridge(p[0], p[1], r.scale), x: p[0], y: p[1] } : null;
  }).filter(Boolean) as AtlasGeometry['mountains'];

  const points: Record<string, { x: number; y: number }> = {};
  SITES.forEach((s) => {
    if (s.zone) return;
    const p = proj([s.lon, s.lat]);
    if (p) points[s.id] = { x: p[0], y: p[1] };
  });

  return {
    sea,
    land,
    focus: focus.map((f) => path(f)).filter(Boolean).join(' '),
    enclaves,
    mountains,
    points,
    clusters: clusterPoints(points, 20),
    zones: { cape: buildZone('cape'), highveld: buildZone('highveld') },
    w,
    h,
  };
}

export function useAtlas(w = 1000, h = 780) {
  return useMemo(() => buildAtlas(w, h), [w, h]);
}

/* ---------------------------------------------------------------------------
   The engraved sea: real coastline, decorative ruling. Wave rules are a fixed
   repeating pattern so they read as copperplate, never as noise.
   -------------------------------------------------------------------------- */
export function SeaRules() {
  return (
    <defs>
      <pattern id="atlas-waves" width="46" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)">
        <path d="M0 18 q 11.5 -9 23 0 t 23 0" fill="none" stroke="rgba(150,180,205,.2)" strokeWidth="1" />
      </pattern>
      <pattern id="atlas-stipple" width="9" height="9" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r=".7" fill="rgba(50,42,20,.2)" />
        <circle cx="6.4" cy="6" r=".55" fill="rgba(50,42,20,.16)" />
      </pattern>
      <linearGradient id="atlas-sea-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#16304a" />
        <stop offset="55%" stopColor="#122438" />
        <stop offset="100%" stopColor="#0d1a2a" />
      </linearGradient>
      <linearGradient id="atlas-land-grad" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#3a3524" />
        <stop offset="46%" stopColor="#4a4128" />
        <stop offset="100%" stopColor="#332f1f" />
      </linearGradient>
    </defs>
  );
}

/** Label anchoring so a site near the right edge prints its name inward. */
export function labelAnchor(x: number, w: number): { x: number; anchor: 'start' | 'end' } {
  return x > w - 190 ? { x: -15, anchor: 'end' } : { x: 15, anchor: 'start' };
}
