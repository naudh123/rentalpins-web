/** Default OG / card image when blog cover is invalid or missing. */
export const DEFAULT_BLOG_OG_IMAGE = "/images/blog/rentalpins-default-og.jpg";

/** Site-wide fallback when blog default asset is not deployed. */
export const FALLBACK_OG_IMAGE = "/og-image.png";

const INVALID_HOST_PATTERNS = [
  /gemini\.google\.com/i,
  /chatgpt\.com/i,
  /chat\.openai\.com/i,
  /googleusercontent\.com\/a\//i,
  /accounts\.google\.com/i,
  /bard\.google\.com/i,
];

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)(\?|$)/i;

/** Reject AI-tool links, empty strings, and non-image URLs for blog covers. */
export function isValidBlogImageUrl(url: string | undefined | null): boolean {
  if (!url || !url.trim()) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("data:")) return trimmed.startsWith("data:image/");

  try {
    const parsed = new URL(trimmed, "https://www.rentalpins.com");
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    for (const pattern of INVALID_HOST_PATTERNS) {
      if (pattern.test(parsed.href)) return false;
    }
    const path = parsed.pathname.toLowerCase();
    return IMAGE_EXT.test(path) || path.includes("/image") || path.includes("/upload");
  } catch {
    if (trimmed.startsWith("/")) {
      return IMAGE_EXT.test(trimmed) || trimmed.includes("/images/");
    }
    return false;
  }
}

/** Resolved cover for OG, Twitter, cards, and Article schema. */
export function resolveBlogImageUrl(url: string | undefined | null): string {
  if (isValidBlogImageUrl(url)) return url!.trim();
  return DEFAULT_BLOG_OG_IMAGE;
}

/** Absolute URL for metadata and JSON-LD. */
export function resolveBlogImageAbsolute(
  url: string | undefined | null,
  siteOrigin: string,
  appPathFn: (path: string) => string
): string {
  const resolved = resolveBlogImageUrl(url);
  if (resolved.startsWith("http")) return resolved;
  return `${siteOrigin}${appPathFn(resolved)}`;
}
