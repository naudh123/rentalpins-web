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
  let score = 0;
  if (candidate.category === current.category) score += 4;
  score += tagOverlap(current.tags, candidate.tags) * 2;
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
