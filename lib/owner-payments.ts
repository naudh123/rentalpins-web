/** Owner payment history from Firestore. */

import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { timestampToMs } from "@/lib/owner-listing-lifecycle";

export interface OwnerPaymentRow {
  id: string;
  listingId: string;
  type: string;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  createdAtMs: number;
}

export async function fetchOwnerPayments(
  db: Firestore,
  ownerUid: string,
  max = 50
): Promise<OwnerPaymentRow[]> {
  const snap = await getDocs(
    query(
      collection(db, "payments"),
      where("userId", "==", ownerUid),
      orderBy("createdAt", "desc"),
      limit(max)
    )
  ).catch(async () => {
    // Fallback if composite index missing — filter client-side
    const all = await getDocs(
      query(collection(db, "payments"), where("userId", "==", ownerUid), limit(max))
    );
    return all;
  });

  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        listingId: String(data.listingId || ""),
        type: String(data.type || "activation"),
        planName: String(data.planName || "Listing plan"),
        amount: Number(data.amount) || 0,
        currency: String(data.currency || "INR"),
        status: String(data.status || "success"),
        createdAtMs: timestampToMs(data.createdAt) ?? timestampToMs(data.createdAtMs) ?? 0,
      };
    })
    .sort((a, b) => b.createdAtMs - a.createdAtMs);
}
