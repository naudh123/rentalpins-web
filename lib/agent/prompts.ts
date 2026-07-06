import type { AgentSurface } from "./types";

export const agentToolLabels: Record<string, string> = {
  searchKnowledge: "Knowledge search",
  searchAreaGuides: "Area guides",
  searchTricityAreas: "Tricity localities",
  searchTricityInvestments: "Investment playbooks",
  searchTricityPlanning: "Planning & zoning",
  searchPropertyTransactionGuides: "Sale deed & transfer",
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
  lookupProjectDetails: "Project deep dive",
  getProjectDetails: "Project facts",
  listProjectUnits: "Unit inventory",
  compareSimilarProjects: "Similar projects",
  searchTricityProjects: "Search projects",
  estimateProjectEmi: "EMI estimate",
  searchProjectFaqs: "Buyer FAQs",
  getAreaContext: "Area market",
  submitProjectEnquiry: "Register enquiry",
  scheduleSiteVisit: "Book site visit",
  connectToSales: "Sales handoff",
  captureConversationLead: "Save lead",
};

export const advisorSuggestedPrompts = [
  "Best property investment in Tricity under ₹50 lakh — yield or appreciation?",
  "I'm buying — compare Zirakpur vs Phase 7 Mohali for a family under ₹90 lakh",
  "Plots on Kharar–Kurali road under ₹40 lakh — what should I verify?",
  "Investor view: rental yield on VIP Road Zirakpur vs Aerocity Mohali",
  "Is New Chandigarh or GMADA Banur road better for 7-year plot hold?",
  "IT Park vs IT City Mohali — where should I buy to live near tech offices?",
  "Can I buy residential in a PSIEC industrial estate?",
  "How is a sale agreement made and what goes into the sale deed?",
  "What precautions before paying token on an owner-direct Tricity listing?",
  "PG near Jhanjeri on Landran–Chunni road — how does it compare to Kharar?",
  "How is RentalPins different from 99acres for Tricity search?",
] as const;

export const mapSuggestedPrompts = {
  sale: [
    "3BHK under 80 lakh in Phase 7 with parking",
    "Ready-to-move flats near Aerocity under ₹1 crore",
    "Plots near New Chandigarh under 50 lakh",
    "Affordable plots on Kurali–Siswan or Banur GMADA belt",
    "Best investment areas around Tricity under ₹60 lakh",
  ],
  rent: [
    "Furnished 2BHK under ₹22k near IT Park Mohali",
    "PG for boys near Chandigarh University under ₹8k",
    "Budget PG near Banur or Rajpura for Chitkara students",
    "Shop for rent on VIP Road Zirakpur under ₹35k",
  ],
} as const;

export const showcaseSuggestedPrompts = [
  "We're a regional developer — what white-label modules would we get?",
  "Walk me through the AI agent, lead scoring, and admin metrics",
  "What engagement tiers and timelines does Rudder Tech offer for PropTech?",
  "Show the buy map demo flow and mobile app parity",
] as const;

export const projectMicrositeSuggestedPrompts = (projectName: string) =>
  [
    `What plots are available at ${projectName} under ₹1.5 Cr?`,
    "Compare this project with similar options in the same city",
    "What's the payment plan and indicative EMI?",
    "I'd like to book a site visit this weekend",
    "Is this RERA registered? What should I verify before booking?",
  ] as const;

export const projectsIndexSuggestedPrompts = [
  "I have ₹80 lakh — best plotted projects in Mohali?",
  "Compare DLF-style townships vs apartment projects in Zirakpur",
  "Pre-launch projects with VIP waitlist in Tricity",
  "Commercial or industrial projects near Chandigarh",
  "I'm Rahul, 9876543210, rahul@gmail.com — send me Mohali plot options under 1 Cr",
] as const;

export function suggestedPromptsForSurface(
  surface: AgentSurface,
  transactionType: "rent" | "sale" = "rent",
  projectName?: string
): readonly string[] {
  if (surface === "project") {
    return projectName
      ? projectMicrositeSuggestedPrompts(projectName)
      : projectsIndexSuggestedPrompts;
  }
  if (surface === "map") {
    return transactionType === "sale" ? mapSuggestedPrompts.sale : mapSuggestedPrompts.rent;
  }
  if (surface === "showcase") return showcaseSuggestedPrompts;
  return advisorSuggestedPrompts;
}
