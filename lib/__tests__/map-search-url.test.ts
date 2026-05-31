import { describe, expect, it } from "vitest";
import { mapSearchUrl } from "@/lib/map-search-url";
import { parseSearchUrlState } from "@/lib/search-url";

function paramsFromUrl(url: string): URLSearchParams {
  const qs = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
  return new URLSearchParams(qs);
}

describe("mapSearchUrl", () => {
  it("includes center, zoom and synthesized bounds", () => {
    const url = mapSearchUrl(30.7333, 76.7794, 12);
    expect(url.startsWith("/search?")).toBe(true);
    const state = parseSearchUrlState(paramsFromUrl(url));
    expect(state.centerLat).toBeCloseTo(30.7333);
    expect(state.centerLng).toBeCloseTo(76.7794);
    expect(state.zoom).toBe(12);
    expect(state.bounds).not.toBeNull();
    expect(state.bounds!.north).toBeGreaterThan(state.bounds!.south);
    expect(state.bounds!.east).toBeGreaterThan(state.bounds!.west);
  });

  it("passes through a selected listing id", () => {
    const url = mapSearchUrl(30.7, 76.7, 14, "listing-123");
    const state = parseSearchUrlState(paramsFromUrl(url));
    expect(state.selectedId).toBe("listing-123");
  });

  it("applies a category filter when not 'All'", () => {
    const url = mapSearchUrl(30.7, 76.7, 12, undefined, "Vehicles");
    const state = parseSearchUrlState(paramsFromUrl(url));
    expect(state.filters.category).toBe("Vehicles");
  });

  it("omits category when 'All'", () => {
    const url = mapSearchUrl(30.7, 76.7, 12, undefined, "All");
    expect(paramsFromUrl(url).has("category")).toBe(false);
  });

  it("uses explicit bounds when provided", () => {
    const bounds = { north: 31, south: 30.5, east: 77, west: 76.5 };
    const url = mapSearchUrl(30.7, 76.7, 12, undefined, null, bounds);
    const state = parseSearchUrlState(paramsFromUrl(url));
    expect(state.bounds).toEqual(bounds);
  });

  it("includes keywords and place label for hub deep links", () => {
    const url = mapSearchUrl(30.7, 76.7, 13, undefined, "Residential", null, "furnished flat", "Chandigarh");
    const state = parseSearchUrlState(paramsFromUrl(url));
    expect(state.keywords).toBe("furnished flat");
    expect(state.placeQuery).toBe("Chandigarh");
    expect(state.filters.category).toBe("Residential");
  });
});
