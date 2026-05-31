import { describe, expect, it } from "vitest";
import {
  boundsForSavedSearchCoverage,
  isSavedSearchCoverageLimited,
  savedSearchCoverageHint,
  savedSearchZoomInUrlState,
  showSavedSearchCoverageBanner,
} from "@/lib/saved-search-coverage";
import type { SavedSearch } from "@/lib/types/saved-search";

function baseSearch(overrides: Partial<SavedSearch> = {}): SavedSearch {
  return {
    id: "s1",
    userId: "u1",
    name: "Test",
    category: "Residential",
    subCategory: null,
    priceMin: null,
    priceMax: null,
    sort: "newest",
    bhk: null,
    furnishing: null,
    tenantPreference: null,
    areaMin: null,
    areaMax: null,
    bounds: { north: 30.8, south: 30.65, east: 76.85, west: 76.7 },
    centerLat: 30.725,
    centerLng: 76.775,
    zoom: 14,
    drawnArea: null,
    alertsEnabled: true,
    source: "web",
    createdAtMs: 0,
    updatedAtMs: 0,
    ...overrides,
  };
}

describe("saved-search-coverage", () => {
  it("derives bounds from center when bounds absent", () => {
    const search = baseSearch({ bounds: null, zoom: 12 });
    const bounds = boundsForSavedSearchCoverage(search);
    expect(bounds).not.toBeNull();
    expect(bounds!.north).toBeGreaterThan(search.centerLat!);
  });

  it("flags wide viewport when grid exceeds prefix budget", () => {
    expect(isSavedSearchCoverageLimited(baseSearch({ zoom: 10 }))).toBe(true);
  });

  it("is false when zoomed out enough for grid budget", () => {
    expect(isSavedSearchCoverageLimited(baseSearch({ zoom: 9 }))).toBe(false);
  });

  it("shows banner when searches or alerts are coverage-limited", () => {
    expect(showSavedSearchCoverageBanner([], [])).toBe(false);
    expect(
      showSavedSearchCoverageBanner([baseSearch({ zoom: 10 })], [])
    ).toBe(true);
    expect(
      showSavedSearchCoverageBanner([], [
        {
          id: "a1",
          userId: "u1",
          savedSearchId: "s1",
          savedSearchName: "Test",
          listingId: "l1",
          listingTitle: "Flat",
          listingPrice: 10000,
          listingImageUrl: "",
          read: false,
          createdAtMs: 0,
          coverageMayBeIncomplete: true,
        },
      ])
    ).toBe(true);
  });

  it("bumps zoom to coverage minimum", () => {
    const search = baseSearch({ zoom: 10 });
    expect(savedSearchZoomInUrlState(search).zoom).toBe(15);
  });

  it("keeps zoom when already at street level", () => {
    const search = baseSearch({ zoom: 16 });
    expect(savedSearchZoomInUrlState(search).zoom).toBe(16);
  });
});
