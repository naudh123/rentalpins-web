import { getLiveCities } from "@/lib/cities-config";
import { buildSitemapXml, toSitemapEntry } from "@/lib/seo/sitemap-xml";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";
import { getStaticRentalCityHubSitemapPaths } from "@/lib/seo/sitemap-config";
import { isInventoryGatedCountry } from "@/lib/seo/indexing-policy";

export const revalidate = 86400;

export async function GET() {
  const now = new Date().toISOString();
  const cities = getLiveCities();
  const pathSet = new Set<string>(getStaticRentalCityHubSitemapPaths());
  for (const city of cities) {
    // UK/KE/NG hubs are inventory-gated (noindex until they have live listings) — keep them out.
    if (isInventoryGatedCountry(city.countrySlug)) continue;
    pathSet.add(`/rentals/${city.countrySlug}/${city.slug}`);
    for (const cat of RENTAL_CATEGORIES) {
      pathSet.add(`/rentals/${city.countrySlug}/${city.slug}/${cat.slug}`);
    }
  }

  const urls = [...pathSet].map((path) => {
    const segments = path.split("/").filter(Boolean);
    const isCategory = segments.length === 4;
    const isStaticHub = segments.length === 2 && segments[0] === "rentals";
    return toSitemapEntry(path, {
      lastmod: now,
      changefreq: "daily",
      priority: isCategory ? 0.75 : isStaticHub ? 0.88 : 0.9,
    });
  });
  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
