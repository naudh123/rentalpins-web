import { describe, expect, it } from "vitest";
import { filterListingsForRentalCategory } from "@/lib/seo/category-listing-filter";
import { getRentalCategoryBySlug } from "@/lib/seo/categories";
import type { SeoListingCard } from "@/lib/seo-listings";

function card(partial: Partial<SeoListingCard> & Pick<SeoListingCard, "id" | "category" | "subCategory">): SeoListingCard {
  return {
    title: "Test",
    description: "",
    price: 10000,
    priceUnit: "/ month",
    locationName: "Ludhiana",
    imageUrl: "",
    lat: 0,
    lng: 0,
    isPromoted: false,
    viewsCount: 0,
    inquiryCount: 0,
    createdAt: "",
    ...partial,
  };
}

describe("filterListingsForRentalCategory", () => {
  it("keeps only houses category listings on houses hub", () => {
    const category = getRentalCategoryBySlug("houses")!;
    const listings = [
      card({ id: "1", category: "Property", subCategory: "House" }),
      card({ id: "2", category: "Vehicles", subCategory: "Car" }),
      card({ id: "3", category: "Furniture", subCategory: "Sofa" }),
      card({ id: "4", category: "Home Appliances", subCategory: "Microwave" }),
    ];

    const filtered = filterListingsForRentalCategory(listings, category);
    expect(filtered.map((l) => l.id)).toEqual(["1"]);
  });
});
