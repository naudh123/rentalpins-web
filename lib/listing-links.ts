import { appPath } from "./config";

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

export function listingDetailHref(listingId: string, returnPath?: string): string {
  const base = appPath(`/listings/${listingId}`);
  if (!returnPath || !returnPath.startsWith("/") || returnPath.startsWith("//")) {
    return base;
  }
  return `${base}?from=${encodeURIComponent(returnPath)}`;
}
