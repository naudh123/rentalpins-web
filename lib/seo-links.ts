import { appPath } from "@/lib/config";
import { mapSearchUrl } from "@/lib/map-search-url";

export type SupplyIntent =
  | "property"
  | "pg"
  | "hostel"
  | "commercial"
  | "office"
  | "shop"
  | "warehouse"
  | "vehicle"
  | "equipment"
  | "general";

export interface SeoBrowseLinkOptions {
  citySlug?: string;
  areaSlug?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  placeQuery?: string;
  category?: string;
  keywords?: string;
}

export interface SeoListLinkOptions {
  citySlug?: string;
  areaSlug?: string;
  intent?: SupplyIntent;
}

/** Map browse CTA to area-centred search when geo is known. */
export function getBrowseHref(options: SeoBrowseLinkOptions = {}): string {
  const {
    lat,
    lng,
    zoom = 12,
    placeQuery,
    category,
    keywords,
  } = options;

  if (lat != null && lng != null) {
    const path = mapSearchUrl(
      lat,
      lng,
      zoom,
      undefined,
      category && category !== "All" ? category : undefined,
      undefined,
      keywords ?? undefined,
      placeQuery
    );
    return appPath(path);
  }

  const params = new URLSearchParams();
  if (placeQuery?.trim()) params.set("place", placeQuery.trim());
  if (keywords?.trim()) params.set("q", keywords.trim());
  const qs = params.toString();
  return appPath(qs ? `/search?${qs}` : "/search");
}

/** List CTA — existing post flow; intent/slugs are for tracking attributes. */
export function getListPropertyHref(_options: SeoListLinkOptions = {}): string {
  return appPath("/post");
}

export function intentFromCategorySlug(slug: string): SupplyIntent {
  const map: Record<string, SupplyIntent> = {
    pg: "pg",
    shops: "shop",
    offices: "office",
    warehouses: "warehouse",
    commercial: "commercial",
    vehicles: "vehicle",
    flats: "property",
    houses: "property",
  };
  return map[slug] ?? "property";
}

export function intentFromMarketingSlug(slug: string): SupplyIntent {
  const s = slug.toLowerCase();
  if (s.includes("equipment")) return "equipment";
  if (s.includes("vehicle")) return "vehicle";
  if (s.includes("warehouse") || s.includes("godown") || s.includes("industrial") || s.includes("factory")) {
    return "warehouse";
  }
  if (s.includes("office")) return "office";
  if (s.includes("shop")) return "shop";
  if (s.includes("commercial")) return "commercial";
  if (s.includes("hostel")) return "hostel";
  if (s.includes("pg")) return "pg";
  return "property";
}

export const SEO_SUPPLY_GROWTH_NOTICE =
  "RentalPins is growing listings in this area. You can browse nearby rentals on the map or list your property free.";

/** Parse city/area slugs from canonical rental hub paths like /rentals/in/chandigarh/mohali/sector-70 */
export function slugsFromRentalHubHref(hubHref: string): {
  citySlug?: string;
  areaSlug?: string;
} {
  const parts = hubHref.split("/").filter(Boolean);
  const rest = parts.slice(2);
  if (rest.length === 0) return {};
  if (rest.length === 1) return { citySlug: rest[0] };
  if (rest.length === 2) return { citySlug: rest[1] };
  return { citySlug: rest[1], areaSlug: rest[2] };
}
