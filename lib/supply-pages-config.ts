import { appPath } from "@/lib/config";
import { rentalAreaPath, rentalCityPath } from "@/lib/cities-config";
import { rentalCategoryPath } from "@/lib/seo/categories";
import type { SupplyIntent } from "@/lib/seo-links";

export interface SupplyFaq {
  q: string;
  a: string;
}

export interface SupplyNearbyLink {
  label: string;
  href: string;
}

export interface SupplyPageConfig {
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  intent: SupplyIntent;
  cityName?: string;
  areaName?: string;
  citySlug?: string;
  areaSlug?: string;
  categorySlug?: string;
  supportedTypes: string[];
  nearbyLinks: SupplyNearbyLink[];
  faq: SupplyFaq[];
}

export interface SupplyCtaOverride {
  headline: string;
  body: string;
  intent?: SupplyIntent;
  cityName?: string;
  areaName?: string;
  citySlug?: string;
  areaSlug?: string;
}

export const SUPPLY_LISTING_STEPS = [
  {
    title: "Create your free account",
    body: "Sign in on RentalPins web or Android. No listing fee to post your property.",
  },
  {
    title: "Add photos and details",
    body: "Pin your property on the map, set rent, amenities, and contact preferences.",
  },
  {
    title: "Go live and respond to inquiries",
    body: "Renters browse map pins and message you directly. Manage listings from the app.",
  },
] as const;

const IN = "in";

function browseCity(citySlug: string, categorySlug?: string): string {
  if (categorySlug) {
    return appPath(rentalCategoryPath(IN, citySlug, categorySlug));
  }
  return appPath(rentalCityPath(IN, citySlug));
}

function browseArea(citySlug: string, areaSlug: string, categorySlug?: string): string {
  if (categorySlug) {
    return appPath(`/rentals/${IN}/${citySlug}/${areaSlug}/${categorySlug}`);
  }
  return appPath(rentalAreaPath(IN, citySlug, areaSlug));
}

const BASE_FAQ: SupplyFaq[] = [
  {
    q: "Is it free to list on RentalPins?",
    a: "Yes — owners can post listings on RentalPins web or Android at no listing fee. Check in-app plans for activation in your city if applicable.",
  },
  {
    q: "Who can list property?",
    a: "Landlords, PG owners, brokers with owner permission, commercial owners, and rental businesses can list flats, PGs, houses, shops, offices, and warehouses.",
  },
  {
    q: "How do renters find my listing?",
    a: "Listings appear as map pins. Renters search by area and category, then contact you directly via chat or WhatsApp.",
  },
];

function pgFaq(place: string): SupplyFaq[] {
  return [
    ...BASE_FAQ,
    {
      q: `Can I list a PG in ${place}?`,
      a: "Yes. Add room types, food options, rules, and photos. Students and professionals search PG listings on the map near colleges and workplaces.",
    },
  ];
}

function flatFaq(city: string): SupplyFaq[] {
  return [
    ...BASE_FAQ,
    {
      q: `Can I list apartments and independent flats in ${city}?`,
      a: "Yes. RentalPins supports apartments, builder floors, and independent houses. Pin the exact location so renters can compare commute and neighbourhood.",
    },
  ];
}

