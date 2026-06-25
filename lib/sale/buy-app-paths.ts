import { basePath } from "@/lib/config";

/** Canonical buy map route — sale mode is implicit (no transaction query param). */
export const BUY_SEARCH_PATH = "/buy/search";

export const BUY_POST_PATH = "/buy/post";

/** Buyer requirement board — Firestore `buyer_requirements` collection. */
export const BUY_REQUIREMENTS_PATH = "/buy/requirements";

/** Buy projects hub. */
export const BUY_PROJECTS_PATH = "/buy/projects";

/** Sale marketing funnels outside /buy — still use SaleShell, not rent AppShell. */
export const SALE_MARKETING_PREFIXES = [
  "/flats-for-sale",
  "/property-for-sale",
  "/commercial-property-for-sale",
  "/list-for-sale",
] as const;

function normalizeAppPathname(pathname: string | null): string {
  if (!pathname) return "/";
  if (basePath && pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length) || "/";
  }
  return pathname;
}

export function isBuySearchPath(pathname: string | null): boolean {
  const p = normalizeAppPathname(pathname);
  return p === BUY_SEARCH_PATH || p.startsWith(`${BUY_SEARCH_PATH}/`);
}

export function isBuyAppPath(pathname: string | null): boolean {
  const p = normalizeAppPathname(pathname);
  if (p === "/buy" || p.startsWith("/buy/")) return true;
  return SALE_MARKETING_PREFIXES.some(
    (prefix) => p === prefix || p.startsWith(`${prefix}/`)
  );
}

export function buyListingPath(slugSegment: string): string {
  return `/buy/listings/${slugSegment}`;
}
