import { describe, expect, it } from "vitest";
import { filterSavedSearches } from "../saved-search-filter";
import type { SavedSearch } from "../types/saved-search";

function sampleSearch(overrides: Partial<SavedSearch> = {}): SavedSearch {
  return {
    id: "s1",
    userId: "u1",
    name: "Chandigarh PG",
    category: "PG",
    subCategory: null,
    priceMin: null,
    priceMax: null,
    sort: "newest",
    bhk: null,
    furnishing: null,
    tenantPreference: null,
    areaMin: null,
    areaMax: null,
    bounds: null,
    centerLat: null,
    centerLng: null,
    zoom: null,
    drawnArea: null,
    alertsEnabled: false,
    source: "web",
    createdAtMs: 0,
    updatedAtMs: 0,
    ...overrides,
  };
}

describe("filterSavedSearches", () => {
  it("returns all searches when query is empty", () => {
    const searches = [sampleSearch(), sampleSearch({ id: "s2", name: "Delhi flat" })];
    expect(filterSavedSearches(searches, "")).toEqual(searches);
    expect(filterSavedSearches(searches, "   ")).toEqual(searches);
  });

  it("matches name, place query, category, and price fields", () => {
    const searches = [
      sampleSearch({ name: "Mohali area", placeQuery: "Sector 70" }),
      sampleSearch({ id: "s2", name: "Ludhiana", category: "Flat", priceMin: 8000 }),
    ];
    expect(filterSavedSearches(searches, "sector")).toHaveLength(1);
    expect(filterSavedSearches(searches, "flat")).toHaveLength(1);
    expect(filterSavedSearches(searches, "8000")).toHaveLength(1);
  });
});
