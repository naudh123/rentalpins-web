import { siteUrl } from "@/lib/config";

/**
 * Legacy alias — 301 to the primary sitemap so crawlers see one sitemap per
 * content type (duplicate alias sitemaps split discovery in Search Console).
 */
export function GET() {
  return Response.redirect(`${siteUrl}/sitemap-blog.xml`, 301);
}
