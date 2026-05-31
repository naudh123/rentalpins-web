import { describe, expect, it } from "vitest";
import {
  decodeMapArea,
  encodeMapArea,
  shapeToBounds,
  type MapAreaShape,
} from "@/lib/map-area";
import { pointInArea, pointInPolygon } from "@/lib/map-geometry";

describe("map-area encode/decode", () => {
  it("round-trips a rectangle", () => {
    const shape: MapAreaShape = {
      type: "rect",
      bounds: { north: 30.8, south: 30.6, east: 76.9, west: 76.7 },
    };
    const encoded = encodeMapArea(shape);
    expect(encoded).toBe("r:30.8,30.6,76.9,76.7");
    const decoded = decodeMapArea(encoded);
    expect(decoded).toEqual(shape);
  });

  it("round-trips a polygon", () => {
    const shape: MapAreaShape = {
      type: "poly",
      path: [
        { lat: 30.7, lng: 76.7 },
        { lat: 30.8, lng: 76.8 },
        { lat: 30.6, lng: 76.9 },
      ],
    };
    const decoded = decodeMapArea(encodeMapArea(shape));
    expect(decoded?.type).toBe("poly");
    expect(decoded).toEqual(shape);
  });

  it("rejects polygons with fewer than 3 points", () => {
    expect(
      encodeMapArea({ type: "poly", path: [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }] })
    ).toBeNull();
    expect(decodeMapArea("p:1,1_2,2")).toBeNull();
  });

  it("returns null for invalid or empty input", () => {
    expect(decodeMapArea(null)).toBeNull();
    expect(decodeMapArea("")).toBeNull();
    expect(decodeMapArea("garbage")).toBeNull();
    expect(decodeMapArea("r:1,2,3")).toBeNull();
  });

  it("computes enclosing bounds for a polygon", () => {
    const bounds = shapeToBounds({
      type: "poly",
      path: [
        { lat: 30.7, lng: 76.7 },
        { lat: 30.9, lng: 76.8 },
        { lat: 30.6, lng: 77.0 },
      ],
    });
    expect(bounds).toEqual({ north: 30.9, south: 30.6, east: 77.0, west: 76.7 });
  });
});

describe("pointInPolygon / pointInArea", () => {
  const square = [
    { lat: 0, lng: 0 },
    { lat: 0, lng: 10 },
    { lat: 10, lng: 10 },
    { lat: 10, lng: 0 },
  ];

  it("detects inside and outside points", () => {
    expect(pointInPolygon(5, 5, square)).toBe(true);
    expect(pointInPolygon(15, 5, square)).toBe(false);
    expect(pointInPolygon(-1, 5, square)).toBe(false);
  });

  it("dispatches rect vs polygon via pointInArea", () => {
    expect(
      pointInArea(5, 5, { type: "rect", bounds: { north: 10, south: 0, east: 10, west: 0 } })
    ).toBe(true);
    expect(pointInArea(5, 5, { type: "poly", path: square })).toBe(true);
    expect(pointInArea(50, 50, { type: "poly", path: square })).toBe(false);
  });
});
