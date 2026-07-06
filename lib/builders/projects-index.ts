import type { BuilderProject, ProjectType } from "@/lib/types/builder-microsite";
import {
  canonicalProjectCitySlug,
  tricityProjectCityFilterOptions,
} from "@/lib/builders/project-city-slugs";

/** Curated featured order for the /projects hero rail (premium Tricity launches). */
export const FEATURED_PROJECT_SLUGS: string[] = [
  "dlf-hyde-park-estate",
  "emaar-mohali-hills",
  "godrej-tricity-heights",
  "sbp-city-of-dreams",
  "omaxe-new-chandigarh",
  "gillco-valley",
  "homeland-regalia",
  "ats-casa-espana",
];

export const PROJECT_TYPE_FILTERS: { id: ProjectType | "all"; label: string }[] = [
  { id: "all", label: "All types" },
  { id: "plots", label: "Plots" },
  { id: "apartments", label: "Apartments" },
  { id: "commercial", label: "Commercial" },
  { id: "industrial", label: "Industrial" },
  { id: "villas", label: "Villas" },
  { id: "mixed-use", label: "Mixed use" },
];

export interface PriceRangeFilter {
  id: string;
  label: string;
  min: number | null;
  max: number | null;
}

/** Price bands in paise (same unit as Firestore priceMin/priceMax). */
export const PRICE_RANGE_FILTERS: PriceRangeFilter[] = [
  { id: "all", label: "Any price", min: null, max: null },
  { id: "under-50l", label: "Under ₹50 L", min: null, max: 50_00_000 },
  { id: "50l-1cr", label: "₹50 L – ₹1 Cr", min: 50_00_000, max: 1_00_00_000 },
  { id: "1cr-2cr", label: "₹1 Cr – ₹2 Cr", min: 1_00_00_000, max: 2_00_00_000 },
  { id: "above-2cr", label: "Above ₹2 Cr", min: 2_00_00_000, max: null },
];

export interface ProjectsIndexFilters {
  query: string;
  citySlug: string | null;
  projectType: ProjectType | "all";
  priceRangeId: string;
}

export const DEFAULT_PROJECTS_FILTERS: ProjectsIndexFilters = {
  query: "",
  citySlug: null,
  projectType: "all",
  priceRangeId: "all",
};

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

function projectMatchesPrice(
  project: BuilderProject,
  range: PriceRangeFilter
): boolean {
  if (range.min == null && range.max == null) return true;

  const min = project.priceMin;
  const max = project.priceMax;
  const effectiveMin = min ?? max;
  const effectiveMax = max ?? min;

  if (effectiveMin == null && effectiveMax == null) {
    return range.id === "all";
  }

  const lo = effectiveMin ?? 0;
  const hi = effectiveMax ?? Number.MAX_SAFE_INTEGER;

  if (range.min != null && hi < range.min) return false;
  if (range.max != null && lo > range.max) return false;
  return true;
}

export function filterProjects(
  projects: BuilderProject[],
  filters: ProjectsIndexFilters
): BuilderProject[] {
  const q = normalizeQuery(filters.query);
  const priceRange =
    PRICE_RANGE_FILTERS.find((r) => r.id === filters.priceRangeId) ??
    PRICE_RANGE_FILTERS[0];

  return projects.filter((p) => {
    if (
      filters.citySlug &&
      canonicalProjectCitySlug(p.citySlug, p.city, p.slug) !==
        canonicalProjectCitySlug(filters.citySlug)
    ) {
      return false;
    }
    if (filters.projectType !== "all" && p.projectType !== filters.projectType) {
      return false;
    }
    if (!projectMatchesPrice(p, priceRange)) return false;

    if (q) {
      const haystack = [
        p.name,
        p.builderName,
        p.city,
        p.address ?? "",
        p.projectType,
        ...(p.amenities ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export function sortFeaturedFirst(projects: BuilderProject[]): BuilderProject[] {
  const order = new Map(FEATURED_PROJECT_SLUGS.map((slug, i) => [slug, i]));
  return [...projects].sort((a, b) => {
    const aFeatured = order.has(a.slug) || a.isFeatured;
    const bFeatured = order.has(b.slug) || b.isFeatured;
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    const aOrder = order.get(a.slug) ?? 999;
    const bOrder = order.get(b.slug) ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return b.updatedAtMs - a.updatedAtMs;
  });
}

export function pickFeaturedProjects(projects: BuilderProject[]): BuilderProject[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const picked: BuilderProject[] = [];
  for (const slug of FEATURED_PROJECT_SLUGS) {
    const p = bySlug.get(slug);
    if (p) picked.push(p);
  }
  return picked;
}

export function uniqueCityOptions(
  projects: BuilderProject[]
): { slug: string; name: string; count: number }[] {
  return tricityProjectCityFilterOptions(projects);
}

export function excludeFeaturedFromGrid(
  projects: BuilderProject[],
  featured: BuilderProject[]
): BuilderProject[] {
  if (featured.length === 0) return projects;
  const featuredIds = new Set(featured.map((p) => p.id));
  return projects.filter((p) => !featuredIds.has(p.id));
}
