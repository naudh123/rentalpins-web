import {
  TRICITY_PROJECT_CITIES,
  tricityCityLabel,
  type TricityProjectCitySlug,
} from "@/lib/builders/tricity-cities";

/** Alternate slugs / labels → canonical Tricity project city slug. */
export const PROJECT_CITY_SLUG_ALIASES: Record<string, string> = {
  new_chandigarh: "new-chandigarh",
  mullanpur: "new-chandigarh",
  "new chandigarh": "new-chandigarh",
  tricity: "chandigarh",
};

const CANONICAL_SLUGS = new Set(
  TRICITY_PROJECT_CITIES.map((c) => c.slug)
);

function isNewChandigarhProject(cityLabel?: string, projectSlug?: string): boolean {
  const label = (cityLabel ?? "").toLowerCase();
  const slug = (projectSlug ?? "").toLowerCase();
  return (
    label.includes("new chandigarh") ||
    label.includes("mullanpur") ||
    slug.includes("new-chandigarh")
  );
}

/** Normalize raw project city slug for filters, URLs, and grouping. */
export function canonicalProjectCitySlug(
  slug: string | null | undefined,
  cityLabel?: string,
  projectSlug?: string
): string {
  if (!slug) return "";
  const lower = slug.trim().toLowerCase();

  if (isNewChandigarhProject(cityLabel, projectSlug)) {
    return "new-chandigarh";
  }

  if (CANONICAL_SLUGS.has(lower as TricityProjectCitySlug)) {
    return lower;
  }

  return PROJECT_CITY_SLUG_ALIASES[lower] ?? lower;
}

/** Display label for a canonical or alias slug. */
export function projectCityLabel(slug: string): string {
  const canonical = canonicalProjectCitySlug(slug);
  return tricityCityLabel(canonical) || tricityCityLabel(slug) || slug;
}

/** Ordered city filter options for /projects (canonical slugs only). */
export function tricityProjectCityFilterOptions(
  projects: { citySlug: string; city?: string; slug?: string }[]
): { slug: string; name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of projects) {
    const slug = canonicalProjectCitySlug(p.citySlug, p.city, p.slug);
    if (!slug || !CANONICAL_SLUGS.has(slug as TricityProjectCitySlug)) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  return TRICITY_PROJECT_CITIES.filter((c) => (counts.get(c.slug) ?? 0) > 0).map(
    (c) => ({
      slug: c.slug,
      name: c.label,
      count: counts.get(c.slug) ?? 0,
    })
  );
}

/** True when a project belongs to a canonical city hub (including New Chandigarh grouping). */
export function projectMatchesCityHub(
  project: { citySlug: string; city?: string; slug?: string },
  hubSlug: string
): boolean {
  return (
    canonicalProjectCitySlug(project.citySlug, project.city, project.slug) ===
    canonicalProjectCitySlug(hubSlug)
  );
}
