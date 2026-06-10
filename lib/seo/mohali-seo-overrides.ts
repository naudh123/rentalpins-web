import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export interface MohaliSeoCopy {
  title: string;
  description: string;
}

/** Canonical money-page overrides tuned to GSC query phrasing. */
export const MOHALI_CANONICAL_AREA_SEO: MohaliSeoCopy = {
  title: "Flats for Rent in Mohali — Map Search, No Broker | RentalPins",
  description:
    "Browse flats, PG and houses for rent in Mohali on the map — Phase 7, Sector 70, IT Park and Aerocity. Contact owners directly or list your Mohali property free.",
};

export const MOHALI_CATEGORY_SEO: Record<string, MohaliSeoCopy> = {
  flats: {
    title: "Flats for Rent in Mohali — Owner Listings on Map | RentalPins",
    description:
      "Find flats for rent in Mohali without a broker. Browse Phase 7, Sector 70, Aerocity and IT Park pins on RentalPins — message owners directly from the map.",
  },
  pg: {
    title: "PG in Mohali — Hostels & Paying Guest on Map | RentalPins",
    description:
      "PG and hostels in Mohali near IT Park and commuter belts. Map-first search with direct owner contact — list your PG free on RentalPins.",
  },
};

export interface MohaliGscLink {
  label: string;
  href: string;
}

/** Short GSC URLs for internal linking and indexation discovery. */
export const MOHALI_GSC_LINKS: MohaliGscLink[] = [
  { label: "Mohali rentals hub", href: "/rentals/mohali" },
  { label: "Sector 70 Mohali", href: "/rentals/mohali/sector-70" },
  { label: "Sector 67 Mohali", href: "/rentals/mohali/sector-67" },
  { label: "Phase 7 Mohali", href: "/rentals/mohali/phase-7" },
  { label: "Mohali flats (map)", href: "/rentals/in/chandigarh/mohali/flats" },
  { label: "PG near CU", href: "/pg-near-chandigarh-university" },
];

export const CU_PG_CROSS_LINKS: MohaliGscLink[] = [
  { label: "PG near Chandigarh University", href: "/pg-near-chandigarh-university" },
  { label: "Rentals near CU campus", href: "/rentals/chandigarh-university" },
  { label: "Kharar near CU", href: "/rentals/kharar/chandigarh-university" },
  { label: "Kharar area hub", href: "/rentals/kharar" },
  { label: "Phase 7 Mohali", href: "/rentals/mohali/phase-7" },
  { label: "Mohali rentals", href: "/rentals/mohali" },
];

export function isMohaliCanonicalArea(
  countrySlug: string,
  citySlug: string,
  areaSlug: string
): boolean {
  return countrySlug === "in" && citySlug === "chandigarh" && areaSlug === "mohali";
}

export function buildMohaliCanonicalAreaMetadata(path: string): Metadata {
  return buildPageMetadata({
    title: MOHALI_CANONICAL_AREA_SEO.title,
    description: MOHALI_CANONICAL_AREA_SEO.description,
    path,
    keywords: [
      "flats for rent in mohali",
      "flat for rent mohali",
      "rent in mohali",
      "mohali rentals",
      "PG mohali",
      "no broker mohali",
    ],
    locale: "en_IN",
  });
}

export function buildMohaliCategoryMetadata(
  categorySlug: string,
  path: string
): Metadata | null {
  const copy = MOHALI_CATEGORY_SEO[categorySlug];
  if (!copy) return null;
  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path,
    keywords: [
      `${categorySlug} for rent mohali`,
      `rent in mohali`,
      "no broker mohali",
      "RentalPins",
    ],
    locale: "en_IN",
  });
}
