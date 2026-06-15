import { describe, expect, it } from "vitest";
import {
  boundsFromCorners,
  isMeaningfulRectBounds,
} from "@/lib/map-area-drawing";

describe("map-area-drawing", () => {
  it("builds bounds from two corners", () => {
    const a = { lat: () => 30.7, lng: () => 76.7 } as google.maps.LatLng;
    const b = { lat: () => 30.8, lng: () => 76.8 } as google.maps.LatLng;
    expect(boundsFromCorners(a, b)).toEqual({
      north: 30.8,
      south: 30.7,
      east: 76.8,
      west: 76.7,
    });
  });

  it("rejects tiny accidental rectangles", () => {
    const bounds = {
      getNorthEast: () => ({ lat: () => 30.70001, lng: () => 76.70001 }),
      getSouthWest: () => ({ lat: () => 30.7, lng: () => 76.7 }),
    } as google.maps.LatLngBounds;
    expect(isMeaningfulRectBounds(bounds)).toBe(false);
  });

  it("accepts meaningful rectangles", () => {
    const bounds = {
      getNorthEast: () => ({ lat: () => 30.71, lng: () => 76.71 }),
      getSouthWest: () => ({ lat: () => 30.7, lng: () => 76.7 }),
    } as google.maps.LatLngBounds;
    expect(isMeaningfulRectBounds(bounds)).toBe(true);
  });
});
