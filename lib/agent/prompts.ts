import type { AgentSurface } from "./types";

export const agentToolLabels: Record<string, string> = {
  searchKnowledge: "Knowledge search",
  searchAreaGuides: "Area guides",
  searchRentGuides: "Rent guides",
  compareAreas: "Compare areas",
  buildMapSearch: "Build map search",
  searchProjects: "Projects",
  searchBuyGuides: "Buy guides",
  searchRentBlog: "Rent guides (blog)",
  getPlatformOverview: "Platform info",
  getDeveloperOffering: "White-label offering",
  sampleListings: "Sample listings",
  matchBuyerRequirement: "Buyer requirement",
  searchFaqs: "FAQs",
  recommendNextStep: "Next step",
  getMarketInsight: "Market insight",
  estimateAffordability: "Affordability",
  scheduleContact: "Contact handoff",
};

export const advisorSuggestedPrompts = [
  "I'm buying — compare Zirakpur vs Phase 7 Mohali for a family under ₹90 lakh",
  "PG near Chandigarh University for girls — what should I verify before booking?",
  "Investor view: rental yield on VIP Road Zirakpur vs Aerocity Mohali",
  "My income is ₹1.2L/month — what buy budget is realistic with ₹15L down?",
  "How is RentalPins different from 99acres for Tricity search?",
] as const;

export const mapSuggestedPrompts = {
  sale: [
    "3BHK under 80 lakh in Phase 7 with parking",
    "Ready-to-move flats near Aerocity under ₹1 crore",
    "Plots near New Chandigarh under 50 lakh",
  ],
  rent: [
    "Furnished 2BHK under ₹22k near IT Park Mohali",
    "PG for boys near Chandigarh University under ₹8k",
    "Shop for rent on VIP Road Zirakpur under ₹35k",
  ],
} as const;

export const showcaseSuggestedPrompts = [
  "We're a regional developer — what white-label modules would we get?",
  "Walk me through the AI agent, lead scoring, and admin metrics",
  "What engagement tiers and timelines does Rudder Tech offer for PropTech?",
  "Show the buy map demo flow and mobile app parity",
] as const;

export function suggestedPromptsForSurface(
  surface: AgentSurface,
  transactionType: "rent" | "sale" = "rent"
): readonly string[] {
  if (surface === "map") {
    return transactionType === "sale" ? mapSuggestedPrompts.sale : mapSuggestedPrompts.rent;
  }
  if (surface === "showcase") return showcaseSuggestedPrompts;
  return advisorSuggestedPrompts;
}
