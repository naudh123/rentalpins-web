import type { ListingAttributes } from "./types/listing";

function pickString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function pickNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

/**
 * Parse the structured `attributes` map off a raw listing doc. Returns
 * undefined when no recognised attribute is present, so callers can omit it
 * entirely (keeps cards/JSON lean and filtering simple).
 */
export function parseListingAttributes(
  raw: Record<string, unknown> | undefined | null
): ListingAttributes | undefined {
  const a = (raw?.attributes ?? {}) as Record<string, unknown>;
  const attrs: ListingAttributes = {};
  const bhk = pickString(a.bhk);
  const furnishing = pickString(a.furnishing);
  const tenantPreference = pickString(a.tenantPreference);
  const areaSqft = pickNumber(a.areaSqft);
  const bathrooms = pickNumber(a.bathrooms);
  if (bhk) attrs.bhk = bhk;
  if (furnishing) attrs.furnishing = furnishing;
  if (tenantPreference) attrs.tenantPreference = tenantPreference;
  if (areaSqft != null) attrs.areaSqft = areaSqft;
  if (bathrooms != null) attrs.bathrooms = bathrooms;
  return Object.keys(attrs).length ? attrs : undefined;
}
