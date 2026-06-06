import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getFirestorePostBySlug, getFirestorePosts } from "./blog-firestore";
import { estimateReadTime, slugify } from "./seo";
import type { BlogPost, BlogPostSummary } from "./blog-types";

export type { BlogPost, BlogPostSummary } from "./blog-types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

import { LEGACY_BLOG_SLUGS } from "./blog-legacy";

function resolveMdxSlug(filename: string, data: Record<string, unknown>): string {
  const fromFrontmatter =
    typeof data.slug === "string" && data.slug.trim() ? data.slug.trim() : null;
  if (fromFrontmatter) return fromFrontmatter;
  const base = filename.replace(/\.mdx$/, "");
  return LEGACY_BLOG_SLUGS[base] ?? slugify(base);
}

function parseMdxFile(filename: string): BlogPost | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  if (data.published === false) return null;

  const slug = resolveMdxSlug(filename, data as Record<string, unknown>);
  const tags = Array.isArray(data.tags)
    ? (data.tags as string[]).filter((t) => typeof t === "string")
    : undefined;
  return {
    slug,
    title: (data.title as string) ?? "",
    date: (data.date as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    category: (data.category as string) ?? "General",
    coverImage: (data.coverImage as string) ?? undefined,
    author: (data.author as string) ?? "RentalPins Team",
    readTime: (data.readTime as string) ?? estimateReadTime(content),
    content,
    source: "mdx",
    published: true,
    tags,
    metaTitle: (data.metaTitle as string) ?? undefined,
    metaDescription: (data.metaDescription as string) ?? undefined,
  };
}

/** File-based posts only (sync — used at build for static params). */
export function getMdxPosts(): BlogPostSummary[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const post = parseMdxFile(filename);
      if (!post) return null;
      const { content: _c, ...summary } = post;
      return summary;
    })
    .filter((p): p is BlogPostSummary => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getMdxPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) return null;

  const canonical = LEGACY_BLOG_SLUGS[slug] ?? slug;

  for (const filename of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))) {
    const post = parseMdxFile(filename);
    if (post && post.slug === canonical) return post;
  }
  return null;
}

/** All published posts — MDX + Firestore merged, deduped by slug (MDX wins). */
export async function getAllPosts(): Promise<BlogPostSummary[]> {
  const mdx = getMdxPosts();
  const firestore = await getFirestorePosts({ publishedOnly: true });
  const mdxSlugs = new Set(mdx.map((p) => p.slug));
  const merged = [...mdx, ...firestore.filter((p) => !mdxSlugs.has(p.slug))];
  return merged.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const canonical = LEGACY_BLOG_SLUGS[slug] ?? slug;
  const mdx = getMdxPostBySlug(canonical);
  if (mdx) return mdx;
  const firestore = await getFirestorePostBySlug(canonical);
  if (firestore?.published !== false) return firestore;
  return null;
}

export function isMdxSlugTaken(slug: string): boolean {
  return getMdxPosts().some((p) => p.slug === slug);
}

export function getStaticBlogSlugs(): string[] {
  return getMdxPosts().map((p) => p.slug);
}
