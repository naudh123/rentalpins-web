import { getIndexableAreas } from "@/lib/cities-config";
import { getAreaConfig } from "@/lib/area-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import { getCitySeoConfig } from "@/lib/seo/city-seo-config";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";
import { getProgrammaticPageIndexability } from "@/lib/seo/programmatic-indexability";
import { getIndianGscSitemapPaths } from "@/lib/rental-area-config";

/** Locality + category paths eligible for sitemap (respects listing thresholds). */
export async function buildSitemapLocalityPaths(): Promise<string[]> {
  const areas = getIndexableAreas();
  const paths: string[] = [];

  for (const area of areas) {
    const areaPath = `/rentals/${area.parentCountrySlug}/${area.parentSlug}/${area.slug}`;
    const areaConfig = getAreaConfig(area.parentSlug, area.slug);
    let listings: Awaited<ReturnType<typeof fetchAreaListings>> = [];

    if (areaConfig) {
      try {
        listings = await fetchAreaListings(areaConfig, 24);
      } catch {
        listings = [];
      }
    }

    const listingCount = listings.length;
    const hasUniqueContent = Boolean(
      getCitySeoConfig(area.parentCountrySlug, area.parentSlug, area.slug)
    );

    const areaPolicy = getProgrammaticPageIndexability({
      listingCount,
      hasUniqueContent,
    });

    if (areaPolicy.includeInSitemap) {
      paths.push(areaPath);
    }

    for (const cat of RENTAL_CATEGORIES) {
      const filtered = listings.filter((l) => l.category === cat.mainCategory);
      const catPolicy = getProgrammaticPageIndexability({
        listingCount: filtered.length,
        hasUniqueContent,
        category: cat.slug,
        area: area.slug,
      });
      if (catPolicy.includeInSitemap) {
        paths.push(`${areaPath}/${cat.slug}`);
      }
    }
  }

  return [...paths, ...getIndianGscSitemapPaths()];
}
