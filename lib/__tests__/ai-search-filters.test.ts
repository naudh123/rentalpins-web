import { describe, expect, it } from "vitest";
import {
  mergeAiSearchFilters,
  mergeAiSearchFiltersIntoExisting,
  buildAiSearchFeedback,
  DEFAULT_LISTING_FILTERS,
} from "@/lib/ai-search";
import type { ListingFilters } from "@/lib/listing-filters";

const CURRENT: ListingFilters = {
  ...DEFAULT_LISTING_FILTERS,
  category: "Vehicles",
  priceMax: 5000,
  bhk: "2 BHK",
  furnishing: "Furnished",
};

describe("mergeAiSearchFiltersIntoExisting", () => {
  it("preserves current filters when AI returns defaults", () => {
    const merged = mergeAiSearchFiltersIntoExisting(CURRENT, {
      category: "All",
      priceMin: null,
      priceMax: null,
    });
    expect(merged.category).toBe("Vehicles");
    expect(merged.priceMax).toBe(5000);
    expect(merged.bhk).toBe("2 BHK");
  });

  it("overrides only fields the AI populated", () => {
    const merged = mergeAiSearchFiltersIntoExisting(CURRENT, {
      category: "Property",
      priceMax: 18000,
      bhk: "3 BHK",
    });
    expect(merged.category).toBe("Property");
    expect(merged.priceMax).toBe(18000);
    expect(merged.bhk).toBe("3 BHK");
    expect(merged.furnishing).toBe("Furnished");
  });
});

describe("buildAiSearchFeedback", () => {
  it("surfaces unmatched terms", () => {
    const fb = buildAiSearchFeedback(
      { unmatched: ["pet friendly"], confidence: "high", placeText: "Mohali" },
      true
    );
    expect(fb.message).toContain("pet friendly");
  });
});

describe("mergeAiSearchFilters", () => {
  it("preserves sale transaction and Property baseline", () => {
    const filters = mergeAiSearchFilters(
      { category: "All", priceMax: 8_000_000, bhk: "3 BHK" },
      "sale"
    );
    expect(filters.transactionType).toBe("sale");
    expect(filters.category).toBe("Property");
    expect(filters.priceMax).toBe(8_000_000);
    expect(filters.bhk).toBe("3 BHK");
    expect(filters.tenantPreference).toBe("");
  });

  it("keeps rent defaults for rental copilot", () => {
    const filters = mergeAiSearchFilters(
      { category: "PG", priceMax: 15000, tenantPreference: "Girls Only" },
      "rent"
    );
    expect(filters.transactionType).toBe("rent");
    expect(filters.category).toBe("PG");
    expect(filters.priceMax).toBe(15000);
    expect(filters.tenantPreference).toBe("Girls Only");
  });
});
