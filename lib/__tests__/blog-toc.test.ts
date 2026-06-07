import { describe, expect, it } from "vitest";
import { extractBlogToc, shouldShowBlogToc } from "@/lib/blog-toc";

describe("extractBlogToc", () => {
  it("collects h2 and h3 headings in order", () => {
    const toc = extractBlogToc(`
Intro paragraph

## PG Accommodation

Some text

### Shared rooms

More text

## Independent Flat
`);

    expect(toc).toEqual([
      { id: "pg-accommodation", text: "PG Accommodation", level: 2 },
      { id: "shared-rooms", text: "Shared rooms", level: 3 },
      { id: "independent-flat", text: "Independent Flat", level: 2 },
    ]);
  });

  it("deduplicates identical heading text", () => {
    const toc = extractBlogToc(`## Overview\n\n## Overview\n`);
    expect(toc.map((entry) => entry.id)).toEqual(["overview", "overview-2"]);
  });

  it("requires at least two headings before showing toc", () => {
    expect(shouldShowBlogToc(extractBlogToc("## Only one"))).toBe(false);
    expect(
      shouldShowBlogToc(extractBlogToc("## One\n\n## Two"))
    ).toBe(true);
  });
});
