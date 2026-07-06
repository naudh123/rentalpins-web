import { describe, expect, it } from "vitest";
import { listingShareMetaDescription, listingShareMetaTitle } from "@/lib/listing-share-meta-copy";
import type { ListingDetail } from "@/lib/types/listing";

const sample: ListingDetail = {
  id: "abc123",
  title: "3 BHK fully furnished flat",
  description: "Spacious owner-direct flat with covered parking and modular kitchen.",
  price: 22000,
  priceUnit: "/ month",
  category: "Property",
  subCategory: "Flat",
  locationName: "Kharar, Mohali",
  imageUrl: "",
  lat: 30.74,
  lng: 76.72,
  isPromoted: false,
  viewsCount: 0,
  inquiryCount: 0,
  ownerPhone: "+919999999999",
  createdAt: "",
  updatedAt: "",
  imageUrls: [],
  ownerUid: "u1",
};

describe("listingShareMetaTitle", () => {
  it("includes title, price, and location", () => {
    const title = listingShareMetaTitle(sample);
    expect(title).toContain("3 BHK fully furnished flat");
    expect(title).toContain("Kharar");
    expect(title).toMatch(/22,?000|₹/i);
  });
});

describe("listingShareMetaDescription", () => {
  it("prefers listing description when long enough", () => {
    expect(listingShareMetaDescription(sample)).toContain("modular kitchen");
  });
});
