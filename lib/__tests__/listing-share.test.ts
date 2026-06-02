import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  listingCanonicalUrl,
  listingOgImagePath,
  listingShareDescription,
} from "@/lib/listing-share";
import { buildListingSlugSegment } from "@/lib/listing-slug";
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

  it("uses slug canonical URL when listing object is provided", () => {
    const slug = buildListingSlugSegment(baseListing);
    expect(listingCanonicalUrl(baseListing)).toBe(
      `https://www.rentalpins.com/listings/${slug}`
    );
  });

  it("falls back to id-only URL when only id string is provided", () => {
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

  it("points OG image at slug opengraph-image route", () => {
    const slug = buildListingSlugSegment(baseListing);
    expect(listingOgImagePath(baseListing)).toBe(
      `/listings/${slug}/opengraph-image`
    );
  });

  it("builds share description with price and location", () => {
    const d = listingShareDescription(baseListing);
    expect(d).toContain("Spacious flat");
    expect(d).toContain("Chandigarh");
  });
});
