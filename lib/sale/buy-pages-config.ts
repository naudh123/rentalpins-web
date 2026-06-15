/** Luxury buy hub pages — Tricity first. */

import type { TransactionType } from "@/lib/transaction-type";
import {
  buildAllNewChandigarhSectorPages,
  NEW_CHANDIGARH_BUY_SECTOR_KEYS,
  newChandigarhSectorSlug,
} from "@/lib/sale/new-chandigarh-buy-sectors";

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
  "mohali/phase-11",
  "mohali/sector-70",
  "mohali/sector-67",
  "mohali/aerocity",
  "mohali/sector-82",
  "mohali/sector-88",
  "mohali/new-chandigarh",
  "kharar/kharar-to-cu",
  "kharar/chandigarh-university",
  "kharar/kharar-to-kurali",
  "kharar/kurali-to-siswan",
  "kharar/landran",
  "kharar/kharar-banur-road",
  "kharar/sector-126",
  "kharar/sector-125",
  "kharar/sector-117",
  "kharar/sector-119",
  "kharar/sector-115",
  "kharar/sector-112",
  "kharar/banur",
  "zirakpur/dhakoli",
  "zirakpur/gazipur",
  "panchkula/sector-20",
  ...NEW_CHANDIGARH_BUY_SECTOR_KEYS,
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
      { hubSlug: "mohali", areaSlug: "aerocity", label: "Aerocity" },
      { hubSlug: "mohali", areaSlug: "phase-11", label: "Phase 11" },
      { hubSlug: "mohali", areaSlug: "sector-82", label: "Sector 82" },
      { hubSlug: "mohali", areaSlug: "new-chandigarh", label: "New Chandigarh" },
      { hubSlug: "mohali", areaSlug: newChandigarhSectorSlug(115), label: "NC Sector 115" },
      { hubSlug: "mohali", areaSlug: newChandigarhSectorSlug(117), label: "NC Sector 117" },
      { hubSlug: "mohali", areaSlug: newChandigarhSectorSlug(120), label: "NC Sector 120" },
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7" },
      { hubSlug: "mohali", areaSlug: "sector-70", label: "Sector 70" },
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
      { hubSlug: "kharar", areaSlug: "kharar-to-cu", label: "Kharar to CU" },
      { hubSlug: "kharar", areaSlug: "kharar-to-kurali", label: "Kharar to Kurali" },
      { hubSlug: "kharar", areaSlug: "kharar-banur-road", label: "Kharar–Banur Road" },
      { hubSlug: "kharar", areaSlug: "sector-126", label: "Sector 126" },
      { hubSlug: "kharar", areaSlug: "sector-125", label: "Sector 125" },
      { hubSlug: "kharar", areaSlug: "chandigarh-university", label: "Near CU" },
      { hubSlug: "kharar", areaSlug: "landran", label: "Landran" },
      { hubSlug: "kharar", areaSlug: "sector-117", label: "Sector 117" },
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
    nearbyBuyAreas: [
      { hubSlug: "zirakpur", areaSlug: "dhakoli", label: "Dhakoli" },
      { hubSlug: "zirakpur", areaSlug: "gazipur", label: "Gazipur" },
    ],
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
    nearbyBuyAreas: [
      { hubSlug: "panchkula", areaSlug: "sector-20", label: "Sector 20" },
    ],
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
      "Campus-adjacent flats and plots — owner-direct sale listings along the Kharar to CU corridor.",
    mapCenter: { lat: 30.741, lng: 76.688 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "kharar-to-cu", label: "Kharar to CU road" },
      { hubSlug: "kharar", areaSlug: "landran", label: "Landran" },
      { hubSlug: "kharar", areaSlug: "kharar-banur-road", label: "Kharar–Banur Road" },
      { hubSlug: "kharar", label: "All Kharar" },
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
  "mohali/phase-11": {
    hubSlug: "mohali",
    areaSlug: "phase-11",
    slug: "phase-11",
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: "Phase 11, Mohali",
    placeQuery: "Phase 11, Mohali",
    eyebrow: "RentalPins Buy · Mohali",
    headline: "Property for sale in Phase 11, Mohali",
    subhead:
      "Growing society belt in Greater Mohali — owner-direct flats and villas on the sale map.",
    mapCenter: { lat: 30.726, lng: 76.715 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "mohali", areaSlug: "phase-7", label: "Phase 7" },
      { hubSlug: "mohali", areaSlug: "sector-82", label: "Sector 82" },
      { hubSlug: "mohali", label: "All Mohali" },
    ],
    highlights: [
      {
        title: "Developing society belt",
        desc: "Phase 11 attracts families comparing newer inventory vs established Phase 7.",
      },
      {
        title: "Map-centred search",
        desc: "Open the sale map centred on Phase 11 before site visits.",
      },
      {
        title: "Owner-direct",
        desc: "Message sellers from listing pins without brokerage search fees.",
      },
    ],
    faqs: [
      {
        q: "Why buy in Phase 11 Mohali?",
        a: "Newer societies and relative value vs inner phases — compare pins on the map first.",
      },
      {
        q: "What property types are listed in Phase 11?",
        a: "Apartments and villas in gated societies — filter Property on the sale map.",
      },
      {
        q: "How do I list in Phase 11?",
        a: "Use List for sale with Phase 11 and society name in the title.",
      },
    ],
  },
  "mohali/aerocity": {
    hubSlug: "mohali",
    areaSlug: "aerocity",
    slug: "aerocity",
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: "Aerocity, Mohali",
    placeQuery: "Aerocity Mohali",
    eyebrow: "RentalPins Buy · Mohali",
    headline: "Property for sale in Aerocity, Mohali",
    subhead:
      "IT City and airport-road corridor — owner-direct sale listings in one of Mohali's fastest-growing belts.",
    mapCenter: { lat: 30.655, lng: 76.735 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-82", label: "Sector 82" },
      { hubSlug: "mohali", areaSlug: "phase-11", label: "Phase 11" },
      { hubSlug: "mohali", label: "All Mohali" },
    ],
    highlights: [
      {
        title: "Employment corridor",
        desc: "Popular with IT Park and airport-road buyers seeking newer inventory.",
      },
      {
        title: "High-growth micro-market",
        desc: "Compare Aerocity pins vs Phase belts for commute and lifestyle fit.",
      },
      {
        title: "Owner listings",
        desc: "Direct seller contact on the sale map — verify RERA where applicable.",
      },
    ],
    faqs: [
      {
        q: "Is Aerocity good for end-user buyers?",
        a: "Strong demand from IT and airport corridor workers — compare society approvals and connectivity.",
      },
      {
        q: "What is commonly for sale in Aerocity?",
        a: "2–3 BHK flats and premium apartments — browse live map inventory.",
      },
      {
        q: "How do I search Aerocity on the sale map?",
        a: "Use View properties on map — the view opens centred on Aerocity.",
      },
    ],
  },
  "mohali/sector-82": {
    hubSlug: "mohali",
    areaSlug: "sector-82",
    slug: "sector-82",
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: "Sector 82, Mohali",
    placeQuery: "Sector 82, Mohali",
    eyebrow: "RentalPins Buy · Mohali",
    headline: "Property for sale in Sector 82, Mohali",
    subhead:
      "GMADA sector with new residential launches — owner-direct flats and plots on the sale map.",
    mapCenter: { lat: 30.738, lng: 76.688 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-88", label: "Sector 88" },
      { hubSlug: "mohali", areaSlug: "aerocity", label: "Aerocity" },
      { hubSlug: "mohali", areaSlug: "new-chandigarh", label: "New Chandigarh" },
      { hubSlug: "mohali", label: "All Mohali" },
    ],
    highlights: [
      {
        title: "New GMADA belt",
        desc: "Sector 82 suits buyers tracking developing corridors north of Aerocity.",
      },
      {
        title: "Plot & flat mix",
        desc: "Compare builder floors, society flats, and plotted inventory on the map.",
      },
      {
        title: "Title diligence",
        desc: "Verify GMADA allotment and possession status before token.",
      },
    ],
    faqs: [
      {
        q: "Why consider Sector 82 for purchase?",
        a: "Relative entry pricing in a developing GMADA sector with airport-road access.",
      },
      {
        q: "Are plots available in Sector 82?",
        a: "Owners list plots and under-construction flats — confirm title on each pin.",
      },
      {
        q: "How does Sector 82 compare to Phase 7?",
        a: "Typically newer but less mature societies — use linked area pages to compare.",
      },
    ],
  },
  "mohali/sector-88": {
    hubSlug: "mohali",
    areaSlug: "sector-88",
    slug: "sector-88",
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: "Sector 88, Mohali",
    placeQuery: "Sector 88, Mohali",
    eyebrow: "RentalPins Buy · Mohali",
    headline: "Property for sale in Sector 88, Mohali",
    subhead:
      "Emerging GMADA sector near New Chandigarh — owner-direct sale listings for early movers.",
    mapCenter: { lat: 30.752, lng: 76.675 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "mohali", areaSlug: "sector-82", label: "Sector 82" },
      { hubSlug: "mohali", areaSlug: "new-chandigarh", label: "New Chandigarh" },
      { hubSlug: "mohali", label: "All Mohali" },
    ],
    highlights: [
      {
        title: "Growth corridor",
        desc: "Sector 88 links Aerocity buyers exploring Mullanpur-adjacent inventory.",
      },
      {
        title: "Early-stage inventory",
        desc: "Compare new launches and resale pins before prices firm up.",
      },
      {
        title: "Map-first",
        desc: "Centre the sale map on Sector 88 to shortlist by pin location.",
      },
    ],
    faqs: [
      {
        q: "Is Sector 88 suitable for investment?",
        a: "Developing sectors can appreciate — verify builder track record and approvals.",
      },
      {
        q: "What should I check before buying in Sector 88?",
        a: "Allotment letters, development charges, and possession timelines.",
      },
      {
        q: "How do I list property in Sector 88?",
        a: "Post List for sale with Sector 88 and landmark cues in the description.",
      },
    ],
  },
  "mohali/new-chandigarh": {
    hubSlug: "mohali",
    areaSlug: "new-chandigarh",
    slug: "new-chandigarh",
    listingAreaSlug: "mohali",
    cityName: "Mohali",
    areaName: "New Chandigarh (Mullanpur)",
    placeQuery: "New Chandigarh Mullanpur",
    eyebrow: "RentalPins Buy · Mohali",
    headline: "Property for sale in New Chandigarh",
    subhead:
      "Mullanpur GMADA Sectors 105–120 — premium plotted and villa inventory across New Chandigarh on the sale map.",
    mapCenter: { lat: 30.765, lng: 76.655 },
    mapZoom: 13,
    nearbyBuyAreas: [
      { hubSlug: "mohali", areaSlug: newChandigarhSectorSlug(110), label: "Sector 110" },
      { hubSlug: "mohali", areaSlug: newChandigarhSectorSlug(115), label: "Sector 115" },
      { hubSlug: "mohali", areaSlug: newChandigarhSectorSlug(117), label: "Sector 117" },
      { hubSlug: "mohali", areaSlug: newChandigarhSectorSlug(120), label: "Sector 120" },
      { hubSlug: "mohali", areaSlug: "sector-88", label: "Sector 88" },
      { hubSlug: "mohali", areaSlug: "sector-82", label: "Sector 82" },
      { hubSlug: "mohali", label: "All Mohali" },
    ],
    highlights: [
      {
        title: "Master-planned belt",
        desc: "New Chandigarh attracts buyers seeking larger plots and villa societies.",
      },
      {
        title: "Premium segment",
        desc: "Compare villa and plotted asks vs inner Mohali phases on the map.",
      },
      {
        title: "Long-term play",
        desc: "Infrastructure is still maturing — factor commute and amenities into offers.",
      },
    ],
    faqs: [
      {
        q: "What is New Chandigarh?",
        a: "The Mullanpur master-plan area with GMADA Sectors 105–120 — browse individual sector pages or pan the sale map.",
      },
      {
        q: "Who buys in New Chandigarh?",
        a: "Families and investors seeking plotted or villa inventory with long-term appreciation.",
      },
      {
        q: "How do I search New Chandigarh on the map?",
        a: "Open the sale map centred on New Chandigarh and pan across Mullanpur belts.",
      },
    ],
  },
  "kharar/kharar-to-cu": {
    hubSlug: "kharar",
    areaSlug: "kharar-to-cu",
    slug: "kharar-to-cu",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Kharar to Chandigarh University",
    placeQuery: "Kharar to Chandigarh University Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale on Kharar to CU road",
    subhead:
      "Kharar town to Chandigarh University belt — student-adjacent flats, plots, and builder floors on the sale map.",
    mapCenter: { lat: 30.744, lng: 76.667 },
    mapZoom: 13,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "chandigarh-university", label: "Near CU campus" },
      { hubSlug: "kharar", areaSlug: "kharar-to-kurali", label: "Kharar to Kurali" },
      { hubSlug: "kharar", areaSlug: "landran", label: "Landran" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "CU corridor",
        desc: "Compare sale pins from Kharar bus stand to campus along the main CU approach roads.",
      },
      {
        title: "Investor demand",
        desc: "Campus-adjacent inventory supports rental yield — verify title on each pin.",
      },
      {
        title: "Owner-direct",
        desc: "No brokerage to search or contact sellers on RentalPins Buy.",
      },
    ],
    faqs: [
      {
        q: "What areas does the Kharar to CU road cover?",
        a: "Kharar town, Gharuan approach, Landran junction, and campus-adjacent belts — use the sale map to compare pin distance to CU.",
      },
      {
        q: "Are plots listed along Kharar to CU?",
        a: "Yes — owners list plots, floors, and flats. Confirm distance cues in each listing.",
      },
      {
        q: "How do I list near Chandigarh University?",
        a: "Post List for sale with Kharar/CU/Landran locality in the title for buyer discovery.",
      },
    ],
  },
  "kharar/kharar-to-kurali": {
    hubSlug: "kharar",
    areaSlug: "kharar-to-kurali",
    slug: "kharar-to-kurali",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Kharar to Kurali",
    placeQuery: "Kharar Kurali Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale on Kharar to Kurali road",
    subhead:
      "Northwest growth corridor from Kharar — affordable plots and flats toward Kurali on the sale map.",
    mapCenter: { lat: 30.761, lng: 76.61 },
    mapZoom: 13,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "kurali-to-siswan", label: "Kurali to Siswan" },
      { hubSlug: "kharar", areaSlug: "kharar-to-cu", label: "Kharar to CU" },
      { hubSlug: "kharar", areaSlug: "chandigarh-university", label: "Near CU" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Northwest belt",
        desc: "Kharar–Kurali road suits buyers seeking larger plots away from highway congestion.",
      },
      {
        title: "Value entry",
        desc: "Often lower per-sqft asks than inner Mohali — compare pins before visiting.",
      },
      {
        title: "Map-first",
        desc: "Centre the sale map on the Kharar–Kurali corridor to shortlist by location.",
      },
    ],
    faqs: [
      {
        q: "Why buy on Kharar to Kurali road?",
        a: "Relative affordability and plot sizes — verify water, road, and title before token.",
      },
      {
        q: "What is commonly for sale?",
        a: "Plots, builder floors, and village-extension flats — filter Property on the map.",
      },
      {
        q: "How does this compare to Banur road?",
        a: "Different corridor — Banur road runs east; Kurali road runs northwest from Kharar.",
      },
    ],
  },
  "kharar/kurali-to-siswan": {
    hubSlug: "kharar",
    areaSlug: "kurali-to-siswan",
    slug: "kurali-to-siswan",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Kurali to Siswan",
    placeQuery: "Kurali Siswan Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale on Kurali to Siswan road",
    subhead:
      "Rural–urban fringe belt beyond Kurali — plotted and farmhouse inventory on the sale map.",
    mapCenter: { lat: 30.793, lng: 76.547 },
    mapZoom: 13,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "kharar-to-kurali", label: "Kharar to Kurali" },
      { hubSlug: "kharar", areaSlug: "chandigarh-university", label: "Near CU" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Fringe belt",
        desc: "Kurali–Siswan suits buyers seeking larger land parcels at lower entry prices.",
      },
      {
        title: "Due diligence",
        desc: "Verify agricultural conversion, approach road, and title before any payment.",
      },
      {
        title: "Owner listings",
        desc: "Contact sellers directly from map pins.",
      },
    ],
    faqs: [
      {
        q: "Is Kurali to Siswan good for farmhouse or plot buyers?",
        a: "Many search this belt for larger plots — confirm land use and access with a lawyer.",
      },
      {
        q: "How far is Siswan from Kharar?",
        a: "Roughly 25–35 minutes by road depending on pin location — test commute before buying.",
      },
      {
        q: "How do I list on Kurali–Siswan road?",
        a: "Use List for sale with Kurali/Siswan and landmark cues in the description.",
      },
    ],
  },
  "kharar/landran": {
    hubSlug: "kharar",
    areaSlug: "landran",
    slug: "landran",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Landran, Kharar",
    placeQuery: "Landran, Kharar",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale in Landran",
    subhead:
      "Developing corridor between Kharar and Mohali — affordable flats and plots on the sale map.",
    mapCenter: { lat: 30.755, lng: 76.662 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "kharar-banur-road", label: "Kharar–Banur Road" },
      { hubSlug: "kharar", areaSlug: "sector-112", label: "Sector 112" },
      { hubSlug: "kharar", areaSlug: "chandigarh-university", label: "Near CU" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Growth corridor",
        desc: "Landran links Kharar town with GMADA sectors — compare pins along the belt.",
      },
      {
        title: "Value entry",
        desc: "Often lower per-sqft asks than inner Mohali phases.",
      },
      {
        title: "Owner-direct",
        desc: "Contact sellers from map pins without brokerage search fees.",
      },
    ],
    faqs: [
      {
        q: "Is Landran good for budget buyers?",
        a: "Many shortlist Landran for relative value — verify connectivity to your workplace.",
      },
      {
        q: "What is listed in Landran?",
        a: "Flats, plots, and builder floors — filter Property on the sale map.",
      },
      {
        q: "How does Landran compare to CU belt?",
        a: "Typically quieter than campus-adjacent belts — use linked pages to compare.",
      },
    ],
  },
  "kharar/kharar-banur-road": {
    hubSlug: "kharar",
    areaSlug: "kharar-banur-road",
    slug: "kharar-banur-road",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Kharar–Banur Road",
    placeQuery: "Kharar Banur Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale on Kharar–Banur Road",
    subhead:
      "GMADA's fastest-growing sale corridor — flats, plots, and builder floors from Sector 126 to Banur on one map.",
    mapCenter: { lat: 30.722, lng: 76.688 },
    mapZoom: 13,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "sector-126", label: "Sector 126" },
      { hubSlug: "kharar", areaSlug: "sector-125", label: "Sector 125" },
      { hubSlug: "kharar", areaSlug: "sector-117", label: "Sector 117" },
      { hubSlug: "kharar", areaSlug: "sector-119", label: "Sector 119" },
      { hubSlug: "kharar", areaSlug: "sector-115", label: "Sector 115" },
      { hubSlug: "kharar", areaSlug: "banur", label: "Banur" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Developing GMADA belt",
        desc: "Sector 112–117 and 125–127 carry the densest new sale inventory east of Kharar town.",
      },
      {
        title: "Investor & end-user mix",
        desc: "Plots, under-construction flats, and resale society units — compare pins before site visits.",
      },
      {
        title: "Owner-direct",
        desc: "Message sellers from map pins without brokerage search fees.",
      },
    ],
    faqs: [
      {
        q: "Which sectors are on Kharar–Banur Road?",
        a: "Buyers commonly search Sector 112, 115, 117, 119, 125, 126, and 127 — use linked area pages or pan the corridor map.",
      },
      {
        q: "Is Kharar–Banur Road good for plot buyers?",
        a: "Yes — GMADA sectors along the belt attract plot and villa buyers; verify allotment and development charges.",
      },
      {
        q: "How do I search the corridor on the sale map?",
        a: "Open View properties on map — centred on the Kharar–Banur Road belt.",
      },
    ],
  },
  "kharar/sector-126": {
    hubSlug: "kharar",
    areaSlug: "sector-126",
    slug: "sector-126",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Sector 126, Kharar",
    placeQuery: "Sector 126, Kharar Banur Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale in Sector 126, Kharar",
    subhead:
      "Kharar-side GMADA sector on the Banur road belt — affordable flats and plots on the sale map.",
    mapCenter: { lat: 30.735, lng: 76.668 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "kharar-banur-road", label: "Kharar–Banur Road" },
      { hubSlug: "kharar", areaSlug: "sector-125", label: "Sector 125" },
      { hubSlug: "kharar", areaSlug: "sector-117", label: "Sector 117" },
      { hubSlug: "kharar", areaSlug: "chandigarh-university", label: "Near CU" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Kharar gateway sector",
        desc: "Sector 126 sits where Kharar town meets the Banur road development belt.",
      },
      {
        title: "Budget entry",
        desc: "Often lower asks than inner Mohali — compare pins before negotiating.",
      },
      {
        title: "Map-first",
        desc: "Centre the sale map on Sector 126 to shortlist by pin location.",
      },
    ],
    faqs: [
      {
        q: "Why buy in Sector 126 Kharar?",
        a: "Relative value and proximity to Kharar town amenities with Banur road growth upside.",
      },
      {
        q: "What is listed in Sector 126?",
        a: "Plots, builder floors, and society flats — filter Property on the sale map.",
      },
      {
        q: "How do I list in Sector 126?",
        a: "Post List for sale with Sector 126 and Kharar Banur Road in the title.",
      },
    ],
  },
  "kharar/sector-125": {
    hubSlug: "kharar",
    areaSlug: "sector-125",
    slug: "sector-125",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Sector 125, Kharar",
    placeQuery: "Sector 125, Kharar Banur Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale in Sector 125, Kharar",
    subhead:
      "GMADA sector on Kharar–Banur Road near Sector 126 — affordable flats and plots on the sale map.",
    mapCenter: { lat: 30.732, lng: 76.673 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "sector-126", label: "Sector 126" },
      { hubSlug: "kharar", areaSlug: "sector-117", label: "Sector 117" },
      { hubSlug: "kharar", areaSlug: "kharar-banur-road", label: "Kharar–Banur Road" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Kharar corridor belt",
        desc: "Sector 125 sits between Kharar town and deeper Banur road inventory.",
      },
      {
        title: "Value pricing",
        desc: "Often competitive per-sqft asks vs Sector 117 — compare pins before visiting.",
      },
      {
        title: "Owner-direct",
        desc: "Message sellers from map pins without brokerage search fees.",
      },
    ],
    faqs: [
      {
        q: "Why buy in Sector 125 Kharar?",
        a: "Strong value on the Banur road belt with Kharar town proximity — verify GMADA allotment.",
      },
      {
        q: "What is listed in Sector 125?",
        a: "Plots, builder floors, and society flats — filter Property on the sale map.",
      },
      {
        q: "How does Sector 125 compare to Sector 126?",
        a: "Adjacent belts with similar inventory — use linked pages to compare pin locations.",
      },
    ],
  },
  "kharar/sector-117": {
    hubSlug: "kharar",
    areaSlug: "sector-117",
    slug: "sector-117",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Sector 117, Kharar",
    placeQuery: "Sector 117, Kharar Banur Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale in Sector 117, Kharar",
    subhead:
      "High-demand GMADA sector on Kharar–Banur Road — owner-direct flats and plots on the sale map.",
    mapCenter: { lat: 30.724, lng: 76.692 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "sector-119", label: "Sector 119" },
      { hubSlug: "kharar", areaSlug: "sector-115", label: "Sector 115" },
      { hubSlug: "kharar", areaSlug: "sector-125", label: "Sector 125" },
      { hubSlug: "kharar", areaSlug: "kharar-banur-road", label: "Kharar–Banur Road" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Corridor hotspot",
        desc: "Sector 117 is among the most searched belts on Kharar–Banur Road for new inventory.",
      },
      {
        title: "Plot & flat mix",
        desc: "Compare plotted, under-construction, and resale pins on one map.",
      },
      {
        title: "Title diligence",
        desc: "Verify GMADA allotment and possession before token payment.",
      },
    ],
    faqs: [
      {
        q: "Is Sector 117 good for investment?",
        a: "Developing GMADA sectors can appreciate — verify builder track record and road connectivity.",
      },
      {
        q: "What should Sector 117 buyers check?",
        a: "Allotment letters, development charges, and distance from Kharar town at peak commute hours.",
      },
      {
        q: "How do I search Sector 117 on the map?",
        a: "Use View properties on map — opens centred on Sector 117.",
      },
    ],
  },
  "kharar/sector-119": {
    hubSlug: "kharar",
    areaSlug: "sector-119",
    slug: "sector-119",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Sector 119, Kharar",
    placeQuery: "Sector 119, Kharar Banur Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale in Sector 119, Kharar",
    subhead:
      "Developing GMADA sector between Sector 117 and Landran belt — flats and plots on the sale map.",
    mapCenter: { lat: 30.721, lng: 76.695 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "sector-117", label: "Sector 117" },
      { hubSlug: "kharar", areaSlug: "sector-115", label: "Sector 115" },
      { hubSlug: "kharar", areaSlug: "sector-112", label: "Sector 112" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Mid-corridor sector",
        desc: "Sector 119 bridges high-demand Sector 117 and the Landran–Banur belt.",
      },
      {
        title: "New inventory",
        desc: "Under-construction and resale pins — compare before prices firm up.",
      },
      {
        title: "Map-first",
        desc: "Centre the sale map on Sector 119 to shortlist by location.",
      },
    ],
    faqs: [
      {
        q: "Is Sector 119 good for first-time buyers?",
        a: "Many shortlist it for relative value on the Banur road — verify connectivity at peak hours.",
      },
      {
        q: "What should Sector 119 buyers verify?",
        a: "GMADA allotment, possession timeline, and road access before token.",
      },
      {
        q: "How do I list in Sector 119?",
        a: "Post List for sale with Sector 119 and Kharar Banur Road in the title.",
      },
    ],
  },
  "kharar/sector-115": {
    hubSlug: "kharar",
    areaSlug: "sector-115",
    slug: "sector-115",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Sector 115, Kharar",
    placeQuery: "Sector 115, Kharar Banur Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale in Sector 115, Kharar",
    subhead:
      "Mid-corridor GMADA sector between Landran and Banur — developing flats and plots on the sale map.",
    mapCenter: { lat: 30.718, lng: 76.698 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "sector-119", label: "Sector 119" },
      { hubSlug: "kharar", areaSlug: "sector-117", label: "Sector 117" },
      { hubSlug: "kharar", areaSlug: "landran", label: "Landran" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Banur road belt",
        desc: "Sector 115 links Landran colleges belt with deeper Banur road inventory.",
      },
      {
        title: "Early-mover pricing",
        desc: "Compare asks vs Sector 117 and inner Kharar before prices firm up.",
      },
      {
        title: "Owner listings",
        desc: "Contact sellers directly from map pins.",
      },
    ],
    faqs: [
      {
        q: "What is commonly for sale in Sector 115?",
        a: "Plots, builder floors, and new society flats — check live map inventory.",
      },
      {
        q: "How does Sector 115 compare to Sector 117?",
        a: "Typically slightly earlier-stage — use linked pages to compare pins side by side.",
      },
      {
        q: "How do I list in Sector 115?",
        a: "Use List for sale with Sector 115 and Kharar Banur Road in the title.",
      },
    ],
  },
  "kharar/sector-112": {
    hubSlug: "kharar",
    areaSlug: "sector-112",
    slug: "sector-112",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Sector 112, Kharar",
    placeQuery: "Sector 112, Kharar Banur Road",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale in Sector 112, Kharar",
    subhead:
      "Landran-adjacent GMADA sector on Kharar–Banur Road — affordable sale inventory on the map.",
    mapCenter: { lat: 30.71, lng: 76.705 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "sector-115", label: "Sector 115" },
      { hubSlug: "kharar", areaSlug: "landran", label: "Landran" },
      { hubSlug: "kharar", areaSlug: "banur", label: "Banur" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Landran junction",
        desc: "Sector 112 sits near the Landran college and industrial belt on the Banur road.",
      },
      {
        title: "Student-adjacent demand",
        desc: "Campus corridor supports rental yield for investor buyers — verify title.",
      },
      {
        title: "Map-centred",
        desc: "Browse Sector 112 pins before scheduling site visits.",
      },
    ],
    faqs: [
      {
        q: "Is Sector 112 near colleges?",
        a: "Yes — CGC Landran and other institutes are along the Kharar–Landran–Banur belt.",
      },
      {
        q: "Are plots listed in Sector 112?",
        a: "Owners list plots and floors — confirm GMADA status on each listing.",
      },
      {
        q: "How do I search Sector 112?",
        a: "Open the sale map centred on Sector 112 from this page.",
      },
    ],
  },
  "kharar/banur": {
    hubSlug: "kharar",
    areaSlug: "banur",
    slug: "banur",
    listingAreaSlug: "kharar",
    cityName: "Kharar",
    areaName: "Banur",
    placeQuery: "Banur, Punjab",
    eyebrow: "RentalPins Buy · Kharar",
    headline: "Property for sale in Banur",
    subhead:
      "Eastern end of the Kharar–Banur corridor — plots, villas, and builder floors on the sale map.",
    mapCenter: { lat: 30.706, lng: 76.719 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "kharar", areaSlug: "sector-112", label: "Sector 112" },
      { hubSlug: "kharar", areaSlug: "sector-115", label: "Sector 115" },
      { hubSlug: "kharar", areaSlug: "kharar-banur-road", label: "Kharar–Banur Road" },
      { hubSlug: "kharar", label: "All Kharar" },
    ],
    highlights: [
      {
        title: "Corridor terminus",
        desc: "Banur town anchors the eastern end of the Kharar–Banur development belt.",
      },
      {
        title: "Larger homes",
        desc: "Independent houses and plotted inventory are common — browse pins before visits.",
      },
      {
        title: "Long-term play",
        desc: "Infrastructure is still expanding — factor commute to Mohali and Chandigarh.",
      },
    ],
    faqs: [
      {
        q: "Why buy in Banur?",
        a: "Relative value vs inner Tricity with larger plot sizes — verify road and water access.",
      },
      {
        q: "What property types are for sale in Banur?",
        a: "Plots, builder floors, and independent houses — filter Property on the sale map.",
      },
      {
        q: "How do I list property in Banur?",
        a: "Post List for sale with Banur and Kharar Banur Road cues in the description.",
      },
    ],
  },
  "zirakpur/dhakoli": {
    hubSlug: "zirakpur",
    areaSlug: "dhakoli",
    slug: "dhakoli",
    listingAreaSlug: "zirakpur",
    cityName: "Zirakpur",
    areaName: "Dhakoli, Zirakpur",
    placeQuery: "Dhakoli, Zirakpur",
    eyebrow: "RentalPins Buy · Zirakpur",
    headline: "Property for sale in Dhakoli, Zirakpur",
    subhead:
      "Fast-growing Zirakpur belt — builder floors and apartments with Chandigarh commute access.",
    mapCenter: { lat: 30.658, lng: 76.822 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "zirakpur", areaSlug: "gazipur", label: "Gazipur" },
      { hubSlug: "zirakpur", label: "All Zirakpur" },
      { hubSlug: "mohali", areaSlug: "sector-70", label: "Sector 70" },
    ],
    highlights: [
      {
        title: "Commuter belt",
        desc: "Dhakoli suits families working in Chandigarh, Panchkula, or Mohali.",
      },
      {
        title: "Builder floor inventory",
        desc: "Compare independent floors and society flats on the map.",
      },
      {
        title: "Developing amenities",
        desc: "Verify society completion status and highway access before offering.",
      },
    ],
    faqs: [
      {
        q: "Why buy in Dhakoli?",
        a: "Relative value and larger homes vs Chandigarh sectors — check traffic at peak hours.",
      },
      {
        q: "What property types are common?",
        a: "Builder floors and 2–3 BHK apartments dominate sale inventory.",
      },
      {
        q: "How do I list in Dhakoli?",
        a: "Use List for sale with Dhakoli and society or landmark in the title.",
      },
    ],
  },
  "zirakpur/gazipur": {
    hubSlug: "zirakpur",
    areaSlug: "gazipur",
    slug: "gazipur",
    listingAreaSlug: "zirakpur",
    cityName: "Zirakpur",
    areaName: "Gazipur, Zirakpur",
    placeQuery: "Gazipur, Zirakpur",
    eyebrow: "RentalPins Buy · Zirakpur",
    headline: "Property for sale in Gazipur, Zirakpur",
    subhead:
      "Highway-adjacent Zirakpur belt — family homes and builder floors on the sale map.",
    mapCenter: { lat: 30.631, lng: 76.815 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "zirakpur", areaSlug: "dhakoli", label: "Dhakoli" },
      { hubSlug: "zirakpur", label: "All Zirakpur" },
      { hubSlug: "mohali", areaSlug: "sector-67", label: "Sector 67" },
    ],
    highlights: [
      {
        title: "Highway corridor",
        desc: "Gazipur attracts buyers prioritising Chandigarh–Delhi highway access.",
      },
      {
        title: "Family homes",
        desc: "Independent houses and floors are common — browse pins before visits.",
      },
      {
        title: "Owner-first",
        desc: "No brokerage to search or contact sellers on RentalPins Buy.",
      },
    ],
    faqs: [
      {
        q: "Is Gazipur noisy due to highway proximity?",
        a: "Visit at peak hours — some societies are set back from the main road.",
      },
      {
        q: "What should Gazipur buyers verify?",
        a: "Society approvals, parking, and water supply — especially in newer blocks.",
      },
      {
        q: "How do I search Gazipur on the map?",
        a: "Open the sale map centred on Gazipur from this page.",
      },
    ],
  },
  "panchkula/sector-20": {
    hubSlug: "panchkula",
    areaSlug: "sector-20",
    slug: "sector-20",
    listingAreaSlug: "panchkula",
    cityName: "Panchkula",
    areaName: "Sector 20, Panchkula",
    placeQuery: "Sector 20, Panchkula",
    eyebrow: "RentalPins Buy · Panchkula",
    headline: "Property for sale in Sector 20, Panchkula",
    subhead:
      "Established Panchkula sector with steady resale demand — owner-direct flats on the sale map.",
    mapCenter: { lat: 30.674, lng: 76.858 },
    mapZoom: 14,
    nearbyBuyAreas: [
      { hubSlug: "panchkula", label: "All Panchkula" },
      { hubSlug: "mohali", areaSlug: "new-chandigarh", label: "New Chandigarh" },
      { hubSlug: "zirakpur", areaSlug: "dhakoli", label: "Dhakoli" },
    ],
    highlights: [
      {
        title: "Mature sector",
        desc: "Sector 20 offers established societies with predictable resale liquidity.",
      },
      {
        title: "Family demand",
        desc: "Popular with buyers comparing Panchkula vs Mohali commutes.",
      },
      {
        title: "Document checks",
        desc: "Verify HUDA/MC approvals and society NOC before token.",
      },
    ],
    faqs: [
      {
        q: "Why buy in Sector 20 Panchkula?",
        a: "Planned sector living with amenities — compare pins vs extension corridors.",
      },
      {
        q: "What is commonly for sale?",
        a: "2–3 BHK society flats and some independent portions.",
      },
      {
        q: "How do I list in Sector 20?",
        a: "Post List for sale with sector and society name in the title.",
      },
    ],
  },
  ...buildAllNewChandigarhSectorPages(),
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

/** City-level money page: /buy/in/chandigarh */
export function buyCityPath(country: string, city: string): string {
  return `/buy/${country}/${city}`;
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
