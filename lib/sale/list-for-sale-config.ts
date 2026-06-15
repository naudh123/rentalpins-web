import { appPath } from "@/lib/config";
import { buyHubPath, saleMapSearchHref } from "@/lib/sale/buy-pages-config";
import { BUY_POST_PATH, BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";
import { BUY_HUB_SLUGS } from "@/lib/sale/buy-pages-config";

export interface ListForSaleFaq {
  q: string;
  a: string;
}

export interface ListForSaleNearbyLink {
  label: string;
  href: string;
}

export interface ListForSalePageConfig {
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  cityName?: string;
  citySlug?: string;
  mapCenter?: { lat: number; lng: number };
  mapZoom?: number;
  supportedTypes: string[];
  nearbyLinks: ListForSaleNearbyLink[];
  faq: ListForSaleFaq[];
}

export const LIST_FOR_SALE_STEPS = [
  {
    title: "Sign in and choose List for sale",
    body: "Open the post flow with transaction=sale — residential Property category in v1.",
  },
  {
    title: "Add photos, price, and map pin",
    body: "Set total price or per sqft, BHK, society name, and drop an accurate location pin.",
  },
  {
    title: "Activate and respond to buyers",
    body: "Your listing appears on the sale map. Buyers message you directly from pin detail.",
  },
] as const;

const BASE_FAQ: ListForSaleFaq[] = [
  {
    q: "Is it free to list property for sale on RentalPins?",
    a: "Owners can post sale listings on RentalPins web. Check activation plans in your city if applicable.",
  },
  {
    q: "Who can list property for sale?",
    a: "Owners and authorised sellers can list flats, villas, builder floors, and plots in the Property category.",
  },
  {
    q: "How do buyers find my sale listing?",
    a: "Listings appear as gold pins on the sale map. Buyers filter by area and contact you directly.",
  },
];

function cityPage(
  slug: string,
  cityName: string,
  mapCenter: { lat: number; lng: number },
  mapZoom: number,
  intro: string
): ListForSalePageConfig {
  return {
    path: `/list-for-sale/${slug}`,
    title: `List Property for Sale in ${cityName} | RentalPins Buy`,
    metaDescription: `List your flat, house, or plot for sale in ${cityName} on RentalPins Buy — map-based discovery for Tricity buyers.`,
    h1: `List property for sale in ${cityName}`,
    intro,
    cityName,
    citySlug: slug,
    mapCenter,
    mapZoom,
    supportedTypes: [
      "Apartments and flats",
      "Independent houses and villas",
      "Builder floors",
      "Plots and land",
    ],
    nearbyLinks: [
      ...BUY_HUB_SLUGS.filter((s) => s !== slug).map((s) => ({
        label: `Buy in ${s.charAt(0).toUpperCase() + s.slice(1)}`,
        href: appPath(buyHubPath(s)),
      })),
      { label: "Flats for sale India", href: appPath("/flats-for-sale") },
      { label: "All list-for-sale cities", href: appPath("/list-for-sale") },
    ],
    faq: [
      ...BASE_FAQ,
      {
        q: `What price units can I use in ${cityName}?`,
        a: "Set total asking price, per sqft, or per acre depending on property type.",
      },
      {
        q: `How do I stand out in ${cityName} searches?`,
        a: "Use clear society or sector names in the title, add quality photos, and pin the exact location.",
      },
    ],
  };
}

const CITY_PAGES: Record<string, ListForSalePageConfig> = {
  mohali: cityPage(
    "mohali",
    "Mohali",
    { lat: 30.7046, lng: 76.7179 },
    12,
    "List your Mohali flat, villa, or plot for sale on RentalPins Buy — Phase 7, IT Park, Aerocity, and sector inventory visible to map-first buyers across Tricity."
  ),
  kharar: cityPage(
    "kharar",
    "Kharar",
    { lat: 30.746, lng: 76.6486 },
    13,
    "Sell property in Kharar — flats and plots near Chandigarh University and Kharar town reach buyers on the Tricity sale map without brokerage listing fees."
  ),
  zirakpur: cityPage(
    "zirakpur",
    "Zirakpur",
    { lat: 30.6434, lng: 76.8085 },
    13,
    "List houses, builder floors, and apartments for sale in Zirakpur — border-belt buyers browse owner-direct pins on RentalPins Buy."
  ),
  panchkula: cityPage(
    "panchkula",
    "Panchkula",
    { lat: 30.6942, lng: 76.8606 },
    12,
    "Post Panchkula flats and villas for sale with accurate sector pins — buyers compare Tricity sale inventory on one map."
  ),
};

const ROOT_PAGE: ListForSalePageConfig = {
  path: "/list-for-sale",
  title: "List Property for Sale in India | RentalPins Buy",
  metaDescription:
    "List flats, houses, and plots for sale in Chandigarh Tricity — Mohali, Kharar, Zirakpur, Panchkula. Map-based buyer discovery on RentalPins Buy.",
  h1: "List property for sale",
  intro:
    "RentalPins Buy helps owners reach map-first buyers in Chandigarh Tricity. Post sale listings with photos, asking price, and an accurate location pin — starting in Mohali, Kharar, Zirakpur, and Panchkula.",
  supportedTypes: [
    "Apartments and flats",
    "Independent houses and villas",
    "Builder floors",
    "Plots and land",
  ],
  nearbyLinks: [
    ...BUY_HUB_SLUGS.map((s) => ({
      label: `List for sale in ${s.charAt(0).toUpperCase() + s.slice(1)}`,
      href: appPath(`/list-for-sale/${s}`),
    })),
    { label: "Flats for sale", href: appPath("/flats-for-sale") },
    { label: "Buy hubs", href: appPath("/buy") },
  ],
  faq: [
    ...BASE_FAQ,
    {
      q: "Which cities can I list for sale in?",
      a: "v1 covers Chandigarh Tricity — Mohali, Kharar, Zirakpur, and Panchkula.",
    },
    {
      q: "Is sale listing different from rental listing?",
      a: "Yes — use List for sale so your pin appears on the sale map with transactionType sale.",
    },
  ],
};

const BY_PATH: Record<string, ListForSalePageConfig> = {
  [ROOT_PAGE.path]: ROOT_PAGE,
  ...Object.fromEntries(Object.values(CITY_PAGES).map((c) => [c.path, c])),
};

export function getListForSalePageByPath(path: string): ListForSalePageConfig | null {
  return BY_PATH[path] ?? null;
}

export function getListForSaleCityConfig(city: string): ListForSalePageConfig | null {
  return CITY_PAGES[city] ?? null;
}

export function getListForSaleCitySlugs(): string[] {
  return Object.keys(CITY_PAGES);
}

export function getListForSaleSitemapPaths(): string[] {
  return [ROOT_PAGE.path, ...Object.values(CITY_PAGES).map((c) => c.path)];
}

export function listForSalePostHref(_citySlug?: string): string {
  return appPath(BUY_POST_PATH);
}

export function listForSaleBrowseHref(config: ListForSalePageConfig): string {
  if (config.mapCenter) {
    return appPath(
      saleMapSearchHref(
        config.mapCenter.lat,
        config.mapCenter.lng,
        config.mapZoom ?? 12
      )
    );
  }
  return appPath(BUY_SEARCH_PATH);
}
