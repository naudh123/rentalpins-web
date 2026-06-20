/** Fetch active boost plans from Firestore. */

import { collection, getDocs, query, where } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

export interface BoostPlanRow {
  id: string;
  planName: string;
  creditCost: number;
  durationDays: number;
  price: number;
  currency: string;
}

export async function fetchBoostPlans(db: Firestore): Promise<BoostPlanRow[]> {
  const snap = await getDocs(
    query(collection(db, "boost_plans"), where("isActive", "==", true))
  );
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        planName: String(data.planName || "Boost"),
        creditCost: Number(data.creditCost) || 0,
        durationDays: Number(data.durationDays) || 7,
        price: Number(data.price) || 0,
        currency: String(data.currency || "INR"),
      };
    })
    .filter((p) => p.creditCost > 0)
    .sort((a, b) => a.creditCost - b.creditCost);
}

export const CREDIT_PACKS = [
  { productId: "credits_50", credits: 50, priceInr: 49 },
  { productId: "credits_100", credits: 100, priceInr: 99 },
  { productId: "credits_250", credits: 250, priceInr: 249 },
  { productId: "credits_500", credits: 500, priceInr: 499 },
] as const;
