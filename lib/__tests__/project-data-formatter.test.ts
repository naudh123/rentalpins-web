import { describe, expect, it } from "vitest";
import {
  findProjectInCatalog,
  formatProjectRichRecord,
  formatProjectsCatalogContext,
} from "@/lib/agent/project-data-formatter";
import type { BuilderProject } from "@/lib/types/builder-microsite";

function sampleProject(overrides: Partial<BuilderProject> = {}): BuilderProject {
  return {
    id: "p1",
    builderId: "b1",
    builderName: "Test Builder",
    builderSlug: "test-builder",
    name: "Green Valley",
    slug: "green-valley",
    description: "Premium plotted development near airport.",
    projectType: "plots",
    status: "ongoing",
    reraNumber: "PBRERA123",
    address: "Sector 115",
    city: "Mohali",
    citySlug: "mohali",
    state: "Punjab",
    country: "India",
    latitude: 30.7,
    longitude: 76.7,
    totalArea: "25 acres",
    totalUnits: 100,
    availableUnits: 40,
    reservedUnits: 10,
    soldUnits: 50,
    comingSoonUnits: 5,
    priceMin: 4_200_000,
    priceMax: 9_300_000,
    sizeMin: 100,
    sizeMax: 200,
    sizeUnit: "sq-yd",
    possessionDate: "2027-12",
    amenities: ["Clubhouse", "Park"],
    galleryUrls: [],
    videoUrls: ["https://youtube.com/x"],
    brochureUrl: "https://example.com/brochure.pdf",
    paymentPlan: "20:80 CLP",
    faqs: [{ question: "RERA?", answer: "Yes registered." }],
    nearbyLandmarks: ["Airport 12km"],
    constructionUpdates: ["Phase 1 roads done"],
    masterPlanImageUrl: "/plan.png",
    virtualTourUrl: null,
    launchDate: "2026-01-01",
    floorPlanUrls: ["/fp1.pdf"],
    testimonials: [],
    isPublished: true,
    isFeatured: true,
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

describe("project data formatter", () => {
  it("includes rich fields in compact record", () => {
    const text = formatProjectRichRecord(sampleProject(), { compact: true, includeDescription: true });
    expect(text).toContain("Green Valley");
    expect(text).toContain("PBRERA123");
    expect(text).toContain("20:80 CLP");
    expect(text).toContain("Clubhouse");
    expect(text).toContain("Premium plotted");
  });

  it("finds project by partial name", () => {
    const hit = findProjectInCatalog(
      [sampleProject(), sampleProject({ name: "Gillco Valley", slug: "gillco-valley" })],
      "gillco"
    );
    expect(hit?.slug).toBe("gillco-valley");
  });

  it("builds catalog context for all projects", () => {
    const ctx = formatProjectsCatalogContext(null, [
      sampleProject(),
      sampleProject({ name: "Zirakpur Heights", citySlug: "zirakpur", slug: "zirakpur-heights", city: "Zirakpur" }),
    ]);
    expect(ctx).toContain("Full Tricity projects catalog (2 published)");
    expect(ctx).toContain("mohali");
    expect(ctx).toContain("zirakpur");
  });
});
