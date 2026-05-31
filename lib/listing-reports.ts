import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getClientDb } from "./firebase-client";
import type { ListingReportInput } from "./types/listing-report";

const COLLECTION = "listing_reports";

export function listingReportDocId(listingId: string, reporterUid: string): string {
  return `${listingId}_${reporterUid}`;
}

/** One report per user per listing (idempotent doc id). */
export async function submitListingReport(
  reporterUid: string,
  input: ListingReportInput
): Promise<void> {
  const details = input.details?.trim().slice(0, 500) ?? "";
  const ref = doc(
    getClientDb(),
    COLLECTION,
    listingReportDocId(input.listingId, reporterUid)
  );

  await setDoc(ref, {
    listingId: input.listingId,
    listingTitle: input.listingTitle.slice(0, 120),
    ownerUid: input.ownerUid,
    reporterUid,
    reason: input.reason,
    details,
    status: "open",
    source: "web",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
