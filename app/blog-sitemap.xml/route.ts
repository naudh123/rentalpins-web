import { GET as sitemapBlogGET } from "@/app/sitemap-blog.xml/route";

export const revalidate = 86400;

export async function GET() {
  return sitemapBlogGET();
}
