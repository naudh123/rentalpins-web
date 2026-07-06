import { describe, expect, it } from "vitest";
import { listingShareMetadata } from "@/lib/listing-share";
import {
  DEFAULT_LISTING_SHARE_DESCRIPTION,
  DEFAULT_LISTING_SHARE_TITLE,
  defaultListingOgImageAbsoluteUrl,
} from "@/lib/listing-og-image";
import type { ListingDetail } from "@/lib/types/listing";

const sampleListing: ListingDetail = {
  id: "bm9sbcUVt1wENj3nlxXT",
  title: "3 BHK with 2 washroom fully furnished owner in G",
  description: "Owner direct flat in Kharar.",
  price: 22000,
  priceUnit: "/ month",
  category: "Property",
  subCategory: "Flat",
  locationName: "Kharar, Mohali",
  imageUrl: "https://firebasestorage.googleapis.com/v0/b/demo/o/cover.jpg",
  lat: 30.74,
  lng: 76.72,
  isPromoted: false,
  viewsCount: 0,
  inquiryCount: 0,
  ownerPhone: "+919999999999",
  createdAt: "",
  updatedAt: "",
  imageUrls: ["https://firebasestorage.googleapis.com/v0/b/demo/o/cover.jpg"],
  ownerUid: "u1",
};

describe("listingShareMetadata", () => {
  it("emits cover photo, canonical, and social tags for property rent URLs", () => {
    const meta = listingShareMetadata(sampleListing);

    expect(meta.openGraph?.url).toMatch(
      /https:\/\/www\.rentalpins\.com\/rentals\/property\/.+bm9sbcUVt1wENj3nlxXT$/
    );
    expect(meta.alternates?.canonical).toBe(meta.openGraph?.url);
    expect(meta.openGraph?.siteName).toBe("RentalPins");
    expect(meta.openGraph?.type).toBe("website");
    expect(meta.twitter?.card).toBe("summary_large_image");

    const ogImages = meta.openGraph?.images;
    const ogImage = Array.isArray(ogImages) ? ogImages[0] : ogImages;
    expect(ogImage).toMatchObject({
      url: "https://www.rentalpins.com/api/listing-og/bm9sbcUVt1wENj3nlxXT",
      width: 1200,
      height: 630,
      type: "image/jpeg",
    });
    expect(meta.twitter?.images).toEqual([
      "https://www.rentalpins.com/api/listing-og/bm9sbcUVt1wENj3nlxXT",
    ]);
  });

  it("uses og-default.jpg when listing has no cover photo", () => {
    const meta = listingShareMetadata({
      ...sampleListing,
      imageUrl: "",
      imageUrls: [],
    });

    const ogImages = meta.openGraph?.images;
    const ogImage = Array.isArray(ogImages) ? ogImages[0] : ogImages;
    expect(ogImage).toMatchObject({ url: defaultListingOgImageAbsoluteUrl() });
    expect(meta.twitter?.images).toEqual([defaultListingOgImageAbsoluteUrl()]);
  });

  it("uses default OG image and alt for missing listing", async () => {
    const { listingOgImageOpenGraphEntry } = await import("@/lib/listing-og-image");
    const entry = listingOgImageOpenGraphEntry(null);
    expect(entry.url).toBe(defaultListingOgImageAbsoluteUrl());
    expect(entry.alt).toContain(DEFAULT_LISTING_SHARE_TITLE);
  });
});
