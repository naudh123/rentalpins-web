import type { ListingDetail } from "@/lib/types/listing";
import { appPath, publicSiteUrl } from "@/lib/config";
import { LISTING_OG_HEIGHT, LISTING_OG_WIDTH } from "@/lib/listing-share-constants";

export const DEFAULT_LISTING_OG_IMAGE_PATH = "/og-default.jpg";

export const DEFAULT_LISTING_SHARE_TITLE = "Rental property on RentalPins";

export const DEFAULT_LISTING_SHARE_DESCRIPTION =
  "Find owner-direct rental properties on RentalPins.";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)(\?|$)/i;

/** True for public HTTPS listing photos (Firebase Storage, CDN, etc.). */
export function isValidListingCoverImageUrl(url: string | undefined | null): boolean {
  if (!url || !url.trim()) return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith("https://")) return false;

  try {
    const parsed = new URL(trimmed);
    const path = parsed.pathname.toLowerCase();
    return (
      IMAGE_EXT.test(path) ||
      path.includes("/image") ||
      parsed.hostname.includes("firebasestorage.googleapis.com") ||
      parsed.hostname.includes("googleusercontent.com")
    );
  } catch {
    return false;
  }
}

/** First listing cover photo suitable for link previews (WhatsApp, Facebook, X). */
export function pickListingCoverImageUrl(
  listing: ListingDetail | null | undefined
): string | null {
  if (!listing) return null;

  const candidates = [
    listing.imageUrls?.[0],
    listing.imageUrl,
    ...(listing.imageUrls?.slice(1) ?? []),
  ];

  for (const raw of candidates) {
    if (typeof raw !== "string") continue;
    const url = raw.trim();
    if (isValidListingCoverImageUrl(url)) return url;
  }

  return null;
}

export function defaultListingOgImageAbsoluteUrl(): string {
  return `${publicSiteUrl()}${appPath(DEFAULT_LISTING_OG_IMAGE_PATH)}`;
}

/** Stable, WhatsApp-safe preview image on RentalPins (1200×630 JPEG). */
export function listingSocialPreviewImageAbsoluteUrl(
  listing: ListingDetail | Pick<ListingDetail, "id">
): string {
  return `${publicSiteUrl()}${appPath(`/api/listing-og/${listing.id}`)}`;
}

/** Absolute OG preview image — optimized social JPEG, else site default. */
export function resolveListingOgImageAbsoluteUrl(
  listing: ListingDetail | null | undefined
): string {
  if (listing?.id && pickListingCoverImageUrl(listing)) {
    return listingSocialPreviewImageAbsoluteUrl(listing);
  }
  return defaultListingOgImageAbsoluteUrl();
}

/**
 * Relative path to a generated OG image on the listing's canonical route.
 * Use when you want a branded 1200×630 card instead of the raw cover photo.
 */
export function listingGeneratedOgImagePath(canonicalPath: string): string {
  return `${appPath(canonicalPath)}/opengraph-image`;
}

export function listingGeneratedOgImageAbsoluteUrl(canonicalPath: string): string {
  return `${publicSiteUrl()}${listingGeneratedOgImagePath(canonicalPath)}`;
}

export function listingOgImageMetadataDimensions(): {
  width: number;
  height: number;
} {
  return { width: LISTING_OG_WIDTH, height: LISTING_OG_HEIGHT };
}

function inferOgImageMimeType(url: string): string | undefined {
  const lower = url.toLowerCase();
  if (lower.includes(".png")) return "image/png";
  if (lower.includes(".webp")) return "image/webp";
  if (lower.includes(".gif")) return "image/gif";
  if (lower.includes(".jpg") || lower.includes(".jpeg")) return "image/jpeg";
  if (url.includes("firebasestorage.googleapis.com")) return "image/jpeg";
  return undefined;
}

export function listingOgImageOpenGraphEntry(listing: ListingDetail | null | undefined): {
  url: string;
  width: number;
  height: number;
  alt: string;
  type?: string;
} {
  const url = resolveListingOgImageAbsoluteUrl(listing);
  const { width, height } = listingOgImageMetadataDimensions();
  const title =
    listing?.title?.trim() || DEFAULT_LISTING_SHARE_TITLE;
  const type =
    url.includes("/api/listing-og/")
      ? "image/jpeg"
      : inferOgImageMimeType(url);

  return {
    url,
    width,
    height,
    alt: `${title} on RentalPins`,
    ...(type ? { type } : {}),
  };
}
