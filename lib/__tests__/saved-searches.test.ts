import { describe, expect, it } from "vitest";
import { buildSavedSearchName } from "../saved-searches";
import { DEFAULT_LISTING_FILTERS } from "../listing-filters";

describe("buildSavedSearchName", () => {
  it("includes keywords in the generated name", () => {
    const name = buildSavedSearchName({
      filters: DEFAULT_LISTING_FILTERS,
      bounds: null,
      centerLat: null,
      centerLng: null,
      zoom: null,
      keywords: "furnished parking",
    });
    expect(name).toContain("furnished parking");
  });
});
