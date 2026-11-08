import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getSeoEntity,
  getSeoEntitiesByType,
  getProgrammaticSeoSitemapPaths,
  getUniversitySubPage,
  seoEntityPath,
  shouldIndexSeoPage,
} from "@/lib/seo/seoData";
import { getAreaConfig } from "@/lib/area-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import {
  renderSeoEntityPage,
  seoEntityMetadata,
} from "@/lib/seo/seo-page-template";
import type { SeoEntity, SeoPageType } from "@/lib/seo/seoTypes";

export async function listingCountForEntity(entity: SeoEntity): Promise<number> {
  const areaSlug = entity.areaSlug;
  if (!areaSlug) return 0;
  const area = getAreaConfig("", areaSlug) ?? getAreaConfig(areaSlug);
  if (!area) return 0;
  const listings = await fetchAreaListings(area, 1);
  return listings.length;
}

export function createSeoEntityPageExports(
  resolveEntity: (params: Record<string, string>) => SeoEntity | undefined
) {
  async function generateMetadata({
    params,
  }: {
    params: Promise<Record<string, string>>;
  }): Promise<Metadata> {
    const p = await params;
    const entity = resolveEntity(p);
    if (!entity) return { title: "Not found" };
    const count = await listingCountForEntity(entity);
    const meta = seoEntityMetadata(entity, count);
    return buildPageMetadata({
      title: meta.title,
      description: meta.description,
      path: seoEntityPath(entity),
      noIndex: !shouldIndexSeoPage(entity, count),
    });
  }

  async function Page({ params }: { params: Promise<Record<string, string>> }) {
    const p = await params;
    const entity = resolveEntity(p);
    if (!entity) notFound();
    return renderSeoEntityPage(entity);
  }

  return { generateMetadata, Page };
}

export function universityPageExports() {
  return createSeoEntityPageExports((p) => getSeoEntity(p.universitySlug, "university"));
}

export function universitySubPageExports(
  subType: "university_pg" | "university_hostel" | "university_flat"
) {
  return createSeoEntityPageExports((p) =>
    getUniversitySubPage(p.universitySlug, subType)
  );
}

export function cityPageExports() {
  return createSeoEntityPageExports((p) => getSeoEntity(p.citySlug, "city"));
}

export function localityPageExports() {
  return createSeoEntityPageExports((p) => {
    const loc = getSeoEntity(p.localitySlug, "locality");
    if (!loc || loc.parentSlug !== p.citySlug) return undefined;
    return loc;
  });
}

export function slugEntityPageExports(type: SeoPageType, paramKey: string) {
  return createSeoEntityPageExports((p) => getSeoEntity(p[paramKey]!, type));
}

export function staticParamsForUniversities() {
  return getSeoEntitiesByType("university").map((u) => ({ universitySlug: u.slug }));
}

export function staticParamsForCities() {
  return getSeoEntitiesByType("city").map((c) => ({ citySlug: c.slug }));
}

export function staticParamsForLocalities() {
  return getSeoEntitiesByType("locality").map((l) => ({
    citySlug: l.parentSlug!,
    localitySlug: l.slug,
  }));
}

export function staticParamsForType(type: SeoPageType, paramKey: string) {
  return getSeoEntitiesByType(type).map((e) => ({ [paramKey]: e.slug }));
}

/**
 * Programmatic sitemap paths filtered by the SAME rule the pages use for their robots tag
 * (shouldIndexSeoPage with the live listing count), so the sitemap never lists a page that
 * noindexes itself. If a count cannot be read (no database at build time), the page stays
 * listed as before rather than being dropped.
 */
export async function getIndexableProgrammaticSeoSitemapPaths(): Promise<{ path: string; priority: number }[]> {
  const entries = getProgrammaticSeoSitemapPaths();
  const keep = await Promise.all(
    entries.map(async ({ entity }) => {
      const t = entity.type;
      if (t === "guide" || t === "comparison" || t === "calculator") return shouldIndexSeoPage(entity, 1);
      try {
        return shouldIndexSeoPage(entity, await listingCountForEntity(entity));
      } catch {
        return true;
      }
    })
  );
  return entries.filter((_, i) => keep[i]).map(({ path, priority }) => ({ path, priority }));
}
