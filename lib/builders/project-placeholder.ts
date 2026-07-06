import type { BrandTheme } from "@/lib/builders/brand-themes";

/** Default RentalPins placeholder colours baked into seeded catalog images. */
export const DEFAULT_PLACEHOLDER_BG = "1E3A6E";
export const DEFAULT_PLACEHOLDER_FG = "C9A227";

/** True when the URL is a generic seeded placeholder (same navy/gold for every builder). */
export function isGenericProjectPlaceholder(url?: string | null): boolean {
  if (!url?.trim()) return true;
  const lower = url.toLowerCase();
  if (!lower.includes("placehold.co")) return false;
  return (
    lower.includes(`${DEFAULT_PLACEHOLDER_BG.toLowerCase()}/${DEFAULT_PLACEHOLDER_FG.toLowerCase()}`) ||
    lower.includes(`${DEFAULT_PLACEHOLDER_BG.toLowerCase()}/${DEFAULT_PLACEHOLDER_FG.toLowerCase()}?`)
  );
}

const UNRELIABLE_HERO_PATTERNS = [
  "housing.com/static/img/placeholder",
  "ghar.tv/images/default",
  "placeholder-project",
  "via.placeholder.com",
  "gillcogroup.com/images/",
];

/** Broken, generic, or tiny placeholder images — prefer branded gradient instead. */
export function isUnreliableHeroUrl(url?: string | null): boolean {
  if (!url?.trim()) return true;
  if (isGenericProjectPlaceholder(url)) return true;
  const lower = url.toLowerCase();
  return UNRELIABLE_HERO_PATTERNS.some((p) => lower.includes(p));
}

/** Returns a real image URL, or null when the UI should render a branded gradient block. */
export function resolveProjectDisplayImage(
  imageUrl: string | undefined | null
): string | null {
  if (!imageUrl?.trim()) return null;
  if (isGenericProjectPlaceholder(imageUrl)) return null;
  return imageUrl;
}

/** Branded placeholder for OG / schema when no real photo exists. */
export function brandPlaceholderUrl(
  label: string,
  theme: BrandTheme,
  w = 1200,
  h = 630
): string {
  const bg = theme.primary.replace("#", "");
  const fg = theme.accent.replace("#", "");
  return `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(label)}`;
}
