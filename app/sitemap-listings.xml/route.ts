import { fetchListingSitemapEntries } from "@/lib/seo/fetch-sitemap-listings";
import { buildSitemapXml, toSitemapEntry } from "@/lib/seo/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  const entries = await fetchListingSitemapEntries();
  const urls = entries.map((e) =>
    toSitemapEntry(`/listings/${e.id}`, {
      lastmod: e.updatedAt,
      changefreq: "weekly",
      priority: 0.65,
    })
  );
  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
