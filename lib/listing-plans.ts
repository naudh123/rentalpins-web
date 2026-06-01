/**
 * Listing plan resolution — mirrors `rentit_clean/lib/screens/listing_plans.dart`.
 * Tier priority: city (geo radius) → country (homeIso) → global.
 * Then free vs paid filter based on listing_policy eligibility.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  type Firestore,
  type QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

export type ListingPlanTier = "city" | "country" | "global";

export interface ListingPlanRow {
  id: string;
  planName: string;
  price: number;
  currency: string;
  durationDays: number;
  tier: ListingPlanTier;
  version: number;
}

export interface ListingPlanResolution {
  plans: ListingPlanRow[];
  resolvedTier: ListingPlanTier;
  resolvedTargetIso: string;
  resolvedCityCode: string | null;
}

export interface ListingPlanDocInput {
  id: string;
  data: Record<string, unknown>;
}

function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lon2 - lon1);
  const aLat = toRad(lat1);
  const bLat = toRad(lat2);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(aLat) * Math.cos(bLat) * sinDLng * sinDLng;
  return 6371000 * (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

export function readGeopointFromPosition(
  position: unknown
): { lat: number; lng: number } | null {
  if (!position || typeof position !== "object") return null;
  const geopoint = (position as Record<string, unknown>).geopoint;
  if (!geopoint || typeof geopoint !== "object") return null;
  const g = geopoint as Record<string, unknown>;
  const lat = (g.latitude ?? g._latitude) as number | undefined;
  const lng = (g.longitude ?? g._longitude) as number | undefined;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return { lat, lng };
}

function readGeopoint(v: unknown): { lat: number; lng: number } | null {
  if (!v || typeof v !== "object") return null;
  const g = v as Record<string, unknown>;
  const lat = (g.latitude ?? g._latitude) as number | undefined;
  const lng = (g.longitude ?? g._longitude) as number | undefined;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return { lat, lng };
}

function scheduledStartMs(v: unknown): number | null {
  if (!v) return null;
  if (v instanceof Timestamp) return v.toMillis();
  if (typeof v === "object" && v !== null && "seconds" in v) {
    return Number((v as { seconds: number }).seconds) * 1000;
  }
  if (typeof v === "object" && v !== null && "toMillis" in v) {
    return Number((v as { toMillis: () => number }).toMillis());
  }
  return null;
}

function normalizeTier(raw: unknown): ListingPlanTier {
  const t = String(raw ?? "global").trim().toLowerCase();
  if (t === "city" || t === "country") return t;
  return "global";
}

function mapPlanRow(id: string, data: Record<string, unknown>): ListingPlanRow {
  return {
    id,
    planName: String(data.planName ?? "Plan"),
    price: Number(data.price ?? 0) || 0,
    currency: String(data.currency ?? "INR"),
    durationDays: Number(data.durationDays ?? 30) || 30,
    tier: normalizeTier(data.tier),
    version: Number(data.version ?? 0) || 0,
  };
}

export function resolvePolicyDocId(
  tier: ListingPlanTier,
  targetIso: string | null,
  cityCode: string | null
): string {
  if (
    tier === "city" &&
    targetIso &&
    targetIso.length > 0 &&
    cityCode &&
    cityCode.length > 0
  ) {
    return `city_${targetIso.toUpperCase()}_${cityCode.toUpperCase()}`;
  }
  if (tier === "country" && targetIso && targetIso.length > 0) {
    return `country_${targetIso.toUpperCase()}`;
  }
  return "global";
}

/** Pure resolver — same rules as Flutter `_getResolvedListingPlansStream`. */
export function resolveListingPlansFromDocs(
  planDocs: ListingPlanDocInput[],
  options: {
    homeIso: string;
    listingLat?: number | null;
    listingLng?: number | null;
    isEligibleForFree: boolean;
    nowMs?: number;
  }
): ListingPlanResolution {
  const homeIso = options.homeIso.trim().toUpperCase() || "IN";
  const nowMs = options.nowMs ?? Date.now();
  const listingLat = options.listingLat;
  const listingLng = options.listingLng;
  const hasListingCoords =
    typeof listingLat === "number" &&
    typeof listingLng === "number" &&
    Number.isFinite(listingLat) &&
    Number.isFinite(listingLng);

  const cityPlans: ListingPlanDocInput[] = [];
  const countryPlans: ListingPlanDocInput[] = [];
  const globalPlans: ListingPlanDocInput[] = [];

  for (const doc of planDocs) {
    const data = doc.data;
    const schedMs = scheduledStartMs(data.scheduledStartTime);
    if (schedMs != null && schedMs > nowMs) continue;

    const tier = normalizeTier(data.tier);
    const targetIso = String(data.targetIso ?? "")
      .trim()
      .toUpperCase();

    if (tier === "city" && hasListingCoords && data.center != null) {
      const center = readGeopoint(data.center);
      const radius = Number(data.radiusMeters ?? 0);
      if (center && radius > 0) {
        const dist = haversineMeters(
          listingLat!,
          listingLng!,
          center.lat,
          center.lng
        );
        if (dist <= radius) cityPlans.push(doc);
      }
    } else if (tier === "country" && targetIso === homeIso) {
      countryPlans.push(doc);
    } else if (tier === "global") {
      globalPlans.push(doc);
    }
  }

  let resolved: ListingPlanDocInput[];
  let resolvedTier: ListingPlanTier;
  if (cityPlans.length > 0) {
    resolved = cityPlans;
    resolvedTier = "city";
  } else if (countryPlans.length > 0) {
    resolved = countryPlans;
    resolvedTier = "country";
  } else {
    resolved = globalPlans;
    resolvedTier = "global";
  }

  let resolvedTargetIso = homeIso;
  let resolvedCityCode: string | null = null;
  if (resolved.length > 0) {
    const winning = resolved[0]!.data;
    resolvedTargetIso =
      String(winning.targetIso ?? homeIso).trim().toUpperCase() || homeIso;
    const cc = String(winning.cityCode ?? "").trim().toUpperCase();
    resolvedCityCode = cc.length > 0 ? cc : null;
  }

  const freePlans = resolved.filter(
    (d) => (Number(d.data.price ?? 0) || 0) === 0
  );
  const paidPlans = resolved.filter((d) => (Number(d.data.price ?? 0) || 0) > 0);

  const picked =
    options.isEligibleForFree && freePlans.length > 0 ? freePlans : paidPlans;

  const plans = picked
    .map((d) => mapPlanRow(d.id, d.data))
    .sort((a, b) => b.version - a.version);

  return {
    plans,
    resolvedTier,
    resolvedTargetIso,
    resolvedCityCode,
  };
}

