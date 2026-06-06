import { getAllPosts } from "@/lib/blog";
import { resolveMetaDescription } from "@/lib/blog-validation";
import { canonicalUrl } from "@/lib/seo";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .slice(0, 50)
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${canonicalUrl(`/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${canonicalUrl(`/blog/${post.slug}`)}</guid>
      <description>${escapeXml(resolveMetaDescription(post.excerpt, post.metaDescription ?? ""))}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>RentalPins Blog</title>
    <link>${canonicalUrl("/blog")}</link>
    <description>Rental tips, city guides, and housing advice across India.</description>
    <language>en-in</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
