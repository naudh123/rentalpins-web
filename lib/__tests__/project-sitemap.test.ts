import { describe, expect, it } from "vitest";
import { buildProjectSitemapEntries } from "@/lib/seo/project-sitemap";
import type { Builder, BuilderProject } from "@/lib/types/builder-microsite";

function mockProject(
  overrides: Partial<BuilderProject> & Pick<BuilderProject, "citySlug" | "slug">
): BuilderProject {
  return {
    id: "p1",
    builderId: "b1",
    builderName: "Test Builder",
    builderSlug: "test-builder",
    name: "Test Project",
    slug: overrides.slug,
    description: "Desc",
    projectType: "plots",
    status: "ongoing",
    reraNumber: null,
    address: null,
    city: "Mohali",
    citySlug: overrides.citySlug,
    state: "Punjab",
    country: "India",
    latitude: null,
    longitude: null,
    priceMin: 5000000,
    priceMax: 10000000,
    sizeMin: 100,
    sizeMax: 200,
    sizeUnit: "sq-yd",
    galleryUrls: [],
    amenities: [],
    faqs: [],
    brochureUrl: null,
    floorPlanUrls: [],
    videoUrl: null,
    masterPlanImageUrl: null,
    isPublished: true,
    isFeatured: false,
    viewCount: 0,
    enquiryCount: 0,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: [],
    aiSearchSnippet: null,
    leadRouting: "platform",
    createdAtMs: 1,
    updatedAtMs: 2,
    ...overrides,
  };
}

function mockBuilder(slug: string): Builder {
  return {
    id: "b1",
    name: "Test Builder",
    slug,
    description: "Builder",
    logoUrl: null,
    coverImageUrl: null,
    phone: null,
    whatsapp: null,
    email: null,
    website: null,
    address: null,
    city: "Mohali",
    state: "Punjab",
    country: "India",
    reraNumber: null,
    establishedYear: null,
    socialLinks: {},
    galleryUrls: [],
    status: "published",
    planType: "basic",
    planStatus: "active",
    planStartDateMs: null,
    planEndDateMs: null,
    featuredUntilMs: null,
    maxProjects: 10,
    maxLeads: 100,
    allowedModules: [],
    viewCount: 0,
    enquiryCount: 0,
    createdAtMs: 1,
    updatedAtMs: 2,
    createdBy: null,
    ownerUserId: null,
    leadRouting: "platform",
    source: "web",
  };
}

describe("project sitemap", () => {
  it("includes builders, city hubs, projects, plots, and master plan URLs", () => {
    const project = mockProject({
      citySlug: "mohali",
      slug: "green-valley",
      masterPlanImageUrl: "https://example.com/plan.jpg",
    });
    const entries = buildProjectSitemapEntries([project], [mockBuilder("test-builder")]);
    const locs = entries.map((e) => e.loc);

    expect(locs.some((u) => u.includes("/builders/test-builder"))).toBe(true);
    expect(locs.some((u) => u.includes("/projects/mohali"))).toBe(true);
    expect(locs.some((u) => u.includes("/projects/mohali/green-valley"))).toBe(true);
    expect(locs.some((u) => u.includes("/projects/mohali/green-valley/plots"))).toBe(true);
    expect(locs.some((u) => u.includes("/projects/mohali/green-valley/master-plan"))).toBe(
      true
    );
  });

  it("dedupes repeated paths", () => {
    const project = mockProject({ citySlug: "mohali", slug: "alpha" });
    const entries = buildProjectSitemapEntries([project, project], [mockBuilder("test-builder")]);
    const projectUrls = entries.filter((e) => e.loc.includes("/projects/mohali/alpha"));
    expect(projectUrls).toHaveLength(2);
  });

  it("skips plots subpage for apartment-only projects", () => {
    const project = mockProject({
      citySlug: "mohali",
      slug: "sky-towers",
      projectType: "apartments",
    });
    const entries = buildProjectSitemapEntries([project], []);
    const locs = entries.map((e) => e.loc);
    expect(locs.some((u) => u.includes("/plots"))).toBe(false);
    expect(locs.some((u) => u.includes("/projects/mohali/sky-towers"))).toBe(true);
  });
});
