import { appPath } from "@/lib/config";
import { mapSearchUrl } from "@/lib/map-search-url";
import { BUY_POST_PATH, BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";
import type { TransactionType } from "@/lib/transaction-type";

export type SupplyIntent =
  | "property"
  | "pg"
  | "hostel"
  | "flat"
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
  /** Rent map (`/search`) or buy map (`/buy/search`). Default rent. */
  transactionType?: TransactionType;
}

export interface SeoListLinkOptions {
  citySlug?: string;
  areaSlug?: string;
  intent?: SupplyIntent;
}

function mapBasePath(transactionType: TransactionType): string {
  return transactionType === "sale" ? BUY_SEARCH_PATH : "/search";
}

/** Map browse CTA — area-centred rent or buy search when geo is known. */
export function getBrowseHref(options: SeoBrowseLinkOptions = {}): string {
  const {
    lat,
    lng,
    zoom = 12,
    placeQuery,
    category,
    keywords,
    transactionType = "rent",
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
      placeQuery,
      transactionType
    );
    return appPath(path);
  }

  const params = new URLSearchParams();
  if (placeQuery?.trim()) params.set("q", placeQuery.trim());
  if (keywords?.trim()) params.set("keywords", keywords.trim());
  if (transactionType === "sale") params.set("category", "Property");
  else if (category?.trim() && category !== "All") params.set("category", category.trim());
  const qs = params.toString();
  const base = mapBasePath(transactionType);
  return appPath(qs ? `${base}?${qs}` : base);
}

/** Buy map deep link — shorthand for getBrowseHref with sale transaction. */
export function getBuyBrowseHref(
  options: Omit<SeoBrowseLinkOptions, "transactionType"> = {}
): string {
  return getBrowseHref({ ...options, transactionType: "sale" });
}

/** List CTA — rent post flow. */
export function getListPropertyHref(_options: SeoListLinkOptions = {}): string {
  return appPath("/post");
}

/** List-for-sale CTA — buy post flow. */
export function getListForSaleHref(_options: SeoListLinkOptions = {}): string {
  return appPath(BUY_POST_PATH);
}

export function intentFromCategorySlug(slug: string): SupplyIntent {
  const map: Record<string, SupplyIntent> = {
    pg: "pg",
    shops: "shop",
    offices: "office",
    warehouses: "warehouse",
    commercial: "commercial",
    vehicles: "vehicle",
    flats: "flat",
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

export const SEO_BUY_SUPPLY_NOTICE =
  "RentalPins Buy is growing sale inventory in this corridor. Browse owner-direct pins on the buy map or list your property for sale.";

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

/** Owner supply landing page for a rental hub — used for internal links from SEO pages. */
export function getSupplyLandingHref(options: {
  citySlug?: string;
  areaSlug?: string;
  categorySlug?: string;
  intent?: SupplyIntent;
}): string {
  const { citySlug, areaSlug, categorySlug, intent } = options;
  const flatIntent = categorySlug === "flats" || intent === "flat";
  const pgIntent = categorySlug === "pg" || intent === "pg" || intent === "hostel";

  if (flatIntent) {
    if (citySlug === "mohali" || areaSlug === "mohali") return appPath("/list-flat/mohali");
    if (citySlug === "delhi") return appPath("/list-flat/delhi");
    if (citySlug === "ludhiana") return appPath("/list-flat/ludhiana");
  }

  if (pgIntent) {
    if (areaSlug === "chandigarh-university" || areaSlug === "kharar") {
      return appPath("/list-pg/chandigarh-university");
    }
    if (citySlug === "mohali" || areaSlug === "mohali") return appPath("/list-pg/mohali");
  }

  if (categorySlug === "commercial" || intent === "commercial") {
    return appPath("/list-commercial-property");
  }
  if (categorySlug === "offices" || intent === "office") return appPath("/list-office");
  if (categorySlug === "shops" || intent === "shop") return appPath("/list-shop");
  if (categorySlug === "warehouses" || intent === "warehouse") {
    return appPath("/list-warehouse");
  }

  if (citySlug && ["mohali", "kharar", "delhi", "ludhiana"].includes(citySlug)) {
    return appPath(`/list-property/${citySlug}`);
  }

  return appPath("/list-property");
}
