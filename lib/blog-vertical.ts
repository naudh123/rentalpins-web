import {
  BUY_BLOG_CATEGORIES,
  BLOG_VERTICALS,
  RENT_BLOG_CATEGORIES,
  type BlogIndexFilter,
  type BlogVertical,
} from "@/lib/blog-config";
import type { BlogPostSummary } from "@/lib/blog-types";

export function parseBlogVertical(raw: unknown): BlogVertical {
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (BLOG_VERTICALS.includes(normalized as BlogVertical)) {
      return normalized as BlogVertical;
    }
  }
  return "rent";
}

export function categoriesForVertical(vertical: BlogVertical): readonly string[] {
  if (vertical === "buy") return BUY_BLOG_CATEGORIES;
  if (vertical === "neutral") {
    return [...RENT_BLOG_CATEGORIES, ...BUY_BLOG_CATEGORIES.filter((c) => c !== "General")];
  }
  return RENT_BLOG_CATEGORIES;
}

export function normalizeBlogCategory(value: string, vertical: BlogVertical): string {
  const trimmed = value.trim();
  if (!trimmed) return "General";
  const pool = categoriesForVertical(vertical);
  const match = pool.find((c) => c.toLowerCase() === trimmed.toLowerCase());
  if (match) return match;
  const rentMatch = RENT_BLOG_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  );
  if (rentMatch) return rentMatch;
  const buyMatch = BUY_BLOG_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  );
  if (buyMatch) return buyMatch;
  if (trimmed.toLowerCase() === "city guide") return "City Guides";
  return trimmed.slice(0, 60);
}

export function verticalLabel(vertical: BlogVertical): string {
  if (vertical === "buy") return "Buy & Sell";
  if (vertical === "neutral") return "Rent & Buy";
  return "Rentals";
}

export function verticalBadgeClass(vertical: BlogVertical): string {
  if (vertical === "buy") {
    return "bg-[color-mix(in_srgb,var(--sale-gold)_22%,white)] text-[var(--brand-navy)]";
  }
  if (vertical === "neutral") {
    return "bg-slate-100 text-slate-700";
  }
  return "bg-[#1E3A6E]/10 text-[#1E3A6E]";
}

export function filterPostsByIndex(
  posts: BlogPostSummary[],
  filter: BlogIndexFilter
): BlogPostSummary[] {
  if (filter === "all") return posts;
  if (filter === "buy") {
    return posts.filter((p) => p.vertical === "buy" || p.vertical === "neutral");
  }
  return posts.filter((p) => p.vertical === "rent" || p.vertical === "neutral");
}

export function blogIndexHref(vertical: BlogVertical): string {
  if (vertical === "buy") return "/blog/buy";
  if (vertical === "neutral") return "/blog/all";
  return "/blog";
}
