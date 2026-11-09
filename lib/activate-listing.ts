/** Listing fields needed on the activate / pay page. */

import { readGeopointFromPosition } from "@/lib/listing-plans";
import { timestampToMs, type OwnerListingSource } from "@/lib/owner-listing-lifecycle";

export interface ActivateListing {
  id: string;
  title: string;
  locationName: string;
  imageUrl: string;
  ownerUid: string;
  isActive: boolean;
  lat: number | null;
  lng: number | null;
  category: string;
  subCategory: string;
  urlSlug?: string;
  sourceCollection: OwnerListingSource;
  isRenewal: boolean;
  /** Current plan expiry (ms) — used to confirm a renewal actually extended it. */
  listingExpiresAtMs?: number;
}

/**
 * Whether a listing snapshot proves checkout succeeded.
 * New / re-list: the doc became active. Renew: the listing was already active, so
 * only a later expiry than the one seen at checkout counts (any other write,
 * e.g. a view-count bump, must not be read as payment success).
 */
export function isActivationConfirmed(
  listing: Pick<ActivateListing, "isActive" | "listingExpiresAtMs">,
  renewBaseline: { expiresAtMs: number | undefined } | null
): boolean {
  if (!listing.isActive) return false;
  if (!renewBaseline) return true;
  const next = listing.listingExpiresAtMs;
  if (next == null) return false;
  return renewBaseline.expiresAtMs == null || next > renewBaseline.expiresAtMs;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function firstString(arr: unknown): string {
  return Array.isArray(arr) && typeof arr[0] === "string" ? arr[0] : "";
}

function sanitizeImageUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const u = raw.trim();
  return u.startsWith("https://") ? u : "";
}

export function parseActivateListing(
  id: string,
  data: Record<string, unknown>,
  sourceCollection: OwnerListingSource = "listings"
): ActivateListing {
  const imageUrl = sanitizeImageUrl(
    firstString(data.imageThumbnails) ||
      firstString(data.imageIcons) ||
      firstString(data.imageUrls) ||
      firstString(data.imagesFull)
  );

  const coords = readGeopointFromPosition(data.position);
  const urlSlug = str(data.urlSlug).trim();

  return {
    id,
    title: str(data.title, "Untitled listing"),
    locationName: str(data.locationName),
    imageUrl,
    ownerUid: str(data.ownerUid),
    isActive: data.isActive === true,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    category: str(data.category),
    subCategory: str(data.subCategory),
    urlSlug: urlSlug || undefined,
    sourceCollection,
    isRenewal: sourceCollection === "deactivated_listings",
    listingExpiresAtMs: timestampToMs(data.listingExpiresAt),
  };
}
