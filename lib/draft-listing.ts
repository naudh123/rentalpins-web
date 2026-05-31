/** Owner draft listing fields for the post / edit form. */

export interface PostDraftListing {
  id: string;
  ownerUid: string;
  isActive: boolean;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  category: string;
  subCategory: string;
  locationName: string;
  lat: number;
  lng: number;
  imageUrl: string;
  imageUrls: string[];
  imageThumbnails: string[];
  imageIcons: string[];
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function firstString(arr: unknown): string {
  return Array.isArray(arr) && typeof arr[0] === "string" ? arr[0] : "";
}

function stringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter((x): x is string => typeof x === "string" && x.startsWith("https://"));
}

export function parsePostDraftListing(
  id: string,
  data: Record<string, unknown>
): PostDraftListing | null {
  const position = data.position as Record<string, unknown> | undefined;
  const geopoint = position?.geopoint as Record<string, unknown> | undefined;
  const lat =
    (geopoint?.latitude as number | undefined) ??
    (geopoint?._latitude as number | undefined);
  const lng =
    (geopoint?.longitude as number | undefined) ??
    (geopoint?._longitude as number | undefined);
  if (typeof lat !== "number" || typeof lng !== "number") return null;

  const imageThumbnails = stringArray(data.imageThumbnails);
  const imageIcons = stringArray(data.imageIcons);
  const imageUrls = stringArray(data.imageUrls);
  const imagesFull = stringArray(data.imagesFull);

  const imageUrl =
    imageThumbnails[0] || imageIcons[0] || imageUrls[0] || imagesFull[0] || "";

  const priceRaw = data.price;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : parseFloat(String(priceRaw ?? "")) || 0;

  return {
    id,
    ownerUid: str(data.ownerUid),
    isActive: data.isActive === true,
    title: str(data.title, "Untitled"),
    description: str(data.description),
    price,
    priceUnit: str(data.priceUnit, "per month"),
    category: str(data.category, "Property"),
    subCategory: str(data.subCategory, "Room"),
    locationName: str(data.locationName),
    lat,
    lng,
    imageUrl,
    imageUrls: imageUrls.length ? imageUrls : imagesFull,
    imageThumbnails: imageThumbnails.length ? imageThumbnails : imageUrls,
    imageIcons: imageIcons.length ? imageIcons : imageUrls,
  };
}
