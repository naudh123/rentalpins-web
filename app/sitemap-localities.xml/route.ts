import { getIndexableAreas } from "@/lib/cities-config";
import { buildSitemapXml, toSitemapEntry } from "@/lib/seo/sitemap-xml";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";

export const revalidate = 86400;

export async function GET() {
  const now = new Date().toISOString();
  const areas = getIndexableAreas();
  const urls = [
    ...areas.map((area) =>
      toSitemapEntry(
        `/rentals/${area.parentCountrySlug}/${area.parentSlug}/${area.slug}`,
        { lastmod: now, changefreq: "daily", priority: 0.8 }
      )
    ),
    ...areas.flatMap((area) =>
      RENTAL_CATEGORIES.map((cat) =>
        toSitemapEntry(
          `/rentals/${area.parentCountrySlug}/${area.parentSlug}/${area.slug}/${cat.slug}`,
          { lastmod: now, changefreq: "daily", priority: 0.7 }
        )
      )
    ),
  ];
  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
