import type { BlogPostSummary } from "@/lib/blog-types";

function tagOverlap(a: string[] | undefined, b: string[] | undefined): number {
  if (!a?.length || !b?.length) return 0;
  const setB = new Set(b.map((tag) => tag.toLowerCase()));
  return a.filter((tag) => setB.has(tag.toLowerCase())).length;
}

function relatedPostScore(
  current: BlogPostSummary,
  candidate: BlogPostSummary
): number {
  const categoryScore = candidate.category === current.category ? 4 : 0;
  const tagScore = tagOverlap(current.tags, candidate.tags) * 2;
  if (categoryScore === 0 && tagScore === 0) return -1;

  let score = categoryScore + tagScore;
  if (candidate.vertical === current.vertical) score += 2;
  else if (current.vertical === "neutral" || candidate.vertical === "neutral") score += 1;
  else score -= 4;
  return score;
}

/** Pick up to `limit` related posts by category and shared tags. */
export function pickRelatedPosts(
  current: BlogPostSummary,
  all: BlogPostSummary[],
  limit = 3
): BlogPostSummary[] {
  return all
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({ post, score: relatedPostScore(current, post) }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    )
    .slice(0, limit)
    .map(({ post }) => post);
}
