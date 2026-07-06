/** Chandigarh Tricity — primary market for RentalPins project microsites. */
export const TRICITY_PROJECT_CITIES = [
  { slug: "mohali", label: "Mohali" },
  { slug: "new-chandigarh", label: "New Chandigarh" },
  { slug: "chandigarh", label: "Chandigarh" },
  { slug: "panchkula", label: "Panchkula" },
  { slug: "zirakpur", label: "Zirakpur" },
  { slug: "kharar", label: "Kharar" },
  { slug: "landran", label: "Landran" },
  { slug: "banur", label: "Banur" },
] as const;

export type TricityProjectCitySlug = (typeof TRICITY_PROJECT_CITIES)[number]["slug"];

export function isTricityProjectCity(slug: string): boolean {
  return TRICITY_PROJECT_CITIES.some((c) => c.slug === slug.toLowerCase());
}

export function tricityCityLabel(slug: string): string {
  return TRICITY_PROJECT_CITIES.find((c) => c.slug === slug.toLowerCase())?.label ?? slug;
}

/** Basic email check for lead capture (not full RFC validation). */
export function isValidLeadEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Indian mobile: 10 digits, optional +91 prefix. */
export function isValidLeadPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 12 && digits.startsWith("91"));
}
