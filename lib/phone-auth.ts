/** Normalize and validate phone numbers for Firebase phone auth (E.164). */

export function normalizePhoneForAuth(phone: string): string {
  const compact = phone.replace(/[\s\-().]/g, "");
  if (!compact) return "";
  if (compact.startsWith("+")) return compact;
  const digits = compact.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

/**
 * A listing's contact number counts as verified only when it is the same number
 * the owner proved via Firebase phone OTP — not just because they verified some phone.
 */
export function isOwnerPhoneVerified(
  contactPhone: string,
  verifiedAuthPhone: string | null | undefined
): boolean {
  if (!verifiedAuthPhone) return false;
  const contact = normalizePhoneForAuth(contactPhone);
  if (!isValidPhoneForAuth(contact)) return false;
  return contact === normalizePhoneForAuth(verifiedAuthPhone);
}

export function isValidPhoneForAuth(phone: string): boolean {
  const normalized = normalizePhoneForAuth(phone);
  if (!normalized.startsWith("+")) return false;
  const digits = normalized.slice(1);
  if (!/^\d+$/.test(digits)) return false;
  // E.164 allows up to 15 digits; require a real subscriber number, not "+91" alone.
  return digits.length >= 10 && digits.length <= 15;
}
