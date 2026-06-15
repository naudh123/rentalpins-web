import { describe, expect, it } from "vitest";
import { mergeAiSearchFilters } from "@/lib/ai-search";

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
