import { adminDb } from "@/lib/firebase-admin";

const MAX_LISTINGS = 5000;

/** Active listing URLs for sitemap-listings.xml (revalidated daily via route). */
export async function fetchListingSitemapEntries(): Promise<
  { id: string; updatedAt: string }[]
> {
  try {
    const snap = await adminDb
      .collection("listings")
      .where("isActive", "==", true)
      .orderBy("updatedAtMs", "desc")
      .limit(MAX_LISTINGS)
      .get();

    return snap.docs.map((doc) => {
      const d = doc.data();
      const updated =
        typeof d.updatedAtMs === "number"
          ? new Date(d.updatedAtMs).toISOString()
          : d.updatedAt?.toDate?.()?.toISOString?.() ??
            d.createdAt?.toDate?.()?.toISOString?.() ??
            new Date().toISOString();
      return { id: doc.id, updatedAt: updated };
    });
  } catch (err) {
    console.error("fetchListingSitemapEntries:", err);
    try {
      const fallback = await adminDb
        .collection("listings")
        .where("isActive", "==", true)
        .limit(500)
        .get();
      return fallback.docs.map((doc) => ({
        id: doc.id,
        updatedAt: new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }
}
