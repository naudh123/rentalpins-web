import { appPath, siteUrl } from "./config";

/** Absolute canonical URL for a site path (respects basePath on staging). */
export function canonicalUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${appPath(p)}`;
}

/** URL-safe slug from title or filename. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Estimate read time from markdown/plain text. */
export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}
