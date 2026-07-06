import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildListingSharePayload } from "@/lib/listing-share-copy";
import {
  listingCanonicalUrl,
  listingOgImageAbsoluteUrl,
  listingOgImagePath,
  listingShareDescription,
} from "@/lib/listing-share";
import {
  defaultListingOgImageAbsoluteUrl,
  pickListingCoverImageUrl,
  resolveListingOgImageAbsoluteUrl,
} from "@/lib/listing-og-image";
import { buildSeoSlugSegment } from "@/lib/seo/listing-seo";
import type { ListingDetail } from "@/lib/types/listing";

const baseListing: ListingDetail = {
  id: "abc123def45678901",
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

  it("uses segmented canonical URL when listing object is provided", () => {
    const slug = buildSeoSlugSegment(baseListing);
    expect(listingCanonicalUrl(baseListing)).toBe(
      `https://www.rentalpins.com/rentals/property/${slug}`
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

  it("points OG image path at canonical route opengraph-image", () => {
    const slug = buildSeoSlugSegment(baseListing);
    expect(listingOgImagePath(baseListing)).toBe(
      `/rentals/property/${slug}/opengraph-image`
    );
  });

  it("uses direct Firebase cover photo URL for crawlers when available", () => {
    expect(listingOgImageAbsoluteUrl(baseListing)).toBe(
      "https://www.rentalpins.com/api/listing-og/abc123def45678901"
    );
    expect(resolveListingOgImageAbsoluteUrl(baseListing)).toBe(
      "https://www.rentalpins.com/api/listing-og/abc123def45678901"
    );
  });

  it("falls back to og-default.jpg when listing has no cover photo", () => {
    const noPhoto = { ...baseListing, imageUrl: "", imageUrls: [] };
    expect(listingOgImageAbsoluteUrl(noPhoto)).toBe(
      defaultListingOgImageAbsoluteUrl()
    );
    expect(defaultListingOgImageAbsoluteUrl()).toBe(
      "https://www.rentalpins.com/og-default.jpg"
    );
  });

  it("picks first https image from imageUrls", () => {
    expect(pickListingCoverImageUrl(baseListing)).toBe(
      "https://firebasestorage.googleapis.com/v0/b/x/o/y.jpg"
    );
  });

  it("builds SEO share description with location", () => {
    const d = listingShareDescription(baseListing);
    expect(d).toMatch(/Chandigarh|Sector/i);
    expect(d).toMatch(/RentalPins/i);
  });
});

describe("listing-share-copy", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  });

  it("puts canonical URL on its own line for WhatsApp preview", () => {
    const payload = buildListingSharePayload(baseListing);
    expect(payload.whatsAppText).toContain("https://www.rentalpins.com/");
    expect(payload.whatsAppText.split("\n\n").pop()).toMatch(/^https:\/\//);
    expect(payload.whatsAppText).toContain("Owner-direct");
  });

  it("uses buy branding for sale listings", () => {
    const sale = {
      ...baseListing,
      transactionType: "sale" as const,
      price: 5500000,
      priceUnit: "total",
    };
    const payload = buildListingSharePayload(sale);
    expect(payload.brandLabel).toBe("RentalPins Buy");
    expect(payload.nativeShareTitle).toContain("For sale");
    expect(payload.whatsAppText).toContain("RentalPins Buy");
  });
});
