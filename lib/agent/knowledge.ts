/**
 * Curated knowledge for the RentalPins property agent ("training" data).
 * Buy hubs, rent guides, projects, blog, market snapshots, plus agent-knowledge.ts FAQs.
 */

import { getMdxPosts } from "@/lib/blog";
import { filterPostsByIndex } from "@/lib/blog-vertical";
import { getIndianRentalPageConfig, indianRentalPagePath } from "@/lib/rental-area-config";
import { BUY_HUBS, BUY_HUB_SLUGS, type BuyPageConfig } from "@/lib/sale/buy-pages-config";
import { BUY_PROJECTS, type BuyProjectConfig } from "@/lib/sale/buy-projects-config";

export interface AreaGuideSummary {
  slug: string;
  cityName: string;
  headline: string;
  subhead: string;
  highlights: string[];
  faqSample: { q: string; a: string }[];
  hubPath: string;
}

export interface ProjectSummary {
  slug: string;
  name: string;
  cityName: string;
  locality: string;
  priceRange: string;
  types: string[];
  amenities: string[];
  status: string;
  investmentNote: string;
  developerSlug?: string;
  path: string;
}

export interface RentGuideSummary {
  hubSlug: string;
  areaName: string;
  intro: string;
  rentalTypes: string[];
  faqSample: { q: string; a: string }[];
  hubPath: string;
  mapPath: string;
}

export interface MarketInsightSnapshot {
  hubSlug: string;
  market: "rent" | "buy";
  headline: string;
  buyerProfile: string;
  priceContext: string;
  searchTip: string;
}

export interface BlogInsightSummary {
  slug: string;
  title: string;
  excerpt: string;
  path: string;
}

export interface PlatformOverview {
  name: string;
  tagline: string;
  modules: string[];
  stack: string[];
  demoPaths: { label: string; path: string }[];
}

const TRICITY_RENT_HUBS = ["mohali", "kharar", "zirakpur", "chandigarh-university"] as const;

const MARKET_INSIGHTS: MarketInsightSnapshot[] = [
  {
    hubSlug: "mohali",
    market: "buy",
    headline: "Mohali buy — family end-user and IT corridor demand",
    buyerProfile: "IT professionals, airport corridor commuters, families in Phase 7/9/11",
    priceContext: "Prime sectors and Aerocity trade at premiums; peripheral belts offer entry 2 BHK bands",
    searchTip: "Filter buy map by BHK + budget, then compare Phase 7 vs Aerocity resale comps",
  },
  {
    hubSlug: "mohali",
    market: "rent",
    headline: "Mohali rent — professionals and furnished flat demand",
    buyerProfile: "IT Park workforce, airport corridor, families seeking gated societies",
    priceContext: "Furnished 2 BHK premiums near IT Park; PG clusters near Phase belts",
    searchTip: "Use rent map PG vs flat filters; check Phase 7 and Sector 70 spokes",
  },
  {
    hubSlug: "zirakpur",
    market: "buy",
    headline: "Zirakpur buy — commuter and investor crossover",
    buyerProfile: "Chandigarh commuters, investors targeting rental yield on VIP Road",
    priceContext: "Entry buy bands often below prime Mohali with strong rental footfall",
    searchTip: "Compare VIP Road projects on /buy/projects with resale pins on buy map",
  },
  {
    hubSlug: "zirakpur",
    market: "rent",
    headline: "Zirakpur rent — Chandigarh spillover market",
    buyerProfile: "Commuters, young professionals, shop and flat tenants on VIP/Gazipur belts",
    priceContext: "Competitive monthly rents vs Chandigarh proper with highway access trade-offs",
    searchTip: "Centre rent map on Zirakpur and filter by furnished + parking if commuting daily",
  },
  {
    hubSlug: "kharar",
    market: "rent",
    headline: "Kharar rent — student PG capital of Tricity",
    buyerProfile: "CU students, coaching migrants, budget renters on Kharar–Landran road",
    priceContext: "PG and hostel inventory dense; verify food plan and distance to campus",
    searchTip: "Search PG near CU and cross-check Kharar town vs campus belt listings",
  },
  {
    hubSlug: "kharar",
    market: "buy",
    headline: "Kharar buy — affordable corridor with CU adjacency",
    buyerProfile: "Investors eyeing student rental yield; end-users on Kharar–Kurali belt",
    priceContext: "Lower entry vs Mohali prime; liquidity varies by society and road frontage",
    searchTip: "Use buy map near Kharar hub and read Kharar buy guide FAQs",
  },
  {
    hubSlug: "panchkula",
    market: "buy",
    headline: "Panchkula buy — established family sectors",
    buyerProfile: "End-user families preferring planned sectors and Chandigarh adjacency",
    priceContext: "Mature resale liquidity in established sectors; steady end-user demand",
    searchTip: "Filter buy map by sector and compare Panchkula Elevate-style projects",
  },
];

