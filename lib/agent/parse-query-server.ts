import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
  MAIN_CATEGORIES,
  BHK_OPTIONS,
  FURNISHING_OPTIONS,
  TENANT_PREFERENCE_OPTIONS,
  getSubCategories,
} from "@/lib/categories";
import type { ListingFilters } from "@/lib/listing-filters";
import type { TransactionType } from "@/lib/transaction-type";
import { agentModel, isAgentConfigured } from "./env";

function allSubCategories(): string[] {
  const set = new Set<string>();
  for (const c of MAIN_CATEGORIES) {
    for (const s of getSubCategories(c)) set.add(s);
  }
  return [...set];
}

export interface ParsedAgentSearch {
  filters: Partial<ListingFilters>;
  placeText: string;
  keywords: string;
}

const parseSchema = z.object({
  category: z.string(),
  subCategory: z.string(),
  bhk: z.string(),
  furnishing: z.string(),
  tenantPreference: z.string().optional(),
  priceMin: z.number().nullable(),
  priceMax: z.number().nullable(),
  areaMin: z.number().nullable(),
  areaMax: z.number().nullable(),
  sort: z.enum(["recommended", "price_asc", "price_desc", "newest"]),
  placeText: z.string(),
  keywords: z.string(),
});

/** Server-side NL → filters (same contract as parseSearchQuery Cloud Function). */
export async function parseNaturalLanguageSearch(
  query: string,
  transactionType: TransactionType = "rent"
): Promise<ParsedAgentSearch> {
  if (!isAgentConfigured) {
    throw new Error("OPENAI_API_KEY is not configured for the property agent.");
  }

  const q = query.trim().slice(0, 300);
  const isSale = transactionType === "sale";
  const categories = [...MAIN_CATEGORIES];
  const subCategories = allSubCategories();

  const { object } = await generateObject({
    model: openai(agentModel),
    schema: parseSchema,
    temperature: 0,
    system: isSale
      ? "Convert property sale searches in Chandigarh Tricity into strict JSON filters. Use only allowed enum values. Interpret lakh/crore purchase prices."
      : "Convert rental searches in Chandigarh Tricity into strict JSON filters. Use only allowed enum values.",
    prompt: `Query: "${q}"

Allowed categories: ${categories.join(", ")}
Allowed subCategories: ${subCategories.slice(0, 40).join(", ")}...
Allowed bhk: ${BHK_OPTIONS.join(", ")}
Allowed furnishing: ${FURNISHING_OPTIONS.join(", ")}
${isSale ? "Default category Property for flats/houses." : `Allowed tenant: ${TENANT_PREFERENCE_OPTIONS.join(", ")}`}`,
  });

  const pick = (val: string, arr: string[]) => (arr.includes(val) ? val : "");
  const num = (v: number | null) => (v != null && v > 0 ? v : null);

  const category =
    object.category === "All" || categories.includes(object.category as (typeof categories)[number])
      ? object.category
      : "All";

  return {
    filters: {
      category,
      subCategory: pick(object.subCategory, subCategories),
      bhk: pick(object.bhk, [...BHK_OPTIONS]),
      furnishing: pick(object.furnishing, [...FURNISHING_OPTIONS]),
      tenantPreference: isSale ? "" : pick(object.tenantPreference ?? "", [...TENANT_PREFERENCE_OPTIONS]),
      priceMin: num(object.priceMin),
      priceMax: num(object.priceMax),
      areaMin: num(object.areaMin),
      areaMax: num(object.areaMax),
      sort: object.sort,
      transactionType,
    },
    placeText: object.placeText.trim(),
    keywords: object.keywords.trim(),
  };
}
