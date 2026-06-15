import { appPath } from "@/lib/config";
import { buyHubPath } from "@/lib/sale/buy-pages-config";

export type SaleFunnelKind = "flats" | "property";

export interface SaleFunnelCity {
  name: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  buyHubHref?: string;
}

const TRICITY_SALE_CITIES: SaleFunnelCity[] = [
  {
    name: "Mohali",
    description: "Phase 7–11, IT Park, Aerocity — apartments and villas for sale.",
    primaryHref: appPath(buyHubPath("mohali")),
    primaryLabel: "Flats for sale in Mohali",
    buyHubHref: appPath(buyHubPath("mohali")),
  },
  {
    name: "Kharar",
    description: "Affordable flats and plots near Chandigarh University belt.",
    primaryHref: appPath(buyHubPath("kharar")),
    primaryLabel: "Property for sale in Kharar",
    buyHubHref: appPath(buyHubPath("kharar")),
  },
  {
    name: "Zirakpur",
    description: "Houses and builder floors on the Chandigarh border.",
    primaryHref: appPath(buyHubPath("zirakpur")),
    primaryLabel: "Homes for sale in Zirakpur",
    buyHubHref: appPath(buyHubPath("zirakpur")),
  },
  {
    name: "Panchkula",
    description: "Sector flats and villas in planned Panchkula belts.",
    primaryHref: appPath(buyHubPath("panchkula")),
    primaryLabel: "Property for sale in Panchkula",
    buyHubHref: appPath(buyHubPath("panchkula")),
  },
  {
    name: "Chandigarh Tricity",
    description: "Mohali, Kharar, Panchkula, and Zirakpur on one sale map.",
    primaryHref: appPath("/property-for-sale-chandigarh"),
    primaryLabel: "Tricity property for sale",
    buyHubHref: appPath("/buy"),
  },
];

export function getSaleFunnelCities(kind: SaleFunnelKind): SaleFunnelCity[] {
  if (kind === "property") {
    return TRICITY_SALE_CITIES.map((city) => ({
      ...city,
      primaryHref:
        city.name === "Mohali"
          ? appPath("/property-for-sale-mohali")
          : city.name === "Chandigarh Tricity"
            ? appPath("/property-for-sale-chandigarh")
            : city.buyHubHref ?? city.primaryHref,
      primaryLabel:
        city.name === "Chandigarh Tricity"
          ? "Tricity sale guide"
          : `Property for sale in ${city.name}`,
    }));
  }
  return TRICITY_SALE_CITIES;
}

export function saleFunnelSectionTitle(kind: SaleFunnelKind): string {
  switch (kind) {
    case "flats":
      return "Flats for sale in Chandigarh Tricity";
    case "property":
      return "Property for sale — Tricity cities";
  }
}

export function saleFunnelSectionIntro(kind: SaleFunnelKind): string {
  switch (kind) {
    case "flats":
      return "Owner-direct apartments and builder floors — browse sale pins by city, then message sellers without brokerage search fees.";
    case "property":
      return "Map-first sale discovery across Mohali, Kharar, Zirakpur, and Panchkula — flats, houses, plots, and villas.";
  }
}
