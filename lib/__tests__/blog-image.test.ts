import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  PUBLIC_IMAGE_FILES,
  generatedBlogCoverPath,
  isValidBlogImageUrl,
  resolveBlogImageAbsolute,
  resolveBlogImageUrl,
} from "@/lib/blog-image";
import { getMdxPosts } from "@/lib/blog";

function listPublicImages(dir: string, base = ""): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = `${base}/${entry.name}`;
    if (entry.isDirectory()) out.push(...listPublicImages(path.join(dir, entry.name), rel));
    else if (/\.(jpe?g|png|gif|webp|avif)$/i.test(entry.name)) out.push(rel);
  }
  return out;
}

describe("blog-image", () => {
  it("PUBLIC_IMAGE_FILES matches the images in /public", () => {
    const actual = listPublicImages(path.join(process.cwd(), "public")).sort();
    expect([...PUBLIC_IMAGE_FILES].sort()).toEqual(actual);
  });

  it("rejects search thumbnails and local files that do not exist", () => {
    expect(
      isValidBlogImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:abc&s=10")
    ).toBe(false);
    expect(isValidBlogImageUrl("/images/blog/article-1-cover.jpg")).toBe(false);
    expect(isValidBlogImageUrl("/og-image.png")).toBe(true);
    expect(isValidBlogImageUrl("https://images.unsplash.com/photo-1460317442991-0ec209397118")).toBe(true);
  });

  it("falls back to the post's generated cover when the slug is known", () => {
    expect(resolveBlogImageUrl(undefined, "pg-guide")).toBe("/blog/pg-guide/cover");
    expect(resolveBlogImageUrl("https://gemini.google.com/app/x", "pg-guide")).toBe(
      generatedBlogCoverPath("pg-guide")
    );
    expect(
      resolveBlogImageAbsolute("", "https://www.rentalpins.com", (p) => p, "pg-guide")
    ).toBe("https://www.rentalpins.com/blog/pg-guide/opengraph-image");
    expect(resolveBlogImageUrl("https://cdn.example.com/a.jpg", "pg-guide")).toBe(
      "https://cdn.example.com/a.jpg"
    );
  });

  it("every MDX post resolves to an image that exists", () => {
    for (const post of getMdxPosts()) {
      const url = resolveBlogImageUrl(post.coverImage, post.slug);
      if (url.startsWith("/") && !url.startsWith("/blog/")) {
        expect(PUBLIC_IMAGE_FILES, `${post.slug} cover ${url}`).toContain(url);
      }
      expect(url).not.toBe("");
    }
  });
});
