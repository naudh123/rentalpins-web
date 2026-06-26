import { describe, expect, it } from "vitest";
import {
  recommendPropertyPath,
  searchAgentFaqs,
  estimateAffordability,
  getDeveloperOffering,
} from "@/lib/agent/agent-knowledge";
import {
  compareBuyAreas,
  getAllAreaGuides,
  getAllRentGuides,
  getMarketInsight,
  getPlatformOverview,
  searchAreaGuides,
  searchProjects,
  searchRentGuides,
} from "@/lib/agent/knowledge";

describe("agent knowledge", () => {
  it("exports Tricity hub guides", () => {
    const guides = getAllAreaGuides();
    expect(guides.length).toBeGreaterThanOrEqual(4);
    expect(guides.some((g) => g.slug === "mohali")).toBe(true);
    expect(guides[0]?.faqSample.length).toBeGreaterThanOrEqual(3);
  });

  it("searchAreaGuides ranks mohali for mohali query", () => {
    const results = searchAreaGuides("mohali phase 7");
    expect(results[0]?.slug).toBe("mohali");
  });

  it("compareBuyAreas returns two hubs", () => {
    const { areas } = compareBuyAreas(["mohali", "zirakpur"]);
    expect(areas).toHaveLength(2);
  });

  it("searchProjects finds sample inventory with amenities", () => {
    const projects = searchProjects("aerocity");
    const sky = projects.find((p) => p.slug === "aerocity-skyline");
    expect(sky).toBeDefined();
    expect(sky?.amenities.length).toBeGreaterThan(0);
  });

  it("platform overview includes agent demo path", () => {
    const p = getPlatformOverview();
    expect(p.demoPaths.some((d) => d.path === "/advisor")).toBe(true);
    expect(p.stack.some((s) => s.includes("OpenAI"))).toBe(true);
  });

  it("exports Tricity rent guides", () => {
    const guides = getAllRentGuides();
    expect(guides.length).toBeGreaterThanOrEqual(3);
    expect(guides.some((g) => g.hubSlug === "kharar")).toBe(true);
  });

  it("searchRentGuides finds PG student content", () => {
    const guides = searchRentGuides("pg chandigarh university");
    expect(guides.length).toBeGreaterThan(0);
  });

  it("getMarketInsight returns mohali buy snapshot", () => {
    const insight = getMarketInsight("mohali", "buy");
    expect(insight?.headline).toContain("Mohali");
  });
});

describe("agent training library", () => {
  it("searchAgentFaqs finds portal objection", () => {
    const faqs = searchAgentFaqs("99acres magicbricks");
    expect(faqs.some((f) => f.id === "platform-vs-portals")).toBe(true);
  });

  it("recommendPropertyPath routes rent intent", () => {
    const path = recommendPropertyPath({ need: "I need a furnished 2BHK on rent near IT Park" });
    expect(path.intent).toBe("rent");
    expect(path.primaryPath).toContain("/search");
  });

  it("recommendPropertyPath routes developer intent", () => {
    const path = recommendPropertyPath({
      need: "We want a white-label portal for our brokerage",
      surface: "showcase",
    });
    expect(path.intent).toBe("developer");
  });

  it("estimateAffordability returns EMI for target price", () => {
    const est = estimateAffordability({ targetPriceLakh: 80, downPaymentLakh: 15 });
    expect(est.estimatedEmiInr).toBeGreaterThan(0);
  });

  it("getDeveloperOffering lists engagement tiers", () => {
    const offering = getDeveloperOffering();
    expect(offering.modules.length).toBeGreaterThanOrEqual(5);
    expect(offering.engagementTiers.length).toBeGreaterThanOrEqual(3);
  });
});
