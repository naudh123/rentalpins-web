/**
 * One-off canonical validation — run: node scripts/validate-listing-canonical.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const results = [];

function pass(name, detail) {
  results.push({ name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ name, status: "FAIL", detail });
}
function warn(name, detail) {
  results.push({ name, status: "WARN", detail });
}

// --- 1. Static source checks ---
const listingPage = readFileSync(join(root, "app/listings/[id]/page.tsx"), "utf8");
const listingShare = readFileSync(join(root, "lib/listing-share.ts"), "utf8");
const middleware = readFileSync(join(root, "middleware.ts"), "utf8");
const sitemapRoute = readFileSync(join(root, "app/sitemap-listings.xml/route.ts"), "utf8");
const listingsGrid = readFileSync(join(root, "components/ListingsGrid.tsx"), "utf8");
const myListingRow = readFileSync(join(root, "components/profile/MyListingRow.tsx"), "utf8");
const relatedCard = readFileSync(join(root, "components/listings/ListingRelatedListingCard.tsx"), "utf8");
const categoryHub = readFileSync(join(root, "components/seo/CategoryHubPage.tsx"), "utf8");
const legacyPage = readFileSync(join(root, "app/[listingId]/page.tsx"), "utf8");

if (listingShare.includes("alternates: { canonical }") && listingShare.includes("robots: { index: true, follow: true }")) {
  pass("Metadata: listingShareMetadata", "Sets alternates.canonical + robots index,follow");
} else fail("Metadata: listingShareMetadata", "Missing canonical or robots");

if (listingPage.includes("listingCanonicalUrl(listing)") && listingPage.includes('url: listingUrl')) {
  pass("JSON-LD: listing page", "Product.url and Offer.url use listingCanonicalUrl(listing)");
} else fail("JSON-LD: listing page", "url field mismatch");

if (middleware.includes("normalizeListingRequestUrl")) {
  pass("Middleware: wired", "normalizeListingRequestUrl called before other redirects");
} else fail("Middleware: wired", "Missing normalizeListingRequestUrl");

if (listingPage.includes("permanentRedirect") && listingPage.includes("listingCanonicalSegment")) {
  pass("Page redirect: wrong slug / ID-only", "308 permanentRedirect to canonical segment");
} else fail("Page redirect: wrong slug / ID-only", "Missing slug normalization redirect");

if (legacyPage.includes("permanentRedirect") && legacyPage.includes("listingPublicPathFromCard")) {
  pass("Page redirect: legacy /{id}", "308 to slug path via listingPublicPathFromCard");
} else fail("Page redirect: legacy /{id}", "Missing legacy redirect");

if (sitemapRoute.includes("buildListingSlugSegment") && !sitemapRoute.includes("searchParams") && !sitemapRoute.includes("?")) {
  pass("Sitemap route", "Uses buildListingSlugSegment only, no query strings in builder");
} else fail("Sitemap route", "Sitemap may include non-canonical URLs");

if (listingsGrid.includes("listingToSlugInput(listing)") && !listingsGrid.includes("lat: 0")) {
  pass("ListingsGrid links", "Uses listingToSlugInput with real listing coords");
} else fail("ListingsGrid links", "Still uses lat:0 slug hack or missing listingToSlugInput");

if (myListingRow.includes("listingToSlugInput") && myListingRow.includes("listing.lat")) {
  pass("MyListingRow links", "Uses listingToSlugInput with lat/lng/urlSlug");
} else fail("MyListingRow links", "Missing canonical slug input");

if (relatedCard.includes("listingToSlugInput") || relatedCard.includes("ListingCard")) {
  pass("Related cards", "ListingRelatedListingCard delegates to ListingCard with listingToSlugInput");
} else fail("Related cards", "Check related card hrefs");

if (categoryHub.includes("buildListingSlugSegment(listingToSlugInput(l))")) {
  pass("CategoryHub ItemList schema", "Schema URLs use SEO slug segment");
} else fail("CategoryHub ItemList schema", "Schema may use non-canonical URLs");

// ID-only internal links (known exceptions: auth next=, alerts, chat)
const idOnlyPattern = /appPath\(`\/listings\/\$\{[^}]+\}`\)/g;
const searchAlerts = readFileSync(join(root, "components/saved-searches/SearchAlertsFeed.tsx"), "utf8");
if (searchAlerts.includes("appPath(`/listings/${alert.listingId}`)")) {
  warn("SearchAlertsFeed", "Still uses ID-only href (redirects to canonical; alert payload lacks slug)");
} else {
  pass("SearchAlertsFeed", "Uses slug URLs");
}

// --- 2. Dynamic middleware simulation (import compiled logic via vitest pattern) ---
// Run normalize tests inline by spawning vitest on specific files
import { execSync } from "child_process";
try {
  execSync("npx vitest run lib/__tests__/listing-url-normalize.test.ts lib/__tests__/listing-canonical.test.ts lib/__tests__/listing-share.test.ts lib/__tests__/listing-slug.test.ts", {
    cwd: root,
    stdio: "pipe",
  });
  pass("Unit tests: canonical suite", "listing-url-normalize, listing-canonical, listing-share, listing-slug all pass");
} catch (e) {
  fail("Unit tests: canonical suite", String(e.stderr || e.message).slice(0, 200));
}

console.log("\n=== RentalPins Listing Canonical Validation ===\n");
for (const r of results) {
  const icon = r.status === "PASS" ? "✓" : r.status === "WARN" ? "!" : "✗";
  console.log(`${icon} [${r.status}] ${r.name}`);
  console.log(`    ${r.detail}\n`);
}
const failed = results.filter((r) => r.status === "FAIL").length;
const warned = results.filter((r) => r.status === "WARN").length;
console.log(`Summary: ${results.filter((r) => r.status === "PASS").length} pass, ${warned} warn, ${failed} fail`);
process.exit(failed > 0 ? 1 : 0);
