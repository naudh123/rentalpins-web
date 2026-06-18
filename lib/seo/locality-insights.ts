import type { ListingCard } from "@/lib/types/listing";

export interface MarketInsightsData {
  heading: string;
  intro: string;
  priceRange: string | null;
  commonTypes: string[];
  popularCategories: string[];
  nearbyAreas: string[];
  demandNote: string;
  hasRealData: boolean;
}

export interface MarketInsightsInput {
  city: string;
  locality?: string;
  listings: Pick<ListingCard, "price" | "priceUnit" | "category" | "subCategory">[];
  nearbyLocalities?: string[];
}

function formatInrRange(min: number, max: number, unit: string): string {
  const fmt = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString("en-IN")}`;
  return `${fmt(min)} – ${fmt(max)}${unit ? ` ${unit}` : ""}`;
}

/** Build market insights from real listing data when sufficient; qualitative fallback otherwise. */
export function buildMarketInsights(input: MarketInsightsInput): MarketInsightsData {
  const { city, locality, listings } = input;
  const place = locality ? `${locality}, ${city}` : city;
  const heading = `Market Insights for ${place}`;

  const active = listings.filter((l) => l.price > 0);
  const hasEnough = active.length >= 3;

  if (!hasEnough) {
    return {
      heading,
      intro: locality
        ? `${locality} ${city} is a popular locality for tenants and buyers looking for owner-direct flats, rooms, and family rentals near key commercial areas.`
        : `${city} is an active rental and buy market on RentalPins with owner-direct listings across residential and commercial categories.`,
      priceRange: null,
      commonTypes: [],
      popularCategories: [],
      nearbyAreas: input.nearbyLocalities ?? [],
      demandNote:
        "Browse live listings on this page for current availability. RentalPins updates inventory as owners activate new listings.",
      hasRealData: false,
    };
  }

  const prices = active.map((l) => l.price).sort((a, b) => a - b);
  const min = prices[0]!;
  const max = prices[prices.length - 1]!;
  const dominantUnit = active[0]?.priceUnit ?? "per month";

  const typeCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  for (const l of active) {
    const sub = l.subCategory || l.category;
    typeCounts.set(sub, (typeCounts.get(sub) ?? 0) + 1);
    categoryCounts.set(l.category, (categoryCounts.get(l.category) ?? 0) + 1);
  }

  const commonTypes = [...typeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([t]) => t);

  const popularCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c);

  return {
    heading,
    intro: `Based on ${active.length} active listings on RentalPins in ${place}, here is a snapshot of current market activity.`,
    priceRange: formatInrRange(min, max, dominantUnit),
    commonTypes,
    popularCategories,
    nearbyAreas: input.nearbyLocalities ?? [],
    demandNote:
      active.length >= 10
        ? `Strong listing activity suggests steady demand for rentals in ${place}. New listings are added regularly by owners.`
        : `Listing activity in ${place} is growing on RentalPins. Check back often for new owner-direct inventory.`,
    hasRealData: true,
  };
}
