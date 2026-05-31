/** Owner's listing row (includes inactive drafts). */

export interface OwnerListing {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  category: string;
  locationName: string;
  imageUrl: string;
  isActive: boolean;
  isPromoted: boolean;
  viewsCount: number;
  inquiryCount: number;
  homeIso?: string;
  createdAtMs: number;
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
  data: Record<string, unknown>
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

  return {
    id,
    title,
    price,
    priceUnit: str(data.priceUnit, "per month"),
    category: str(data.category, "Others"),
    locationName: str(data.locationName),
    imageUrl,
    isActive: data.isActive === true,
    isPromoted: data.isPromoted === true,
    viewsCount: num(data.viewsCount),
    inquiryCount: num(data.inquiryCount),
    homeIso: str(data.homeIso) || str(data.iso) || undefined,
    createdAtMs,
  };
}
