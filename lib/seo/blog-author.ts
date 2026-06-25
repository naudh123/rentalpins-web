/** Centralized blog authorship for E-E-A-T consistency. */

export const RENTALPINS_EDITORIAL_TEAM = {
  name: "RentalPins Editorial Team",
  bio: "RentalPins Editorial Team publishes practical rental, property, and local market guides based on RentalPins' map-first property discovery experience.",
  slug: "rentalpins-editorial-team",
} as const;

export const RENTALPINS_BUY_EDITORIAL_BIO =
  "RentalPins Buy editorial publishes practical buyer and seller guides for owner-direct property sales — starting in Chandigarh Tricity.";

/** Author bio by blog vertical. */
export function resolveBlogAuthorBio(
  authorName: string,
  category: string,
  vertical: "rent" | "buy" | "neutral"
): string {
  const isEditorial = authorName === RENTALPINS_EDITORIAL_TEAM.name;
  if (isEditorial && vertical === "buy") return RENTALPINS_BUY_EDITORIAL_BIO;
  if (isEditorial) return RENTALPINS_EDITORIAL_TEAM.bio;
  if (vertical === "buy") {
    return `Writes practical buy and sell guides for RentalPins Buy — covering ${category.toLowerCase()} topics with owner-direct sale discovery.`;
  }
  return `Writes practical rental guides for RentalPins — covering ${category.toLowerCase()} topics across India with owner-direct listings and no broker bias.`;
}

const PLACEHOLDER_AUTHORS = new Set(
  [
    "fireon isnice",
    "fireon",
    "admin",
    "unknown",
    "rentalpins team",
    "rentalpins",
  ].map((s) => s.toLowerCase())
);

/** Normalize author display name — replaces placeholders with editorial team. */
export function resolveBlogAuthorName(author?: string | null): string {
  const raw = (author ?? "").trim();
  if (!raw || PLACEHOLDER_AUTHORS.has(raw.toLowerCase())) {
    return RENTALPINS_EDITORIAL_TEAM.name;
  }
  return raw;
}
