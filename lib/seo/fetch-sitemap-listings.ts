import { adminDb } from "@/lib/firebase-admin";
import type { ListingSlugInput } from "@/lib/listing-slug";
import { parseListingAttributes } from "@/lib/listing-attributes";

const MAX_LISTINGS = 5000;

export type ListingSitemapEntry = ListingSlugInput & {
  updatedAt: string;
};

function readCoords(raw: Record<string, unknown>): { lat: number; lng: number } {
  const position = raw.position as Record<string, unknown> | undefined;
  const geopoint = position?.geopoint as Record<string, unknown> | undefined;
  const lat =
    (geopoint?.latitude as number | undefined) ??
    (geopoint?._latitude as number | undefined) ??
    0;
  const lng =
    (geopoint?.longitude as number | undefined) ??
    (geopoint?._longitude as number | undefined) ??
    0;
  return { lat, lng };
}

/** Active listing URLs for sitemap-listings.xml (revalidated daily via route). */
export async function fetchListingSitemapEntries(): Promise<ListingSitemapEntry[]> {
  try {
    const snap = await adminDb
      .collection("listings")
      .where("isActive", "==", true)
      .orderBy("updatedAtMs", "desc")
      .limit(MAX_LISTINGS)
      .get();

    return snap.docs.map((doc) => mapSitemapEntry(doc.id, doc.data() as Record<string, unknown>));
  } catch (err) {
    console.error("fetchListingSitemapEntries:", err);
    try {
      const fallback = await adminDb
        .collection("listings")
        .where("isActive", "==", true)
        .limit(500)
        .get();
      return fallback.docs.map((doc) =>
        mapSitemapEntry(doc.id, doc.data() as Record<string, unknown>)
      );
    } catch {
      return [];
    }
  }
}

function mapSitemapEntry(id: string, d: Record<string, unknown>): ListingSitemapEntry {
  const { lat, lng } = readCoords(d);
  const updated =
    typeof d.updatedAtMs === "number"
      ? new Date(d.updatedAtMs).toISOString()
      : (d.updatedAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ??
        (d.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ??
        new Date().toISOString();

  return {
    id,
    title: typeof d.title === "string" ? d.title : "Untitled",
    locationName: typeof d.locationName === "string" ? d.locationName : "",
    lat,
    lng,
    subCategory: typeof d.subCategory === "string" ? d.subCategory : "",
    category: typeof d.category === "string" ? d.category : "",
    attributes: parseListingAttributes(d),
    searchableTitle:
      typeof d.searchableTitle === "string" ? d.searchableTitle : undefined,
    urlSlug: typeof d.urlSlug === "string" ? d.urlSlug : undefined,
    transactionType: d.transactionType === "sale" ? "sale" : "rent",
    updatedAt: updated,
  };
}
