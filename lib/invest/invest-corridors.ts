import type { InvestmentStrategy } from "@/lib/agent/tricity-investment-knowledge";

export interface InvestCorridor {
  id: string;
  name: string;
  tagline: string;
  strategy: InvestmentStrategy;
  budgetBand: string;
  horizon: string;
  playbookId: string;
  /** Map centre for deep link. */
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  buyHubPath: string;
  rentHubPath: string;
  guidePath: string | null;
  projectsPath: string | null;
  highlights: string[];
}

export const INVEST_CORRIDORS: InvestCorridor[] = [
  {
    id: "mohali-it-aerocity",
    name: "Mohali IT Park & Aerocity",
    tagline: "Professional rental yield",
    strategy: "rental-yield",
    budgetBand: "₹55L–₹1.5Cr",
    horizon: "3–7 years",
    playbookId: "mohali-professional-yield",
    mapCenter: { lat: 30.7045, lng: 76.7179 },
    mapZoom: 13,
    buyHubPath: "/buy/mohali",
    rentHubPath: "/rentals/in/chandigarh/mohali",
    guidePath: "/buy/mohali-investment-guide",
    projectsPath: "/projects/mohali",
    highlights: [
      "IT City & airport corridor tenant pool",
      "Furnished premium vs unfurnished",
      "Better resale liquidity than greenfield fringe",
    ],
  },
  {
    id: "zirakpur-vip",
    name: "Zirakpur VIP Road",
    tagline: "Commuter rental yield",
    strategy: "rental-yield",
    budgetBand: "₹35L–₹90L",
    horizon: "3–6 years",
    playbookId: "zirakpur-commuter-yield",
    mapCenter: { lat: 30.6428, lng: 76.8172 },
    mapZoom: 13,
    buyHubPath: "/buy/zirakpur",
    rentHubPath: "/rentals/in/chandigarh/zirakpur",
    guidePath: "/buy/zirakpur-investment-guide",
    projectsPath: "/projects/zirakpur",
    highlights: [
      "Lower entry than prime Mohali",
      "Chandigarh commuter demand",
      "Active VIP Road resale market",
    ],
  },
  {
    id: "kharar-cu-jhanjeri",
    name: "Kharar–CU & Jhanjeri",
    tagline: "Student PG yield",
    strategy: "student-yield",
    budgetBand: "₹25L–₹70L",
    horizon: "2–5 years",
    playbookId: "kharar-cu-pg-yield",
    mapCenter: { lat: 30.7456, lng: 76.6467 },
    mapZoom: 13,
    buyHubPath: "/buy/kharar",
    rentHubPath: "/rentals/kharar",
    guidePath: "/buy/kharar-investment-guide",
    projectsPath: "/projects/kharar",
    highlights: [
      "Chandigarh University PG density",
      "Multi-tenant gross can beat family rent",
      "Emerging Jhanjeri on Landran–Chunni road",
    ],
  },
  {
    id: "new-chandigarh",
    name: "New Chandigarh / Mullanpur",
    tagline: "Capital appreciation & plots",
    strategy: "capital-appreciation",
    budgetBand: "₹40L–₹2Cr+",
    horizon: "5–10 years",
    playbookId: "new-chandigarh-appreciation",
    mapCenter: { lat: 30.7712, lng: 76.6934 },
    mapZoom: 12,
    buyHubPath: "/buy/mohali/new-chandigarh",
    rentHubPath: "/rentals/in/chandigarh/new-chandigarh",
    guidePath: "/buy/new-chandigarh-investment-guide",
    projectsPath: "/projects/kharar",
    highlights: [
      "GMADA growth belt positioning",
      "Plot + apartment mix",
      "Long hold — liquidity slower than prime Mohali",
    ],
  },
  {
    id: "kurali-banur-gmada",
    name: "Kurali–Banur GMADA belt",
    tagline: "Plot long-hold entry",
    strategy: "plot-long-hold",
    budgetBand: "₹18L–₹80L plots",
    horizon: "7–15 years",
    playbookId: "kurali-banur-plot-entry",
    mapCenter: { lat: 30.8345, lng: 76.5521 },
    mapZoom: 12,
    buyHubPath: "/buy/kharar",
    rentHubPath: "/rentals/kharar",
    guidePath: "/buy/kurali-banur-investment-guide",
    projectsPath: null,
    highlights: [
      "Lower ticket GMADA plots",
      "Infrastructure-led appreciation thesis",
      "Verify CLU and possession before payment",
    ],
  },
  {
    id: "aerocity-airport",
    name: "Aerocity & Airport Road",
    tagline: "Premium professional corridor",
    strategy: "rental-yield",
    budgetBand: "₹70L–₹2Cr",
    horizon: "4–8 years",
    playbookId: "mohali-professional-yield",
    mapCenter: { lat: 30.6765, lng: 76.7402 },
    mapZoom: 13,
    buyHubPath: "/buy/mohali/airport-road",
    rentHubPath: "/rentals/in/chandigarh/mohali",
    guidePath: "/buy/aerocity-investment-guide",
    projectsPath: "/projects/mohali",
    highlights: [
      "Airport & hospitality workforce demand",
      "Premium furnished segment",
      "Compare vs IT Park societies on rent map",
    ],
  },
];

export function getInvestCorridor(id: string): InvestCorridor | undefined {
  return INVEST_CORRIDORS.find((c) => c.id === id);
}

export function buildCorridorBuyMapUrl(corridor: InvestCorridor): string {
  const { lat, lng } = corridor.mapCenter;
  return `${corridor.buyHubPath.replace(/^\/buy/, "/buy/search")}?lat=${lat}&lng=${lng}&zoom=${corridor.mapZoom}`;
}

/** Deep link to buy map with corridor viewport. */
export function corridorBuySearchUrl(corridor: InvestCorridor): string {
  const { lat, lng } = corridor.mapCenter;
  return `/buy/search?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}&zoom=${corridor.mapZoom}`;
}

export function corridorRentSearchUrl(corridor: InvestCorridor): string {
  const { lat, lng } = corridor.mapCenter;
  return `/search?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}&zoom=${corridor.mapZoom}`;
}
