import { fetchProjectSitemapEntries } from "@/lib/seo/project-sitemap";
import { buildSitemapXml } from "@/lib/seo/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  const urls = await fetchProjectSitemapEntries();
  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
