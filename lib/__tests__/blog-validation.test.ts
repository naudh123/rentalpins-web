import { describe, expect, it } from "vitest";
import {
  analyzeBlogSeo,
  generateExcerptFromContent,
  normalizeBlogPostBody,
  parseBlogFaqs,
  parseBlogTags,
  resolveMetaDescription,
} from "@/lib/blog-validation";

describe("parseBlogTags", () => {
  it("parses comma-separated tags and dedupes", () => {
    expect(parseBlogTags("PG, Chandigarh, pg")).toEqual(["PG", "Chandigarh"]);
  });

  it("caps tag count", () => {
    const tags = parseBlogTags(
      "a, b, c, d, e, f, g, h, i, j"
    );
    expect(tags.length).toBeLessThanOrEqual(8);
  });
});

describe("parseBlogFaqs", () => {
  it("parses q/a pairs and skips incomplete items", () => {
    expect(
      parseBlogFaqs([
        { q: "Is PG better?", a: "Often yes for first-year students." },
        { q: "Missing answer" },
        { question: "Shared flat?", answer: "Cheaper with friends." },
      ])
    ).toEqual([
      { q: "Is PG better?", a: "Often yes for first-year students." },
      { q: "Shared flat?", a: "Cheaper with friends." },
    ]);
  });
});

describe("generateExcerptFromContent", () => {
  it("strips markdown and truncates", () => {
    const excerpt = generateExcerptFromContent(
      "## Hello world\n\nThis is a **long** rental guide for students near CU.",
      40
    );
    expect(excerpt).not.toContain("##");
    expect(excerpt.length).toBeLessThanOrEqual(41);
  });
});

describe("normalizeBlogPostBody", () => {
  it("accepts valid publish payload", () => {
    const result = normalizeBlogPostBody({
      title: "Guide to PG near CU",
      excerpt: "A practical guide for students renting near Chandigarh University campus.",
      content: "x".repeat(120),
      vertical: "rent",
      slug: "guide-pg-near-cu",
      tags: "PG, Chandigarh",
      published: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.tags).toEqual(["PG", "Chandigarh"]);
      expect(result.data.published).toBe(true);
    }
  });

  it("allows shorter drafts", () => {
    const result = normalizeBlogPostBody({
      title: "Draft",
      excerpt: "",
      content: "Short draft body here.",
      published: false,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects publish without enough excerpt", () => {
    const result = normalizeBlogPostBody({
      title: "Guide to PG near CU",
      excerpt: "Too short",
      content: "x".repeat(120),
      published: true,
    });
    expect(result.ok).toBe(false);
  });
});

describe("analyzeBlogSeo", () => {
  it("uses meta description override in checks", () => {
    const metaDescription = "x".repeat(130);
    const checks = analyzeBlogSeo({
      title: "The Ultimate Guide to Renting Near Chandigarh University",
      excerpt: "Short",
      content: `${"word ".repeat(350)}## Section\n\nMore text`,
      vertical: "rent",
      category: "Student Housing",
      coverImage: "/images/cover.jpg",
      slug: "renting-near-cu",
      tags: ["PG", "Chandigarh"],
      metaTitle: "",
      metaDescription,
      published: true,
      faqs: [],
    });
    const metaCheck = checks.find((c) => c.id === "meta-description");
    expect(metaCheck?.pass).toBe(true);
  });
});

describe("resolveMetaDescription", () => {
  it("prefers custom meta description", () => {
    expect(resolveMetaDescription("excerpt", "custom meta")).toBe("custom meta");
  });
});
