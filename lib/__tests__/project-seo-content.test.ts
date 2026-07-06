import { describe, expect, it } from "vitest";
import { TRICITY_PROJECTS } from "@/lib/builders/tricity-catalog";
import {
  RENTALPINS_DEAL_MARKER,
  buildProjectSeoBundle,
} from "@/lib/builders/project-seo-content";

describe("project SEO content", () => {
  it("generates best-deal bundle for Gillco Valley", () => {
    const entry = TRICITY_PROJECTS.find((p) => p.slug === "gillco-valley");
    expect(entry).toBeDefined();
    const bundle = buildProjectSeoBundle(entry!, "Gillco Group");

    expect(bundle.seoTitle).toContain("Best Deal");
    expect(bundle.seoTitle).toContain("Gillco Valley");
    expect(bundle.seoDescription.toLowerCase()).toContain("best deal");
    expect(bundle.description).toContain(RENTALPINS_DEAL_MARKER);
    expect(bundle.seoKeywords.length).toBeGreaterThan(15);
    expect(bundle.seoKeywords.some((k) => k.toLowerCase().includes("gillco"))).toBe(true);
    expect(bundle.faqs.some((f) => f.question.includes("best deal"))).toBe(true);
    expect(bundle.aiSearchSnippet).toContain("9915061640");
  });

  it("generates SEO for every catalog project", () => {
    expect(TRICITY_PROJECTS.length).toBeGreaterThanOrEqual(50);
    for (const entry of TRICITY_PROJECTS) {
      const bundle = buildProjectSeoBundle(entry, entry.builderSlug);
      expect(bundle.seoTitle.length).toBeGreaterThan(10);
      expect(bundle.seoDescription.length).toBeGreaterThan(40);
      expect(bundle.seoKeywords.length).toBeGreaterThan(10);
      expect(bundle.description).toContain(RENTALPINS_DEAL_MARKER);
      expect(bundle.faqs.length).toBeGreaterThanOrEqual(5);
    }
  });
});
