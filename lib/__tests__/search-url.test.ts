import { describe, expect, it } from "vitest";
import {
  applyBuySearchDefaults,
  normalizeSearchQueryString,
  parseSearchUrlState,
  searchUrlQueryString,
} from "@/lib/search-url";

describe("search-url", () => {
  it("round-trips viewport and filters", () => {
    const params = new URLSearchParams({
      lat: "30.7333",
      lng: "76.7794",
      zoom: "12",
      north: "30.8",
      south: "30.65",
      east: "76.85",
      west: "76.7",
      category: "PG",
      q: "Chandigarh",
      selected: "abc123",
    });
    const state = parseSearchUrlState(params);
    expect(state.centerLat).toBeCloseTo(30.7333);
    expect(state.bounds?.north).toBe(30.8);
    expect(state.filters.category).toBe("PG");
    expect(state.placeQuery).toBe("Chandigarh");
    expect(state.selectedId).toBe("abc123");

    const qs = searchUrlQueryString(state);
    const again = parseSearchUrlState(new URLSearchParams(qs));
    expect(again.filters.category).toBe("PG");
    expect(again.selectedId).toBe("abc123");
  });

  it("normalizes query param order", () => {
    const a = normalizeSearchQueryString("zoom=12&lat=30.7333&lng=76.7794");
    const b = normalizeSearchQueryString("lng=76.7794&lat=30.7333&zoom=12");
    expect(a).toBe(b);
  });

  it("round-trips keywords filter", () => {
    const params = new URLSearchParams({
      lat: "30.7",
      lng: "76.7",
      zoom: "12",
      keywords: "furnished parking",
    });
    const state = parseSearchUrlState(params);
    expect(state.keywords).toBe("furnished parking");
    const again = parseSearchUrlState(new URLSearchParams(searchUrlQueryString(state)));
    expect(again.keywords).toBe("furnished parking");
  });

  it("round-trips a drawn polygon area", () => {
    const params = new URLSearchParams({ area: "p:30.7,76.7_30.8,76.8_30.6,76.9" });
    const state = parseSearchUrlState(params);
    expect(state.drawnArea?.type).toBe("poly");
    const qs = searchUrlQueryString(state);
    expect(qs).toContain("area=p%3A30.7%2C76.7_30.8%2C76.8_30.6%2C76.9");
    const again = parseSearchUrlState(new URLSearchParams(qs));
    expect(again.drawnArea).toEqual(state.drawnArea);
  });

  it("applyBuySearchDefaults locks sale + Property regardless of URL", () => {
    const state = applyBuySearchDefaults(
      parseSearchUrlState(
        new URLSearchParams({ category: "PG", transaction: "rent", tenant: "Boys Only" })
      )
    );
    expect(state.filters.transactionType).toBe("sale");
    expect(state.filters.category).toBe("Property");
    expect(state.filters.tenantPreference).toBe("");
  });
});
