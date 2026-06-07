import { describe, expect, it } from "vitest";
import { pickRelatedPosts } from "@/lib/blog-related";
import type { BlogPostSummary } from "@/lib/blog-types";

function post(
  slug: string,
  overrides: Partial<BlogPostSummary> = {}
): BlogPostSummary {
  return {
    slug,
    title: slug,
    date: "2026-01-01",
    excerpt: "Excerpt",
    category: "General",
    ...overrides,
  };
}

describe("pickRelatedPosts", () => {
  const current = post("current", {
    category: "City Guides",
    tags: ["Chandigarh", "Students"],
  });

  const pool = [
    current,
    post("same-category", { category: "City Guides", date: "2026-02-01" }),
    post("shared-tags", {
      category: "PG & Flats",
      tags: ["Chandigarh"],
      date: "2026-03-01",
    }),
    post("unrelated", { category: "Vehicle Rental", tags: ["Cars"] }),
  ];

  it("prefers same category and overlapping tags", () => {
    const related = pickRelatedPosts(current, pool, 2);
    expect(related.map((item) => item.slug)).toEqual([
      "same-category",
      "shared-tags",
    ]);
  });

  it("excludes the current post and unrelated items", () => {
    const related = pickRelatedPosts(current, pool, 3);
    expect(related.some((item) => item.slug === "current")).toBe(false);
    expect(related.some((item) => item.slug === "unrelated")).toBe(false);
  });
});
