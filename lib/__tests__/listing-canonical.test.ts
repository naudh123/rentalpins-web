import { describe, expect, it } from "vitest";
import {
  buildListingNavigationQuery,
  cleanedListingSearchParams,
  listingCanonicalAbsoluteUrl,
  listingPathNeedsSeoQueryCleanup,
} from "@/lib/listing-canonical";
import { buildListingSlugSegment } from "@/lib/listing-slug";

const sampleListing = {
  id: "TL5GclYimIKzQMTO0kzW",
  title: "Fully Furnished 2BHK Apartment for Rent in Sector 70",
  locationName: "Sector 70, Mohali",
  lat: 30.7046,
  lng: 76.7179,
  category: "Property",
  subCategory: "Flat",
};

describe("listing-canonical", () => {
  it("builds absolute canonical URL with SEO slug", () => {
    const slug = buildListingSlugSegment(sampleListing);
    expect(listingCanonicalAbsoluteUrl(sampleListing)).toBe(
      `https://www.rentalpins.com/listings/${slug}`
    );
  });

  it("preserves only from in navigation query", () => {
    expect(
      buildListingNavigationQuery({
        from: "/search",
        utm_source: "google",
        gclid: "abc",
      })
    ).toBe("?from=%2Fsearch");
  });

  it("detects tracking params that should be stripped", () => {
    const params = new URLSearchParams("utm_source=google&from=%2Fsearch");
    expect(listingPathNeedsSeoQueryCleanup(params)).toBe(true);
  });

  it("keeps clean from-only query", () => {
    const params = new URLSearchParams("from=%2Fsearch");
    expect(listingPathNeedsSeoQueryCleanup(params)).toBe(false);
    expect(cleanedListingSearchParams(params).toString()).toBe("from=%2Fsearch");
  });
});
