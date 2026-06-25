import { getIndexableAreas } from "@/lib/cities-config";
import { getIndianGscSitemapPaths } from "@/lib/rental-area-config";
import { buildSitemapXml, toSitemapEntry } from "@/lib/seo/sitemap-xml";
import { buildSitemapLocalityPaths } from "@/lib/seo/sitemap-locality-filter";

export const revalidate = 86400;

export async function GET() {
  const now = new Date().toISOString();
  let paths: string[];

  try {
    paths = await buildSitemapLocalityPaths();
  } catch {
    paths = [
      ...getIndexableAreas().map(
        (area) =>
          `/rentals/${area.parentCountrySlug}/${area.parentSlug}/${area.slug}`
      ),
      ...getIndianGscSitemapPaths(),
    ];
  }

  const urls = paths.map((path) =>
    toSitemapEntry(path, { lastmod: now, changefreq: "daily", priority: 0.8 })
  );

  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
