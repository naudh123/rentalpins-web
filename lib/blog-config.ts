/** Blog vertical — rent vs buy/sell editorial lanes. */
export const BLOG_VERTICALS = ["rent", "buy", "neutral"] as const;
export type BlogVertical = (typeof BLOG_VERTICALS)[number];

/** Curated rental blog categories. */
export const RENT_BLOG_CATEGORIES = [
  "Student Housing",
  "City Guides",
  "PG & Flats",
  "Renting Smart",
  "Vehicle Rental",
  "Owner Tips",
  "General",
] as const;

/** Curated buy/sell blog categories. */
export const BUY_BLOG_CATEGORIES = [
  "Buyer Guides",
  "Seller Tips",
  "Investment & Localities",
  "Legal & Due Diligence",
  "Market Insights",
  "General",
] as const;

/** @deprecated Use RENT_BLOG_CATEGORIES — kept for imports that expect BLOG_CATEGORIES. */
export const BLOG_CATEGORIES = RENT_BLOG_CATEGORIES;

export type RentBlogCategory = (typeof RENT_BLOG_CATEGORIES)[number];
export type BuyBlogCategory = (typeof BUY_BLOG_CATEGORIES)[number];
export type BlogCategory = RentBlogCategory | BuyBlogCategory;

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

/** Static buy guides featured on /blog/buy (not MDX — cross-linked). */
export const FEATURED_BUY_GUIDE_LINKS = [
  {
    title: "Mohali investment & buy guide",
    href: "/buy/mohali-investment-guide",
    description:
      "Sectors, PR7, IT Park adjacency, and owner-direct sale discovery on RentalPins Buy.",
  },
  {
    title: "New Chandigarh investment guide",
    href: "/buy/new-chandigarh-investment-guide",
    description:
      "Growth corridor context for buyers comparing Mohali and Airport Road inventory.",
  },
] as const;

export type BlogIndexFilter = "all" | "rent" | "buy";

export const BLOG_INDEX_TABS: { id: BlogIndexFilter; label: string; href: string }[] = [
  { id: "rent", label: "Rentals", href: "/blog" },
  { id: "buy", label: "Buy & Sell", href: "/blog/buy" },
  { id: "all", label: "All", href: "/blog/all" },
];
