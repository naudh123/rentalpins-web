import type { User } from "firebase/auth";
import { requirePhoneVerification } from "@/lib/config";

/** True when user must link a Firebase-verified phone (OTP) before continuing. */
export function mustVerifyPhone(user: User | null): boolean {
  if (!user || !requirePhoneVerification) return false;
  return !user.phoneNumber;
}

export function canLeaveLogin(user: User | null): boolean {
  return Boolean(user && !mustVerifyPhone(user));
}
