import type { User } from "firebase/auth";
import { requirePhoneVerification } from "@/lib/config";

/** True when user must link/verify phone before continuing (production gate). */
export function mustVerifyPhone(
  user: User | null,
  profile: { phone?: string } | null
): boolean {
  if (!user || !requirePhoneVerification) return false;
  if (user.phoneNumber) return false;
  if (profile?.phone && profile.phone.length >= 8) return false;
  return true;
}

export function canLeaveLogin(
  user: User | null,
  profile: { phone?: string } | null
): boolean {
  return Boolean(user && !mustVerifyPhone(user, profile));
}
