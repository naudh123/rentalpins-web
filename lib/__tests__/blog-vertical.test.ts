import { describe, expect, it } from "vitest";
import {
  categoriesForVertical,
  filterPostsByIndex,
  normalizeBlogCategory,
  parseBlogVertical,
  verticalLabel,
} from "@/lib/blog-vertical";
import type { BlogPostSummary } from "@/lib/blog-types";

function post(vertical: BlogPostSummary["vertical"]): BlogPostSummary {
  return {
    slug: `post-${vertical}`,
    title: "Test",
    date: "2026-01-01",
    excerpt: "Excerpt long enough for tests and summaries here.",
    vertical,
    category: "General",
  };
}

describe("blog vertical helpers", () => {
  it("parses vertical values with rent default", () => {
    expect(parseBlogVertical("buy")).toBe("buy");
    expect(parseBlogVertical("neutral")).toBe("neutral");
    expect(parseBlogVertical(undefined)).toBe("rent");
  });

  it("returns category pools per vertical", () => {
    expect(categoriesForVertical("buy")).toContain("Buyer Guides");
    expect(categoriesForVertical("rent")).toContain("Student Housing");
  });

  it("normalizes legacy city guide spelling", () => {
    expect(normalizeBlogCategory("City Guide", "rent")).toBe("City Guides");
  });

  it("filters index posts by lane", () => {
    const posts = [post("rent"), post("buy"), post("neutral")];
    expect(filterPostsByIndex(posts, "rent")).toHaveLength(2);
    expect(filterPostsByIndex(posts, "buy")).toHaveLength(2);
    expect(filterPostsByIndex(posts, "all")).toHaveLength(3);
  });

  it("labels verticals for UI", () => {
    expect(verticalLabel("buy")).toBe("Buy & Sell");
    expect(verticalLabel("rent")).toBe("Rentals");
  });
});
