/** Curated blog categories — keeps index pages and filters consistent. */
export const BLOG_CATEGORIES = [
  "Student Housing",
  "City Guides",
  "PG & Flats",
  "Renting Smart",
  "Vehicle Rental",
  "Owner Tips",
  "General",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_DRAFT_STORAGE_KEY = "rentalpins-blog-draft-v1";

export const BLOG_LIMITS = {
  titleMin: 5,
  titleMax: 120,
  metaTitleMax: 70,
  excerptMin: 20,
  excerptMax: 300,
  metaDescriptionMax: 160,
  contentMinPublish: 100,
  contentMinDraft: 20,
  slugMin: 3,
  slugMax: 80,
  tagsMax: 8,
  tagMaxLength: 40,
  faqsMax: 8,
  faqQuestionMax: 200,
  faqAnswerMax: 500,
} as const;
