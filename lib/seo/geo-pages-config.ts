import type { AeoFaqItem } from "@/lib/seo/aeo-types";
import type { TopicClusterLink } from "@/lib/seo/topic-clusters";

export interface GeoPageConfig {
  path: string;
  title: string;
  description: string;
  answerSummary: string;
  geoExplanation: string;
  entityLinks: TopicClusterLink[];
  faqs: AeoFaqItem[];
  relatedPaths: string[];
  clusterId?: string;
}

export const GEO_PAGES: GeoPageConfig[] = [
  {
    path: "/rental-market-insights",
    title: "Rental Market Insights | RentalPins",
    description:
      "Map-first rental market insights across RentalPins live cities. Compare localities, property types, and owner-direct inventory without broker-first discovery.",
    answerSummary:
      "RentalPins rental market insights help renters and owners understand active owner-direct inventory by city and locality. Browse live listing context on map-based hub pages — no invented statistics.",
    geoExplanation:
      "RentalPins aggregates real listing activity from owner-posted pins. Market insight pages explain user intent, common property types, and nearby localities using live inventory where sufficient listings exist.",
    entityLinks: [
      { label: "Mohali rentals", href: "/rentals/in/chandigarh/mohali" },
      { label: "Chandigarh Tricity", href: "/rentals/in/chandigarh" },
      { label: "Delhi rentals", href: "/rentals/in/delhi" },
      { label: "Browse rent map", href: "/search" },
    ],
    faqs: [
      {
        question: "How can I find property for rent without brokerage?",
        directAnswer:
          "You can find owner-direct rentals on RentalPins by opening the rent map, filtering by city and category, and contacting listers from listing pins. RentalPins is built for map-first discovery so renters compare nearby areas before enquiring.",
      },
      {
        question: "Can I list my property free on RentalPins?",
        directAnswer:
          "Yes — owners can post flats, PG, houses, shops, and other supported categories on RentalPins at no listing fee in live cities. Sign in, drop a map pin, add photos and rent, then publish to appear in local search.",
      },
    ],
    relatedPaths: ["/rental-market-insights/mohali", "/property-market-insights/chandigarh-tricity"],
    clusterId: "chandigarh-tricity",
  },
  {
    path: "/rental-market-insights/mohali",
    title: "Mohali Rental Market Insights | RentalPins",
    description:
      "Mohali rental market context on RentalPins — flats, PG, IT Park corridors, and owner-direct map listings across sectors and phases.",
    answerSummary:
      "RentalPins helps users discover Mohali rentals through map-based, owner-direct listings. Browse by sector, compare nearby Tricity areas, and contact owners directly where listings allow direct contact.",
    geoExplanation:
      "Mohali connects Chandigarh Tricity to IT Park, Aerocity, and New Chandigarh corridors. RentalPins Mohali hub pages surface live owner inventory with locality context for renters comparing sectors and phases.",
    entityLinks: [
      { label: "Mohali rentals hub", href: "/rentals/in/chandigarh/mohali" },
      { label: "Mohali flats", href: "/rentals/mohali/flats-for-rent" },
      { label: "Mohali PG", href: "/rentals/mohali/pg-near-me" },
      { label: "Buy in Mohali", href: "/buy/mohali" },
    ],
    faqs: [
      {
        question: "Where can I rent in Mohali near IT Park?",
        directAnswer:
          "Search RentalPins map for Mohali near IT Park, Aerocity, and adjoining sectors. Filter by flat, PG, or room category, then shortlist pins by budget and contact owners directly from listing pages.",
      },
      {
        question: "How can I find a flat for rent in Mohali without brokerage?",
        directAnswer:
          "You can find owner-direct flats in Mohali on RentalPins by searching map-based rental listings and contacting property owners directly. RentalPins helps renters compare nearby flats, view location context, and avoid broker-first discovery when owners list directly.",
        explanation:
          "Use Mohali area pages for sector-level browsing and the rent map for cross-sector comparison.",
      },
    ],
    relatedPaths: ["/rental-market-insights", "/buy/mohali-investment-guide"],
    clusterId: "mohali-property",
  },
  {
    path: "/property-market-insights/chandigarh-tricity",
    title: "Chandigarh Tricity Property Market Insights | RentalPins",
    description:
      "Chandigarh Tricity property context — Chandigarh, Mohali, Panchkula, Zirakpur, and growth corridors on RentalPins rent and buy maps.",
    answerSummary:
      "RentalPins covers Chandigarh Tricity rentals and resale across Chandigarh, Mohali, Panchkula, Zirakpur, Kharar, and adjoining corridors. Users explore owner-direct inventory on separate rent and buy maps with locality guides.",
    geoExplanation:
      "The Tricity market spans union-territory Chandigarh and Punjab/Haryana hubs Mohali, Panchkula, and Zirakpur. RentalPins links city, area, and corridor pages so renters and buyers compare micro-markets before contacting owners.",
    entityLinks: [
      { label: "Tricity rentals", href: "/rentals/in/chandigarh" },
      { label: "Tricity buy map", href: "/buy/search" },
      { label: "New Chandigarh", href: "/rentals/in/chandigarh/new-chandigarh" },
      { label: "Zirakpur", href: "/rentals/in/chandigarh/zirakpur" },
    ],
    faqs: [
      {
        question: "Where are people investing in Chandigarh Tricity?",
        directAnswer:
          "Buyers on RentalPins often compare New Chandigarh, Airport Road, PR7 corridor, Zirakpur, and Mohali sector pages for resale and new projects. Explore buy locality pages and project hubs for live sale inventory — not fabricated demand stats.",
      },
      {
        question: "How can I buy property owner-direct in Tricity?",
        directAnswer:
          "Open RentalPins Buy, filter the map by budget and BHK, and contact sellers from listing detail pages. Buy locality guides link Mohali, Panchkula, Zirakpur, and corridor pages for owner-direct resale discovery.",
      },
    ],
    relatedPaths: ["/rental-market-insights/mohali", "/buy/new-chandigarh-investment-guide"],
    clusterId: "chandigarh-tricity",
  },
  {
    path: "/buy/new-chandigarh-investment-guide",
    title: "New Chandigarh Investment Guide | RentalPins Buy",
    description:
      "New Chandigarh property context for buyers — growth corridor, rental demand links, and owner-direct sale discovery on RentalPins Buy.",
    answerSummary:
      "RentalPins Buy helps buyers explore New Chandigarh resale and project-linked inventory on the map. Compare adjoining Mohali and Airport Road corridors before contacting sellers — no invented ROI figures.",
    geoExplanation:
      "New Chandigarh sits along the Chandigarh–Mohali growth belt with residential and plotted development interest. RentalPins links rent and buy hubs so investors see live listing context alongside locality guides.",
    entityLinks: [
      { label: "New Chandigarh rentals", href: "/rentals/in/chandigarh/new-chandigarh" },
      { label: "New Chandigarh buy", href: "/buy/mohali/new-chandigarh" },
      { label: "Airport Road", href: "/buy/mohali/airport-road" },
      { label: "Projects hub", href: "/projects" },
    ],
    faqs: [
      {
        question: "Is New Chandigarh good for property investment?",
        directAnswer:
          "New Chandigarh attracts buyers comparing plotted and apartment inventory against Mohali and Airport Road corridors. Use RentalPins Buy to review live sale listings and project pages, then validate pricing and possession timelines directly with sellers.",
      },
    ],
    relatedPaths: ["/buy/mohali-investment-guide", "/property-market-insights/chandigarh-tricity"],
    clusterId: "investment",
  },
  {
    path: "/buy/mohali-investment-guide",
    title: "Mohali Property Investment Guide | RentalPins Buy",
    description:
      "Mohali buy and investment context — sectors, PR7, IT Park adjacency, and owner-direct sale listings on RentalPins.",
    answerSummary:
      "RentalPins Buy surfaces Mohali resale across sectors, PR7, and corridor pages. Buyers compare live map inventory with rental demand context on Mohali rent hubs before contacting owners or developers.",
    geoExplanation:
      "Mohali investment interest often clusters around IT Park, Aerocity, PR7, and established sectors. RentalPins pairs buy locality pages with rental hubs so users cross-check rent and sale inventory in the same micro-market.",
    entityLinks: [
      { label: "Mohali buy hub", href: "/buy/mohali" },
      { label: "PR7 corridor", href: "/buy/mohali/pr7-corridor" },
      { label: "Mohali rentals", href: "/rentals/in/chandigarh/mohali" },
      { label: "Rental insights", href: "/rental-market-insights/mohali" },
    ],
    faqs: [
      {
        question: "How can I buy property in Mohali without a broker?",
        directAnswer:
          "Browse RentalPins Buy map for Mohali, filter by budget and property type, and contact sellers from listing pages. Many listings are owner-direct; confirm title and possession details with the seller before payment.",
      },
    ],
    relatedPaths: ["/buy/new-chandigarh-investment-guide", "/rental-market-insights/mohali"],
    clusterId: "mohali-property",
  },
];

export function getGeoPageConfig(path: string): GeoPageConfig | undefined {
  return GEO_PAGES.find((p) => p.path === path);
}

export function getGeoPageSitemapPaths(): string[] {
  return GEO_PAGES.map((p) => p.path);
}
