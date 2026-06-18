import { appPath } from "./config";
import { buildListingCanonicalPath } from "@/lib/seo/listing-seo";
import type { ListingSlugInput } from "./listing-slug";

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

export function listingDetailHref(
  listing: ListingSlugInput | string,
  returnPath?: string
): string {
  const base =
    typeof listing === "string"
      ? appPath(`/listings/${listing}`)
      : appPath(buildListingCanonicalPath(listing));
  if (!returnPath || !returnPath.startsWith("/") || returnPath.startsWith("//")) {
    return base;
  }
  return `${base}?from=${encodeURIComponent(returnPath)}`;
}
