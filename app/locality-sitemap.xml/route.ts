import { GET as sitemapLocalitiesGET } from "@/app/sitemap-localities.xml/route";

export const revalidate = 86400;

export async function GET() {
  return sitemapLocalitiesGET();
}
