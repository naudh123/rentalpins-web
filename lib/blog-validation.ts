import { BLOG_CATEGORIES, BLOG_LIMITS } from "./blog-config";
import type { BlogFaqItem } from "./blog-types";
import { estimateReadTime, slugify } from "./seo";

export type { BlogFaqItem } from "./blog-types";

export interface BlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  slug: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  faqs: BlogFaqItem[];
}

export interface BlogSeoCheck {
  id: string;
  label: string;
  pass: boolean;
  hint?: string;
}

function trimString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCategory(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "General";
  const match = BLOG_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  );
  return match ?? trimmed.slice(0, 60);
}

/** Parse comma- or newline-separated tags into a deduped list. */
export function parseBlogTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return dedupeTags(raw.map((t) => (typeof t === "string" ? t : "")));
  }
  if (typeof raw !== "string") return [];
  return dedupeTags(raw.split(/[,;\n]+/));
}

function dedupeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of tags) {
    const cleaned = tag.trim().replace(/\s+/g, " ");
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned.slice(0, BLOG_LIMITS.tagMaxLength));
    if (out.length >= BLOG_LIMITS.tagsMax) break;
  }
  return out;
}

/** Parse FAQ pairs from API/editor payloads (supports q/a or question/answer keys). */
export function parseBlogFaqs(raw: unknown): BlogFaqItem[] {
  if (!Array.isArray(raw)) return [];
  const out: BlogFaqItem[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const q = trimString(record.q ?? record.question);
    const a = trimString(record.a ?? record.answer);
    if (!q || !a) continue;

    out.push({
      q: q.slice(0, BLOG_LIMITS.faqQuestionMax),
      a: a.slice(0, BLOG_LIMITS.faqAnswerMax),
    });
    if (out.length >= BLOG_LIMITS.faqsMax) break;
  }

  return out;
}

