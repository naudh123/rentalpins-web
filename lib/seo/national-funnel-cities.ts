import {
  getLiveCities,
  rentalAreaPath,
  rentalCityPath,
} from "@/lib/cities-config";
import { appPath } from "@/lib/config";
import { rentalAreaCategoryPath, rentalCategoryPath } from "@/lib/seo/categories";

export type NationalFunnelKind = "flats" | "houses" | "property";

export interface NationalFunnelCity {
  name: string;
  description: string;
  hubHref: string;
  primaryHref: string;
  primaryLabel: string;
}

interface FunnelCitySeed {
  name: string;
  description: string;
  countrySlug: string;
  citySlug: string;
  areaSlug?: string;
  brokerLandingSlug?: string;
}

const PRIORITY_FUNNEL_CITIES: FunnelCitySeed[] = [
  {
    name: "Chandigarh Tricity",
    description: "Sectors, Mohali phases, Panchkula, Zirakpur & Kharar on one map.",
    countrySlug: "in",
    citySlug: "chandigarh",
    brokerLandingSlug: "property-without-broker-chandigarh",
  },
  {
    name: "Mohali",
    description: "Phase 7–11, IT Park, Aerocity — apartments & PG for professionals.",
    countrySlug: "in",
    citySlug: "chandigarh",
    areaSlug: "mohali",
    brokerLandingSlug: "property-without-broker-mohali",
  },
  {
    name: "Kharar",
    description: "Budget PG and flats near Chandigarh University and Landran belt.",
    countrySlug: "in",
    citySlug: "chandigarh",
    areaSlug: "kharar",
  },
  {
    name: "Ludhiana",
    description: "Model Town, Sarabha Nagar, Focal Point — family & industrial belts.",
    countrySlug: "in",
    citySlug: "ludhiana",
    brokerLandingSlug: "property-without-broker-ludhiana",
  },
  {
    name: "Delhi NCR",
    description: "Dwarka, Rohini, Mukherjee Nagar and major Delhi localities.",
    countrySlug: "in",
    citySlug: "delhi",
    brokerLandingSlug: "property-without-broker-delhi",
  },
];

function hubPath(seed: FunnelCitySeed): string {
  return seed.areaSlug
    ? rentalAreaPath(seed.countrySlug, seed.citySlug, seed.areaSlug)
    : rentalCityPath(seed.countrySlug, seed.citySlug);
}

function categoryPath(seed: FunnelCitySeed, category: "flats" | "houses"): string {
  return seed.areaSlug
    ? rentalAreaCategoryPath(
        seed.countrySlug,
        seed.citySlug,
        seed.areaSlug,
        category
      )
    : rentalCategoryPath(seed.countrySlug, seed.citySlug, category);
}

function seedToFunnelCity(seed: FunnelCitySeed, kind: NationalFunnelKind): NationalFunnelCity {
  const hubHref = appPath(hubPath(seed));

  if (kind === "property") {
    const primaryHref = seed.brokerLandingSlug
      ? appPath(`/${seed.brokerLandingSlug}`)
      : hubHref;
    return {
      name: seed.name,
      description: seed.description,
      hubHref,
      primaryHref,
      primaryLabel: seed.brokerLandingSlug
        ? `Property in ${seed.name.split(" ")[0]}`
        : `Browse ${seed.name}`,
    };
  }

  const category = kind === "flats" ? "flats" : "houses";
  const label = kind === "flats" ? "Flats" : "Houses";

  return {
    name: seed.name,
    description: seed.description,
    hubHref,
    primaryHref: appPath(categoryPath(seed, category)),
    primaryLabel: `${label} in ${seed.name.split(" ")[0]}`,
  };
}

/** Extra live Indian cities appended after priority markets. */
function secondaryIndianCities(): FunnelCitySeed[] {
  const priorityKeys = new Set(
    PRIORITY_FUNNEL_CITIES.map((s) => `${s.countrySlug}/${s.citySlug}/${s.areaSlug ?? ""}`)
  );

  return getLiveCities()
    .filter((city) => city.countrySlug === "in")
    .filter((city) => !priorityKeys.has(`${city.countrySlug}/${city.slug}/`))
    .map((city) => ({
      name: city.name,
      description: city.tagline || city.heroDescription.slice(0, 120),
      countrySlug: city.countrySlug,
      citySlug: city.slug,
    }));
}

export function getNationalFunnelCities(kind: NationalFunnelKind): NationalFunnelCity[] {
  const seeds = [...PRIORITY_FUNNEL_CITIES, ...secondaryIndianCities()];
  return seeds.map((seed) => seedToFunnelCity(seed, kind));
}

export function nationalFunnelSectionTitle(kind: NationalFunnelKind): string {
  switch (kind) {
    case "flats":
      return "Flats for rent by city";
    case "houses":
      return "Houses for rent by city";
    case "property":
      return "Property without broker — top cities";
  }
}

export function nationalFunnelSectionIntro(kind: NationalFunnelKind): string {
  switch (kind) {
    case "flats":
      return "Start from a live city hub or jump straight to flats & apartments — owner listings, no brokerage to search.";
    case "houses":
      return "Browse independent houses and villas in our highest-demand markets, then contact owners on the map.";
    case "property":
      return "India-wide entry points into owner-direct property search — flats, PG, houses, shops, and offices.";
  }
}
