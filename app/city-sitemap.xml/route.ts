import { GET as sitemapCitiesGET } from "@/app/sitemap-cities.xml/route";

export const revalidate = 86400;

export async function GET() {
  return sitemapCitiesGET();
}
