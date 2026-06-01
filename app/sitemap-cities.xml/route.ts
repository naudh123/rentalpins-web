import { getAllCities } from "@/lib/cities-config";
import { buildSitemapXml, toSitemapEntry } from "@/lib/seo/sitemap-xml";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";

export const revalidate = 86400;

export async function GET() {
  const now = new Date().toISOString();
  const urls = [
    ...getAllCities().map((city) =>
      toSitemapEntry(`/rentals/${city.countrySlug}/${city.slug}`, {
        lastmod: now,
        changefreq: "daily",
        priority: city.status === "live" ? 0.9 : 0.4,
      })
    ),
    ...getAllCities().flatMap((city) =>
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
