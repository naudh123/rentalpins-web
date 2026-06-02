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
- RSS feed: ${siteUrl}/feed.xml
- Robots: ${siteUrl}/robots.txt
- Do not index or scrape: ${abs("/api/")} (health checks and server APIs only)

## Contact

- Website: ${siteUrl}
- Support: ${abs("/contact")}

Last updated: ${new Date().toISOString().slice(0, 10)}
`;
}
