import { describe, expect, it } from "vitest";
import {
  expandMapBounds,
  listingInBounds,
  mergeViewportListings,
  pruneListingsToViewport,
  viewportPaddingRatio,
} from "../map-listings-merge";
import type { ListingCard } from "../types/listing";

function card(id: string, lat: number, lng: number): ListingCard {
  return {
    id,
    title: id,
    description: "",
    price: 10000,
    priceUnit: "/mo",
    category: "Property",
    subCategory: "",
    locationName: "",
    imageUrl: "",
    lat,
    lng,
    isPromoted: false,
    viewsCount: 0,
    inquiryCount: 0,
    ownerPhone: "",
    createdAt: "",
    updatedAt: "",
  };
}

const bounds = { north: 31, south: 30, east: 77, west: 76 };

describe("mergeViewportListings", () => {
  it("keeps previous listings still in viewport when fetch omits them", () => {
    const prev = [card("a", 30.5, 76.5), card("b", 30.6, 76.6)];
    const fetched = [card("a", 30.5, 76.5), card("c", 30.7, 76.7)];
    const merged = mergeViewportListings(prev, fetched, bounds, 11);
    expect(merged.map((l) => l.id).sort()).toEqual(["a", "b", "c"]);
  });

  it("drops previous listings outside viewport", () => {
    const prev = [card("far", 35, 80)];
    const fetched = [card("a", 30.5, 76.5)];
    const merged = mergeViewportListings(prev, fetched, bounds, 11);
    expect(merged.map((l) => l.id)).toEqual(["a"]);
  });

  it("prefers fetched version when ids overlap", () => {
    const prev = [card("a", 30.5, 76.5)];
    const fetched = [{ ...card("a", 30.5, 76.5), price: 99999 }];
    const merged = mergeViewportListings(prev, fetched, bounds, 11);
    expect(merged[0].price).toBe(99999);
  });
});

describe("pruneListingsToViewport", () => {
  it("removes listings outside padded viewport when zooming in", () => {
    const tight = { north: 30.72, south: 30.68, east: 76.78, west: 76.72 };
    const listings = [
      card("near", 30.7, 76.75),
      card("far", 30.5, 76.5),
    ];
    const pruned = pruneListingsToViewport(listings, tight, 15);
    expect(pruned.map((l) => l.id)).toEqual(["near"]);
  });
});

describe("viewportPaddingRatio", () => {
  it("uses more padding when zoomed in", () => {
    expect(viewportPaddingRatio(17)).toBeGreaterThan(viewportPaddingRatio(9));
  });
});

describe("listingInBounds", () => {
  it("returns true inside bounds", () => {
    expect(listingInBounds(card("x", 30.5, 76.5), bounds)).toBe(true);
  });
});

describe("expandMapBounds", () => {
  it("expands all sides", () => {
    const expanded = expandMapBounds(bounds, 0.1);
    expect(expanded.north).toBeGreaterThan(bounds.north);
    expect(expanded.south).toBeLessThan(bounds.south);
  });
});
