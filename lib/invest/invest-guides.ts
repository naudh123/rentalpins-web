import { GEO_PAGES } from "@/lib/seo/geo-pages-config";

export interface InvestGuideEntry {
  path: string;
  title: string;
  description: string;
  tag: string;
}

const EXTRA_GUIDES: InvestGuideEntry[] = [
  {
    path: "/property-market-insights/chandigarh-tricity",
    title: "Chandigarh Tricity market overview",
    description: "Cross-city rent and buy context for the full Tricity micro-market.",
    tag: "Market insights",
  },
  {
    path: "/rental-market-insights/mohali",
    title: "Mohali rental market",
    description: "Owner-direct rent inventory context for yield underwriting.",
    tag: "Rent comps",
  },
];

export function getInvestGuides(): InvestGuideEntry[] {
  const fromGeo = GEO_PAGES.filter(
    (p) => p.path.includes("investment-guide") || p.clusterId === "investment"
  ).map((p) => ({
    path: p.path,
    title: p.title.replace(/\s*\|\s*RentalPins.*$/, ""),
    description: p.description,
    tag: p.path.includes("investment-guide") ? "Investment guide" : "Insights",
  }));

  const seen = new Set<string>();
  const merged: InvestGuideEntry[] = [];
  for (const entry of [...fromGeo, ...EXTRA_GUIDES]) {
    if (seen.has(entry.path)) continue;
    seen.add(entry.path);
    merged.push(entry);
  }
  return merged;
}
