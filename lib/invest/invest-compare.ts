import { BUY_HUBS } from "@/lib/sale/buy-pages-config";
import {
  TRICITY_INVESTMENT_PLAYBOOKS,
  type InvestmentStrategy,
  type TricityInvestmentPlaybook,
} from "@/lib/agent/tricity-investment-knowledge";

function hubHighlights(slug: string): string[] {
  const hub = BUY_HUBS[slug];
  if (!hub) return [];
  return hub.highlights.slice(0, 6).map((h) => `${h.title}: ${h.desc}`);
}

export interface InvestCompareProfile {
  slug: string;
  name: string;
  headline: string;
  strategy: InvestmentStrategy | "mixed";
  budgetBand: string;
  horizon: string;
  yieldStyle: string;
  appreciationStyle: string;
  liquidity: string;
  tenantProfile: string;
  strengths: string[];
  risks: string[];
  buyMapPath: string;
  rentMapPath: string;
  guidePath: string | null;
  playbook: TricityInvestmentPlaybook | null;
}

const SLUG_PLAYBOOK_MAP: Record<string, string> = {
  mohali: "mohali-professional-yield",
  zirakpur: "zirakpur-commuter-yield",
  kharar: "kharar-cu-pg-yield",
  panchkula: "panchkula-stable-enduser",
};

const SLUG_GUIDE_MAP: Record<string, string> = {
  mohali: "/buy/mohali-investment-guide",
  zirakpur: "/buy/zirakpur-investment-guide",
  kharar: "/buy/kharar-investment-guide",
  panchkula: "/property-market-insights/chandigarh-tricity",
};

const YIELD_STYLE: Record<string, string> = {
  mohali: "Strong professional rent — furnished 2 BHK often ₹18k–₹35k/mo in prime belts (verify on rent map)",
  zirakpur: "Commuter yield — 2 BHK often ₹10k–₹22k/mo; lower entry, higher churn",
  kharar: "Student PG yield — bed-level gross can exceed family rent with active ops",
  panchkula: "Moderate yield, stronger end-user resale — family tenants preferred",
};

const APPRECIATION_STYLE: Record<string, string> = {
  mohali: "Steady sector appreciation; IT corridor premium for quality societies",
  zirakpur: "Infrastructure-led; VIP Road frontage commands premium",
  kharar: "Student hub expansion (Jhanjeri) — emerging, higher volatility",
  panchkula: "Mature Haryana hub — stable, slower than greenfield corridors",
};

const LIQUIDITY: Record<string, string> = {
  mohali: "High — active resale in Phases and IT belts",
  zirakpur: "Medium-high — VIP Road resales move steadily",
  kharar: "Medium — student segment faster turnover, plot fringe slower",
  panchkula: "High for established sectors — end-user driven",
};

export const INVEST_COMPARE_SLUGS = ["mohali", "zirakpur", "kharar", "panchkula"] as const;

export function getInvestCompareProfile(slug: string): InvestCompareProfile | null {
  const normalized = slug.trim().toLowerCase();
  const hub = BUY_HUBS[normalized];
  if (!hub) return null;

  const playbookId = SLUG_PLAYBOOK_MAP[normalized];
  const playbook =
    TRICITY_INVESTMENT_PLAYBOOKS.find((p) => p.id === playbookId) ?? null;
  const highlights = hubHighlights(normalized);

  return {
    slug: normalized,
    name: hub.cityName,
    headline: hub.headline,
    strategy: playbook?.strategy ?? "mixed",
    budgetBand: playbook?.budgetBand ?? "Varies by micro-market — filter buy map by budget",
    horizon: playbook?.horizon ?? "3–7 years typical",
    yieldStyle: YIELD_STYLE[normalized] ?? "Verify rent comps on the rent map for your target society",
    appreciationStyle:
      APPRECIATION_STYLE[normalized] ?? "Compare corridor guides and planning context before committing",
    liquidity: LIQUIDITY[normalized] ?? "Confirm resale activity on buy map before assuming exit",
    tenantProfile:
      playbook?.tenantOrBuyerProfile ?? "Family and professional tenants — verify locally",
    strengths: playbook?.strengths ?? highlights.slice(0, 3),
    risks: playbook?.risks ?? ["Validate title, society NOC, and live inventory before payment"],
    buyMapPath: `/buy/search?q=${encodeURIComponent(hub.cityName)}`,
    rentMapPath: `/search?q=${encodeURIComponent(hub.cityName)}`,
    guidePath: SLUG_GUIDE_MAP[normalized] ?? null,
    playbook,
  };
}

export function compareInvestAreas(slugs: string[]): {
  profiles: InvestCompareProfile[];
  note: string;
} {
  const profiles = slugs
    .map((s) => getInvestCompareProfile(s))
    .filter((p): p is InvestCompareProfile => p != null);

  const note =
    profiles.length < 2
      ? "Select at least two areas to compare: Mohali, Zirakpur, Kharar, Panchkula."
      : "Figures are indicative — always verify rent and resale on live maps before underwriting.";

  return { profiles, note };
}
