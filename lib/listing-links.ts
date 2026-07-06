import { appPath } from "./config";
import { buildListingCanonicalPath } from "@/lib/seo/listing-seo";
import type { ListingSlugInput } from "./listing-slug";

export const LISTING_RETURN_PATH_KEY = "rp_listing_return";

/** Only allow same-origin relative return paths. */
export function safeReturnPath(from: string | null, fallback = "/search"): string {
  if (!from) return appPath(fallback);
  try {
    const decoded = decodeURIComponent(from);
    if (!decoded.startsWith("/") || decoded.startsWith("//")) {
      return appPath(fallback);
    }
    return appPath(decoded);
  } catch {
    return appPath(fallback);
  }
}

/** Store map/city return path before navigating to a listing (client-only). */
export function persistListingReturnPath(path: string): void {
  if (typeof window === "undefined") return;
  if (!path.startsWith("/") || path.startsWith("//")) return;
  try {
    sessionStorage.setItem(LISTING_RETURN_PATH_KEY, path);
  } catch {
    /* quota / private mode */
  }
}

export function readListingReturnPath(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(LISTING_RETURN_PATH_KEY);
  } catch {
    return null;
  }
}

/** Canonical listing detail href — never includes ?from= (use persistListingReturnPath). */
export function listingDetailHref(
  listing: ListingSlugInput | string,
  _returnPath?: string
): string {
  if (typeof listing === "string") {
    return appPath(`/listings/${listing}`);
  }
  return appPath(buildListingCanonicalPath(listing));
}

/** onClick handler for listing links that should restore back navigation. */
export function listingDetailNavigate(returnPath?: string): () => void {
  return () => {
    if (returnPath) persistListingReturnPath(returnPath);
  };
}
