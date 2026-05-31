import { describe, expect, it } from "vitest";
import { pointInBounds } from "@/lib/map-geometry";

describe("map-geometry", () => {
  const bounds = { north: 31, south: 30, east: 77, west: 76 };

  it("includes point inside bounds", () => {
    expect(pointInBounds(30.5, 76.5, bounds)).toBe(true);
  });

  it("excludes point outside bounds", () => {
    expect(pointInBounds(29, 76.5, bounds)).toBe(false);
    expect(pointInBounds(30.5, 75, bounds)).toBe(false);
  });
});