const PLATFORM: PlatformOverview = {
  name: "RentalPins",
  tagline: "Map-first property discovery for rent and buy in India.",
  modules: [
    "Rent map (silver theme) — /search",
    "Buy map (gold theme) — /buy/search",
    "List for sale — /buy/post",
    "Buyer requirements board — /buy/requirements",
    "Developer projects hub — /buy/projects",
    "AI property advisor — /advisor",
    "Phone OTP + Google auth, Razorpay listing activation",
    "Semantic search + NL map filters (OpenAI)",
    "Flutter mobile app on same Firebase project",
  ],
  stack: [
    "Next.js 16",
    "React 19",
    "Firebase (Auth, Firestore, Functions, Storage)",
    "Google Maps JavaScript + Places",
    "OpenAI (listing improve, NL search, property agent)",
    "Flutter (iOS/Android)",
  ],
  demoPaths: [
    { label: "AI advisor", path: "/advisor" },
    { label: "Buy map", path: "/buy/search" },
    { label: "Rent map", path: "/search" },
    { label: "Post for sale", path: "/buy/post" },
    { label: "Projects hub", path: "/buy/projects" },
    { label: "For developers", path: "/developers" },
  ],
};

function hubToGuide(hub: BuyPageConfig): AreaGuideSummary {
  return {
    slug: hub.hubSlug,
    cityName: hub.cityName,
    headline: hub.headline,
    subhead: hub.subhead,
    highlights: hub.highlights.slice(0, 6).map((h) => `${h.title}: ${h.desc}`),
    faqSample: hub.faqs.slice(0, 5),
    hubPath: `/buy/${hub.hubSlug}`,
  };
}

function rentPageToGuide(hubSlug: string): RentGuideSummary | null {
  const page = getIndianRentalPageConfig(hubSlug);
  if (!page) return null;
  return {
    hubSlug: page.hubSlug,
    areaName: page.areaName,
    intro: page.intro,
    rentalTypes: page.rentalTypes,
    faqSample: page.faqs.slice(0, 4),
    hubPath: indianRentalPagePath(page.hubSlug, page.areaSlug),
    mapPath: "/search",
  };
}

function projectToSummary(p: BuyProjectConfig): ProjectSummary {
  return {
    slug: p.slug,
    name: p.name,
    cityName: p.cityName,
    locality: p.locality,
    priceRange: p.priceRange,
    types: p.types,
    amenities: p.amenities,
    status: p.status,
    investmentNote: p.investmentNote,
    developerSlug: p.developerSlug,
    path: `/buy/projects/${p.citySlug}/${p.slug}`,
  };
}

export function getPlatformOverview(): PlatformOverview {
  return PLATFORM;
}

export function getAllAreaGuides(): AreaGuideSummary[] {
  return BUY_HUB_SLUGS.map((slug) => hubToGuide(BUY_HUBS[slug])).filter(Boolean);
}

export function getAreaGuide(slug: string): AreaGuideSummary | null {
  const hub = BUY_HUBS[slug];
  return hub ? hubToGuide(hub) : null;
}

export function searchAreaGuides(query: string, limit = 4): AreaGuideSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllAreaGuides().slice(0, limit);

  const scored = getAllAreaGuides().map((guide) => {
    let score = 0;
    const blob = `${guide.slug} ${guide.cityName} ${guide.headline} ${guide.subhead}`.toLowerCase();
    if (guide.slug.includes(q) || q.includes(guide.slug)) score += 4;
    if (guide.cityName.toLowerCase().includes(q)) score += 3;
    if (blob.includes(q)) score += 2;
    for (const token of q.split(/\s+/)) {
      if (token.length > 2 && blob.includes(token)) score += 1;
    }
    return { guide, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.guide);
}

export function getAllProjects(): ProjectSummary[] {
  return BUY_PROJECTS.map(projectToSummary);
}

export function searchProjects(query: string, citySlug?: string, limit = 4): ProjectSummary[] {
  const q = query.trim().toLowerCase();
  let pool = getAllProjects();
  if (citySlug) pool = pool.filter((p) => p.slug.includes(citySlug) || p.cityName.toLowerCase() === citySlug);

  if (!q) return pool.slice(0, limit);

  const scored = pool.map((project) => {
    let score = 0;
    const blob =
      `${project.name} ${project.cityName} ${project.locality} ${project.investmentNote} ${project.amenities.join(" ")}`.toLowerCase();
    if (blob.includes(q)) score += 3;
    for (const token of q.split(/\s+/)) {
      if (token.length > 2 && blob.includes(token)) score += 1;
    }
    return { project, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.project);
}

export function getBuyBlogInsights(limit = 8): BlogInsightSummary[] {
  const posts = filterPostsByIndex(getMdxPosts(), "buy");
  return posts.slice(0, limit).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    path: `/blog/${p.slug}`,
  }));
}

