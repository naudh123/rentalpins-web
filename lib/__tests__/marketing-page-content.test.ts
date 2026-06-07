import { describe, expect, it } from "vitest";
import {
  countMarketingPageWords,
  enrichMarketingPageConfig,
  PRIORITY_BROKER_LANDING_SLUGS,
  PRIORITY_PG_LANDING_SLUGS,
  PRIORITY_SECONDARY_LANDING_SLUGS,
  PRIORITY_CATEGORY_LANDING_SLUGS,
  PRIORITY_APP_LANDING_SLUGS,
} from "@/lib/seo/marketing-page-content";
import {
  marketingLandingPlaceName,
  pickMarketingLandingBlogPosts,
} from "@/lib/seo/marketing-broker-blog-links";
import { getMdxPosts } from "@/lib/blog";
import {
  COMPETITOR_PAGES,
  INDUSTRIAL_PAGES,
  NEAR_ME_PAGES,
  STUDENT_RENTAL_PAGES,
  WITHOUT_BROKER_PAGES,
  CATEGORY_LANDING_PAGES,
  APP_DOWNLOAD_PAGES,
} from "@/lib/seo/marketing-pages";

function pageConfig(slug: string) {
  return (
    WITHOUT_BROKER_PAGES[slug] ??
    STUDENT_RENTAL_PAGES[slug] ??
    NEAR_ME_PAGES[slug] ??
    COMPETITOR_PAGES[slug] ??
    INDUSTRIAL_PAGES[slug] ??
    CATEGORY_LANDING_PAGES[slug] ??
    APP_DOWNLOAD_PAGES[slug]
  );
}

describe("marketing page content", () => {
  it("enriches priority broker landings with long-form sections", () => {
    for (const slug of PRIORITY_BROKER_LANDING_SLUGS) {
      const base = WITHOUT_BROKER_PAGES[slug];
      expect(base).toBeDefined();
      const enriched = enrichMarketingPageConfig(base!);
      expect(enriched.sections?.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("enriches priority PG landings with long-form sections", () => {
    for (const slug of PRIORITY_PG_LANDING_SLUGS) {
      const base = STUDENT_RENTAL_PAGES[slug];
      expect(base).toBeDefined();
      const enriched = enrichMarketingPageConfig(base!);
      expect(enriched.sections?.length).toBeGreaterThanOrEqual(6);
    }
  });

  it("keeps priority broker landings above thin-content floor", () => {
    for (const slug of PRIORITY_BROKER_LANDING_SLUGS) {
      const enriched = enrichMarketingPageConfig(WITHOUT_BROKER_PAGES[slug]!);
      expect(countMarketingPageWords(enriched)).toBeGreaterThanOrEqual(650);
    }
  });

  it("keeps priority PG landings above thin-content floor", () => {
    for (const slug of PRIORITY_PG_LANDING_SLUGS) {
      const enriched = enrichMarketingPageConfig(STUDENT_RENTAL_PAGES[slug]!);
      expect(countMarketingPageWords(enriched)).toBeGreaterThanOrEqual(650);
    }
  });

  it("enriches secondary landings with long-form sections", () => {
    for (const slug of PRIORITY_SECONDARY_LANDING_SLUGS) {
      const base = pageConfig(slug);
      expect(base).toBeDefined();
      const enriched = enrichMarketingPageConfig(base!);
      expect(enriched.sections?.length).toBeGreaterThanOrEqual(7);
    }
  });

  it("keeps secondary landings above thin-content floor", () => {
    for (const slug of PRIORITY_SECONDARY_LANDING_SLUGS) {
      const enriched = enrichMarketingPageConfig(pageConfig(slug)!);
      expect(countMarketingPageWords(enriched)).toBeGreaterThanOrEqual(650);
    }
  });

  it("enriches category funnel landings with long-form sections", () => {
    for (const slug of PRIORITY_CATEGORY_LANDING_SLUGS) {
      const base = CATEGORY_LANDING_PAGES[slug];
      expect(base).toBeDefined();
      const enriched = enrichMarketingPageConfig(base!);
      expect(enriched.sections?.length).toBeGreaterThanOrEqual(7);
    }
  });

  it("keeps category funnel landings above thin-content floor", () => {
    for (const slug of PRIORITY_CATEGORY_LANDING_SLUGS) {
      const enriched = enrichMarketingPageConfig(CATEGORY_LANDING_PAGES[slug]!);
      expect(countMarketingPageWords(enriched)).toBeGreaterThanOrEqual(650);
    }
  });

  it("enriches app download landings with long-form sections", () => {
    for (const slug of PRIORITY_APP_LANDING_SLUGS) {
      const base = APP_DOWNLOAD_PAGES[slug];
      expect(base).toBeDefined();
      const enriched = enrichMarketingPageConfig(base!);
      expect(enriched.sections?.length).toBeGreaterThanOrEqual(7);
    }
  });

  it("keeps app download landings above thin-content floor", () => {
    for (const slug of PRIORITY_APP_LANDING_SLUGS) {
      const enriched = enrichMarketingPageConfig(APP_DOWNLOAD_PAGES[slug]!);
      expect(countMarketingPageWords(enriched)).toBeGreaterThanOrEqual(650);
    }
  });

  it("links city broker pages to featured blog guides", () => {
    const posts = getMdxPosts();
    const delhiGuides = pickMarketingLandingBlogPosts(
      "property-without-broker-delhi",
      posts,
      2
    );
    expect(delhiGuides.map((post) => post.slug)).toContain(
      "delhi-rentals-without-broker-guide"
    );
    expect(marketingLandingPlaceName("property-without-broker-mohali")).toBe("Mohali");
  });

  it("links CU PG landing to Kharar blog guides", () => {
    const posts = getMdxPosts();
    const cuGuides = pickMarketingLandingBlogPosts(
      "pg-near-chandigarh-university",
      posts,
      2
    );
    expect(cuGuides.map((post) => post.slug)).toContain(
      "kharar-pg-guide-chandigarh-university"
    );
    expect(marketingLandingPlaceName("pg-near-chandigarh-university")).toBe(
      "Kharar / CU"
    );
  });
});
