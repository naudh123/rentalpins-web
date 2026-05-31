import { describe, expect, it } from "vitest";
import {
  buildMapListingDisplayItems,
  buildingGroupKey,
  primaryListingInGroup,
  unitPriceChips,
} from "../map-building-groups";
import type { ListingCard } from "../types/listing";

function listing(id: string, lat: number, lng: number, price: number, bhk?: string): ListingCard {
  return {
    id,
    title: `Listing ${id}`,
    description: "",
    price,
    priceUnit: "/mo",
    category: "Property",
    subCategory: "Flat",
    locationName: "Sector 22",
    imageUrl: "",
    lat,
    lng,
    isPromoted: false,
    viewsCount: 0,
    inquiryCount: 0,
    ownerPhone: "",
    homeIso: "IN",
    createdAt: "",
    updatedAt: "",
    attributes: bhk ? { bhk } : undefined,
  };
}

describe("buildingGroupKey", () => {
  it("groups coordinates within ~1m", () => {
    expect(buildingGroupKey(30.733314, 76.779419)).toBe(
      buildingGroupKey(30.7333149, 76.7794194)
    );
  });
});

describe("buildMapListingDisplayItems", () => {
  it("merges co-located listings into building rows", () => {
    const items = buildMapListingDisplayItems([
      listing("a", 30.7333, 76.7794, 15000, "1 BHK"),
      listing("b", 30.7333, 76.7794, 18000, "2 BHK"),
      listing("c", 30.74, 76.78, 12000),
    ]);
    expect(items).toHaveLength(2);
    expect(items[0].kind).toBe("building");
    if (items[0].kind === "building") expect(items[0].listings).toHaveLength(2);
    expect(items[1].kind).toBe("single");
  });
});

describe("primaryListingInGroup", () => {
  it("prefers lowest price", () => {
    const primary = primaryListingInGroup([
      listing("b", 0, 0, 20000),
      listing("a", 0, 0, 15000),
    ]);
    expect(primary.id).toBe("a");
  });
});

describe("unitPriceChips", () => {
  it("returns distinct price and bhk combos", () => {
    const chips = unitPriceChips([
      listing("a", 0, 0, 15000, "1 BHK"),
      listing("b", 0, 0, 18000, "2 BHK"),
      listing("c", 0, 0, 18000, "2 BHK"),
    ]);
    expect(chips).toHaveLength(2);
    expect(chips[0].label).toContain("1 BHK");
  });
});