export function isValidCoverImageUrl(value: string): boolean {
  if (!value) return true;
  if (value.startsWith("/")) return value.length <= 500;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function countMarkdownHeadings(content: string): number {
  return (content.match(/^#{1,3}\s+/gm) ?? []).length;
}

/** First paragraph or sentence slice for meta description fallback. */
export function generateExcerptFromContent(content: string, maxLen = 160): string {
  const plain = content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (!plain) return "";
  if (plain.length <= maxLen) return plain;
  const slice = plain.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

export function resolveMetaTitle(title: string, metaTitle: string): string {
  const mt = metaTitle.trim();
  return mt || title.trim();
}

export function resolveMetaDescription(
  excerpt: string,
  metaDescription: string
): string {
  const md = metaDescription.trim();
  return md || excerpt.trim();
}

export function analyzeBlogSeo(input: BlogPostInput): BlogSeoCheck[] {
  const metaTitle = resolveMetaTitle(input.title, input.metaTitle);
  const metaDescription = resolveMetaDescription(
    input.excerpt,
    input.metaDescription
  );
  const words = countWords(input.content);
  const headings = countMarkdownHeadings(input.content);

  return [
    {
      id: "title",
      label: "Title length (30–60 chars ideal)",
      pass:
        input.title.length >= BLOG_LIMITS.titleMin &&
        input.title.length <= BLOG_LIMITS.titleMax,
      hint: `${input.title.length} characters`,
    },
    {
      id: "meta-title",
      label: "SEO title ≤ 70 characters",
      pass: metaTitle.length > 0 && metaTitle.length <= BLOG_LIMITS.metaTitleMax,
      hint: `${metaTitle.length} characters`,
    },
    {
      id: "meta-description",
      label: "Meta description 120–160 characters",
      pass:
        metaDescription.length >= 120 &&
        metaDescription.length <= BLOG_LIMITS.metaDescriptionMax,
      hint: `${metaDescription.length} characters`,
    },
    {
      id: "slug",
      label: "URL slug is short and readable",
      pass:
        input.slug.length >= BLOG_LIMITS.slugMin &&
        input.slug.length <= BLOG_LIMITS.slugMax &&
        input.slug === slugify(input.slug),
      hint: input.slug || "Add a slug",
    },
    {
      id: "headings",
      label: "At least one H2/H3 heading in content",
      pass: headings >= 1,
      hint: `${headings} heading(s) found`,
    },
    {
      id: "word-count",
      label: "Content at least 300 words",
      pass: words >= 300,
      hint: `${words} words`,
    },
    {
      id: "cover",
      label: "Cover image set (better social previews)",
      pass: Boolean(input.coverImage),
    },
    {
      id: "tags",
      label: "At least 2 topic tags",
      pass: input.tags.length >= 2,
      hint: `${input.tags.length} tag(s)`,
    },
    {
      id: "faqs",
      label: "5–8 manual FAQs (recommended for rich results)",
      pass: input.faqs.length >= 5 && input.faqs.length <= BLOG_LIMITS.faqsMax,
      hint: `${input.faqs.length} FAQ(s)`,
    },
  ];
}

function pushError(errors: string[], message: string) {
  errors.push(message);
}

export function normalizeBlogPostBody(
  body: Record<string, unknown>,
  options?: { published?: boolean }
): { ok: true; data: BlogPostInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const published =
    typeof options?.published === "boolean"
      ? options.published
      : body.published === true;

  const title = trimString(body.title);
  let excerpt = trimString(body.excerpt);
  const content = trimString(body.content);
  const category = normalizeCategory(trimString(body.category) || "General");
  const coverImage = trimString(body.coverImage);
  const metaTitle = trimString(body.metaTitle);
  const metaDescription = trimString(body.metaDescription);
  const tags = parseBlogTags(body.tags);
  const faqs = parseBlogFaqs(body.faqs);
  const rawSlug = trimString(body.slug);
  const slug = rawSlug ? slugify(rawSlug) : slugify(title);

  if (
    published &&
    excerpt.length < BLOG_LIMITS.excerptMin &&
    metaDescription.length >= BLOG_LIMITS.excerptMin
  ) {
    excerpt = metaDescription.slice(0, BLOG_LIMITS.excerptMax);
  }

  if (title.length < BLOG_LIMITS.titleMin || title.length > BLOG_LIMITS.titleMax) {
    pushError(
      errors,
      `Title must be ${BLOG_LIMITS.titleMin}–${BLOG_LIMITS.titleMax} characters.`
    );
  }

  if (metaTitle.length > BLOG_LIMITS.metaTitleMax) {
    pushError(
      errors,
      `SEO title must be at most ${BLOG_LIMITS.metaTitleMax} characters.`
    );
  }

  if (published) {
    if (
      excerpt.length < BLOG_LIMITS.excerptMin ||
      excerpt.length > BLOG_LIMITS.excerptMax
    ) {
      pushError(
        errors,
        `Excerpt must be ${BLOG_LIMITS.excerptMin}–${BLOG_LIMITS.excerptMax} characters.`
      );
    }
    if (content.length < BLOG_LIMITS.contentMinPublish) {
      pushError(
        errors,
        `Content must be at least ${BLOG_LIMITS.contentMinPublish} characters to publish.`
      );
    }
  } else {
    if (title.length < 3) {
      pushError(errors, "Draft title must be at least 3 characters.");
    }
    if (content.length < BLOG_LIMITS.contentMinDraft) {
      pushError(
        errors,
        `Draft content must be at least ${BLOG_LIMITS.contentMinDraft} characters.`
      );
    }
    if (excerpt.length > BLOG_LIMITS.excerptMax) {
      pushError(
        errors,
        `Excerpt must be at most ${BLOG_LIMITS.excerptMax} characters.`
      );
    }
  }

  if (metaDescription.length > BLOG_LIMITS.metaDescriptionMax) {
    pushError(
      errors,
      `Meta description must be at most ${BLOG_LIMITS.metaDescriptionMax} characters.`
    );
  }

  if (!slug || slug.length < BLOG_LIMITS.slugMin || slug.length > BLOG_LIMITS.slugMax) {
    pushError(
      errors,
      `URL slug must be ${BLOG_LIMITS.slugMin}–${BLOG_LIMITS.slugMax} characters.`
    );
  }

  if (rawSlug && slug !== slugify(rawSlug)) {
    pushError(errors, "URL slug may only contain letters, numbers, and hyphens.");
  }

  if (!isValidCoverImageUrl(coverImage)) {
    pushError(errors, "Cover image must be a valid http(s) URL or site path.");
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      title,
      excerpt,
      content,
      category,
      coverImage,
      slug,
      tags,
      metaTitle,
      metaDescription,
      published,
      faqs,
    },
  };
}

export function blogReadTimeLabel(content: string): string {
  return estimateReadTime(content);
}