function matchesFreeHistoryDoc(
  data: Record<string, unknown>,
  tier: ListingPlanTier
): boolean {
  if (Number(data.activationFeePaid ?? 0) !== 0) return false;
  const docTier = String(data.resolvedTier ?? "global").trim().toLowerCase();
  return docTier === tier;
}

async function safeHistoryQuery(
  db: Firestore,
  collectionName: string,
  ownerUid: string,
  tier: ListingPlanTier
): Promise<QueryDocumentSnapshot[]> {
  try {
    const snap = await getDocs(
      query(
        collection(db, collectionName),
        where("ownerUid", "==", ownerUid),
        where("activationFeePaid", "==", 0),
        where("resolvedTier", "==", tier)
      )
    );
    return snap.docs;
  } catch (primaryErr) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[listing-plans] ${collectionName} composite history query failed; using ownerUid fallback`,
        primaryErr
      );
    }
    try {
      const snap = await getDocs(
        query(collection(db, collectionName), where("ownerUid", "==", ownerUid))
      );
      return snap.docs.filter((d) =>
        matchesFreeHistoryDoc(d.data() as Record<string, unknown>, tier)
      );
    } catch (fallbackErr) {
      console.error(`[listing-plans] ${collectionName} history fallback failed`, fallbackErr);
      return [];
    }
  }
}

export type FreePlanEligibilityResult =
  | { eligible: true }
  | {
      eligible: false;
      code: "policy_unavailable" | "cooldown_active";
      message: string;
    };

async function loadListingPolicy(
  db: Firestore,
  tier: ListingPlanTier,
  targetIso: string | null,
  cityCode?: string | null
): Promise<Record<string, unknown> | null> {
  const docId = resolvePolicyDocId(tier, targetIso, cityCode ?? null);

  const policyRef = doc(db, "settings", "listing_policy", "rules", docId);
  const policyDoc = await getDoc(policyRef);
  if (policyDoc.exists()) {
    return policyDoc.data() as Record<string, unknown>;
  }
  if (tier === "city" && targetIso) {
    const countryDoc = await getDoc(
      doc(db, "settings", "listing_policy", "rules", `country_${targetIso}`)
    );
    if (countryDoc.exists()) return countryDoc.data() as Record<string, unknown>;
  }
  const globalDoc = await getDoc(
    doc(db, "settings", "listing_policy", "rules", "global")
  );
  if (globalDoc.exists()) return globalDoc.data() as Record<string, unknown>;
  return null;
}

/** Client-side free eligibility — mirrors Flutter `_checkFreeEligibility` + server `activateFreePlan`. */
export async function resolveFreePlanEligibility(
  db: Firestore,
  ownerUid: string,
  tier: ListingPlanTier,
  targetIso: string | null,
  cityCode?: string | null
): Promise<FreePlanEligibilityResult> {
  const data = await loadListingPolicy(db, tier, targetIso, cityCode);
  if (!data) {
    return {
      eligible: false,
      code: "policy_unavailable",
      message: "Free plan is not available for this market.",
    };
  }

  const limit = Number(data.freeLimit ?? 0);
  const cooldownDays = Number(data.cooldownDays ?? 90);
  if (limit <= 0) {
    return {
      eligible: false,
      code: "policy_unavailable",
      message: "Free plan is not available for this market.",
    };
  }

  const historySnaps = await Promise.all([
    safeHistoryQuery(db, "listings", ownerUid, tier),
    safeHistoryQuery(db, "deactivated_listings", ownerUid, tier),
    safeHistoryQuery(db, "archived_listings", ownerUid, tier),
  ]);

  const docs = [...historySnaps[0], ...historySnaps[1], ...historySnaps[2]].sort(
    (a, b) => {
      const at = scheduledStartMs(a.data().createdAt) ?? 0;
      const bt = scheduledStartMs(b.data().createdAt) ?? 0;
      return bt - at;
    }
  );

  if (docs.length < limit) return { eligible: true };

  const lastMs = scheduledStartMs(docs[0]!.data().createdAt);
  if (lastMs == null) return { eligible: true };

  const cooldownEnd = lastMs + cooldownDays * 24 * 60 * 60 * 1000;
  if (Date.now() > cooldownEnd) return { eligible: true };

  const nextEligibleAt = new Date(cooldownEnd);
  return {
    eligible: false,
    code: "cooldown_active",
    message: `Free plan cooldown active. You can use a free plan again after ${nextEligibleAt.toLocaleDateString()}.`,
  };
}

/** Client-side free eligibility estimate — mirrors Flutter `_checkFreeEligibility`. */
export async function checkFreePlanEligibility(
  db: Firestore,
  ownerUid: string,
  tier: ListingPlanTier,
  targetIso: string | null,
  cityCode?: string | null
): Promise<boolean> {
  const result = await resolveFreePlanEligibility(db, ownerUid, tier, targetIso, cityCode);
  return result.eligible;
}

export async function fetchResolvedListingPlans(
  db: Firestore,
  params: {
    homeIso: string;
    ownerUid: string;
    listingLat?: number | null;
    listingLng?: number | null;
  }
): Promise<ListingPlanResolution> {
  const snap = await getDocs(
    query(collection(db, "listing_plans"), where("isActive", "==", true))
  );
  const planDocs: ListingPlanDocInput[] = snap.docs.map((d) => ({
    id: d.id,
    data: d.data() as Record<string, unknown>,
  }));

  const homeIso = params.homeIso.trim().toUpperCase() || "IN";
  const prelim = resolveListingPlansFromDocs(planDocs, {
    homeIso,
    listingLat: params.listingLat,
    listingLng: params.listingLng,
    isEligibleForFree: false,
  });

  const isEligibleForFree = await checkFreePlanEligibility(
    db,
    params.ownerUid,
    prelim.resolvedTier,
    prelim.resolvedTargetIso,
    prelim.resolvedCityCode
  );

  return resolveListingPlansFromDocs(planDocs, {
    homeIso,
    listingLat: params.listingLat,
    listingLng: params.listingLng,
    isEligibleForFree,
  });
}