const LIST_PROPERTY_CITIES: Record<string, SupplyPageConfig> = {
  mohali: {
    path: "/list-property/mohali",
    title: "List Property Free in Mohali",
    metaDescription:
      "List your flat, PG, house, shop or office in Mohali free on RentalPins. Connect directly with renters searching on the map — no broker commission.",
    h1: "List your property free in Mohali",
    intro:
      "Mohali owners and PG operators can post listings on RentalPins and reach renters browsing flats, PGs, and commercial spaces across Phase 7, Sector 70, and nearby Tricity areas.",
    intent: "property",
    cityName: "Mohali",
    citySlug: "mohali",
    supportedTypes: ["Flats & apartments", "PG & hostel", "Houses", "Shops", "Offices", "Warehouses"],
    nearbyLinks: [
      { label: "Flats for rent in Mohali", href: browseArea("chandigarh", "mohali", "flats") },
      { label: "PG near Chandigarh University", href: appPath("/rentals/kharar/chandigarh-university") },
      { label: "Mohali rentals hub", href: appPath("/rentals/mohali") },
    ],
    faq: flatFaq("Mohali"),
  },
  kharar: {
    path: "/list-property/kharar",
    title: "List Property Free in Kharar",
    metaDescription:
      "List your PG, flat or commercial property in Kharar free on RentalPins. Reach students near Chandigarh University and local renters on the map.",
    h1: "List your property free in Kharar",
    intro:
      "Kharar landlords and PG owners can list on RentalPins to reach students near Chandigarh University and renters across the Kharar–Landran corridor.",
    intent: "property",
    cityName: "Kharar",
    areaName: "Kharar",
    citySlug: "kharar",
    areaSlug: "kharar",
    supportedTypes: ["PG & hostel", "Flats", "Rooms", "Shops", "Commercial"],
    nearbyLinks: [
      { label: "PG near Chandigarh University", href: appPath("/rentals/kharar/chandigarh-university") },
      { label: "Kharar rentals", href: appPath("/rentals/kharar") },
      { label: "List PG free", href: appPath("/list-pg/kharar") },
    ],
    faq: pgFaq("Kharar"),
  },
  delhi: {
    path: "/list-property/delhi",
    title: "List Property Free in Delhi",
    metaDescription:
      "List your flat, PG, shop or office in Delhi free on RentalPins. Connect directly with renters searching neighbourhoods like Dwarka and GTB Nagar on the map.",
    h1: "List your property free in Delhi",
    intro:
      "Delhi owners can post flats, PGs, shops, and offices on RentalPins. Renters discover listings on the map and contact you directly without a tenant search commission.",
    intent: "property",
    cityName: "Delhi",
    citySlug: "delhi",
    supportedTypes: ["Flats & apartments", "PG & rooms", "Shops", "Offices", "Commercial"],
    nearbyLinks: [
      { label: "Flats for rent in Delhi", href: browseCity("delhi", "flats") },
      { label: "Dwarka rentals", href: browseArea("delhi", "dwarka", "flats") },
      { label: "Mukherjee Nagar flats", href: browseArea("delhi", "mukherjee-nagar", "flats") },
    ],
    faq: flatFaq("Delhi"),
  },
  ludhiana: {
    path: "/list-property/ludhiana",
    title: "List Property Free in Ludhiana",
    metaDescription:
      "List your flat, shop or warehouse in Ludhiana free on RentalPins. Reach local renters browsing map listings across Model Town and city hubs.",
    h1: "List your property free in Ludhiana",
    intro:
      "Ludhiana landlords and commercial owners can list rentals on RentalPins and connect with renters searching flats, shops, and industrial spaces on the map.",
    intent: "property",
    cityName: "Ludhiana",
    citySlug: "ludhiana",
    supportedTypes: ["Flats", "Houses", "Shops", "Offices", "Warehouses"],
    nearbyLinks: [
      { label: "Flats for rent in Ludhiana", href: browseCity("ludhiana", "flats") },
      { label: "Ludhiana rentals hub", href: browseCity("ludhiana") },
    ],
    faq: flatFaq("Ludhiana"),
  },
};

const LIST_PG_AREAS: Record<string, SupplyPageConfig> = {
  "chandigarh-university": {
    path: "/list-pg/chandigarh-university",
    title: "List PG Free near Chandigarh University",
    metaDescription:
      "Own a PG near Chandigarh University? List it free on RentalPins and reach students searching Kharar and Landran on the map.",
    h1: "List your PG free near Chandigarh University",
    intro:
      "PG and hostel owners near Chandigarh University can list on RentalPins to reach students comparing options in Kharar, Landran, and the CU corridor.",
    intent: "pg",
    cityName: "Kharar",
    areaName: "Chandigarh University",
    citySlug: "kharar",
    areaSlug: "chandigarh-university",
    supportedTypes: ["Boys PG", "Girls PG", "Co-ed PG", "Hostel rooms", "Single & shared rooms"],
    nearbyLinks: [
      { label: "PG near CU guide", href: appPath("/blog/kharar-pg-guide-chandigarh-university") },
      { label: "Browse PG near CU", href: appPath("/rentals/kharar/chandigarh-university") },
      { label: "List PG in Kharar", href: appPath("/list-pg/kharar") },
    ],
    faq: pgFaq("the Chandigarh University area"),
  },
  kharar: {
    path: "/list-pg/kharar",
    title: "List PG Free in Kharar",
    metaDescription:
      "List your PG or hostel in Kharar free on RentalPins. Reach students and professionals searching near Chandigarh University and Landran.",
    h1: "List your PG free in Kharar",
    intro:
      "Kharar PG owners can post listings with photos, food details, and rules. Students search map pins near colleges and contact owners directly.",
    intent: "pg",
    cityName: "Kharar",
    areaName: "Kharar",
    citySlug: "kharar",
    areaSlug: "kharar",
    supportedTypes: ["Boys PG", "Girls PG", "Co-ed PG", "Hostel", "Rooms"],
    nearbyLinks: [
      { label: "PG near Chandigarh University", href: appPath("/rentals/kharar/chandigarh-university") },
      { label: "Kharar rentals", href: appPath("/rentals/kharar") },
    ],
    faq: pgFaq("Kharar"),
  },
  mohali: {
    path: "/list-pg/mohali",
    title: "List PG Free in Mohali",
    metaDescription:
      "List your PG or hostel in Mohali free on RentalPins. Reach students and working professionals searching Tricity PG listings on the map.",
    h1: "List your PG free in Mohali",
    intro:
      "Mohali PG operators can list rooms and hostels on RentalPins. Renters filter by area and contact owners directly from map listings.",
    intent: "pg",
    cityName: "Mohali",
    citySlug: "mohali",
    supportedTypes: ["Boys PG", "Girls PG", "Co-ed PG", "Hostel", "Single rooms"],
    nearbyLinks: [
      { label: "Mohali rentals", href: appPath("/rentals/mohali") },
      { label: "Flats in Mohali", href: browseArea("chandigarh", "mohali", "flats") },
    ],
    faq: pgFaq("Mohali"),
  },
};

