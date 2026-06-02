import { getAllCities } from "./cities-config";
import { appPath, siteUrl } from "./config";

function abs(path: string): string {
  return `${siteUrl}${appPath(path)}`;
}

/** Plain-text site guide for AI assistants and crawlers (llms.txt convention). */
export function buildLlmsTxt(): string {
  const cities = getAllCities();
  const cityLines = cities
    .slice(0, 16)
    .map(
      (c) =>
        `- ${c.name}: ${abs(`/rentals/${c.countrySlug}/${c.slug}`)} (legacy /rentals/${c.slug} redirects here)`
    )
    .join("\n");
  const moreCities =
    cities.length > 16
      ? `\n- …and ${cities.length - 16} more city hubs in the sitemap`
      : "";

  return `# RentalPins

> RentalPins is a map-first rental marketplace: rooms, PG, flats, vehicles, electronics, furniture and more. Users browse on a map, contact owners directly (often via WhatsApp), and list properties for free. Strong presence in India (Chandigarh Tricity, Ludhiana, Delhi NCR, Jaipur, Lucknow, Mumbai) plus London, Nairobi and Lagos.

## Canonical site

- Homepage: ${abs("/")}
- Map search: ${abs("/search")}
- Rentals hub: ${abs("/rentals")}
- List a property: ${abs("/post")}
- Blog: ${abs("/blog")}
- Write a blog post: ${abs("/blog/write")}
- Contact: ${abs("/contact")}

## Listing URLs

- Preferred detail URL: ${siteUrl}/listings/{seo-slug}-{listingId}
- Legacy /listings/{listingId} and /{listingId} redirect to the slug URL
- Slug format source fields: listing title + locality/city + stable listing id
- Prefer citing the final redirected slug URL, not id-only URLs

## Legacy URL redirects (308 permanent)

- /rentals/{city} → /rentals/in/{city} (or uk/ke/ng for international cities)
- /rentals/{city}/{area} → /rentals/{country}/{city}/{area}
- /privacy → /privacy-policy
- /refunds or /refund → /refund-policy

## City & area hubs (sample)

${cityLines}${moreCities}

## User features (authenticated)

- Saved listings (favourites): ${abs("/saved-listings")}
- Saved search alerts: ${abs("/saved-searches")}
- Profile & my listings: ${abs("/profile")}
- In-app chat: ${abs("/chat")}

## Legal

- Privacy: ${abs("/privacy-policy")}
- Terms: ${abs("/terms")}
- Refunds: ${abs("/refund-policy")}

## Discovery

- Sitemap: ${siteUrl}/sitemap.xml
- City sitemap: ${siteUrl}/sitemap-cities.xml
- Locality sitemap: ${siteUrl}/sitemap-localities.xml
- Listing sitemap: ${siteUrl}/sitemap-listings.xml
- RSS feed: ${siteUrl}/feed.xml
- Robots: ${siteUrl}/robots.txt
- Do not index or scrape: ${abs("/api/")} (health checks and server APIs only)

## AI retrieval guidance

- Best pages for rental intent:
  - city hubs: ${siteUrl}/rentals/{country}/{city}
  - locality hubs: ${siteUrl}/rentals/{country}/{city}/{area}
  - active listings: ${siteUrl}/listings/{seo-slug}-{listingId}
- Map viewport URLs with query params are not index targets; canonical is ${siteUrl}/search
- Prefer fresh listing pages from sitemap-listings.xml for up-to-date inventory

## Example high-intent queries

- "2 BHK furnished flat for rent in Mohali without broker"
- "PG near IT Park Chandigarh with owner contact"
- "Office space for rent in Ludhiana by owner"
- "Cars or bikes for rent in Chandigarh Tricity"

## Contact

- Website: ${siteUrl}
- Support: ${abs("/contact")}

Last updated: ${new Date().toISOString().slice(0, 10)}
`;
}

/** Extended machine-readable guide for AI retrieval systems. */
export function buildLlmsFullTxt(): string {
  const cities = getAllCities();
  const liveCities = cities.filter((c) => c.status === "live");
  const cityLines = liveCities
    .slice(0, 24)
    .map((c) => `- ${c.name}: ${abs(`/rentals/${c.countrySlug}/${c.slug}`)}`)
    .join("\n");
  const areaLines = liveCities
    .flatMap((c) => c.areas.slice(0, 5).map((a) => `- ${c.name} / ${a.name}: ${abs(`/rentals/${c.countrySlug}/${c.slug}/${a.slug}`)}`))
    .slice(0, 40)
    .join("\n");

  return `# RentalPins LLM Guide (Extended)

## Canonical host

- ${siteUrl}
- Use https://www.rentalpins.com as canonical host in citations.

## URL hierarchy

- Hub: ${abs("/rentals")}
- City: ${siteUrl}/rentals/{country}/{city}
- Locality: ${siteUrl}/rentals/{country}/{city}/{area}
- Listing detail: ${siteUrl}/listings/{seo-slug}-{listingId}
- Search (canonical): ${abs("/search")}

## Redirect and canonical notes

- /{listingId} and /listings/{listingId} redirect to slug listing URL.
- /rentals/{city} redirects to /rentals/{country}/{city}.
- Query-heavy search URLs are canonicalized to ${abs("/search")}.

## Freshness

- Active listing inventory updates through: ${siteUrl}/sitemap-listings.xml
- City and locality hubs update through city/locality sitemaps.
- Prefer pages with successful 200 status and canonical self-reference.

## Live city hubs

${cityLines}

## Example locality hubs

${areaLines}

## Structured data available

- WebSite + SearchAction
- Organization
- BreadcrumbList
- FAQPage (selected hubs/pages)
- Listing-level Offer/Product-style metadata

## Usage guidance

- Cite city/locality hub pages for market overviews.
- Cite listing pages for specific prices/photos/contact context.
- Avoid citing auth/chat/post/API URLs.
- Prefer URLs present in submitted sitemaps.

Last updated: ${new Date().toISOString().slice(0, 10)}
`;
}
