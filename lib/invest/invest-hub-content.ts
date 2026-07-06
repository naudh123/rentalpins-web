import {
  INVEST_ADVISOR_PATH,
  INVEST_CALCULATOR_PATH,
  INVEST_COMPARE_PATH,
  INVEST_CORRIDORS_PATH,
  INVEST_GUIDES_PATH,
  INVEST_PROJECTS_PATH,
  INVEST_PULSE_PATH,
  INVEST_REQUIREMENTS_POST_PATH,
} from "@/lib/invest/invest-paths";

export type InvestGoal = "yield" | "appreciation" | "both";

export const INVEST_HUB = {
  eyebrow: "RentalPins Invest",
  title: "Tricity investment decision workspace",
  subtitle:
    "Compare corridors, underwrite yield with rent comps, shortlist on the buy map, and explore RERA projects — built for Chandigarh Tricity investors, not national brokerage.",
  disclaimer:
    "All yields and projections are indicative from your inputs and sample map pins. RentalPins does not guarantee returns — verify title, CLU, and pricing with sellers and your advocate.",
} as const;

export const INVEST_TOOLS = [
  {
    title: "Yield calculator",
    description: "Model gross/net yield, EMI, cash flow, and break-even rent.",
    href: INVEST_CALCULATOR_PATH,
    tag: "Underwrite",
  },
  {
    title: "Compare areas",
    description: "Side-by-side Mohali, Zirakpur, Kharar, and Panchkula investor profiles.",
    href: INVEST_COMPARE_PATH,
    tag: "Compare",
  },
  {
    title: "Growth corridors",
    description: "Explore IT Park, VIP Road, CU belt, New Chandigarh, and GMADA plot belts.",
    href: INVEST_CORRIDORS_PATH,
    tag: "Discover",
  },
  {
    title: "Investment guides",
    description: "Deep-dive locality guides with map links and due diligence checklists.",
    href: INVEST_GUIDES_PATH,
    tag: "Research",
  },
  {
    title: "Projects (investor lens)",
    description: "Filter RERA launches by yield, appreciation, student, and plot strategies.",
    href: INVEST_PROJECTS_PATH,
    tag: "Pre-launch",
  },
  {
    title: "Invest Pulse",
    description: "Quarterly Tricity investor briefing — corridors, launches, and underwriting tips.",
    href: INVEST_PULSE_PATH,
    tag: "Reports",
  },
] as const;

export const INVEST_QUICK_ACTIONS = [
  { label: "Open buy map", href: "/buy/search" },
  { label: "Open rent comps", href: "/search" },
  { label: "Ask AI advisor", href: INVEST_ADVISOR_PATH },
  { label: "Post investor requirement", href: INVEST_REQUIREMENTS_POST_PATH },
] as const;

export const INVEST_GOAL_OPTIONS: { id: InvestGoal; label: string; hint: string }[] = [
  {
    id: "yield",
    label: "Rental yield",
    hint: "Mohali IT, Zirakpur VIP, Kharar PG corridors",
  },
  {
    id: "appreciation",
    label: "Capital appreciation",
    hint: "New Chandigarh, GMADA plots, project entry",
  },
  {
    id: "both",
    label: "Both",
    hint: "Compare on calculator and area compare tools",
  },
];

export function goalToCorridorFilter(goal: InvestGoal): string[] | null {
  if (goal === "yield") {
    return ["mohali-it-aerocity", "zirakpur-vip", "kharar-cu-jhanjeri", "aerocity-airport"];
  }
  if (goal === "appreciation") {
    return ["new-chandigarh", "kurali-banur-gmada"];
  }
  return null;
}
