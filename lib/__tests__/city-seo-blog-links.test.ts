import { describe, expect, it } from "vitest";
import { pickCitySeoBlogPosts } from "@/lib/seo/city-seo-blog-links";
import type { BlogPostSummary } from "@/lib/blog-types";

function post(
  slug: string,
  overrides: Partial<BlogPostSummary> = {}
): BlogPostSummary {
  return {
    slug,
    title: slug,
    date: "2026-06-01",
    excerpt: "Excerpt",
    category: "City Guide",
    ...overrides,
  };
}

const pool: BlogPostSummary[] = [
  post("pg-vs-flat-chandigarh-students", {
    tags: ["Chandigarh", "Mohali", "PG", "Students"],
  }),
  post("vehicle-rental-chandigarh-guide", {
    tags: ["Chandigarh", "Mohali", "Vehicles"],
    date: "2026-04-15",
  }),
  post("mohali-it-park-rental-guide", {
    tags: ["Mohali", "PG", "Students"],
  }),
  post("kharar-pg-guide-chandigarh-university", {
    tags: ["Kharar", "PG", "Students"],
  }),
  post("how-to-find-room-ludhiana", {
    tags: ["Ludhiana", "PG", "Students"],
  }),
  post("delhi-rentals-without-broker-guide", {
    tags: ["Delhi", "PG", "Students"],
  }),
  post("why-renting-locally-beats-buying", {
    category: "Renting Smart",
    tags: ["renting", "P2P rental"],
    date: "2025-04-25",
  }),
];

describe("pickCitySeoBlogPosts", () => {
  it("returns featured Chandigarh guides first", () => {
    const guides = pickCitySeoBlogPosts("in/chandigarh", pool, 2);
    expect(guides.map((item) => item.slug)).toEqual([
      "pg-vs-flat-chandigarh-students",
      "vehicle-rental-chandigarh-guide",
    ]);
  });

  it("returns Mohali IT Park guide for Mohali money page", () => {
    const guides = pickCitySeoBlogPosts("in/chandigarh/mohali", pool, 2);
    expect(guides[0]?.slug).toBe("mohali-it-park-rental-guide");
  });

  it("returns Kharar CU guide for Kharar money page", () => {
    const guides = pickCitySeoBlogPosts("in/chandigarh/kharar", pool, 1);
    expect(guides.map((item) => item.slug)).toEqual([
      "kharar-pg-guide-chandigarh-university",
    ]);
  });

  it("returns Ludhiana and Delhi guides for respective hubs", () => {
    expect(
      pickCitySeoBlogPosts("in/ludhiana", pool)[0]?.slug
    ).toBe("how-to-find-room-ludhiana");
    expect(
      pickCitySeoBlogPosts("in/delhi", pool)[0]?.slug
    ).toBe("delhi-rentals-without-broker-guide");
  });
});
