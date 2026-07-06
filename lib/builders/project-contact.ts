/** RentalPins platform sales line for project enquiries. */
export const PLATFORM_SALES_PHONE = "9915061640";

export type LeadRouting = "platform" | "direct";

export function normalizeContactPhone(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const digits = raw.replace(/\D/g, "");
  const ten = digits.length >= 10 ? digits.slice(-10) : digits;
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
}

/** Display 10-digit mobile for call buttons (no misleading last-4 suffix). */
export function formatContactPhoneLabel(phone: string): string {
  const ten = normalizeContactPhone(phone);
  return ten ?? phone.replace(/\s/g, "");
}

export function resolveProjectContact(
  builderPhone?: string | null,
  builderWhatsapp?: string | null,
  leadRouting: LeadRouting = "platform"
): { phone: string; whatsapp: string } {
  if (leadRouting === "platform") {
    return { phone: PLATFORM_SALES_PHONE, whatsapp: PLATFORM_SALES_PHONE };
  }

  const phone = normalizeContactPhone(builderPhone) ?? PLATFORM_SALES_PHONE;
  const whatsapp =
    normalizeContactPhone(builderWhatsapp) ??
    normalizeContactPhone(builderPhone) ??
    PLATFORM_SALES_PHONE;
  return { phone, whatsapp };
}

export function projectWhatsAppMessage(projectName: string): string {
  return `Hi RentalPins, I'm interested in ${projectName}. Please share details and arrange a site visit.`;
}