const LIST_FLAT_CITIES: Record<string, SupplyPageConfig> = {
  mohali: {
    path: "/list-flat/mohali",
    title: "List Flat Free in Mohali",
    metaDescription:
      "Own a flat in Mohali? List it free on RentalPins. Flats, apartments, houses and PGs are welcome. Connect directly with renters on the map.",
    h1: "List your flat free in Mohali",
    intro:
      "Mohali flat owners can post apartments and builder floors on RentalPins. Renters browse Phase 7, Sector 70, and Tricity listings on the map.",
    intent: "flat",
    cityName: "Mohali",
    citySlug: "mohali",
    categorySlug: "flats",
    supportedTypes: ["1 BHK", "2 BHK", "3 BHK", "Builder floor", "Apartment"],
    nearbyLinks: [
      { label: "Flats for rent in Mohali", href: browseArea("chandigarh", "mohali", "flats") },
      { label: "List property in Mohali", href: appPath("/list-property/mohali") },
    ],
    faq: flatFaq("Mohali"),
  },
  delhi: {
    path: "/list-flat/delhi",
    title: "List Flat Free in Delhi",
    metaDescription:
      "Looking for tenants in Delhi? List your flat free on RentalPins and connect directly with renters searching neighbourhoods on the map.",
    h1: "List your flat free in Delhi",
    intro:
      "Delhi flat owners can list apartments and independent floors on RentalPins. Renters search by locality — Dwarka, GTB Nagar, Mukherjee Nagar, and more.",
    intent: "flat",
    cityName: "Delhi",
    citySlug: "delhi",
    categorySlug: "flats",
    supportedTypes: ["1 BHK", "2 BHK", "3 BHK", "Builder floor", "Studio"],
    nearbyLinks: [
      { label: "Flats for rent in Delhi", href: browseCity("delhi", "flats") },
      { label: "List property in Delhi", href: appPath("/list-property/delhi") },
    ],
    faq: flatFaq("Delhi"),
  },
  ludhiana: {
    path: "/list-flat/ludhiana",
    title: "List Flat Free in Ludhiana",
    metaDescription:
      "Own a flat in Ludhiana? List your rental property free on RentalPins and connect with local renters browsing map listings.",
    h1: "List your flat free in Ludhiana",
    intro:
      "Ludhiana flat owners can post listings with map pins, rent details, and photos. Renters compare options across Model Town and city localities.",
    intent: "flat",
    cityName: "Ludhiana",
    citySlug: "ludhiana",
    categorySlug: "flats",
    supportedTypes: ["1 BHK", "2 BHK", "3 BHK", "Apartment", "Independent floor"],
    nearbyLinks: [
      { label: "Flats for rent in Ludhiana", href: browseCity("ludhiana", "flats") },
      { label: "List property in Ludhiana", href: appPath("/list-property/ludhiana") },
    ],
    faq: flatFaq("Ludhiana"),
  },
};

