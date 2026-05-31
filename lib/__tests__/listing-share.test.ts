import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  listingCanonicalUrl,
  listingOgImagePath,
  listingShareDescription,
} from "@/lib/listing-share";
import type { ListingDetail } from "@/lib/types/listing";

const baseListing: ListingDetail = {
  id: "abc123",
  title: "2 BHK near Sector 17",
  description: "Spacious flat with parking and lift.",
  price: 18000,
  priceUnit: "/ month",
  category: "Property",
  subCategory: "Flat",
  locationName: "Chandigarh",
  imageUrl: "https://firebasestorage.googleapis.com/v0/b/x/o/y.jpg",
  lat: 30.7,
  lng: 76.7,
  isPromoted: false,
  viewsCount: 0,
  inquiryCount: 0,
  ownerPhone: "+919999999999",
  createdAt: "",
  updatedAt: "",
  imageUrls: ["https://firebasestorage.googleapis.com/v0/b/x/o/y.jpg"],
  ownerUid: "u1",
};

describe("listing-share", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  });

  it("uses www.rentalpins.com canonical listing URL", () => {
    expect(listingCanonicalUrl("abc123")).toBe(
      "https://www.rentalpins.com/listings/abc123"
    );
  });

  it("uses production URL when NEXT_PUBLIC_SITE_URL is localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    expect(listingCanonicalUrl("abc123")).toBe(
      "https://www.rentalpins.com/listings/abc123"
    );
  });

  it("points OG image at dynamic opengraph-image route", () => {
    expect(listingOgImagePath("abc123")).toBe(
      "/listings/abc123/opengraph-image"
    );
  });

  it("builds share description with price and location", () => {
    const d = listingShareDescription(baseListing);
    expect(d).toContain("Spacious flat");
    expect(d).toContain("Chandigarh");
  });
});
