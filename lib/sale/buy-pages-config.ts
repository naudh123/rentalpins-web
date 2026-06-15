/** Luxury buy hub pages — Tricity first. */

import type { TransactionType } from "@/lib/transaction-type";

export interface BuyNearbyHub {
  slug: string;
  label: string;
}

export interface BuyNearbyArea {
  hubSlug: string;
  areaSlug?: string;
  label: string;
}

export interface BuyPageConfig {
  hubSlug: string;
  areaSlug?: string;
  /** Hub slug for listing fetch (parent city geohash). */
  listingAreaSlug: string;
  slug: string;
  cityName: string;
  areaName: string;
  placeQuery: string;
  headline: string;
  subhead: string;
  eyebrow: string;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  faqs: { q: string; a: string }[];
  highlights: { title: string; desc: string }[];
  nearbyBuyHubs?: BuyNearbyHub[];
  nearbyBuyAreas?: BuyNearbyArea[];
}

/** @deprecated Use BuyPageConfig — kept for gradual migration. */
export type BuyHubConfig = BuyPageConfig;

export const BUY_HUB_SLUGS = ["mohali", "kharar", "zirakpur", "panchkula"] as const;
export type BuyHubSlug = (typeof BUY_HUB_SLUGS)[number];

export const BUY_SUB_AREA_KEYS = [
  "mohali/phase-7",
  "mohali/sector-70",
  "mohali/sector-67",
  "kharar/chandigarh-university",
] as const;

const TRICITY_NEARBY: BuyNearbyHub[] = [
  { slug: "mohali", label: "Mohali" },
  { slug: "kharar", label: "Kharar" },
  { slug: "zirakpur", label: "Zirakpur" },
  { slug: "panchkula", label: "Panchkula" },
];

function nearbyExcept(slug: string): BuyNearbyHub[] {
  return TRICITY_NEARBY.filter((h) => h.slug !== slug);
}

function pageKey(hub: string, area?: string): string {
  return area ? `${hub}/${area}` : hub;
}

