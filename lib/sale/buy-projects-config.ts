/** Buy-side developer project hub — Tricity launch inventory. */

export interface BuyProjectConfig {
  slug: string;
  name: string;
  citySlug: string;
  cityName: string;
  locality: string;
  priceRange: string;
  types: string[];
  amenities: string[];
  investmentNote: string;
  status: "selling" | "upcoming";
  developerSlug?: string;
}

export const BUY_PROJECTS: BuyProjectConfig[] = [
  {
    slug: "green-valley-residences",
    name: "Green Valley Residences",
    citySlug: "mohali",
    cityName: "Mohali",
    locality: "New Chandigarh",
    priceRange: "₹45L – ₹1.2Cr",
    types: ["2 BHK", "3 BHK", "Penthouse"],
    amenities: ["Clubhouse", "Covered parking", "Power backup", "Landscaped gardens"],
    investmentNote:
      "New Chandigarh growth corridor with improving connectivity to Chandigarh and Mohali commercial hubs.",
    status: "selling",
    developerSlug: "green-valley-builders",
  },
  {
    slug: "tricity-heights",
    name: "Tricity Heights",
    citySlug: "zirakpur",
    cityName: "Zirakpur",
    locality: "VIP Road",
    priceRange: "₹35L – ₹90L",
    types: ["2 BHK", "3 BHK"],
    amenities: ["Gym", "Swimming pool", "24×7 security"],
    investmentNote:
      "VIP Road belt with strong rental demand from Chandigarh commuters and airport corridor professionals.",
    status: "selling",
  },
  {
    slug: "aerocity-skyline",
    name: "Aerocity Skyline",
    citySlug: "mohali",
    cityName: "Mohali",
    locality: "Aerocity",
    priceRange: "₹55L – ₹1.5Cr",
    types: ["2 BHK", "3 BHK", "4 BHK"],
    amenities: ["Concierge", "EV charging", "Sky lounge", "Landscaped podium"],
    investmentNote:
      "Airport-adjacent premium corridor — compare resale comps on the RentalPins buy map before booking.",
    status: "upcoming",
  },
  {
    slug: "panchkula-elevate",
    name: "Panchkula Elevate",
    citySlug: "panchkula",
    cityName: "Panchkula",
    locality: "Sector 20",
    priceRange: "₹40L – ₹95L",
    types: ["2 BHK", "3 BHK"],
    amenities: ["Clubhouse", "Jogging track", "Kids play area"],
    investmentNote:
      "Established Panchkula sector with family buyer demand and steady end-user resale liquidity.",
    status: "selling",
  },
];

export function getBuyProject(slug: string): BuyProjectConfig | null {
  return BUY_PROJECTS.find((p) => p.slug === slug) ?? null;
}

export function getBuyProjectsForCity(citySlug: string): BuyProjectConfig[] {
  return BUY_PROJECTS.filter((p) => p.citySlug === citySlug);
}

export function getBuyProjectCitySlugs(): string[] {
  return [...new Set(BUY_PROJECTS.map((p) => p.citySlug))];
}

export function buyProjectPath(citySlug: string, projectSlug: string): string {
  return `/buy/projects/${citySlug}/${projectSlug}`;
}

export function getBuyProjectSitemapPaths(): string[] {
  return [
    "/buy/projects",
    ...getBuyProjectCitySlugs().map((c) => `/buy/projects/${c}`),
    ...BUY_PROJECTS.map((p) => buyProjectPath(p.citySlug, p.slug)),
  ];
}
