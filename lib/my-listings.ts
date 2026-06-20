/** Owner's listing row (includes inactive drafts). */

import { parseTransactionType, type TransactionType } from "@/lib/transaction-type";
import {
  deriveOwnerListingStatus,
  isUnpaidDraft,
  timestampToMs,
  type OwnerListingSource,
  type OwnerListingStatus,
} from "@/lib/owner-listing-lifecycle";

export type { OwnerListingStatus, OwnerListingSource };

export interface OwnerListing {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  category: string;
  locationName: string;
  imageUrl: string;
  isActive: boolean;
  status: OwnerListingStatus;
  sourceCollection: OwnerListingSource;
  isPromoted: boolean;
  isUnpaidDraft: boolean;
  viewsCount: number;
  inquiryCount: number;
  transactionType: TransactionType;
  currentPlanName?: string;
  listingExpiresAtMs?: number;
  listingDeleteAtMs?: number;
  promoExpiresAtMs?: number;
  leaseEndAtMs?: number;
  deactivatedAtMs?: number;
  homeIso?: string;
  createdAtMs: number;
  lat?: number;
  lng?: number;
  urlSlug?: string;
  deactivatedReason?: string;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" ? v : fallback;
}

function sanitizeImageUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const u = raw.trim();
  return u.startsWith("https://") ? u : "";
}

function firstString(arr: unknown): string {
  return Array.isArray(arr) && typeof arr[0] === "string" ? arr[0] : "";
}

export function parseOwnerListing(
  id: string,
  data: Record<string, unknown>,
  sourceCollection: OwnerListingSource = "listings"
): OwnerListing | null {
  const title = str(data.title, "Untitled");
  const priceRaw = data.price;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : parseFloat(String(priceRaw ?? "")) || 0;

  const imageUrl = sanitizeImageUrl(
    firstString(data.imageThumbnails) ||
      firstString(data.imageIcons) ||
      firstString(data.imageUrls) ||
      firstString(data.imagesFull)
  );

  const createdAt = data.createdAt as { toMillis?: () => number } | undefined;
  const createdAtMs =
    typeof data.createdAtMs === "number"
      ? data.createdAtMs
      : createdAt?.toMillis?.() ?? 0;

  const geopoint = data.position as { geopoint?: { latitude?: number; longitude?: number } } | undefined;
  const lat = geopoint?.geopoint?.latitude ?? 0;
  const lng = geopoint?.geopoint?.longitude ?? 0;

  const status = deriveOwnerListingStatus(data, sourceCollection);

  return {
    id,
    title,
    price,
    priceUnit: str(data.priceUnit, "per month"),
    category: str(data.category, "Others"),
    locationName: str(data.locationName),
    imageUrl,
    isActive: data.isActive === true,
    status,
    sourceCollection,
    isPromoted: data.isPromoted === true,
    isUnpaidDraft: isUnpaidDraft(data, sourceCollection),
    transactionType: parseTransactionType(data.transactionType),
    currentPlanName: str(data.currentPlanName) || undefined,
    listingExpiresAtMs: timestampToMs(data.listingExpiresAt),
    listingDeleteAtMs: timestampToMs(data.listingDeleteAt),
    promoExpiresAtMs: timestampToMs(data.promoExpiresAt),
    leaseEndAtMs: timestampToMs(data.leaseEndAt),
    deactivatedAtMs:
      timestampToMs(data.deactivatedAtMs) ?? timestampToMs(data.deactivatedAt),
    viewsCount: num(data.viewsCount),
    inquiryCount: num(data.inquiryCount),
    homeIso: str(data.homeIso) || str(data.iso) || undefined,
    createdAtMs,
    lat,
    lng,
    urlSlug: str(data.urlSlug) || undefined,
    deactivatedReason: str(data.deactivatedReason) || undefined,
  };
}