const HUB_PAGES: Record<string, BuyPageConfig> = {
  mohali: {
    hubSlug: "mohali",
    slug: "mohali",
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: "Mohali",
    placeQuery: "Mohali, Punjab",
    eyebrow: "RentalPins Buy · Chandigarh Tricity",
    headline: "Private property for sale in Mohali",
    subhead:
      "Owner-direct flats, villas, and land on one curated map. No brokerage search fees — inquire with confidence.",
    mapCenter: { lat: 30.7046, lng: 76.7179 },
    mapZoom: 12,
    nearbyBuyHubs: nearbyExcept("mohali"),
    nearbyBuyAreas: [
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7" },
      { hubSlug: "mohali", areaSlug: "sector-70", label: "Sector 70" },
      { hubSlug: "mohali", areaSlug: "sector-67", label: "Sector 67" },
    ],
    highlights: [
      {
        title: "Owner direct",
        desc: "Speak with sellers without unlock fees or broker commissions on search.",
      },
      {
        title: "Map-first discovery",
        desc: "Browse sale inventory by sector, IT Park corridor, and Aerocity surroundings.",
      },
      {
        title: "Curated Tricity focus",
        desc: "Dense local inventory across Mohali, Kharar, and Greater Mohali growth corridors.",
      },
    ],
    faqs: [
      {
        q: "Is RentalPins Buy only for Mohali?",
        a: "Mohali is our launch hub — we also cover Kharar, Zirakpur, and Panchkula across Chandigarh Tricity.",
      },
      {
        q: "Are these broker listings?",
        a: "RentalPins Buy prioritises owner-direct and authorised seller listings. Always verify documents before any token or payment.",
      },
      {
        q: "How do I list my property for sale?",
        a: "Use List for sale — add photos, location, and asking price. Your listing appears on the sale map after activation.",
      },
      {
        q: "Which Mohali areas have the most sale inventory?",
        a: "Phase 7, Phase 9, Sector 70, IT Park, and Aerocity are commonly searched. Pan the sale map to compare pins by locality.",
      },
    ],
  },
  kharar: {
    hubSlug: "kharar",
    slug: "kharar",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Kharar",
    placeQuery: "Kharar, Punjab",
    eyebrow: "RentalPins Buy · Chandigarh Tricity",
    headline: "Property for sale in Kharar",
    subhead:
      "Flats, plots, and builder floors near Chandigarh University and Kharar town — owner-direct sale listings on the map.",
    mapCenter: { lat: 30.746, lng: 76.6486 },
    mapZoom: 13,
    nearbyBuyHubs: nearbyExcept("kharar"),
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "chandigarh-university", label: "Near CU" },
    ],
    highlights: [
      {
        title: "CU belt proximity",
        desc: "Compare sale pins along the Kharar–Landran corridor and Kharar town for family and investor buys.",
      },
      {
        title: "Affordable Tricity entry",
        desc: "Kharar often offers lower per-sqft asks than Chandigarh sectors — ideal for first-time buyers.",
      },
      {
        title: "Direct seller contact",
        desc: "Message owners from map pins without paying brokerage to search or shortlist.",
      },
    ],
    faqs: [
      {
        q: "Can I find flats for sale near Chandigarh University?",
        a: "Yes — filter Property on the Kharar sale map and compare pins by distance to CU and Kharar bus stand.",
      },
      {
        q: "Are plots and independent floors listed in Kharar?",
        a: "Owners list plots, builder floors, and apartments. Check listing detail for title and possession notes.",
      },
      {
        q: "How do I list property for sale in Kharar?",
        a: "Post through List for sale with accurate Kharar locality in the title so buyers find your pin.",
      },
    ],
  },
  zirakpur: {
    hubSlug: "zirakpur",
    slug: "zirakpur",
    listingAreaSlug: "zirakpur",
    cityName: "Zirakpur",
    areaName: "Zirakpur",
    placeQuery: "Zirakpur, Punjab",
    eyebrow: "RentalPins Buy · Chandigarh Tricity",
    headline: "Property for sale in Zirakpur",
    subhead:
      "Houses, builder floors, and apartments on the Chandigarh–Punjab border — family-friendly sale inventory on one map.",
    mapCenter: { lat: 30.6434, lng: 76.8085 },
    mapZoom: 13,
    nearbyBuyHubs: nearbyExcept("zirakpur"),
    highlights: [
      {
        title: "Border commute belt",
        desc: "Popular with families commuting to Chandigarh, Mohali, and Panchkula — compare highway and Gazipur belts.",
      },
      {
        title: "Builder floors & villas",
        desc: "Independent homes and 2–3 BHK floors are common — browse by pin before site visits.",
      },
      {
        title: "Owner-first listings",
        desc: "No brokerage to discover or contact sellers on RentalPins Buy.",
      },
    ],
    faqs: [
      {
        q: "Is Zirakpur good for family home purchases?",
        a: "Many buyers choose Zirakpur for larger homes and relative value vs Chandigarh sectors. Verify society approvals and connectivity.",
      },
      {
        q: "What property types are for sale in Zirakpur?",
        a: "Builder floors, independent houses, apartments, and some plots — filter Property on the sale map.",
      },
      {
        q: "How do I sell my house in Zirakpur?",
        a: "List for sale with society name, floor count, and highway or landmark cues in the description.",
      },
    ],
  },
  panchkula: {
    hubSlug: "panchkula",
    slug: "panchkula",
    listingAreaSlug: "panchkula",
    cityName: "Panchkula",
    areaName: "Panchkula",
    placeQuery: "Panchkula, Haryana",
    eyebrow: "RentalPins Buy · Chandigarh Tricity",
    headline: "Property for sale in Panchkula",
    subhead:
      "Flats, villas, and plots in Panchkula sectors and extension belts — curated owner-direct sale listings.",
    mapCenter: { lat: 30.6942, lng: 76.8606 },
    mapZoom: 12,
    nearbyBuyHubs: nearbyExcept("panchkula"),
    highlights: [
      {
        title: "Planned sector living",
        desc: "Browse sale inventory across Panchkula sectors and extension areas with map-first clarity.",
      },
      {
        title: "Tricity connectivity",
        desc: "Compare Panchkula pins vs Mohali and Zirakpur for daily commute and lifestyle fit.",
      },
      {
        title: "Document-first approach",
        desc: "We surface owner listings — always verify title, approvals, and encumbrances before token.",
      },
    ],
    faqs: [
      {
        q: "Which Panchkula areas are popular for buyers?",
        a: "Sector belts and extension corridors vary by budget. Use the sale map to compare pins before scheduling visits.",
      },
      {
        q: "Are commercial properties for sale listed?",
        a: "RentalPins Buy v1 focuses on residential Property category. Commercial sale listings may follow in later phases.",
      },
      {
        q: "How do I list a flat for sale in Panchkula?",
        a: "Use List for sale, pin your society accurately, and include sector or block in the title.",
      },
    ],
  },
};

