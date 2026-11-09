/**
 * Fields a self-service project owner may change via PUT /api/builder-projects/[id].
 * Everything else (publishing, ownership, builder link, slug, lead routing,
 * counters, featured flags, timestamps) is staff-only — new projects go live
 * only after RentalPins staff publish them.
 */
export const OWNER_EDITABLE_PROJECT_FIELDS = [
  "name",
  "description",
  "status",
  "address",
  "reraNumber",
  "priceMin",
  "priceMax",
  "sizeMin",
  "sizeMax",
  "sizeUnit",
  "possessionDate",
  "latitude",
  "longitude",
  "amenities",
  "galleryUrls",
  "brochureUrl",
  "paymentPlan",
  "masterPlanImageUrl",
  "seoTitle",
  "seoDescription",
] as const;

const OWNER_EDITABLE = new Set<string>(OWNER_EDITABLE_PROJECT_FIELDS);

/** Keep only owner-editable keys from a client patch (drops unknown and protected fields). */
export function pickOwnerProjectPatch(patch: unknown): Record<string, unknown> {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
    if (OWNER_EDITABLE.has(key) && value !== undefined) out[key] = value;
  }
  return out;
}
