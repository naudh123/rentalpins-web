import { describe, expect, it } from "vitest";
import { urlMapViewMatchesState } from "@/lib/map-url-viewport";
import type { SearchUrlState } from "@/lib/search-url";
import { DEFAULT_LISTING_FILTERS } from "@/lib/listing-filters";

function mockMap(opts: {
  center?: { lat: number; lng: number };
  zoom?: number;
  bounds?: { north: number; south: number; east: number; west: number };
}): google.maps.Map {
  const center = opts.center ?? { lat: 30.73, lng: 76.78 };
  const bounds = opts.bounds;
  return {
    getCenter: () => ({
      lat: () => center.lat,
      lng: () => center.lng,
    }),
    getZoom: () => opts.zoom ?? 12,
    getBounds: () =>
      bounds
        ? {
            getNorthEast: () => ({ lat: () => bounds.north, lng: () => bounds.east }),
            getSouthWest: () => ({ lat: () => bounds.south, lng: () => bounds.west }),
          }
        : null,
  } as google.maps.Map;
}

function baseState(overrides: Partial<SearchUrlState> = {}): SearchUrlState {
  return {
    filters: DEFAULT_LISTING_FILTERS,
    centerLat: 30.73,
    centerLng: 76.78,
    zoom: 12,
    bounds: null,
    placeQuery: null,
    keywords: null,
    selectedId: null,
    drawnArea: null,
    ...overrides,
  };
}

describe("urlMapViewMatchesState", () => {
  it("matches center and zoom within tolerance", () => {
    const map = mockMap({ center: { lat: 30.7301, lng: 76.7801 }, zoom: 12 });
    expect(urlMapViewMatchesState(map, baseState())).toBe(true);
  });

  it("matches bounds when nearly equal", () => {
    const bounds = { north: 30.8, south: 30.65, east: 76.85, west: 76.7 };
    const map = mockMap({ bounds });
    expect(urlMapViewMatchesState(map, baseState({ bounds, centerLat: null, centerLng: null }))).toBe(
      true
    );
  });

  it("is false when zoom differs", () => {
    const map = mockMap({ center: { lat: 30.73, lng: 76.78 }, zoom: 15 });
    expect(urlMapViewMatchesState(map, baseState({ zoom: 12 }))).toBe(false);
  });
});
