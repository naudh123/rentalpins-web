import { describe, expect, it } from "vitest";
import { resolveListingPlaceLabel } from "@/lib/listing-slug-location";
import {
  buildListingSlugSegment,
  extractListingIdFromSlugParam,
  generateSeoSlug,
} from "@/lib/listing-slug";

const MOHALI_LISTING = {
  id: "4EXRL7RcLbdMQykfMujYCymOb002",
  title: "OWNER FREE | 2BHK FULLY FURNISHED FOR RENT",
  searchableTitle: "owner free | 2bhk fully furnished for rent",
  locationName:
    "Block D5, PURAB PREMIUM, 102, Apartments, Sector 88, Sahibzada Ajit Singh Nagar, Punjab 140308, India",
  lat: 30.6846864,
  lng: 76.6933266,
  subCategory: "Apartments / Flats",
  category: "Property",
  attributes: { bhk: "2BHK" },
};

describe("listing-slug-location", () => {
  it("resolves Mohali from coordinates near Sector 88", () => {
    expect(
      resolveListingPlaceLabel({
        lat: MOHALI_LISTING.lat,
        lng: MOHALI_LISTING.lng,
        locationName: MOHALI_LISTING.locationName,
      })
    ).toBe("Mohali");
  });

  it("falls back to locationName when coordinates are missing", () => {
    expect(
      resolveListingPlaceLabel({
        lat: 0,
        lng: 0,
        locationName: MOHALI_LISTING.locationName,
      })
    ).toBe("Mohali");
  });
});

describe("listing-slug", () => {
  it("generates readable slug segments", () => {
    expect(generateSeoSlug("OWNER FREE | 2BHK FOR RENT")).toBe(
      "owner-free-2bhk-for-rent"
    );
  });

  it("builds title-in-place-id slug for Mohali property", () => {
    const slug = buildListingSlugSegment(MOHALI_LISTING);
    expect(slug).toMatch(/-in-mohali-4EXRL7RcLbdMQykfMujYCymOb002$/);
    expect(slug).toContain("2bhk");
    expect(slug).not.toContain("owner-free");
  });

  it("extracts Firebase id from slug param and legacy id-only param", () => {
    const slug = buildListingSlugSegment(MOHALI_LISTING);
    expect(extractListingIdFromSlugParam(slug)).toBe(MOHALI_LISTING.id);
    expect(extractListingIdFromSlugParam(MOHALI_LISTING.id)).toBe(
      MOHALI_LISTING.id
    );
  });

  it("returns null for invalid slug params", () => {
    expect(extractListingIdFromSlugParam("")).toBeNull();
    expect(extractListingIdFromSlugParam("not-a-valid-slug")).toBeNull();
  });

  it("prefers stored urlSlug over computed slug", () => {
    const stored = "stored-slug-abc123";
    expect(
      buildListingSlugSegment({
        ...MOHALI_LISTING,
        urlSlug: stored,
      })
    ).toBe(stored);
  });
});
