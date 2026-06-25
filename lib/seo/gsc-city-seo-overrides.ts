import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export interface GscCitySeoCopy {
  title: string;
  description: string;
  /** Visible intro under H1 — aligned with meta for snippet consistency. */
  heroDescription?: string;
}

/** Tuned for GSC zero-click flats hubs (Delhi, Ludhiana, Lucknow). */
const CITY_FLATS_SEO: Record<string, GscCitySeoCopy> = {
  delhi: {
    title: "Apartments & Flats for Rent in Delhi — Map Listings, No Broker",
    description:
      "Browse apartments and flats for rent in Delhi on RentalPins map — Dwarka, GTB Nagar, Mukherjee Nagar and more. Direct owner contact. Own a flat? List free.",
    heroDescription:
      "Browse apartments and flats for rent in Delhi on the map — owner listings across Dwarka, GTB Nagar, Mukherjee Nagar and coaching-belt localities. Contact directly, no broker search fee. Own a flat? List it free.",
  },
  ludhiana: {
    title: "Flats & Apartments for Rent in Ludhiana — Map Search | RentalPins",
    description:
      "Find flats and apartments for rent in Ludhiana without a broker. Browse Model Town and city listings on the map — list your flat free on RentalPins.",
    heroDescription:
      "Compare flats and apartments for rent in Ludhiana on the map — Model Town, PAU belt and city hubs. Message owners directly from map pins. List your Ludhiana flat free.",
  },
  lucknow: {
    title: "Flats & Apartments for Rent in Lucknow — Map Search | RentalPins",
    description:
      "Browse flats and apartments for rent in Lucknow on the map. Compare localities and contact owners directly — list your rental property free on RentalPins.",
    heroDescription:
      "Find flats and apartments for rent in Lucknow through map-first search. Browse owner pins by locality and contact directly — list your flat or PG free on RentalPins.",
  },
  jaipur: {
    title: "Flats for Rent in Jaipur — Apartments & Map Listings | RentalPins",
    description:
      "Find flats for rent in Jaipur — Malviya Nagar, Vaishali Nagar, Mansarovar, Jagatpura and more. Browse owner apartment listings on the map. List free.",
    heroDescription:
      "Browse flats and apartments for rent in Jaipur on the map — Malviya Nagar, Vaishali Nagar, Mansarovar, Jagatpura and C-Scheme. Contact owners directly. List your Jaipur flat free.",
  },
};

/** Jaipur category hubs — early GSC signals (June 2026). */
const JAIPUR_CATEGORY_SEO: Record<string, GscCitySeoCopy> = {
  houses: {
    title: "Houses for Rent in Jaipur — Villas & Independent Homes | RentalPins",
    description:
      "Find houses and villas for rent in Jaipur on the map. Vaishali Nagar, Mansarovar, Jagatpura and more — owner-direct listings. List your house free.",
    heroDescription:
      "Discover independent houses and villas for rent in Jaipur through map pins across Vaishali Nagar, Mansarovar, and Jagatpura. Contact owners directly — list your house free.",
  },
  pg: {
    title: "PG for Rent in Jaipur — Student & Professional Hostels | RentalPins",
    description:
      "Find PG and hostels for rent in Jaipur near colleges and IT corridors. Malviya Nagar, Jagatpura, Sitapura — map search with owner contact.",
    heroDescription:
      "Compare PG and hostel rentals in Jaipur on the map — popular near Malviya Nagar, Jagatpura, and Sitapura. Message owners directly. PG owners can list free.",
  },
  commercial: {
    title: "Commercial Property for Rent in Jaipur | RentalPins",
    description:
      "Browse commercial property for rent in Jaipur — offices, shops, and mixed-use units on the map. Owner-direct contact. List commercial space free.",
    heroDescription:
      "Find commercial property for rent in Jaipur on the RentalPins map — offices, retail, and mixed-use along main corridors. Contact owners directly. List free.",
  },
  warehouses: {
    title: "Warehouses for Rent in Jaipur — Godown & Storage | RentalPins",
    description:
      "Find warehouses and godowns for rent in Jaipur — Sitapura, VKI, and industrial belts on the map. Owner listings with direct contact.",
    heroDescription:
      "Browse warehouse and godown rentals in Jaipur — Sitapura industrial belt and logistics corridors on the map. Contact owners directly. List your warehouse free.",
  },
  shops: {
    title: "Shops for Rent in Jaipur — Retail Space on Map | RentalPins",
    description:
      "Find shops and retail space for rent in Jaipur — C-Scheme, Raja Park, Vaishali Nagar and high-street corridors. Owner-direct map listings.",
    heroDescription:
      "Discover shops for rent in Jaipur on the map — retail units across C-Scheme, Raja Park, and Vaishali Nagar. Contact shop owners directly. List free.",
  },
};

