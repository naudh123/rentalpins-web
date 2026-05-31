import { describe, expect, it } from "vitest";
import { resolveHoverRingPosition } from "@/lib/map-hover-ring-position";
import type { ListingCard } from "@/lib/types/listing";

function listing(id: string, lat: number, lng: number): ListingCard {
  return {
    id,
    title: `Listing ${id}`,
    description: "",
    price: 10000,
    priceUnit: "per month",
    category: "Residential",
    subCategory: "",
    locationName: "Test",
    imageUrl: "",
    lat,
    lng,
    isPromoted: false,
    viewsCount: 0,
    inquiryCount: 0,
    ownerPhone: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe("resolveHoverRingPosition", () => {
  it("uses spiderfy position when provided", () => {
    const listings = [listing("a", 30.73, 76.78)];
    const pos = resolveHoverRingPosition({
      listingId: "a",
      listings,
      mapZoom: 15,
      buildingPinZoom: 15,
      spiderfyPosition: { lat: 30.731, lng: 76.781 },
    });
    expect(pos).toEqual({ lat: 30.731, lng: 76.781 });
  });

  it("offsets co-located pins below building zoom", () => {
    const listings = [
      listing("a", 30.73, 76.78),
      listing("b", 30.73, 76.78),
    ];
    const base = resolveHoverRingPosition({
      listingId: "a",
      listings,
      mapZoom: 15,
      buildingPinZoom: 16,
    });
    expect(base).not.toEqual({ lat: 30.73, lng: 76.78 });
  });

  it("returns null for unknown listing", () => {
    expect(
      resolveHoverRingPosition({
        listingId: "missing",
        listings: [listing("a", 30.73, 76.78)],
        mapZoom: 12,
        buildingPinZoom: 15,
      })
    ).toBeNull();
  });
});
