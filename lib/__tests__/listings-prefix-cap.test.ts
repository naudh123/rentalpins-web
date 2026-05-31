import { describe, expect, it } from "vitest";
import {
  geohashPrefixesForBounds,
  geohashPrefixesForViewport,
  geohashMaxPrefixesForZoom,
  isLikelyGeohashPrefixCapped,
} from "@/lib/geohash-bounds";

describe("listings geohash prefix cap signal", () => {
  const bounds = { north: 30.8, south: 30.65, east: 76.85, west: 76.7 };

  it("matches raw grid size to cap helper used by fetchListingsInBounds", () => {
    const { prefixes } = geohashPrefixesForViewport(bounds, 14);
    const capped = prefixes.length > geohashMaxPrefixesForZoom(14);
    expect(isLikelyGeohashPrefixCapped(bounds, 14)).toBe(capped);
  });

  it("is false when grid fits budget", () => {
    expect(isLikelyGeohashPrefixCapped(bounds, 9)).toBe(false);
  });
});