const SUB_AREA_PAGES: Record<string, BuyPageConfig> = {
  "mohali/phase-7": {
    hubSlug: "mohali",
    areaSlug: "phase-7",
    slug: "phase-7",
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: "Phase 7, Mohali",
    placeQuery: "Phase 7, Mohali",
    eyebrow: "RentalPins Buy · Mohali",
    headline: "Flats for sale in Phase 7, Mohali",
    subhead:
      "Owner-direct apartments and villas in Phase 7 societies — map-first sale discovery without brokerage search fees.",
    mapCenter: { lat: 30.7075, lng: 76.801 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-70", label: "Sector 70" },
      { hubSlug: "mohali", areaSlug: "sector-67", label: "Sector 67" },
      { hubSlug: "mohali", label: "All Mohali" },
      { hubSlug: "kharar", label: "Kharar" },
    ],
    highlights: [
      {
        title: "Family society belt",
        desc: "Phase 7 gated societies attract buyers seeking planned layouts and Tricity connectivity.",
      },
      {
        title: "Sector-level map",
        desc: "Open the sale map centred on Phase 7 to compare pins before site visits.",
      },
      {
        title: "Owner-direct",
        desc: "Message sellers from listing pins — no brokerage to search or shortlist.",
      },
    ],
    faqs: [
      {
        q: "Why buy in Phase 7 Mohali?",
        a: "Strong society inventory, family-friendly layout, and connectivity toward Chandigarh and IT Park make Phase 7 a top buyer search cluster.",
      },
      {
        q: "What property types are for sale in Phase 7?",
        a: "Apartments, builder floors, and some villas — filter Property on the Phase 7 sale map.",
      },
      {
        q: "How do I list a flat for sale in Phase 7?",
        a: "Use List for sale with society name and Phase 7 in the title for buyer discovery.",
      },
    ],
  },
  "mohali/sector-70": {
    hubSlug: "mohali",
    areaSlug: "sector-70",
    slug: "sector-70",
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: "Sector 70, Mohali",
    placeQuery: "Sector 70, Mohali",
    eyebrow: "RentalPins Buy · Mohali",
    headline: "Property for sale in Sector 70, Mohali",
    subhead:
      "2–3 BHK flats and builder floors in Sector 70 — owner-direct sale listings on the map.",
    mapCenter: { lat: 30.6795, lng: 76.7355 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-67", label: "Sector 67" },
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7" },
      { hubSlug: "mohali", label: "All Mohali" },
      { hubSlug: "zirakpur", label: "Zirakpur" },
    ],
    highlights: [
      {
        title: "Mid-budget belt",
        desc: "Sector 70 suits buyers comparing value across Mohali–Zirakpur corridors.",
      },
      {
        title: "Map-centred search",
        desc: "Browse Sector 70 sale pins with direct seller contact.",
      },
      {
        title: "Document diligence",
        desc: "Verify title and society approvals before token or payment.",
      },
    ],
    faqs: [
      {
        q: "What is commonly for sale in Sector 70?",
        a: "2–3 BHK flats, builder floors, and some independent portions — check live map inventory.",
      },
      {
        q: "How do I search Sector 70 on the sale map?",
        a: "Use View properties on map — the view opens centred on Sector 70.",
      },
      {
        q: "Can I compare Sector 70 with Phase 7?",
        a: "Yes — use linked area pages or pan the Mohali sale map across belts.",
      },
    ],
  },
  "mohali/sector-67": {
    hubSlug: "mohali",
    areaSlug: "sector-67",
    slug: "sector-67",
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: "Sector 67, Mohali",
    placeQuery: "Sector 67, Mohali",
    eyebrow: "RentalPins Buy · Mohali",
    headline: "Flats for sale in Sector 67, Mohali",
    subhead:
      "Affordable flats and builder floors in Sector 67 — owner-direct sale pins near Zirakpur and inner Mohali.",
    mapCenter: { lat: 30.691, lng: 76.726 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-70", label: "Sector 70" },
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7" },
      { hubSlug: "mohali", label: "All Mohali" },
      { hubSlug: "zirakpur", label: "Zirakpur" },
    ],
    highlights: [
      {
        title: "Value corridor",
        desc: "Sector 67 often offers relatively affordable flats vs inner Phase belts.",
      },
      {
        title: "Owner listings",
        desc: "Compare multiple seller pins before scheduling visits.",
      },
      {
        title: "Tricity links",
        desc: "Jump to Sector 70, Phase 7, or Zirakpur buy pages from one place.",
      },
    ],
    faqs: [
      {
        q: "Is Sector 67 good for budget flat buyers?",
        a: "Many buyers shortlist Sector 67 for value — compare pins on the map before visiting.",
      },
      {
        q: "How do I list in Sector 67?",
        a: "Post List for sale with Sector 67 and society name in the title.",
      },
      {
        q: "What if inventory looks thin?",
        a: "Browse Sector 70 and Phase 7 linked pages or the full Mohali sale map.",
      },
    ],
  },
  "kharar/chandigarh-university": {
    hubSlug: "kharar",
    areaSlug: "chandigarh-university",
    slug: "chandigarh-university",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Chandigarh University area",
    placeQuery: "Chandigarh University, Kharar",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale near Chandigarh University",
    subhead:
      "Flats and plots on the CU belt — owner-direct sale listings along the Kharar–Landran corridor.",
    mapCenter: { lat: 30.741, lng: 76.688 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", label: "All Kharar" },
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7" },
      { hubSlug: "mohali", label: "Mohali" },
    ],
    highlights: [
      {
        title: "CU corridor",
        desc: "Compare sale pins along the campus belt and Kharar–Landran road.",
      },
      {
        title: "Investor & family buys",
        desc: "Flats and plots suited to campus-adjacent demand.",
      },
      {
        title: "Direct sellers",
        desc: "No brokerage to discover owners on the sale map.",
      },
    ],
    faqs: [
      {
        q: "Can I find flats for sale near CU?",
        a: "Yes — browse the CU-centred sale map and compare pin locations.",
      },
      {
        q: "Are plots listed near campus?",
        a: "Owners list plots and floors — verify title and distance cues in each listing.",
      },
      {
        q: "How do I sell near Chandigarh University?",
        a: "List for sale with CU/Kharar locality in the title.",
      },
    ],
  },
};

