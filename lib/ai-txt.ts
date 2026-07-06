import { buildLlmsTxt } from "./llms-txt";
import { siteUrl } from "./config";

/** Compact AI crawler guide (ai.txt convention — alias of llms.txt with pointer). */
export function buildAiTxt(): string {
  return `# RentalPins — AI Search Guide

> RentalPins is a map-first property platform for rentals, resale (Buy), and owner-direct listings in India and select global hubs.

## Primary guide

For the full site map, URL patterns, and retrieval guidance, read:
- ${siteUrl}/llms.txt
- ${siteUrl}/llms-full.txt (extended)

## Quick links

${buildLlmsTxt()
  .split("\n")
  .filter((line) => line.startsWith("- ") && line.includes("https://"))
  .slice(0, 24)
  .join("\n")}

## Crawl policy

- Allowed: public marketing, city/locality hubs, listings, blog, projects, invest tools
- Disallowed: /api/, /admin/, /auth/, /profile/, /chat/, /post/, /buy/post/, /saved-listings/, /saved-searches/
- Sitemaps listed in ${siteUrl}/robots.txt

Last updated: ${new Date().toISOString().slice(0, 10)}
`;
}
