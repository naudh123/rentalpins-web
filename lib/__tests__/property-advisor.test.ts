import { describe, expect, it } from "vitest";
import {
  buildAdvisorSearchQuery,
  recommendBuyAreas,
  transactionTypeForAdvisorMode,
} from "@/lib/property-advisor";

describe("property-advisor", () => {
  it("builds natural language query for buy mode", () => {
    const q = buildAdvisorSearchQuery({
      mode: "buy",
      budgetMin: null,
      budgetMax: 80_00_000,
      purpose: "Self use",
      timeline: "Within 3 months",
      locationHint: "Phase 7 Mohali",
    });
    expect(q).toContain("property for sale");
    expect(q).toContain("80 lakh");
    expect(q).toContain("Phase 7 Mohali");
  });

  it("maps advisor mode to transaction type", () => {
    expect(transactionTypeForAdvisorMode("rent")).toBe("rent");
    expect(transactionTypeForAdvisorMode("buy")).toBe("sale");
    expect(transactionTypeForAdvisorMode("invest")).toBe("sale");
  });

  it("recommends Tricity buy hubs by budget", () => {
    const areas = recommendBuyAreas(60_00_000, "mohali");
    expect(areas.length).toBeGreaterThan(0);
    expect(areas.some((a) => a.slug === "mohali")).toBe(true);
  });
});
