/** Site-wide brand image (public/og-image.png, 1920×1080). */
export const FALLBACK_OG_IMAGE = "/og-image.png";

/** Default hero / OG / card image when no slug is known and the cover is invalid or missing. */
export const DEFAULT_BLOG_OG_IMAGE = FALLBACK_OG_IMAGE;

/**
 * Image files that actually ship in /public. A site-relative cover that is not in
 * this list (e.g. "/images/blog/x.jpg" that was never committed) would 404, so it
 * is treated as missing. Kept in sync with /public by a unit test.
 */
export const PUBLIC_IMAGE_FILES: readonly string[] = [
  "/og-image.png",
  "/logo/logo-buy.png",
  "/logo/logo-full.png",
  "/logo/logo-pin.png",
  "/logo/logo-stack.png",
  "/logo/logo-wordmark.png",
  "/logo/logo.png",
  "/logo/logo2.png",
];

const INVALID_HOST_PATTERNS = [
  /gemini\.google\.com/i,
  /chatgpt\.com/i,
  /chat\.openai\.com/i,
  /googleusercontent\.com\/a\//i,
  /accounts\.google\.com/i,
  /bard\.google\.com/i,
  // Google Image Search thumbnails: tiny, hotlinked, and not licensed for reuse.
  /encrypted-tbn\d*\.gstatic\.com/i,
];

/** Image CDNs whose URLs often have no file extension. */
const TRUSTED_IMAGE_HOSTS = [
  /(^|.)images.unsplash.com$/i,
  /(^|.)images.pexels.com$/i,
  /(^|.)res.cloudinary.com$/i,
  /(^|.)firebasestorage.googleapis.com$/i,
  /(^|.)storage.googleapis.com$/i,
];

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)(\?|$)/i;

/** Reject AI-tool links, search thumbnails, missing local files and non-image URLs. */
export function isValidBlogImageUrl(url: string | undefined | null): boolean {
  if (!url || !url.trim()) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("data:")) return trimmed.startsWith("data:image/");

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    const pathOnly = trimmed.split(/[?#]/)[0];
    return PUBLIC_IMAGE_FILES.includes(pathOnly);
  }

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    for (const pattern of INVALID_HOST_PATTERNS) {
      if (pattern.test(parsed.href)) return false;
    }
    if (TRUSTED_IMAGE_HOSTS.some((h) => h.test(parsed.hostname))) return true;
    const path = parsed.pathname.toLowerCase();
    return IMAGE_EXT.test(path) || path.includes("/image") || path.includes("/upload");
  } catch {
    return false;
  }
}

/** Per-post illustrated cover (app/blog/[slug]/cover), 1200×750 — hero and cards. */
export function generatedBlogCoverPath(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}/cover`;
}

/** Per-post social card with the headline (app/blog/[slug]/opengraph-image), 1200×630. */
export function generatedBlogOgImagePath(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}/opengraph-image`;
}

/**
 * Cover for the article hero and blog cards. Posts without a usable cover get
 * their own illustrated cover (when the slug is known) instead of the generic
 * site image.
 */
export function resolveBlogImageUrl(
  url: string | undefined | null,
  slug?: string
): string {
  if (isValidBlogImageUrl(url)) return url!.trim();
  return slug ? generatedBlogCoverPath(slug) : DEFAULT_BLOG_OG_IMAGE;
}

/**
 * Absolute URL for OG/Twitter metadata and Article JSON-LD. Posts without a
 * usable cover use their generated social card (headline + map art).
 */
export function resolveBlogImageAbsolute(
  url: string | undefined | null,
  siteOrigin: string,
  appPathFn: (path: string) => string,
  slug?: string
): string {
  const resolved = isValidBlogImageUrl(url)
    ? url!.trim()
    : slug
      ? generatedBlogOgImagePath(slug)
      : DEFAULT_BLOG_OG_IMAGE;
  if (resolved.startsWith("http")) return resolved;
  return `${siteOrigin}${appPathFn(resolved)}`;
}