const MOHALI_FLATS_SEO: GscCitySeoCopy = {
  title: "Flats for Rent in Mohali — Owner Listings on Map | RentalPins",
  description:
    "Find flats for rent in Mohali without a broker. Browse Phase 7, Sector 70, Aerocity and IT Park pins — list your Mohali flat free on RentalPins.",
  heroDescription:
    "Browse flats for rent in Mohali on the map — Phase 7, Sector 70, Aerocity and IT Park. Direct owner contact, no broker. List your flat, PG or house free.",
};

export function buildGscCityCategoryMetadata(
  citySlug: string,
  categorySlug: string,
  path: string,
  areaSlug?: string | null
): Metadata | null {
  if (citySlug === "jaipur" && !areaSlug) {
    const jaipurCopy = JAIPUR_CATEGORY_SEO[categorySlug] ?? CITY_FLATS_SEO.jaipur;
    if (categorySlug === "flats" || JAIPUR_CATEGORY_SEO[categorySlug]) {
      const copy = categorySlug === "flats" ? CITY_FLATS_SEO.jaipur! : jaipurCopy;
      return buildFromCopy(copy, path, [
        `${categorySlug} for rent in jaipur`,
        `flat on rent jaipur`,
        `flats for rent in jaipur`,
        `no broker jaipur`,
      ]);
    }
  }

  if (categorySlug !== "flats") return null;

  if (citySlug === "chandigarh" && areaSlug === "mohali") {
    return buildFromCopy(MOHALI_FLATS_SEO, path, [
      "flats for rent in mohali",
      "flat for rent mohali",
      "apartment rental listings mohali",
      "no broker mohali",
    ]);
  }

  const copy = CITY_FLATS_SEO[citySlug];
  if (!copy || areaSlug) return null;

  return buildFromCopy(copy, path, [
    `flats for rent in ${citySlug}`,
    `apartment rental listings ${citySlug}`,
    `where to find apartments ${citySlug}`,
    `no broker ${citySlug}`,
  ]);
}

export function resolveGscCityHeroDescription(
  citySlug: string,
  categorySlug: string,
  areaSlug?: string | null
): string | null {
  if (citySlug === "jaipur" && !areaSlug) {
    if (categorySlug === "flats") return CITY_FLATS_SEO.jaipur?.heroDescription ?? null;
    return JAIPUR_CATEGORY_SEO[categorySlug]?.heroDescription ?? null;
  }
  if (categorySlug !== "flats") return null;
  if (citySlug === "chandigarh" && areaSlug === "mohali") {
    return MOHALI_FLATS_SEO.heroDescription ?? null;
  }
  return CITY_FLATS_SEO[citySlug]?.heroDescription ?? null;
}

function buildFromCopy(
  copy: GscCitySeoCopy,
  path: string,
  keywords: string[]
): Metadata {
  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path,
    keywords: [...keywords, "RentalPins", "map search"],
    locale: "en_IN",
  });
}
