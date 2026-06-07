import { slugify } from "@/lib/seo";

export interface BlogTocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

const MARKDOWN_INLINE = /\*\*|__|\*|_|`|\[|\]|\(|\)/g;

function stripMarkdownInline(text: string): string {
  return text.replace(MARKDOWN_INLINE, "").replace(/\s+/g, " ").trim();
}

function uniqueHeadingId(base: string, used: Map<string, number>): string {
  const slug = slugify(base) || "section";
  const count = used.get(slug) ?? 0;
  used.set(slug, count + 1);
  return count === 0 ? slug : `${slug}-${count + 1}`;
}

/** Extract H2/H3 headings from markdown/MDX body for table-of-contents links. */
export function extractBlogToc(content: string): BlogTocEntry[] {
  const entries: BlogTocEntry[] = [];
  const usedIds = new Map<string, number>();

  for (const line of content.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = stripMarkdownInline(match[2]);
    if (!text) continue;

    entries.push({
      id: uniqueHeadingId(text, usedIds),
      text,
      level,
    });
  }

  return entries;
}

export function shouldShowBlogToc(entries: BlogTocEntry[]): boolean {
  return entries.length >= 2;
}
