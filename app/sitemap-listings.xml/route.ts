import { fetchListingSitemapEntries } from "@/lib/seo/fetch-sitemap-listings";
import { buildSitemapXml, toSitemapEntry } from "@/lib/seo/sitemap-xml";
import { buildListingCanonicalPath } from "@/lib/seo/listing-seo";
import { appPath } from "@/lib/config";

export const revalidate = 86400;

export async function GET() {
  const entries = await fetchListingSitemapEntries();
  const urls = entries.map((e) =>
    toSitemapEntry(appPath(buildListingCanonicalPath(e)), {
      lastmod: e.updatedAt,
      changefreq: "weekly",
      priority: 0.65,
    })
  );
  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
