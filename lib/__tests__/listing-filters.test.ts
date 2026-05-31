import { describe, expect, it } from "vitest";
import { applyTextSearchFilter } from "../listing-filters";
import type { ListingCard } from "../types/listing";

const base: ListingCard = {
  id: "1",
  title: "2BHK Apartment Sector 22",
  description: "Furnished flat with parking and lift",
  price: 18000,
  priceUnit: "month",
  category: "Property",
  subCategory: "Apartments / Flats",
  locationName: "Chandigarh",
  imageUrl: "",
  lat: 30.7,
  lng: 76.7,
  isPromoted: false,
  viewsCount: 0,
  inquiryCount: 0,
  ownerPhone: "",
  createdAt: "",
  updatedAt: "",
};

describe("applyTextSearchFilter", () => {
  it("returns all listings when query is empty", () => {
    expect(applyTextSearchFilter([base], "")).toHaveLength(1);
  });

  it("matches all words with AND logic", () => {
    expect(applyTextSearchFilter([base], "parking lift")).toHaveLength(1);
    expect(applyTextSearchFilter([base], "parking pool")).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    expect(applyTextSearchFilter([base], "SECTOR 22")).toHaveLength(1);
  });
});
