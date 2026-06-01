import { getAllPosts } from "@/lib/blog";
import { buildSitemapXml, toSitemapEntry } from "@/lib/seo/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  const now = new Date().toISOString();
  const posts = await getAllPosts();
  const urls = [
    toSitemapEntry("/blog", { lastmod: now, changefreq: "weekly", priority: 0.6 }),
    ...posts.map((post) =>
      toSitemapEntry(`/blog/${post.slug}`, {
        lastmod: post.updatedAt ?? post.date ?? now,
        changefreq: "monthly",
        priority: 0.7,
      })
    ),
  ];
  return new Response(buildSitemapXml(urls), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
