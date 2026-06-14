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
