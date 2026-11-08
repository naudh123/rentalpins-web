import { getIndexableAreas } from "@/lib/cities-config";
import { getAreaConfig } from "@/lib/area-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import { getCitySeoConfig } from "@/lib/seo/city-seo-config";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";
import { filterListingsForRentalCategory } from "@/lib/seo/category-listing-filter";
import { getProgrammaticPageIndexability } from "@/lib/seo/programmatic-indexability";
import { getIndianGscSitemapPaths } from "@/lib/rental-area-config";

/** Areas processed at once (each makes one area query plus one per category). */
const AREA_CONCURRENCY = 4;

/**
 * Locality + category paths eligible for sitemap (respects listing thresholds).
 *
 * Each count is taken with the SAME call the page makes (area page: 24 listings;
 * category page: render-category-hub.ts — 48 of that category, then the strict
 * sub-category filter), so the sitemap never lists a page that noindexes itself.
 */
export async function buildSitemapLocalityPaths(): Promise<string[]> {
  const areas = getIndexableAreas();
  const perArea: string[][] = new Array(areas.length);

  let next = 0;
  async function worker() {
    while (next < areas.length) {
      const i = next++;
      perArea[i] = await pathsForArea(areas[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(AREA_CONCURRENCY, areas.length) }, worker));

  return [...perArea.flat(), ...getIndianGscSitemapPaths()];
}

type Listings = Awaited<ReturnType<typeof fetchAreaListings>>;

async function pathsForArea(area: ReturnType<typeof getIndexableAreas>[number]): Promise<string[]> {
  const areaPath = `/rentals/${area.parentCountrySlug}/${area.parentSlug}/${area.slug}`;
  const areaConfig = getAreaConfig(area.parentSlug, area.slug);
  const safe = async (load: () => Promise<Listings>): Promise<Listings> => {
    if (!areaConfig) return [];
    try {
      return await load();
    } catch {
      return [];
    }
  };

  const hasUniqueContent = Boolean(
    getCitySeoConfig(area.parentCountrySlug, area.parentSlug, area.slug)
  );

  const [areaListings, ...categoryListings] = await Promise.all([
    safe(() => fetchAreaListings(areaConfig!, 24)),
    ...RENTAL_CATEGORIES.map((cat) =>
      safe(() => fetchAreaListings(areaConfig!, 48, { mainCategory: cat.mainCategory }))
    ),
  ]);

  const paths: string[] = [];
  if (getProgrammaticPageIndexability({ listingCount: areaListings.length, hasUniqueContent }).includeInSitemap) {
    paths.push(areaPath);
  }

  RENTAL_CATEGORIES.forEach((cat, i) => {
    const filtered = filterListingsForRentalCategory(categoryListings[i], cat);
    const catPolicy = getProgrammaticPageIndexability({
      listingCount: filtered.length,
      hasUniqueContent,
      category: cat.slug,
      area: area.slug,
    });
    if (catPolicy.includeInSitemap) {
      paths.push(`${areaPath}/${cat.slug}`);
    }
  });
  return paths;
}
