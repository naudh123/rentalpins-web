import { describe, expect, it } from "vitest";
import {
  FEATURED_PROJECT_SLUGS,
  filterProjects,
  pickFeaturedProjects,
} from "@/lib/builders/projects-index";
import type { BuilderProject } from "@/lib/types/builder-microsite";

function mockProject(overrides: Partial<BuilderProject> = {}): BuilderProject {
  return {
    id: "1",
    builderId: "b1",
    builderName: "Test Builder",
    builderSlug: "test-builder",
    name: "Test Project",
    slug: "test-project",
    description: "Desc",
    projectType: "plots",
    status: "ongoing",
    reraNumber: null,
    address: null,
    city: "Mohali",
    citySlug: "mohali",
    state: "Punjab",
    country: "India",
    latitude: null,
    longitude: null,
    totalArea: null,
    totalUnits: 0,
    availableUnits: 0,
    reservedUnits: 0,
    soldUnits: 0,
    comingSoonUnits: 0,
    priceMin: 80_00_000,
    priceMax: 1_20_00_000,
    sizeMin: 100,
    sizeMax: 200,
    sizeUnit: "sq-yd",
    possessionDate: null,
    amenities: ["Clubhouse"],
    galleryUrls: [],
    videoUrls: [],
    brochureUrl: null,
    paymentPlan: null,
    faqs: [],
    nearbyLandmarks: [],
    constructionUpdates: [],
    masterPlanImageUrl: null,
    isPublished: true,
    isFeatured: false,
    featuredUntilMs: null,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: [],
    aiSearchSnippet: null,
    viewCount: 0,
    enquiryCount: 0,
    createdAtMs: 0,
    updatedAtMs: 0,
    createdBy: null,
    ownerUserId: null,
    leadRouting: "platform",
    source: "web",
    ...overrides,
  };
}

describe("projects-index", () => {
  it("filters by city slug", () => {
    const projects = [
      mockProject({ id: "1", citySlug: "mohali" }),
      mockProject({ id: "2", citySlug: "zirakpur", name: "Z Project" }),
    ];
    const result = filterProjects(projects, {
      query: "",
      citySlug: "zirakpur",
      projectType: "all",
      priceRangeId: "all",
    });
    expect(result).toHaveLength(1);
    expect(result[0].citySlug).toBe("zirakpur");
  });

  it("filters by search query on builder name", () => {
    const projects = [
      mockProject({ id: "1", builderName: "DLF New Chandigarh" }),
      mockProject({ id: "2", builderName: "SBP Group", name: "Other" }),
    ];
    const result = filterProjects(projects, {
      query: "dlf",
      citySlug: null,
      projectType: "all",
      priceRangeId: "all",
    });
    expect(result).toHaveLength(1);
    expect(result[0].builderName).toContain("DLF");
  });

  it("filters by price range", () => {
    const projects = [
      mockProject({ id: "1", priceMin: 30_00_000, priceMax: 45_00_000 }),
      mockProject({ id: "2", priceMin: 1_50_00_000, priceMax: 2_00_00_000 }),
    ];
    const result = filterProjects(projects, {
      query: "",
      citySlug: null,
      projectType: "all",
      priceRangeId: "under-50l",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("pickFeaturedProjects respects FEATURED_PROJECT_SLUGS order", () => {
    const projects = FEATURED_PROJECT_SLUGS.map((slug, i) =>
      mockProject({ id: String(i), slug, name: slug })
    );
    const picked = pickFeaturedProjects(projects);
    expect(picked.map((p) => p.slug)).toEqual(FEATURED_PROJECT_SLUGS);
  });
});
