import { mapPathForTransaction, parseSearchQueryMerged } from "@/lib/ai-search";
import { buildSearchUrl } from "@/lib/search-url";
import { DEFAULT_LISTING_FILTERS } from "@/lib/listing-filters";
import type { TransactionType } from "@/lib/transaction-type";
import { BUY_HUBS } from "@/lib/sale/buy-pages-config";

export type AdvisorMode = "buy" | "rent" | "invest";

export interface AdvisorInput {
  mode: AdvisorMode;
  budgetMin: number | null;
  budgetMax: number | null;
  purpose: string;
  timeline: string;
  locationHint: string;
}

export interface AreaRecommendation {
  slug: string;
  label: string;
  reason: string;
  href: string;
}

export function transactionTypeForAdvisorMode(mode: AdvisorMode): TransactionType {
  return mode === "rent" ? "rent" : "sale";
}

export function buildAdvisorSearchQuery(input: AdvisorInput): string {
  const parts: string[] = [];
  if (input.mode === "buy") parts.push("property for sale");
  else if (input.mode === "rent") parts.push("for rent");
  else parts.push("investment property for sale");

  if (input.budgetMax != null && input.budgetMax > 0) {
    const lakhs = Math.round(input.budgetMax / 1_00_000);
    parts.push(`under ${lakhs} lakh`);
  } else if (input.budgetMin != null && input.budgetMin > 0) {
    const lakhs = Math.round(input.budgetMin / 1_00_000);
    parts.push(`above ${lakhs} lakh`);
  }

  const loc = input.locationHint.trim();
  if (loc) parts.push(`near ${loc}`);

  const purpose = input.purpose.trim().toLowerCase();
  if (purpose && purpose !== "any") parts.push(purpose);

  const timeline = input.timeline.trim().toLowerCase();
  if (timeline && timeline !== "flexible") parts.push(timeline);

  return parts.join(" ");
}

/** Static Tricity area shortlist by budget band (buy / invest modes). */
export function recommendBuyAreas(
  budgetMax: number | null,
  locationHint?: string
): AreaRecommendation[] {
  const hint = locationHint?.toLowerCase() ?? "";
  const hubs = Object.values(BUY_HUBS);

  const scored = hubs.map((hub) => {
    let score = 0;
    if (hint.includes(hub.slug) || hint.includes(hub.cityName.toLowerCase())) score += 3;
    if (budgetMax == null) score += 1;
    else if (budgetMax >= 1_00_00_000 && hub.slug === "mohali") score += 2;
    else if (budgetMax >= 50_00_000 && (hub.slug === "zirakpur" || hub.slug === "kharar")) score += 2;
    else if (budgetMax < 50_00_000 && hub.slug === "kharar") score += 2;
    else score += 1;
    return { hub, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 4).map(({ hub }) => ({
    slug: hub.slug,
    label: hub.cityName,
    reason: hub.subhead.slice(0, 120) + (hub.subhead.length > 120 ? "…" : ""),
    href: `/buy/${hub.slug}`,
  }));
}

export async function resolveAdvisorMapUrl(input: AdvisorInput): Promise<{
  mapUrl: string;
  query: string;
  recommendations: AreaRecommendation[];
}> {
  const transactionType = transactionTypeForAdvisorMode(input.mode);
  const query = buildAdvisorSearchQuery(input);
  const parsed = await parseSearchQueryMerged(query, DEFAULT_LISTING_FILTERS, transactionType);

  const mapUrl = buildSearchUrl({
    filters: parsed.filters,
    centerLat: null,
    centerLng: null,
    zoom: 12,
    bounds: null,
    placeQuery: parsed.placeText || input.locationHint.trim() || null,
    keywords: parsed.keywords || null,
    selectedId: null,
    drawnArea: null,
  });

  const recommendations =
    input.mode === "rent"
      ? []
      : recommendBuyAreas(input.budgetMax, input.locationHint);

  return { mapUrl, query, recommendations };
}

export function advisorModeLabel(mode: AdvisorMode): string {
  switch (mode) {
    case "buy":
      return "Buy property";
    case "rent":
      return "Find rentals";
    case "invest":
      return "Invest in property";
  }
}

export function defaultAdvisorMapPath(mode: AdvisorMode): string {
  return mapPathForTransaction(transactionTypeForAdvisorMode(mode));
}
