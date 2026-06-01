import { GET as sitemapListingsGET } from "@/app/sitemap-listings.xml/route";

export const revalidate = 86400;

export async function GET() {
  return sitemapListingsGET();
}