const ROOT_PAGES: Record<string, SupplyPageConfig> = {
  "/list-property": {
    path: "/list-property",
    title: "List Property Free on RentalPins",
    metaDescription:
      "List your flat, PG, house, shop, office or warehouse free on RentalPins. Owners connect directly with renters browsing map listings across India.",
    h1: "List your property free on RentalPins",
    intro:
      "RentalPins helps landlords, PG owners, brokers, and commercial operators reach renters through map-based discovery. Post your listing free and manage inquiries from web or Android.",
    intent: "property",
    supportedTypes: ["Flats & apartments", "PG & hostel", "Houses", "Shops", "Offices", "Warehouses", "Commercial"],
    nearbyLinks: [
      { label: "List flat in Mohali", href: appPath("/list-flat/mohali") },
      { label: "List PG near CU", href: appPath("/list-pg/chandigarh-university") },
      { label: "List property in Delhi", href: appPath("/list-property/delhi") },
      { label: "Browse rentals map", href: appPath("/search") },
    ],
    faq: BASE_FAQ,
  },
  "/list-pg": {
    path: "/list-pg",
    title: "List PG Free on RentalPins",
    metaDescription:
      "List your PG or hostel free on RentalPins. Reach students and professionals searching PG listings on the map near colleges and workplaces.",
    h1: "List your PG free on RentalPins",
    intro:
      "PG and hostel owners can post listings with room types, food options, and house rules. Renters browse map pins and contact owners directly.",
    intent: "pg",
    supportedTypes: ["Boys PG", "Girls PG", "Co-ed PG", "Hostel", "Single & shared rooms"],
    nearbyLinks: [
      { label: "List PG near Chandigarh University", href: appPath("/list-pg/chandigarh-university") },
      { label: "List PG in Kharar", href: appPath("/list-pg/kharar") },
      { label: "PG near CU guide", href: appPath("/blog/kharar-pg-guide-chandigarh-university") },
    ],
    faq: pgFaq("your area"),
  },
  "/list-flat": {
    path: "/list-flat",
    title: "List Flat Free on RentalPins",
    metaDescription:
      "List your flat or apartment free on RentalPins. Connect directly with renters searching map listings in Mohali, Delhi, Ludhiana and other cities.",
    h1: "List your flat free on RentalPins",
    intro:
      "Flat and apartment owners can post listings with map pins, rent, and amenities. Renters search by city and locality without broker search fees.",
    intent: "flat",
    supportedTypes: ["1 BHK", "2 BHK", "3 BHK", "Builder floor", "Apartment", "Studio"],
    nearbyLinks: [
      { label: "List flat in Mohali", href: appPath("/list-flat/mohali") },
      { label: "List flat in Delhi", href: appPath("/list-flat/delhi") },
      { label: "List flat in Ludhiana", href: appPath("/list-flat/ludhiana") },
    ],
    faq: flatFaq("your city"),
  },
  "/list-commercial-property": {
    path: "/list-commercial-property",
    title: "List Commercial Property Free on RentalPins",
    metaDescription:
      "List your shop, office, warehouse or commercial space free on RentalPins. Reach businesses and renters searching commercial listings on the map.",
    h1: "List your commercial property free",
    intro:
      "Commercial owners can list shops, offices, warehouses, and industrial units on RentalPins. Businesses discover listings on the map and contact owners directly.",
    intent: "commercial",
    supportedTypes: ["Retail shop", "Office space", "Warehouse", "Godown", "Showroom", "Industrial unit"],
    nearbyLinks: [
      { label: "List office space", href: appPath("/list-office") },
      { label: "List shop", href: appPath("/list-shop") },
      { label: "List warehouse", href: appPath("/list-warehouse") },
      { label: "Commercial rentals Delhi", href: browseCity("delhi", "commercial") },
    ],
    faq: [
      ...BASE_FAQ,
      {
        q: "Can brokers list commercial property?",
        a: "Yes, if you have owner permission. Add accurate location, size, and rent details so businesses can compare options on the map.",
      },
    ],
  },
  "/list-office": {
    path: "/list-office",
    title: "List Office Space Free on RentalPins",
    metaDescription:
      "List your office or co-working space free on RentalPins. Businesses search map listings and contact owners directly.",
    h1: "List your office space free",
    intro:
      "Office owners and operators can post furnished or bare-shell spaces on RentalPins. Businesses browse by area and reach out directly from map listings.",
    intent: "office",
    supportedTypes: ["Furnished office", "Bare shell", "Co-working desk", "Small office", "Commercial floor"],
    nearbyLinks: [
      { label: "Offices for rent", href: appPath("/offices-for-rent") },
      { label: "List commercial property", href: appPath("/list-commercial-property") },
      { label: "Delhi commercial", href: browseCity("delhi", "offices") },
    ],
    faq: BASE_FAQ,
  },
  "/list-shop": {
    path: "/list-shop",
    title: "List Shop for Rent Free on RentalPins",
    metaDescription:
      "List your retail shop or commercial unit free on RentalPins. Reach businesses searching shop rentals on the map.",
    h1: "List your shop for rent free",
    intro:
      "Shop and retail space owners can post listings with location, size, and rent. Businesses compare map pins and contact owners directly.",
    intent: "shop",
    supportedTypes: ["Retail shop", "Showroom", "Street-facing unit", "Market shop", "Commercial plot"],
    nearbyLinks: [
      { label: "Shops for rent", href: appPath("/shops-for-rent") },
      { label: "List commercial property", href: appPath("/list-commercial-property") },
    ],
    faq: BASE_FAQ,
  },
  "/list-warehouse": {
    path: "/list-warehouse",
    title: "List Warehouse Free on RentalPins",
    metaDescription:
      "List your warehouse, godown or industrial space free on RentalPins. Businesses search map listings and contact owners directly.",
    h1: "List your warehouse free",
    intro:
      "Warehouse and godown owners can list industrial spaces on RentalPins. Logistics and business users browse map pins by area and size.",
    intent: "warehouse",
    supportedTypes: ["Warehouse", "Godown", "Industrial shed", "Storage unit", "Factory space"],
    nearbyLinks: [
      { label: "Warehouse for rent", href: appPath("/warehouse-for-rent") },
      { label: "List commercial property", href: appPath("/list-commercial-property") },
    ],
    faq: BASE_FAQ,
  },
};

