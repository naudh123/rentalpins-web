import ngeohash from "ngeohash";
import { describe, expect, it } from "vitest";
import {
  geohashCoverForBounds,
  limitPerCoverCell,
  MAP_COVER_MAX_CELLS,
  MAP_PIN_TARGET,
} from "@/lib/geohash-bounds";
import { mapPinLabelTier } from "@/lib/map-zoom-tier";
import { MAP_CLUSTER_MAX_ZOOM } from "@/lib/map-cluster";

/** Default opening view of /search (Chandigarh tricity, zoom 11). */
const OPENING_BOUNDS = { north: 30.94319, south: 30.52296, east: 76.94694, west: 76.61186 };

describe("Zillow-style map view", () => {
  it("covers every point of the opening viewport, not a sample", () => {
    const { prefixes } = geohashCoverForBounds(OPENING_BOUNDS);
    expect(prefixes.length).toBeGreaterThan(0);
    expect(prefixes.length).toBeLessThanOrEqual(MAP_COVER_MAX_CELLS);
    // A dense grid of points inside the bounds must all fall in a queried cell.
    for (let i = 0; i <= 20; i++) {
      for (let j = 0; j <= 20; j++) {
        const lat = OPENING_BOUNDS.south + ((OPENING_BOUNDS.north - OPENING_BOUNDS.south) * i) / 20;
        const lng = OPENING_BOUNDS.west + ((OPENING_BOUNDS.east - OPENING_BOUNDS.west) * j) / 20;
        const hash = ngeohash.encode(lat, lng, 9);
        expect(prefixes.some((p) => hash.startsWith(p))).toBe(true);
      }
    }
  });

  it("handles a whole-country view without enumerating tiny cells", () => {
    const india = { north: 37.5, south: 6.5, east: 97.5, west: 68 };
    const started = Date.now();
    const { prefixes, precision } = geohashCoverForBounds(india);
    expect(Date.now() - started).toBeLessThan(500);
    expect(prefixes.length).toBeLessThanOrEqual(MAP_COVER_MAX_CELLS);
    expect(precision).toBeLessThanOrEqual(3);
  });

  it("uses finer cells for smaller viewports", () => {
    const small = { north: 30.71, south: 30.69, east: 76.73, west: 76.71 };
    expect(geohashCoverForBounds(small).precision).toBeGreaterThan(
      geohashCoverForBounds(OPENING_BOUNDS).precision
    );
  });

  it("lets one dense cell answer in a single round, within a bounded cap", () => {
    for (const cells of [1, 6, 20, 32]) {
      const limit = limitPerCoverCell(cells);
      // Dense Tricity (~230 listings) fits in one cell's first query.
      expect(limit).toBeGreaterThanOrEqual(230);
      expect(limit).toBeLessThanOrEqual(400);
      expect(limit * cells).toBeLessThanOrEqual(400 * MAP_COVER_MAX_CELLS);
    }
    expect(MAP_PIN_TARGET).toBe(500);
  });

  it("shows individual dots at city zoom and price pills closer in", () => {
    expect(mapPinLabelTier(11)).toBe("dot");
    expect(mapPinLabelTier(12)).toBe("dot");
    expect(mapPinLabelTier(13)).toBe("compact");
    expect(mapPinLabelTier(15)).toBe("detailed");
  });

  it("only groups pins when zoomed out past city level", () => {
    expect(MAP_CLUSTER_MAX_ZOOM).toBeLessThanOrEqual(10);
  });
});

describe("sparse areas show prices", () => {
  it("shows price pills at city zoom when few listings are in view", () => {
    expect(mapPinLabelTier(12, 16)).toBe("compact");
    expect(mapPinLabelTier(10, 60)).toBe("compact");
    expect(mapPinLabelTier(12, 157)).toBe("dot");
    expect(mapPinLabelTier(9, 5)).toBe("dot");
  });
});
