import { describe, expect, it } from "vitest";
import { isBuyAppPath, isBuySearchPath } from "@/lib/sale/buy-app-paths";
import { buildMapSearchUrl } from "@/lib/search-url";
import { DEFAULT_LISTING_FILTERS } from "@/lib/listing-filters";

describe("buy-app-paths", () => {
  it("detects buy namespace paths", () => {
    expect(isBuyAppPath("/buy")).toBe(true);
    expect(isBuyAppPath("/buy/mohali")).toBe(true);
    expect(isBuyAppPath("/buy/search")).toBe(true);
    expect(isBuyAppPath("/flats-for-sale")).toBe(true);
    expect(isBuyAppPath("/commercial-property-for-sale")).toBe(true);
    expect(isBuyAppPath("/search")).toBe(false);
    expect(isBuyAppPath("/rentals/mohali")).toBe(false);
  });

  it("detects buy search path", () => {
    expect(isBuySearchPath("/buy/search")).toBe(true);
    expect(isBuySearchPath("/search")).toBe(false);
  });
});

describe("buildMapSearchUrl", () => {
  it("routes sale state to /buy/search without transaction param", () => {
    const href = buildMapSearchUrl({
      filters: { ...DEFAULT_LISTING_FILTERS, transactionType: "sale", category: "Property" },
      centerLat: 30.7,
      centerLng: 76.7,
      zoom: 12,
      bounds: null,
      placeQuery: null,
      keywords: null,
      selectedId: null,
      drawnArea: null,
    });
    expect(href).toContain("/buy/search");
    expect(href).not.toContain("transaction=");
    expect(href).toContain("category=Property");
  });

  it("keeps rent state on /search", () => {
    const href = buildMapSearchUrl({
      filters: DEFAULT_LISTING_FILTERS,
      centerLat: null,
      centerLng: null,
      zoom: null,
      bounds: null,
      placeQuery: null,
      keywords: null,
      selectedId: null,
      drawnArea: null,
    });
    expect(href).toBe("/search");
  });
});
