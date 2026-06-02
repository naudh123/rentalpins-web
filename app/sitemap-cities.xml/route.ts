import { getLiveCities } from "@/lib/cities-config";
import { buildSitemapXml, toSitemapEntry } from "@/lib/seo/sitemap-xml";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";

export const revalidate = 86400;

export async function GET() {
  const now = new Date().toISOString();
  const cities = getLiveCities();
  const urls = [
    ...cities.map((city) =>
      toSitemapEntry(`/rentals/${city.countrySlug}/${city.slug}`, {
        lastmod: now,
        changefreq: "daily",
        priority: 0.9,
      })
    ),
    ...cities.flatMap((city) =>
      RENTAL_CATEGORIES.map((cat) =>
        toSitemapEntry(`/rentals/${city.countrySlug}/${city.slug}/${cat.slug}`, {
          lastmod: now,
          changefreq: "daily",
          priority: 0.75,
        })
      )
    ),
  ];
  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