export function searchBlogInsights(query: string, limit = 4): BlogInsightSummary[] {
  const q = query.trim().toLowerCase();
  const posts = filterPostsByIndex(getMdxPosts(), "buy");
  if (!q) {
    return posts.slice(0, limit).map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      path: `/blog/${p.slug}`,
    }));
  }

  const scored = posts.map((post) => {
    const blob = `${post.title} ${post.excerpt}`.toLowerCase();
    let score = 0;
    if (blob.includes(q)) score += 3;
    for (const token of q.split(/\s+/)) {
      if (token.length > 2 && blob.includes(token)) score += 1;
    }
    return { post, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => ({
      slug: s.post.slug,
      title: s.post.title,
      excerpt: s.post.excerpt,
      path: `/blog/${s.post.slug}`,
    }));
}

export function getAllRentGuides(): RentGuideSummary[] {
  return TRICITY_RENT_HUBS.map((slug) => rentPageToGuide(slug)).filter(
    (g): g is RentGuideSummary => g != null
  );
}

export function searchRentGuides(query: string, limit = 4): RentGuideSummary[] {
  const q = query.trim().toLowerCase();
  const guides = getAllRentGuides();
  if (!q) return guides.slice(0, limit);

  const scored = guides.map((guide) => {
    let score = 0;
    const blob = `${guide.hubSlug} ${guide.areaName} ${guide.intro} ${guide.rentalTypes.join(" ")}`.toLowerCase();
    if (guide.hubSlug.includes(q) || q.includes(guide.hubSlug)) score += 4;
    if (blob.includes(q)) score += 2;
    for (const token of q.split(/\s+/)) {
      if (token.length > 2 && blob.includes(token)) score += 1;
    }
    return { guide, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.guide);
}

export function searchRentBlogInsights(query: string, limit = 4): BlogInsightSummary[] {
  const q = query.trim().toLowerCase();
  const posts = filterPostsByIndex(getMdxPosts(), "rent");
  if (!q) {
    return posts.slice(0, limit).map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      path: `/blog/${p.slug}`,
    }));
  }

  const scored = posts.map((post) => {
    const blob = `${post.title} ${post.excerpt}`.toLowerCase();
    let score = 0;
    if (blob.includes(q)) score += 3;
    for (const token of q.split(/\s+/)) {
      if (token.length > 2 && blob.includes(token)) score += 1;
    }
    return { post, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => ({
      slug: s.post.slug,
      title: s.post.title,
      excerpt: s.post.excerpt,
      path: `/blog/${s.post.slug}`,
    }));
}

export function getMarketInsight(
  hubSlug: string,
  market: "rent" | "buy"
): MarketInsightSnapshot | null {
  const slug = hubSlug.trim().toLowerCase();
  return MARKET_INSIGHTS.find((m) => m.hubSlug === slug && m.market === market) ?? null;
}

export function searchMarketInsights(query: string, limit = 3): MarketInsightSnapshot[] {
  const q = query.trim().toLowerCase();
  if (!q) return MARKET_INSIGHTS.slice(0, limit);

  return MARKET_INSIGHTS.filter((m) => {
    const blob = `${m.hubSlug} ${m.market} ${m.headline} ${m.buyerProfile} ${m.priceContext}`.toLowerCase();
    return blob.includes(q) || q.split(/\s+/).some((t) => t.length > 2 && blob.includes(t));
  }).slice(0, limit);
}

/** Compare two buy hubs for advisor conversations. */
export function compareBuyAreas(slugs: string[]): {
  areas: AreaGuideSummary[];
  note: string;
} {
  const areas = slugs
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .map((s) => getAreaGuide(s))
    .filter((a): a is AreaGuideSummary => a != null);

  const note =
    areas.length < 2
      ? "Need at least two valid hub slugs: mohali, kharar, zirakpur, panchkula."
      : "Compare using headline, subhead, highlights, and suggest opening the buy map with budget filters.";

  return { areas, note };
}
