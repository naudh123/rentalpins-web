import type { BuilderProject } from "@/lib/types/builder-microsite";

function priceOverlap(a: BuilderProject, b: BuilderProject): number {
  const aMin = a.priceMin ?? 0;
  const aMax = a.priceMax ?? aMin;
  const bMin = b.priceMin ?? 0;
  const bMax = b.priceMax ?? bMin;
  if (aMax === 0 && bMax === 0) return 0.5;
  const overlap = Math.min(aMax, bMax) - Math.max(aMin, bMin);
  if (overlap <= 0) return 0;
  const span = Math.max(aMax, bMax) - Math.min(aMin, bMin);
  return span > 0 ? overlap / span : 0;
}

function similarityScore(base: BuilderProject, candidate: BuilderProject): number {
  if (base.id === candidate.id) return -1;
  let score = 0;
  if (candidate.citySlug === base.citySlug) score += 3;
  if (candidate.projectType === base.projectType) score += 2;
  score += priceOverlap(base, candidate) * 2;
  if (candidate.builderSlug === base.builderSlug) score += 0.5;
  if (candidate.isFeatured) score += 0.25;
  if (candidate.status === base.status) score += 0.5;
  return score;
}

export function rankSimilarProjects(
  base: BuilderProject,
  candidates: BuilderProject[],
  limit = 4
): BuilderProject[] {
  return candidates
    .filter((p) => p.id !== base.id && p.isPublished)
    .sort((a, b) => similarityScore(base, b) - similarityScore(base, a))
    .slice(0, limit);
}
