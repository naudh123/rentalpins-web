import type { BlogPostSummary } from "@/lib/blog-types";

/** Priority blog slugs per money-page key — shown first when published. */
const FEATURED_BLOG_SLUGS: Record<string, string[]> = {
  "in/chandigarh": [
    "pg-vs-flat-chandigarh-students",
    "vehicle-rental-chandigarh-guide",
  ],
  "in/chandigarh/mohali": [
    "mohali-it-park-rental-guide",
    "pg-vs-flat-chandigarh-students",
  ],
  "in/chandigarh/kharar": ["kharar-pg-guide-chandigarh-university"],
  "in/ludhiana": ["how-to-find-room-ludhiana"],
  "in/delhi": ["delhi-rentals-without-broker-guide"],
};

/** Primary geo tag — filler posts must match this before secondary hints apply. */
const KEY_PRIMARY_TAG: Record<string, string> = {
  "in/chandigarh": "chandigarh",
  "in/chandigarh/mohali": "mohali",
  "in/chandigarh/kharar": "kharar",
  "in/ludhiana": "ludhiana",
  "in/delhi": "delhi",
};

/** Secondary tags used to rank filler guides after the primary geo match. */
const KEY_TAG_HINTS: Record<string, string[]> = {
  "in/chandigarh": ["students", "pg", "vehicles"],
  "in/chandigarh/mohali": ["students", "pg"],
  "in/chandigarh/kharar": ["students", "pg"],
  "in/ludhiana": ["students", "pg"],
  "in/delhi": ["students", "pg"],
};

function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim();
}

function postMatchesPrimaryTag(configKey: string, post: BlogPostSummary): boolean {
  const primary = KEY_PRIMARY_TAG[configKey];
  if (!primary || !post.tags?.length) return false;
  return post.tags.some((tag) => {
    const normalized = normalizeTag(tag);
    return normalized === primary || normalized.includes(primary);
  });
}

function scorePostForCityKey(
  configKey: string,
  post: BlogPostSummary
): number {
  if (!postMatchesPrimaryTag(configKey, post)) return 0;
  const hints = KEY_TAG_HINTS[configKey];
  if (!hints?.length || !post.tags?.length) return 1;
  const hintSet = new Set(hints.map(normalizeTag));
  return (
    1 +
    post.tags.filter((tag) => hintSet.has(normalizeTag(tag))).length
  );
}

/** Pick blog guides to surface on a priority city/area money page. */
export function pickCitySeoBlogPosts(
  configKey: string,
  allPosts: BlogPostSummary[],
  limit = 3
): BlogPostSummary[] {
  const bySlug = new Map(allPosts.map((post) => [post.slug, post]));
  const picked: BlogPostSummary[] = [];
  const seen = new Set<string>();

  for (const slug of FEATURED_BLOG_SLUGS[configKey] ?? []) {
    const post = bySlug.get(slug);
    if (!post || seen.has(post.slug)) continue;
    picked.push(post);
    seen.add(post.slug);
    if (picked.length >= limit) return picked;
  }

  const fillers = allPosts
    .filter((post) => !seen.has(post.slug))
    .map((post) => ({ post, score: scorePostForCityKey(configKey, post) }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    );

  for (const { post } of fillers) {
    picked.push(post);
    seen.add(post.slug);
    if (picked.length >= limit) break;
  }

  return picked;
}