export const BUY_HUBS: Record<string, BuyPageConfig> = HUB_PAGES;

export function getBuyPageConfig(
  hubSlug: string,
  areaSlug?: string
): BuyPageConfig | null {
  if (areaSlug) {
    return SUB_AREA_PAGES[pageKey(hubSlug, areaSlug)] ?? null;
  }
  return HUB_PAGES[hubSlug] ?? null;
}

export function getBuyHub(slug: string): BuyPageConfig | null {
  return HUB_PAGES[slug] ?? null;
}

export function getBuyHubSlugs(): string[] {
  return BUY_HUB_SLUGS.slice();
}

export function getBuySubAreaParams(): { hub: string; area: string }[] {
  return BUY_SUB_AREA_KEYS.map((k) => {
    const slash = k.indexOf("/");
    return { hub: k.slice(0, slash), area: k.slice(slash + 1) };
  });
}

export function buyPagePath(hubSlug: string, areaSlug?: string): string {
  return areaSlug ? `/buy/${hubSlug}/${areaSlug}` : `/buy/${hubSlug}`;
}

/** Long-form money page path: /buy/in/chandigarh/mohali */
export function buyAreaPath(country: string, city: string, area: string): string {
  return `/buy/${country}/${city}/${area}`;
}

/** @deprecated Use buyPagePath */
export function buyHubPath(slug: string): string {
  return buyPagePath(slug);
}

export function getBuyHubSitemapPaths(): string[] {
  return [
    ...getBuyHubSlugs().map((slug) => buyPagePath(slug)),
    ...BUY_SUB_AREA_KEYS.map((k) => {
      const slash = k.indexOf("/");
      return buyPagePath(k.slice(0, slash), k.slice(slash + 1));
    }),
  ];
}

export function saleMapSearchHref(
  lat: number,
  lng: number,
  zoom = 12,
  placeQuery?: string
): string {
  const p = new URLSearchParams({
    transaction: "sale",
    lat: String(lat),
    lng: String(lng),
    zoom: String(zoom),
    category: "Property",
  });
  if (placeQuery?.trim()) {
    p.set("q", placeQuery.trim());
  }
  return `/search?${p.toString()}`;
}

export const SALE_TRANSACTION: TransactionType = "sale";
