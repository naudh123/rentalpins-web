import { describe, expect, it } from "vitest";
import type { ListingCard } from "../types/listing";
import {
  mergeSemanticSearchResults,
  SEMANTIC_MIN_SCORE,
} from "../semantic-search";

const base: ListingCard = {
  id: "1",
  title: "2BHK Apartment Sector 22",
  description: "Quiet family home near parks with parking",
  price: 18000,
  priceUnit: "per month",
  category: "Property",
  subCategory: "Apartment",
  locationName: "Sector 22, Chandigarh",
  imageUrl: "",
  lat: 30.7,
  lng: 76.7,
  isPromoted: false,
  viewsCount: 0,
  inquiryCount: 0,
  ownerPhone: "",
  createdAt: "",
  updatedAt: "",
  searchText: "2bhk apartment sector 22 quiet family parks parking",
};

describe("mergeSemanticSearchResults", () => {
  it("returns keyword matches when no semantic scores", () => {
    const result = mergeSemanticSearchResults(
      [base],
      [],
      "quiet parks",
      ""
    );
    expect(result).toHaveLength(1);
  });

  it("prioritises semantic matches by score", () => {
    const other: ListingCard = { ...base, id: "2", title: "Shop in market" };
    const result = mergeSemanticSearchResults(
      [other, base],
      [
        { listingId: "1", score: 0.9 },
        { listingId: "2", score: 0.1 },
      ],
      "quiet family apartment",
      "",
      SEMANTIC_MIN_SCORE
    );
    expect(result.map((l) => l.id)).toEqual(["1"]);
  });
});
