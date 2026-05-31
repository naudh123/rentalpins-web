import { describe, expect, it } from "vitest";
import {
  buildMapResultsCountInfo,
  listingPageForIndex,
  MAP_LIST_PAGE_SIZE,
} from "../map-list-count";

describe("buildMapResultsCountInfo", () => {
  it("ignores refreshing flag for header copy", () => {
    const idle = buildMapResultsCountInfo({
      resultCount: 8,
      totalInBounds: 20,
      loading: false,
      resultsMayBeIncomplete: true,
      mapZoom: 12,
    });
    const withRefresh = buildMapResultsCountInfo({
      resultCount: 8,
      totalInBounds: 20,
      loading: false,
      refreshing: true,
      resultsMayBeIncomplete: true,
      mapZoom: 12,
    });
    expect(withRefresh.headline).toBe(idle.headline);
    expect(withRefresh.subline).toBe(idle.subline);
  });

  it("shows loading state", () => {
    const info = buildMapResultsCountInfo({
      resultCount: 0,
      totalInBounds: 0,
      loading: true,
      mapZoom: 12,
    });
    expect(info.headline).toContain("Updating");
  });

  it("shows filter mismatch like Zillow subset", () => {
    const info = buildMapResultsCountInfo({
      resultCount: 12,
      totalInBounds: 40,
      loading: false,
      mapZoom: 14,
      filtersActive: true,
    });
    expect(info.headline).toBe("12 of 40 match filters");
  });

  it("does not blame filters when only the fetch cap applies", () => {
    const info = buildMapResultsCountInfo({
      resultCount: 40,
      totalInBounds: 100,
      loading: false,
      resultsMayBeIncomplete: true,
      mapZoom: 12,
      filtersActive: false,
      clientFilterActive: false,
    });
    expect(info.headline).not.toContain("match filters");
    expect(info.headline).toContain("on map");
  });

  it("shows zoom-in hint when area may have more", () => {
    const info = buildMapResultsCountInfo({
      resultCount: 40,
      totalInBounds: 40,
      loading: false,
      resultsMayBeIncomplete: true,
      mapZoom: 12,
    });
    expect(info.headline).toContain("on map");
    expect(info.subline).toContain("Not all listings");
    expect(info.areaMayHaveMore).toBe(true);
  });

  it("shows zoom-in hint when prefix cap trims geohash grid", () => {
    const info = buildMapResultsCountInfo({
      resultCount: 40,
      totalInBounds: 40,
      loading: false,
      mapZoom: 12,
      prefixCapActive: true,
    });
    expect(info.areaMayHaveMore).toBe(true);
    expect(info.subline).toContain("Not all listings");
  });

  it("shows exact count when complete", () => {
    const info = buildMapResultsCountInfo({
      resultCount: 11,
      totalInBounds: 11,
      loading: false,
      mapZoom: 18,
    });
    expect(info.headline).toBe("11 rentals available");
    expect(info.areaMayHaveMore).toBe(false);
  });
});

describe("listingPageForIndex", () => {
  it("maps index to page", () => {
    expect(listingPageForIndex(0)).toBe(0);
    expect(listingPageForIndex(MAP_LIST_PAGE_SIZE - 1)).toBe(0);
    expect(listingPageForIndex(MAP_LIST_PAGE_SIZE)).toBe(1);
  });
});
