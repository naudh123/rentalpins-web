import {
  INVEST_ADVISOR_PATH,
  INVEST_CALCULATOR_PATH,
  INVEST_COMPARE_PATH,
  INVEST_CORRIDORS_PATH,
  INVEST_GUIDES_PATH,
  INVEST_PATH,
  INVEST_PROJECTS_PATH,
  INVEST_PULSE_PATH,
} from "@/lib/invest/invest-paths";

/** Indexable RentalPins Invest marketing/tool pages for sitemap and audits. */
export const INVEST_SITEMAP_PATHS = [
  INVEST_PATH,
  INVEST_CALCULATOR_PATH,
  INVEST_COMPARE_PATH,
  INVEST_CORRIDORS_PATH,
  INVEST_GUIDES_PATH,
  INVEST_PROJECTS_PATH,
  INVEST_ADVISOR_PATH,
  INVEST_PULSE_PATH,
] as const;

export function getInvestSitemapPaths(): string[] {
  return [...INVEST_SITEMAP_PATHS];
}
