import { describe, expect, it } from "vitest";
import {
  LISTING_IMAGE_CACHE_CONTROL,
  LISTING_IMAGE_VARIANTS,
  listingImagePath,
} from "@/lib/storage-upload";

describe("listing image storage layout", () => {
  it("uses the same path pattern as the Flutter app", () => {
    expect(listingImagePath("u1", "123", 0, "full")).toBe("listings/u1/123_img_0_full.jpg");
    expect(listingImagePath("u1", "123", 2, "thumb")).toBe("listings/u1/123_img_2_thumb.jpg");
    expect(listingImagePath("u1", "123", 2, "icon")).toBe("listings/u1/123_img_2_icon.jpg");
  });

  it("makes real small copies", () => {
    expect(LISTING_IMAGE_VARIANTS.thumbnail.maxDimension).toBe(640);
    expect(LISTING_IMAGE_VARIANTS.icon.maxDimension).toBe(200);
  });

  it("lets browsers cache photos for a year", () => {
    expect(LISTING_IMAGE_CACHE_CONTROL).toBe("public, max-age=31536000, immutable");
  });
});
