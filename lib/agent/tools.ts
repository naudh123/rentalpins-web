import { tool } from "ai";
import { z } from "zod";
import { fetchListingsInBounds } from "@/lib/listings";
import { DEFAULT_LISTING_FILTERS } from "@/lib/listing-filters";
import { getBuyHub } from "@/lib/sale/buy-pages-config";
import {
  buildContactHandoff,
  estimateAffordability,
  getDeveloperOffering,
  recommendPropertyPath,
  searchAgentFaqs,
} from "./agent-knowledge";
import {
  compareBuyAreas,
  getMarketInsight,
  getPlatformOverview,
  searchAreaGuides,
  searchBlogInsights,
  searchMarketInsights,
  searchProjects,
  searchRentBlogInsights,
  searchRentGuides,
} from "./knowledge";
import { buildAgentMapUrl } from "./map-url";
import { parseNaturalLanguageSearch } from "./parse-query-server";
import type { AgentSurface } from "./types";

function boundsAround(lat: number, lng: number, delta = 0.06) {
  return { north: lat + delta, south: lat - delta, east: lng + delta, west: lng - delta };
}

export interface AgentToolContext {
  surface: AgentSurface;
  defaultTransactionType: "rent" | "sale";
}

export interface AgentToolCallbacks {
  onContactHandoff?: (params: { interest?: string; summary: string; company?: string }) => void;
}

const SURFACE_TOOL_NAMES: Record<AgentSurface, string[]> = {
  advisor: [
    "searchAreaGuides",
    "searchRentGuides",
    "compareAreas",
    "buildMapSearch",
    "searchProjects",
    "searchBuyGuides",
    "searchRentBlog",
    "sampleListings",
    "matchBuyerRequirement",
    "searchFaqs",
    "recommendNextStep",
    "getMarketInsight",
    "estimateAffordability",
    "scheduleContact",
  ],
  map: [
    "buildMapSearch",
    "searchAreaGuides",
    "searchRentGuides",
    "sampleListings",
    "searchFaqs",
    "recommendNextStep",
    "compareAreas",
    "getMarketInsight",
    "estimateAffordability",
    "searchProjects",
  ],
  showcase: [
    "getPlatformOverview",
    "getDeveloperOffering",
    "recommendNextStep",
    "scheduleContact",
    "searchFaqs",
    "searchProjects",
    "buildMapSearch",
    "compareAreas",
    "getMarketInsight",
    "searchBuyGuides",
  ],
};

function pickToolsForSurface<T extends Record<string, unknown>>(
  all: T,
  surface: AgentSurface
): Partial<T> {
  const allowed = new Set(SURFACE_TOOL_NAMES[surface]);
  return Object.fromEntries(
    Object.entries(all).filter(([name]) => allowed.has(name))
  ) as Partial<T>;
}

