import type { BuilderProject, ProjectTestimonial } from "@/lib/types/builder-microsite";

export interface ProjectEnrichment {
  /** Only official builder/project videos — never placeholder YouTube IDs */
  videoUrls?: string[];
  /** Matterport or verified walkthrough embed only — not generic YouTube */
  virtualTourUrl?: string;
  constructionUpdates?: string[];
  launchDate?: string;
  floorPlanUrls?: string[];
  testimonials?: ProjectTestimonial[];
}

/** Catalog enrichments for lead-conversion features (merged at read + seed patch). */
export const PROJECT_ENRICHMENTS: Record<string, ProjectEnrichment> = {
  "dlf-hyde-park-estate": {
    constructionUpdates: [
      "Dec 2025 — Phase 1 infrastructure complete; internal roads paved.",
      "Mar 2026 — Clubhouse shell complete; landscaping underway.",
      "Jun 2026 — Sample villa ready for site visits.",
    ],
    launchDate: "2012-04-01",
  },
  "emaar-mohali-hills": {
    constructionUpdates: [
      "Jan 2026 — Sector 105 entry boulevard completed.",
      "Apr 2026 — First tower foundation work in progress.",
    ],
  },
  "sbp-city-of-dreams": {
    constructionUpdates: [
      "Feb 2026 — Highland Marg frontage development active.",
      "May 2026 — Phase 2 plot demarcation complete.",
    ],
  },
  "jubilee-techyards": {
    launchDate: "2026-09-15",
    testimonials: [
      {
        quote: "Strong location for IT and commercial investors near Sector 102A.",
        author: "Commercial buyer",
        role: "Mohali",
      },
    ],
  },
  "godrej-tricity-heights": {
    constructionUpdates: [
      "Mar 2026 — Tower A structural work 40% complete.",
      "Jun 2026 — Amenity deck waterproofing complete.",
    ],
  },
  "gmada-aerocity-mohali": {
    launchDate: "2027-03-01",
  },
};

/** Demo-era placeholder YouTube links that were never official project media. */
export function isPlaceholderProjectVideoUrl(url: string): boolean {
  const u = url.toLowerCase();
  if (!u.includes("youtube.com") && !u.includes("youtu.be")) return false;
  const placeholders = [
    "zxfismub0ta",
    "6v2l2ugzjam",
    "8qqr7lyl9z0",
    "scmzvixbsi4",
  ];
  return placeholders.some((id) => u.includes(id));
}

export function mergeProjectEnrichment(project: BuilderProject): BuilderProject {
  const e = PROJECT_ENRICHMENTS[project.slug];
  const videos = (project.videoUrls ?? []).filter((u) => !isPlaceholderProjectVideoUrl(u));
  const virtualTour =
    project.virtualTourUrl && !isPlaceholderProjectVideoUrl(project.virtualTourUrl)
      ? project.virtualTourUrl
      : null;

  if (!e) {
    return { ...project, videoUrls: videos, virtualTourUrl: virtualTour };
  }

  return {
    ...project,
    videoUrls:
      videos.length > 0
        ? videos
        : (e.videoUrls ?? []).filter((u) => !isPlaceholderProjectVideoUrl(u)),
    virtualTourUrl:
      virtualTour ??
      (e.virtualTourUrl && !isPlaceholderProjectVideoUrl(e.virtualTourUrl)
        ? e.virtualTourUrl
        : null),
    constructionUpdates:
      project.constructionUpdates.length > 0
        ? project.constructionUpdates
        : (e.constructionUpdates ?? []),
    launchDate: project.launchDate ?? e.launchDate ?? null,
    floorPlanUrls:
      project.floorPlanUrls.length > 0 ? project.floorPlanUrls : (e.floorPlanUrls ?? []),
    testimonials:
      project.testimonials.length > 0 ? project.testimonials : (e.testimonials ?? []),
  };
}

export function enrichmentPatchForSlug(slug: string): Record<string, unknown> | null {
  const e = PROJECT_ENRICHMENTS[slug];
  if (!e) return null;
  const patch: Record<string, unknown> = {};
  if (e.videoUrls?.length) patch.videoUrls = e.videoUrls;
  if (e.virtualTourUrl) patch.virtualTourUrl = e.virtualTourUrl;
  if (e.constructionUpdates?.length) patch.constructionUpdates = e.constructionUpdates;
  if (e.launchDate) patch.launchDate = e.launchDate;
  if (e.floorPlanUrls?.length) patch.floorPlanUrls = e.floorPlanUrls;
  if (e.testimonials?.length) patch.testimonials = e.testimonials;
  return Object.keys(patch).length > 0 ? patch : null;
}

/** Remove stale demo YouTube embeds from Firestore. */
export function shouldClearPlaceholderMedia(data: Record<string, unknown>): boolean {
  const videos = Array.isArray(data.videoUrls) ? (data.videoUrls as string[]) : [];
  const tour = typeof data.virtualTourUrl === "string" ? data.virtualTourUrl : "";
  const badVideos = videos.some(isPlaceholderProjectVideoUrl);
  const badTour = tour ? isPlaceholderProjectVideoUrl(tour) : false;
  return badVideos || badTour;
}

export function placeholderMediaClearPatch(data: Record<string, unknown>): Record<string, unknown> {
  const videos = Array.isArray(data.videoUrls) ? (data.videoUrls as string[]) : [];
  const kept = videos.filter((u) => !isPlaceholderProjectVideoUrl(u));
  const tour =
    typeof data.virtualTourUrl === "string" && !isPlaceholderProjectVideoUrl(data.virtualTourUrl)
      ? data.virtualTourUrl
      : null;
  return {
    videoUrls: kept,
    virtualTourUrl: tour,
  };
}
