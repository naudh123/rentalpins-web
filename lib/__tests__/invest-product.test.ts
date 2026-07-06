import { describe, expect, it } from "vitest";
import { computeYield, formatYieldPercent } from "@/lib/invest/yield-calculator";
import { compareInvestAreas } from "@/lib/invest/invest-compare";
import { buildRentCompsUrlFromBuyView } from "@/lib/invest/rent-comps-url";
import { getInvestGuides } from "@/lib/invest/invest-guides";
import { INVEST_CORRIDORS } from "@/lib/invest/invest-corridors";

describe("yield-calculator", () => {
  it("computes gross and net yield", () => {
    const result = computeYield({
      buyPrice: 75_00_000,
      downPayment: 15_00_000,
      monthlyRent: 22_000,
      annualMaintenance: 30_000,
      vacancyRate: 0.08,
      loanRatePercent: 8.5,
      loanTenureYears: 20,
    });
    expect(result.grossYieldPercent).toBeGreaterThan(3);
    expect(result.netYieldPercent).toBeLessThan(result.grossYieldPercent);
    expect(result.emi).toBeGreaterThan(0);
    expect(formatYieldPercent(result.grossYieldPercent)).toContain("%");
  });

  it("returns zero yield for zero buy price", () => {
    const result = computeYield({
      buyPrice: 0,
      downPayment: 0,
      monthlyRent: 20_000,
      annualMaintenance: 0,
      vacancyRate: 0,
      loanRatePercent: 8.5,
      loanTenureYears: 20,
    });
    expect(result.grossYieldPercent).toBe(0);
  });
});

describe("invest-compare", () => {
  it("compares at least two areas", () => {
    const { profiles } = compareInvestAreas(["mohali", "zirakpur"]);
    expect(profiles.length).toBe(2);
    expect(profiles[0]?.slug).toBe("mohali");
  });
});

describe("rent-comps-url", () => {
  it("builds rent map url from buy viewport", () => {
    const url = buildRentCompsUrlFromBuyView({
      filters: { transactionType: "sale", category: "Property", subCategory: "", priceMin: null, priceMax: null, sort: "recommended", bhk: "", furnishing: "", tenantPreference: "", areaMin: null, areaMax: null },
      centerLat: 30.7,
      centerLng: 76.7,
      zoom: 13,
      bounds: null,
      placeQuery: null,
      keywords: null,
      selectedId: null,
      drawnArea: null,
    });
    expect(url).toContain("/search");
    expect(url).toContain("lat=30.7");
    expect(url).not.toContain("transaction=sale");
  });
});

describe("invest-guides", () => {
  it("includes new investment geo guides", () => {
    const guides = getInvestGuides();
    expect(guides.some((g) => g.path === "/buy/zirakpur-investment-guide")).toBe(true);
    expect(guides.some((g) => g.path === "/buy/kharar-investment-guide")).toBe(true);
  });
});

describe("invest-corridors", () => {
  it("defines six tricity corridors", () => {
    expect(INVEST_CORRIDORS.length).toBeGreaterThanOrEqual(6);
    expect(INVEST_CORRIDORS.every((c) => c.guidePath || c.projectsPath)).toBe(true);
  });
});
