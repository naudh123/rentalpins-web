import { describe, expect, it } from "vitest";
import {
  clampPostListingAiText,
  listingCoordsEqual,
  POST_LISTING_DESC_MAX,
  POST_LISTING_DESC_MIN,
  POST_LISTING_TITLE_MAX,
  POST_LISTING_TITLE_MIN,
} from "@/lib/post-listing-limits";

describe("post-listing-limits", () => {
  it("matches Flutter post sheet minimums", () => {
    expect(POST_LISTING_TITLE_MIN).toBe(10);
    expect(POST_LISTING_DESC_MIN).toBe(30);
    expect(POST_LISTING_DESC_MAX).toBe(1000);
  });

  it("web title max is stricter than Flutter (100)", () => {
    expect(POST_LISTING_TITLE_MAX).toBe(80);
  });

  it("clampPostListingAiText truncates overlong AI output", () => {
    const longTitle = "T".repeat(POST_LISTING_TITLE_MAX + 5);
    const longDesc = "D".repeat(POST_LISTING_DESC_MAX + 10);
    const out = clampPostListingAiText(longTitle, longDesc);
    expect(out.title).toHaveLength(POST_LISTING_TITLE_MAX);
    expect(out.description).toHaveLength(POST_LISTING_DESC_MAX);
    expect(out.titleTrimmed).toBe(true);
    expect(out.descriptionTrimmed).toBe(true);
  });

  it("listingCoordsEqual matches server contentHash precision", () => {
    expect(
      listingCoordsEqual(
        { lat: 30.7333123, lng: 76.7794999 },
        { lat: 30.7333987, lng: 76.7794123 }
      )
    ).toBe(true);
    expect(
      listingCoordsEqual({ lat: 30.733, lng: 76.779 }, { lat: 30.734, lng: 76.779 })
    ).toBe(false);
  });

  it("clampPostListingAiText leaves in-range text unchanged", () => {
    const out = clampPostListingAiText("Short title", "A".repeat(POST_LISTING_DESC_MIN));
    expect(out.title).toBe("Short title");
    expect(out.titleTrimmed).toBe(false);
    expect(out.descriptionTrimmed).toBe(false);
  });
});
