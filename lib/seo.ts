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

/**
 * Join sentences into a meta description: drops repeated sentences
 * (hero copy often already says "Contact owners directly on RentalPins.")
 * and stops before `max` characters at a sentence boundary when possible.
 */
export function composeMetaDescription(parts: Array<string | null | undefined>, max = 158): string {
  const seen = new Set<string>();
  const sentences: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    for (const raw of part.match(/[^.!?]+[.!?]*/g) ?? []) {
      const s = raw.trim();
      if (!s) continue;
      const key = s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      sentences.push(/[.!?]$/.test(s) ? s : `${s}.`);
    }
  }
  let out = "";
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > max) break;
    out = next;
  }
  if (!out && sentences[0]) out = `${sentences[0].slice(0, max - 1).trimEnd()}…`;
  return out;
}
