import { adminDb } from "./firebase-admin";
import type { AreaConfig } from "./area-config";

export interface SeoListingCard {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  category: string;
  subCategory: string;
  locationName: string;
  imageUrl: string;
  lat: number;
  lng: number;
  isPromoted: boolean;
  viewsCount: number;
  inquiryCount: number;
  createdAt: string;
  urlSlug?: string;
}

function sanitizeListingImageUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const u = raw.trim();
  if (!u.startsWith("https://")) return "";
  try {
    return new URL(u).protocol === "https:" ? u : "";
  } catch {
    return "";
  }
}

function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Active listings near an SEO area hub (geohash queries, same as production site). */
export async function fetchAreaListings(
  area: AreaConfig,
  limit = 20
): Promise<SeoListingCard[]> {
  try {
    const listingsRef = adminDb.collection("listings");
    const queryPromises = area.geohashPrefixes.map((prefix) =>
      listingsRef
        .where("isActive", "==", true)
        .where("position.geohash", ">=", prefix)
        .where("position.geohash", "<=", prefix + "\uf8ff")
        .orderBy("position.geohash")
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get()
    );

    const snapshots = await Promise.all(queryPromises);
    const seen = new Set<string>();
    const allListings: (SeoListingCard & { _distance: number })[] = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        if (seen.has(doc.id)) continue;
        seen.add(doc.id);
        const d = doc.data();
        const imageUrl = sanitizeListingImageUrl(
          d.imageThumbnails?.[0] ||
            d.imageIcons?.[0] ||
            d.imageUrls?.[0] ||
            d.imagesFull?.[0] ||
            ""
        );
        const geopoint = d.position?.geopoint;
        const listingLat = geopoint?.latitude ?? 0;
        const listingLng = geopoint?.longitude ?? 0;
        const distance = distanceKm(
          area.center.lat,
          area.center.lng,
          listingLat,
          listingLng
        );

        allListings.push({
          id: doc.id,
          title: d.title || "Untitled",
          description: d.description || "",
          price: typeof d.price === "number" ? d.price : parseFloat(d.price) || 0,
          priceUnit: d.priceUnit || "per month",
          category: d.category || "Others",
          subCategory: d.subCategory || "",
          locationName: d.locationName || "",
          imageUrl,
          lat: listingLat,
          lng: listingLng,
          isPromoted: d.isPromoted === true,
          viewsCount: d.viewsCount || 0,
          inquiryCount: d.inquiryCount || 0,
          createdAt:
            d.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          urlSlug: typeof d.urlSlug === "string" ? d.urlSlug : undefined,
          _distance: distance,
        });
      }
    }

    allListings.sort((a, b) => {
      if (a.isPromoted !== b.isPromoted) return a.isPromoted ? -1 : 1;
      if (Math.abs(a._distance - b._distance) > 1) return a._distance - b._distance;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return allListings.slice(0, limit).map(({ _distance: _, ...listing }) => listing);
  } catch (error) {
    console.error("fetchAreaListings error:", error);
    return [];
  }
}