export function createPropertyAgentTools(
  context: AgentToolContext,
  callbacks: AgentToolCallbacks = {}
) {
  const allTools = {
    searchAreaGuides: tool({
      description:
        "Search Tricity buy area guides (Mohali, Kharar, Zirakpur, Panchkula) — headlines, highlights, FAQs.",
      inputSchema: z.object({
        query: z.string().describe("Area name or topic, e.g. Mohali Aerocity investment"),
      }),
      execute: async ({ query }) => ({
        guides: searchAreaGuides(query, 4),
      }),
    }),

    searchRentGuides: tool({
      description:
        "Search Tricity rent hub guides — Mohali, Kharar, Zirakpur, Chandigarh University PG corridor.",
      inputSchema: z.object({
        query: z.string().describe("Rent locality or PG topic, e.g. PG near CU, Phase 7 rent"),
      }),
      execute: async ({ query }) => ({
        guides: searchRentGuides(query, 4),
      }),
    }),

    compareAreas: tool({
      description: "Compare two or more buy hub areas side by side.",
      inputSchema: z.object({
        slugs: z
          .array(z.string())
          .min(2)
          .max(4)
          .describe("Hub slugs: mohali, kharar, zirakpur, panchkula"),
      }),
      execute: async ({ slugs }) => compareBuyAreas(slugs),
    }),

    buildMapSearch: tool({
      description:
        "Convert natural language into a RentalPins map URL with filters. Share mapPath as markdown link.",
      inputSchema: z.object({
        query: z.string().describe("Full search intent in plain English"),
        transactionType: z
          .enum(["rent", "sale"])
          .optional()
          .describe("rent → /search, sale → /buy/search"),
        hubSlug: z
          .string()
          .optional()
          .describe("Optional hub slug: mohali, kharar, zirakpur, panchkula"),
      }),
      execute: async ({ query, transactionType, hubSlug }) => {
        const tx = transactionType ?? context.defaultTransactionType;
        const parsed = await parseNaturalLanguageSearch(query, tx);
        const mapPath = buildAgentMapUrl(parsed, tx, hubSlug);
        return {
          mapPath,
          transactionType: tx,
          placeText: parsed.placeText,
          keywords: parsed.keywords,
          filters: parsed.filters,
        };
      },
    }),

    searchProjects: tool({
      description: "Search developer projects on RentalPins Buy (Tricity sample inventory).",
      inputSchema: z.object({
        query: z.string(),
        citySlug: z.string().optional(),
      }),
      execute: async ({ query, citySlug }) => ({
        projects: searchProjects(query, citySlug, 4),
      }),
    }),

    searchBuyGuides: tool({
      description: "Search buy-side blog guides (due diligence, area comparisons, seller checklists).",
      inputSchema: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => ({
        articles: searchBlogInsights(query, 4),
      }),
    }),

    searchRentBlog: tool({
      description: "Search rent-side blog guides (tenant tips, PG, locality advice).",
      inputSchema: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => ({
        articles: searchRentBlogInsights(query, 4),
      }),
    }),

    getPlatformOverview: tool({
      description: "RentalPins platform modules, tech stack, and demo paths.",
      inputSchema: z.object({}),
      execute: async () => getPlatformOverview(),
    }),

    getDeveloperOffering: tool({
      description:
        "White-label PropTech offering — modules, engagement tiers, differentiators, contact.",
      inputSchema: z.object({}),
      execute: async () => getDeveloperOffering(),
    }),

    sampleListings: tool({
      description:
        "Sample live listings near a Tricity hub (title, price, location) — cite only returned data.",
      inputSchema: z.object({
        hubSlug: z.string().describe("mohali, kharar, zirakpur, or panchkula"),
        transactionType: z.enum(["rent", "sale"]).optional(),
        limit: z.number().min(1).max(6).optional(),
      }),
      execute: async ({ hubSlug, transactionType, limit = 4 }) => {
        const hub = getBuyHub(hubSlug) ?? getBuyHub("mohali");
        if (!hub) return { listings: [] as { id: string; title: string; price: number; location: string }[] };

        const tx = transactionType ?? context.defaultTransactionType;
        const bounds = boundsAround(hub.mapCenter.lat, hub.mapCenter.lng, 0.1);
        const filters = {
          ...DEFAULT_LISTING_FILTERS,
          transactionType: tx,
          category: tx === "sale" ? "Property" : DEFAULT_LISTING_FILTERS.category,
        };
        const { listings } = await fetchListingsInBounds(bounds, filters, { zoom: 11 });

        return {
          listings: listings.slice(0, limit).map((l) => ({
            id: l.id,
            title: l.title,
            price: l.price,
            location: l.locationName,
            path: tx === "sale" ? `/buy/listings/${l.id}` : `/listings/${l.id}`,
          })),
        };
      },
    }),

    matchBuyerRequirement: tool({
      description:
        "Draft buyer requirement for the demand board (user must sign in to publish on /buy/requirements/post).",
      inputSchema: z.object({
        city: z.string(),
        budgetMaxLakh: z.number().optional(),
        propertyType: z.string().optional(),
        notes: z.string().optional(),
      }),
      execute: async ({ city, budgetMaxLakh, propertyType, notes }) => ({
        action: "post_requirement",
        path: "/buy/requirements/post",
        summary: {
          city,
          budgetMax: budgetMaxLakh != null ? budgetMaxLakh * 100_000 : null,
          propertyType: propertyType ?? "Property",
          notes: notes ?? null,
        },
        message:
          "Buyer requirements go live after sign-in. Sellers browse demand on /buy/requirements.",
      }),
    }),

    searchFaqs: tool({
      description:
        "Search curated FAQs — platform fees, objections vs portals, due diligence, PG/student, invest, white-label.",
      inputSchema: z.object({
        query: z.string().describe("Topic or question keywords"),
      }),
      execute: async ({ query }) => ({
        faqs: searchAgentFaqs(query, 5).map((f) => ({
          id: f.id,
          category: f.category,
          title: f.title,
          content: f.content,
          url: f.url,
        })),
      }),
    }),

    recommendNextStep: tool({
      description:
        "Rule-based routing — recommend primary path, secondary links, and qualification questions from user need.",
      inputSchema: z.object({
        need: z.string().describe("Summarized user intent in plain English"),
        budget: z.string().optional(),
        timeline: z.string().optional(),
        areas: z.array(z.string()).optional(),
      }),
      execute: async ({ need, budget, timeline, areas }) =>
        recommendPropertyPath({
          need,
          budget,
          timeline,
          areas,
          surface: context.surface,
        }),
    }),

    getMarketInsight: tool({
      description:
        "Curated Tricity market snapshot — buyer/tenant profile, price context, search tip for a hub.",
      inputSchema: z.object({
        hubSlug: z.string().describe("mohali, kharar, zirakpur, panchkula"),
        market: z.enum(["rent", "buy"]),
      }),
      execute: async ({ hubSlug, market }) => {
        const insight = getMarketInsight(hubSlug, market);
        const related = searchMarketInsights(hubSlug, 2);
        return { insight, related };
      },
    }),

    estimateAffordability: tool({
      description:
        "Indicative EMI and max affordable price from income/down payment — not a loan offer.",
      inputSchema: z.object({
        monthlyIncome: z.number().optional().describe("Net monthly income INR"),
        existingEmi: z.number().optional(),
        downPaymentLakh: z.number().optional(),
        loanTenureYears: z.number().optional(),
        interestRatePercent: z.number().optional(),
        targetPriceLakh: z.number().optional(),
      }),
      execute: async (params) => estimateAffordability(params),
    }),

    scheduleContact: tool({
      description:
        "Prepare contact handoff for human follow-up — strategy call (showcase) or RentalPins admin follow-up.",
      inputSchema: z.object({
        summary: z.string().describe("2–4 sentence summary of user needs"),
        interest: z.string().optional().describe("e.g. proptech, buy-mohali, rent-pg"),
        company: z.string().optional(),
      }),
      execute: async ({ summary, interest, company }) => {
        callbacks.onContactHandoff?.({ interest, summary, company });
        return buildContactHandoff({
          surface: context.surface,
          interest,
          summary,
          company,
        });
      },
    }),
  };

  return pickToolsForSurface(allTools, context.surface);
}
