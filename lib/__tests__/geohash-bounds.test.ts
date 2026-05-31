import { describe, expect, it } from "vitest";
import {
  bonusLimitPerPrefix,
  capGeohashPrefixesNearCenter,
  GEOHASH_CENTER_BOOST_PREFIXES,
  GEOHASH_MAX_PREFIXES,
  GEOHASH_QUERY_BATCH_SIZE,
  geohashMaxPrefixesForZoom,
  geohashPrefixesForBounds,
  geohashPrefixesForViewport,
  geohashPrecisionForZoom,
  gridStepsForPrecision,
  isLikelyGeohashPrefixCapped,
  isLikelyResultCapSaturated,
  limitPerPrefixForZoom,
  shrinkBoundsTowardCenter,
  sortGeohashPrefixesNearCenter,
} from "@/lib/geohash-bounds";

describe("geohash-bounds", () => {
  const bounds = { north: 30.8, south: 30.65, east: 76.85, west: 76.7 };

  it("uses finer precision when zoomed in", () => {
    expect(geohashPrecisionForZoom(16)).toBeGreaterThan(geohashPrecisionForZoom(10));
  });

  it("raises per-prefix limit at street zoom", () => {
    expect(limitPerPrefixForZoom(14)).toBe(58);
    expect(limitPerPrefixForZoom(13)).toBe(52);
  });

  it("shrinks bounds toward center for inner tiling", () => {
    const inner = shrinkBoundsTowardCenter(bounds, 0.5);
    expect(inner.north).toBeLessThan(bounds.north);
    expect(inner.south).toBeGreaterThan(bounds.south);
    expect(inner.east).toBeLessThan(bounds.east);
    expect(inner.west).toBeGreaterThan(bounds.west);
  });

  it("caps prefix count preferring center cells", () => {
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    const many = geohashPrefixesForBounds(bounds, 7, 12);
    expect(many.length).toBeGreaterThan(GEOHASH_MAX_PREFIXES);
    const capped = capGeohashPrefixesNearCenter(many, centerLat, centerLng);
    expect(capped.length).toBe(GEOHASH_MAX_PREFIXES);
  });

  it("raises prefix budget at street zoom", () => {
    expect(geohashMaxPrefixesForZoom(16)).toBeGreaterThan(geohashMaxPrefixesForZoom(10));
    expect(geohashMaxPrefixesForZoom(10)).toBeLessThan(GEOHASH_MAX_PREFIXES);
  });

  it("detects when viewport grid exceeds prefix budget", () => {
    const many = geohashPrefixesForBounds(bounds, 7, 12);
    expect(many.length).toBeGreaterThan(geohashMaxPrefixesForZoom(10));
    expect(isLikelyGeohashPrefixCapped(bounds, 10)).toBe(true);
  });

  it("adds center grid at building zoom 16", () => {
    const z15 = geohashPrefixesForViewport(bounds, 15);
    const z16 = geohashPrefixesForViewport(bounds, 16);
    expect(z16.prefixes.length).toBeGreaterThan(z15.prefixes.length);
  });

  it("adds inner tiles from city zoom 14+", () => {
    const wide = geohashPrefixesForViewport(bounds, 10);
    const city = geohashPrefixesForViewport(bounds, 14);
    expect(city.prefixes.length).toBeGreaterThan(wide.prefixes.length);
  });

  it("adds inner tiles at street zoom 15", () => {
    const wide = geohashPrefixesForViewport(bounds, 11);
    const z15 = geohashPrefixesForViewport(bounds, 15);
    expect(z15.prefixes.length).toBeGreaterThan(wide.prefixes.length);
  });

  it("defines center boost pass constants", () => {
    expect(GEOHASH_CENTER_BOOST_PREFIXES).toBe(10);
    expect(bonusLimitPerPrefix(52)).toBe(76);
    expect(bonusLimitPerPrefix(80)).toBe(96);
  });

  it("generates a grid of prefixes", () => {
    const prefixes = geohashPrefixesForBounds(bounds, 5, 4);
    expect(prefixes.length).toBeGreaterThanOrEqual(9);
    expect(prefixes.length).toBeLessThanOrEqual(25);
    expect(new Set(prefixes).size).toBe(prefixes.length);
  });

  it("sorts prefixes so viewport center cells come first", () => {
    const prefixes = geohashPrefixesForBounds(bounds, 5, 4);
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    const sorted = sortGeohashPrefixesNearCenter(prefixes, centerLat, centerLng);
    expect(sorted[0]).toBeTruthy();
    expect(sorted.length).toBe(prefixes.length);
  });

  it("keeps prefix budget within zoom-aware cap", () => {
    expect(GEOHASH_QUERY_BATCH_SIZE).toBe(32);
    const capped = capGeohashPrefixesNearCenter(
      geohashPrefixesForViewport(bounds, 12).prefixes,
      30.73,
      76.78,
      geohashMaxPrefixesForZoom(12)
    );
    expect(capped.length).toBeLessThanOrEqual(geohashMaxPrefixesForZoom(12));
  });

  it("detects likely cap saturation", () => {
    const steps = gridStepsForPrecision(6);
    const limit = limitPerPrefixForZoom(12);
    const cap = (steps + 1) ** 2 * limit;
    expect(isLikelyResultCapSaturated(cap - 1, steps, limit)).toBe(true);
    expect(isLikelyResultCapSaturated(10, steps, limit)).toBe(false);
  });
});
