/** Listing fields needed on the activate / pay page. */

import { readGeopointFromPosition } from "@/lib/listing-plans";

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
  data: Record<string, unknown>
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
  };
}
