/** Build WhatsApp deep link for listing owner contact. */

/** E.164 digits only for wa.me (handles +91, 10-digit IN mobiles, etc.). */
export function normalizePhoneForWhatsApp(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  // 10-digit Indian mobile → prepend country code
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    digits = `91${digits}`;
  }
  // 0-prefixed local → drop leading 0 then treat as above
  if (digits.length === 11 && digits.startsWith("0")) {
    const rest = digits.slice(1);
    if (rest.length === 10 && /^[6-9]/.test(rest)) digits = `91${rest}`;
  }

  return digits;
}

export function whatsappUrl(phone: string, message?: string): string {
  const digits = normalizePhoneForWhatsApp(phone);
  if (!digits) return "";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function listingWhatsAppMessage(title: string, listingUrl: string): string {
  return `Hi, I'm interested in your listing "${title}" on RentalPins: ${listingUrl}`;
}
