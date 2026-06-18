import type { NextRequest } from "next/server";
import { FIREBASE_LISTING_ID_RE } from "@/lib/listing-slug";
import {
  cleanedListingSearchParams,
  listingPathNeedsSeoQueryCleanup,
} from "@/lib/listing-canonical";
import { LISTING_CATEGORY_SEGMENTS } from "@/lib/seo/listing-category-segments";

export interface ListingUrlNormalization {
  pathname: string;
  search: string;
}

const SEGMENT_PATTERN = LISTING_CATEGORY_SEGMENTS.join("|");

/** Matches segmented listing detail paths. */
const SEGMENTED_LISTING_RE = new RegExp(
  `^/(?:buy/property|rentals/(?:${SEGMENT_PATTERN}))/[^/]+$`
);

function isListingDetailPath(pathname: string): boolean {
  const decoded = pathname.replace(/\/+$/, "");
  if (/^\/listings\/[^/]+$/.test(decoded)) return true;
  if (/^\/buy\/listings\/[^/]+$/.test(decoded)) return true;
  if (SEGMENTED_LISTING_RE.test(decoded)) return true;
  return false;
}

/** Normalize trailing slash + strip tracking params on listing detail paths. */
export function normalizeListingRequestUrl(
  request: NextRequest
): ListingUrlNormalization | null {
  const { pathname } = request.nextUrl;
  const decoded = decodeListingPath(pathname);
  let normalizedPath = decoded;

  if (decoded.length > 1 && decoded.endsWith("/")) {
    normalizedPath = decoded.replace(/\/+$/, "") || "/";
  }

  const isLegacyRootId =
    normalizedPath.startsWith("/") &&
    !normalizedPath.slice(1).includes("/") &&
    FIREBASE_LISTING_ID_RE.test(normalizedPath.slice(1));

  if (!isListingDetailPath(normalizedPath) && !isLegacyRootId) {
    if (normalizedPath !== decoded) {
      return { pathname: normalizedPath, search: request.nextUrl.search };
    }
    return null;
  }

  const needsPathFix = normalizedPath !== decoded;
  const needsQueryFix = listingPathNeedsSeoQueryCleanup(request.nextUrl.searchParams);

  if (!needsPathFix && !needsQueryFix) return null;

  const clean = cleanedListingSearchParams(request.nextUrl.searchParams);
  return {
    pathname: normalizedPath,
    search: clean.toString() ? `?${clean.toString()}` : "",
  };
}

function decodeListingPath(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}
