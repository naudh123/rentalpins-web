import { describe, expect, it } from "vitest";
import {
  BUY_PROJECTS,
  getBuyProject,
  getBuyProjectSitemapPaths,
  getBuyProjectsForCity,
} from "@/lib/sale/buy-projects-config";

describe("buy-projects-config", () => {
  it("lists Tricity projects", () => {
    expect(BUY_PROJECTS.length).toBeGreaterThanOrEqual(3);
  });

  it("resolves project by slug", () => {
    expect(getBuyProject("green-valley-residences")?.citySlug).toBe("mohali");
  });

  it("filters projects by city", () => {
    expect(getBuyProjectsForCity("mohali").length).toBeGreaterThan(0);
  });

  it("generates sitemap paths under /buy/projects", () => {
    const paths = getBuyProjectSitemapPaths();
    expect(paths).toContain("/buy/projects");
    // Mohali is a Tricity area, not a top-level city: its project page 404s, so it must not be listed.
    expect(paths).not.toContain("/buy/projects/mohali/green-valley-residences");
    expect(paths).not.toContain("/buy/projects/mohali");
  });
});
