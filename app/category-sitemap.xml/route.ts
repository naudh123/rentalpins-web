import { buildSitemapXml, toSitemapEntry } from "@/lib/seo/sitemap-xml";
import {
  CATEGORY_LANDING_PAGES,
  INDUSTRIAL_PAGES,
} from "@/lib/seo/marketing-pages";

export const revalidate = 86400;

export async function GET() {
  const now = new Date().toISOString();
  const slugs = [
    ...Object.keys(CATEGORY_LANDING_PAGES),
    ...Object.keys(INDUSTRIAL_PAGES),
  ];
  const urls = slugs.map((slug) =>
    toSitemapEntry(`/${slug}`, {
      lastmod: now,
      changefreq: "weekly",
      priority: 0.78,
    })
  );
  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
