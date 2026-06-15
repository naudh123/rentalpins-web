/**
 * Long-form sale money-page SEO copy — mirrors city-seo-config for RentalPins Buy.
 */
import { buyAreaPath, buyPagePath } from "@/lib/sale/buy-pages-config";
import { appPath } from "@/lib/config";

export interface CityBuySeoFaq {
  q: string;
  a: string;
}

export interface CityBuySeoBestArea {
  name: string;
  description: string;
  href?: string;
}

export interface CityBuyPriceRange {
  label: string;
  range: string;
  note?: string;
}

export interface CityBuySeoSection {
  title: string;
  paragraphs: string[];
}

export interface CityBuySEOConfig {
  key: string;
  placeName: string;
  intro: string[];
  bestAreas: CityBuySeoBestArea[];
  averagePrice: CityBuyPriceRange[];
  sections?: CityBuySeoSection[];
  faq: CityBuySeoFaq[];
}

function k(country: string, city: string, area?: string): string {
  return area ? `${country}/${city}/${area}` : `${country}/${city}`;
}

const BUY_SEO: Record<string, CityBuySEOConfig> = {
  [k("in", "chandigarh")]: {
    key: k("in", "chandigarh"),
    placeName: "Chandigarh Tricity",
    intro: [
      "Chandigarh Tricity is a mature property market spanning Mohali phases, Panchkula sectors, Zirakpur highway belts, and Kharar's CU corridor. Buyers compare owner-direct sale pins before site visits — map-first discovery reduces broker noise.",
      "RentalPins Buy organizes Tricity sale inventory by locality. Browse flats, villas, builder floors, and plots with direct seller contact — no brokerage to search or shortlist.",
      "Use this guide when comparing micro-markets across Mohali, Kharar, Panchkula, and Zirakpur before you commit to a locality.",
    ],
    bestAreas: [
      {
        name: "Mohali (Phase 7–11 & IT Park)",
        description: "Family apartments and villas near IT Park, Aerocity, and established societies.",
        href: appPath(buyAreaPath("in", "chandigarh", "mohali")),
      },
      {
        name: "Aerocity & GMADA sectors (82, 88)",
        description: "Fast-growing airport-road and New Chandigarh corridors — newer inventory.",
        href: appPath(buyPagePath("mohali", "aerocity")),
      },
      {
        name: "New Chandigarh (Mullanpur)",
        description: "GMADA Sectors 105–120 — premium plotted and villa inventory.",
        href: appPath(buyPagePath("mohali", "new-chandigarh")),
      },
      {
        name: "Kharar & CU belt",
        description: "Affordable flats and plots near Chandigarh University — investor and end-user demand.",
        href: appPath(buyAreaPath("in", "chandigarh", "kharar")),
      },
      {
        name: "Zirakpur border belt",
        description: "Dhakoli and Gazipur — larger homes for Chandigarh commuters.",
        href: appPath(buyAreaPath("in", "chandigarh", "zirakpur")),
      },
      {
        name: "Panchkula sectors",
        description: "Planned sector living with strong resale tenant demand for landlords.",
        href: appPath(buyAreaPath("in", "chandigarh", "panchkula")),
      },
    ],
    averagePrice: [
      { label: "2 BHK flat (Mohali society)", range: "₹45 L – ₹90 L" },
      { label: "3 BHK villa / floor", range: "₹80 L – ₹1.8 Cr" },
      { label: "Kharar budget flat", range: "₹25 L – ₹55 L" },
      { label: "Zirakpur builder floor", range: "₹35 L – ₹75 L" },
    ],
    faq: [
      {
        q: "Is RentalPins Buy different from rentals?",
        a: "Yes — Buy is our sale vertical with owner-direct property for purchase, separate map filters, and sale-specific guides.",
      },
      {
        q: "Which Tricity city should I start with?",
        a: "Mohali for IT Park buyers, Kharar for budget, Zirakpur for larger homes, Panchkula for sector living.",
      },
      {
        q: "Are prices on the map formal valuations?",
        a: "No — they are owner asking prices. Use listing intelligence comps as context and always verify title.",
      },
    ],
  },

  [k("in", "chandigarh", "mohali")]: {
    key: k("in", "chandigarh", "mohali"),
    placeName: "Mohali",
    intro: [
      "Mohali attracts buyers targeting IT Park proximity, Aerocity, and phase-based gated societies. Phase 7, Phase 9, Sector 70, and airport road belts carry the densest sale inventory in Greater Mohali.",
      "RentalPins Buy Mohali combines live sale listings, locality shortcuts, and buyer FAQs — evaluate apartments and villas on the map before scheduling site visits.",
      "Short GSC hub: compare pins on the Phase 7 or Sector 70 buy pages for hyper-local map centres.",
    ],
    bestAreas: [
      {
        name: "Aerocity & IT City",
        description: "Fastest-growing employment corridor — newer flats near airport road.",
        href: appPath(buyPagePath("mohali", "aerocity")),
      },
      {
        name: "Phase 7 & Phase 9",
        description: "Established societies with strong family flat and villa inventory.",
        href: appPath(buyPagePath("mohali", "phase-7")),
      },
      {
        name: "Phase 11",
        description: "Developing society belt with newer inventory vs inner phases.",
        href: appPath(buyPagePath("mohali", "phase-11")),
      },
      {
        name: "Sector 82 & 88 (GMADA)",
        description: "New GMADA sectors linking Aerocity to New Chandigarh.",
        href: appPath(buyPagePath("mohali", "sector-82")),
      },
      {
        name: "New Chandigarh (Mullanpur)",
        description: "GMADA Sectors 105–120 — browse sector pages or the New Chandigarh hub.",
        href: appPath(buyPagePath("mohali", "new-chandigarh")),
      },
      {
        name: "Sector 70",
        description: "Mid-budget 2–3 BHK flats with Zirakpur connectivity.",
        href: appPath(buyPagePath("mohali", "sector-70")),
      },
      {
        name: "Sector 67",
        description: "Value belt for affordable flats — compare pins before visiting.",
        href: appPath(buyPagePath("mohali", "sector-67")),
      },
    ],
    averagePrice: [
      { label: "2 BHK society flat", range: "₹45 L – ₹85 L" },
      { label: "3 BHK / villa", range: "₹75 L – ₹1.5 Cr" },
      { label: "Builder floor", range: "₹35 L – ₹65 L" },
      { label: "Per sq.ft (society)", range: "₹4,500 – ₹8,500 / sq.ft", note: "Indicative — verify on live pins" },
    ],
    sections: [
      {
        title: "Buyer checklist for Mohali",
        paragraphs: [
          "Confirm RERA registration where applicable, society NOC, and parking allocation before token.",
          "Compare Phase 7 vs Sector 70 commute to your workplace at peak hours — not just mid-day map distance.",
          "Use listing intelligence on detail pages to see nearby comp bands before negotiating.",
        ],
      },
    ],
    faq: [
      {
        q: "What are the best areas to buy a flat in Mohali?",
        a: "Phase 7, Phase 9, Phase 11, and Aerocity are most searched. Sector 70 and 67 offer relative value.",
      },
      {
        q: "Are there brokerage fees for buyers on RentalPins?",
        a: "No — RentalPins does not charge buyers to search or contact owners on the sale map.",
      },
      {
        q: "How do I list my Mohali property for sale?",
        a: "Use List for sale — add photos, BHK, society name, and accurate map pin.",
      },
    ],
  },

  [k("in", "chandigarh", "kharar")]: {
    key: k("in", "chandigarh", "kharar"),
    placeName: "Kharar",
    intro: [
      "Kharar offers Tricity's most affordable entry points — flats and plots along the CU belt, Kharar town, and the fast-growing Kharar–Banur Road GMADA corridor.",
      "RentalPins Buy Kharar maps owner-direct sale listings with corridor shortcuts — Kharar to CU, Kharar to Kurali, Kurali to Siswan, and the Kharar–Banur GMADA belt.",
    ],
    bestAreas: [
      {
        name: "Kharar to Chandigarh University",
        description: "Kharar town to CU campus — flats and plots on the main student corridor.",
        href: appPath(buyPagePath("kharar", "kharar-to-cu")),
      },
      {
        name: "Kharar to Kurali",
        description: "Northwest corridor from Kharar — affordable plots and builder floors.",
        href: appPath(buyPagePath("kharar", "kharar-to-kurali")),
      },
      {
        name: "Kurali to Siswan",
        description: "Fringe belt beyond Kurali — larger plots and farmhouse inventory.",
        href: appPath(buyPagePath("kharar", "kurali-to-siswan")),
      },
      {
        name: "Kharar–Banur Road (GMADA belt)",
        description: "Sector 112–119 and 125–127 — Tricity's fastest-growing sale corridor east of Kharar.",
        href: appPath(buyPagePath("kharar", "kharar-banur-road")),
      },
      {
        name: "Sector 117 & 119",
        description: "High-demand mid-corridor sectors on the Banur road belt.",
        href: appPath(buyPagePath("kharar", "sector-117")),
      },
      {
        name: "Sector 126 & 125",
        description: "Kharar-gateway GMADA sectors where town meets the Banur road belt.",
        href: appPath(buyPagePath("kharar", "sector-126")),
      },
      {
        name: "Chandigarh University belt",
        description: "Campus-adjacent flats and plots — see dedicated CU buy page.",
        href: appPath(buyPagePath("kharar", "chandigarh-university")),
      },
      {
        name: "Landran & Sector 112",
        description: "College and industrial belt junction on Kharar–Banur Road.",
        href: appPath(buyPagePath("kharar", "sector-112")),
      },
      { name: "Banur", description: "Eastern corridor end — plots and independent homes.", href: appPath(buyPagePath("kharar", "banur")) },
      { name: "Kharar town", description: "Mixed flat and plot inventory near bus stand and markets." },
    ],
    averagePrice: [
      { label: "2 BHK flat", range: "₹25 L – ₹50 L" },
      { label: "Plot (per acre)", range: "Varies — filter on map", note: "Verify title and zoning" },
    ],
    faq: [
      {
        q: "Is Kharar good for investment flats?",
        a: "CU corridor demand supports rental yield — verify builder reputation and title before buying.",
      },
    ],
  },

  [k("in", "chandigarh", "zirakpur")]: {
    key: k("in", "chandigarh", "zirakpur"),
    placeName: "Zirakpur",
    intro: [
      "Zirakpur suits families seeking larger homes on the Chandigarh–Punjab border. Builder floors and independent houses dominate sale inventory.",
    ],
    bestAreas: [
      { name: "Gazipur & highway belt", description: "Commuter-friendly floors with Chandigarh access." },
      { name: "Baltana", description: "Mixed apartment and floor inventory." },
    ],
    averagePrice: [
      { label: "Builder floor (2–3 BHK)", range: "₹35 L – ₹75 L" },
      { label: "Independent house", range: "₹60 L – ₹1.2 Cr" },
    ],
    faq: [
      {
        q: "Why do families choose Zirakpur?",
        a: "Relative value vs Chandigarh sectors and larger home sizes — verify society approvals.",
      },
    ],
  },

  [k("in", "chandigarh", "panchkula")]: {
    key: k("in", "chandigarh", "panchkula"),
    placeName: "Panchkula",
    intro: [
      "Panchkula offers planned sector living with strong family demand. Buyers compare sector belts and extension areas on the sale map.",
    ],
    bestAreas: [
      { name: "Sector belts", description: "Established residential sectors with society flats." },
      { name: "Extension corridors", description: "Newer inventory with varying completion status." },
    ],
    averagePrice: [
      { label: "2 BHK flat", range: "₹50 L – ₹95 L" },
      { label: "3 BHK / villa", range: "₹90 L – ₹2 Cr" },
    ],
    faq: [
      {
        q: "What should Panchkula buyers verify?",
        a: "Title, HUDA/MC approvals, and encumbrance — always before token payment.",
      },
    ],
  },
};

export function getCityBuySeoConfig(
  countrySlug: string,
  citySlug: string,
  areaSlug?: string
): CityBuySEOConfig | null {
  const lookup = areaSlug
    ? k(countrySlug, citySlug, areaSlug)
    : k(countrySlug, citySlug);
  return BUY_SEO[lookup] ?? null;
}

export function listCityBuySeoConfigKeys(): string[] {
  return Object.keys(BUY_SEO);
}

export function getBuyMoneyPageSitemapPaths(): string[] {
  return listCityBuySeoConfigKeys().map((key) => {
    const parts = key.split("/");
    if (parts.length === 2) return `/buy/${parts[0]}/${parts[1]}`;
    return `/buy/${parts[0]}/${parts[1]}/${parts[2]}`;
  });
}

/** Params for /buy/{country}/{city} routed via [hub]/[area]. */
export function getBuyCityMoneyPageParams(): { hub: string; area: string }[] {
  return listCityBuySeoConfigKeys()
    .filter((key) => key.split("/").length === 2)
    .map((key) => {
      const [hub, area] = key.split("/");
      return { hub: hub!, area: area! };
    });
}
