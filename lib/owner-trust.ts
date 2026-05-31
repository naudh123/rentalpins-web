import { adminDb } from "./firebase-admin";

export interface OwnerTrust {
  displayName: string;
  verifiedLevel: number;
  /** True when user has verifiedLevel ≥ 1 or a stored phone on their profile. */
  phoneVerified: boolean;
}

export async function fetchOwnerTrust(ownerUid: string): Promise<OwnerTrust | null> {
  if (!ownerUid) return null;

  const snap = await adminDb.collection("users").doc(ownerUid).get();
  if (!snap.exists) return null;

  const data = snap.data()!;
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const verifiedLevel =
    typeof data.verifiedLevel === "number" ? data.verifiedLevel : 0;

  return {
    displayName:
      typeof data.displayName === "string" ? data.displayName.trim() : "",
    verifiedLevel,
    phoneVerified: verifiedLevel >= 1 || phone.length >= 8,
  };
}

/** Owner is considered reachable when profile or listing has a phone. */
export function ownerHasContactPhone(
  ownerTrust: OwnerTrust | null,
  listingOwnerPhone: string
): boolean {
  const listingPhone = listingOwnerPhone.replace(/\s/g, "");
  return Boolean(ownerTrust?.phoneVerified || listingPhone.length >= 8);
}
