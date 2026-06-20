/** Clone an existing listing into a new draft (duplicate property). */

import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { generateRankingKey } from "@/lib/listing-publish";

const COPY_FIELDS = [
  "title",
  "description",
  "originalTitle",
  "originalDescription",
  "price",
  "priceUnit",
  "transactionType",
  "category",
  "subCategory",
  "attributes",
  "imageUrls",
  "imageIcons",
  "imageThumbnails",
  "imagesFull",
  "searchableTitle",
  "searchKeywords",
  "position",
  "locationName",
  "fetchToken",
  "ownerPhone",
  "ownerPhoneVerified",
  "iso",
  "homeIso",
  "billingCurrency",
] as const;

export async function duplicateListingAsDraft(
  db: Firestore,
  sourceListingId: string,
  ownerUid: string
): Promise<string> {
  let snap = await getDoc(doc(db, "listings", sourceListingId));
  if (!snap.exists()) {
    snap = await getDoc(doc(db, "deactivated_listings", sourceListingId));
  }
  if (!snap.exists()) {
    throw new Error("Listing not found");
  }
  const data = snap.data();
  if (String(data.ownerUid || "") !== ownerUid) {
    throw new Error("Not your listing");
  }

  const payload: Record<string, unknown> = {
    ownerUid,
    isActive: false,
    appType: "web",
    sourceListingId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    rankingKey: generateRankingKey(),
    viewsCount: 0,
    inquiryCount: 0,
    isPromoted: false,
  };

  for (const key of COPY_FIELDS) {
    if (data[key] !== undefined) payload[key] = data[key];
  }

  if (typeof payload.title === "string") {
    payload.title = `${payload.title} (copy)`.slice(0, 120);
  }

  const ref = await addDoc(collection(db, "listings"), payload);
  return ref.id;
}