/** Priority rental hub / blog paths with tailored owner CTA copy. */
export const SUPPLY_CTA_OVERRIDES: Record<string, SupplyCtaOverride> = {
  "/blog/kharar-pg-guide-chandigarh-university": {
    headline: "Own a PG near Chandigarh University?",
    body: "List your PG free on RentalPins and reach students searching nearby.",
    intent: "pg",
    cityName: "Kharar",
    areaName: "Chandigarh University",
    citySlug: "kharar",
    areaSlug: "chandigarh-university",
  },
  "/rentals/in/chandigarh/mohali/flats": {
    headline: "Own a flat in Mohali?",
    body: "List your flat free on RentalPins. Flats, apartments, houses and PGs are welcome.",
    intent: "flat",
    cityName: "Mohali",
    citySlug: "mohali",
    areaSlug: "mohali",
  },
  "/rentals/in/delhi/flats": {
    headline: "Looking for tenants in Delhi?",
    body: "List your flat free and connect directly with renters.",
    intent: "flat",
    cityName: "Delhi",
    citySlug: "delhi",
  },
  "/rentals/in/ludhiana/flats": {
    headline: "Own a flat in Ludhiana?",
    body: "List your rental property free and connect with local renters.",
    intent: "flat",
    cityName: "Ludhiana",
    citySlug: "ludhiana",
  },
};

export function resolveSupplyCtaOverride(path: string): SupplyCtaOverride | null {
  const normalized = path.split("?")[0]?.replace(/\/$/, "") ?? path;
  return SUPPLY_CTA_OVERRIDES[normalized] ?? null;
}

export function getSupplyPageByPath(path: string): SupplyPageConfig | null {
  const normalized = path.replace(/\/$/, "") || path;
  if (ROOT_PAGES[normalized]) return ROOT_PAGES[normalized]!;
  return null;
}

export function getListPropertyCityConfig(city: string): SupplyPageConfig | null {
  return LIST_PROPERTY_CITIES[city] ?? null;
}

export function getListPgAreaConfig(area: string): SupplyPageConfig | null {
  return LIST_PG_AREAS[area] ?? null;
}

export function getListFlatCityConfig(city: string): SupplyPageConfig | null {
  return LIST_FLAT_CITIES[city] ?? null;
}

export function getListPropertyCitySlugs(): string[] {
  return Object.keys(LIST_PROPERTY_CITIES);
}

export function getListPgAreaSlugs(): string[] {
  return Object.keys(LIST_PG_AREAS);
}

export function getListFlatCitySlugs(): string[] {
  return Object.keys(LIST_FLAT_CITIES);
}

/** All supply-side SEO paths for sitemap.xml */
export function getSupplyPageSitemapPaths(): string[] {
  return [
    ...Object.keys(ROOT_PAGES),
    ...Object.values(LIST_PROPERTY_CITIES).map((c) => c.path),
    ...Object.values(LIST_PG_AREAS).map((c) => c.path),
    ...Object.values(LIST_FLAT_CITIES).map((c) => c.path),
  ];
}
