// Map data: world-atlas (public domain country boundaries, simplified) converted with topojson-client.
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import c110 from 'world-atlas/countries-110m.json';
import c50 from 'world-atlas/countries-50m.json';

export interface CountryProps { name?: string; id?: string }

// The JSON is typed loosely by the bundler; the topojson structure is stable.
const t110 = c110 as unknown as { objects: { countries: unknown } };
const t50 = c50 as unknown as { objects: { countries: unknown } };

export const world110 = feature(c110 as never, t110.objects.countries as never) as unknown as FeatureCollection<Geometry, CountryProps>;
export const world50 = feature(c50 as never, t50.objects.countries as never) as unknown as FeatureCollection<Geometry, CountryProps>;

// ISO numeric codes used by world-atlas.
export const SOUTH_AFRICA = '710';
export const LESOTHO = '426';
export const ESWATINI = '748';

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
