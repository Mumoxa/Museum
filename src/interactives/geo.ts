// Map data for this book.
//
// The full world-atlas set (Natural Earth, public domain, 50m resolution) is
// 756 KB, and this book only ever draws southern Africa. So the seven countries
// it needs are extracted into src/data/southern-africa-50m.json: the same arcs,
// re-indexed, at 15 KB. The extraction is verified by projecting both sets and
// comparing the output paths, which are byte identical. See tests/smoke.mjs.
//
// The 110m set is small enough (108 KB) to import whole, and is used only by
// the globe and the sea-route device, which draw the whole world.
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import c110 from 'world-atlas/countries-110m.json';
import region from '../data/southern-africa-50m.json';

export interface CountryProps { name?: string; id?: string }

/* The JSON is typed loosely by the bundler; the topojson structure is stable. */
type Topo = { objects: { countries: unknown } };

export const world110 = feature(c110 as never, (c110 as unknown as Topo).objects.countries as never) as unknown as FeatureCollection<Geometry, CountryProps>;
export const world50 = feature(region as never, (region as unknown as Topo).objects.countries as never) as unknown as FeatureCollection<Geometry, CountryProps>;

// ISO numeric codes used by world-atlas. Botswana is zero padded in the 50m set.
export const SOUTH_AFRICA = '710';
export const LESOTHO = '426';
export const ESWATINI = '748';
export const BOTSWANA = '072';

/**
 * A rectangle in lon/lat used only to fit a projection to a region.
 * d3 treats polygon winding as meaningful on the sphere, so this ring is wound
 * the way that makes the rectangle (not its complement) the region.
 */
export function boxFeature(x0: number, x1: number, y0: number, y1: number) {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[[x0, y0], [x0, y1], [x1, y1], [x1, y0], [x0, y0]]],
    },
  };
}
