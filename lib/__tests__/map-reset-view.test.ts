import { describe, expect, it } from "vitest";
import { mapViewCanReset } from "../map-reset-view";
import { DEFAULT_LISTING_FILTERS } from "../listing-filters";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../map-viewport";

describe("mapViewCanReset", () => {
  const base = {
    filters: DEFAULT_LISTING_FILTERS,
    placeQuery: "",
    textQuery: "",
    mapCenter: DEFAULT_MAP_CENTER,
    mapZoom: DEFAULT_MAP_ZOOM,
    drawnShape: null,
  };

  it("returns false at default state", () => {
    expect(mapViewCanReset(base)).toBe(false);
  });

  it("returns true when filters change", () => {
    expect(
      mapViewCanReset({
        ...base,
        filters: { ...DEFAULT_LISTING_FILTERS, category: "PG" },
      })
    ).toBe(true);
  });

  it("returns true when keywords are set", () => {
    expect(mapViewCanReset({ ...base, textQuery: "furnished" })).toBe(true);
  });

  it("returns true when drawn area is active", () => {
    expect(
      mapViewCanReset({
        ...base,
        drawnShape: {
          type: "rect",
          bounds: { north: 30.8, south: 30.6, east: 76.9, west: 76.7 },
        },
      })
    ).toBe(true);
  });
});
