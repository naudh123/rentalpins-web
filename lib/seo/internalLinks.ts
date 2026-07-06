import type { SeoEntity } from "@/lib/seo/seoTypes";
import {
  getSeoEntity,
  seoEntityPath,
  getUniversitySubPage,
} from "@/lib/seo/seoData";
import { appPath } from "@/lib/config";

export type InternalLink = { label: string; href: string };

export function universityHubLinks(universitySlug: string): InternalLink[] {
  const base = getSeoEntity(universitySlug, "university");
  if (!base) return [];
  const links: InternalLink[] = [
    { label: `${base.name} overview`, href: appPath(seoEntityPath(base)) },
    { label: `PG near ${base.name}`, href: appPath(`/universities/${universitySlug}/pg`) },
    { label: `Hostels near ${base.name}`, href: appPath(`/universities/${universitySlug}/hostel`) },
    { label: `Flats near ${base.name}`, href: appPath(`/universities/${universitySlug}/flats`) },
  ];
  if (base.browseHref) {
    links.push({ label: `Browse map — ${base.city}`, href: appPath(base.browseHref) });
  }
  if (universitySlug === "chandigarh-university") {
    links.push({ label: "PG near CU (legacy hub)", href: appPath("/pg-near-chandigarh-university") });
    links.push({ label: "Kharar PG guide", href: appPath("/blog/kharar-pg-guide-chandigarh-university") });
  }
  if (universitySlug === "panjab-university") {
    links.push({ label: "PG near PU (legacy hub)", href: appPath("/pg-near-panjab-university") });
    links.push({ label: "PG near PEC", href: appPath("/pg-near-pec") });
    links.push({ label: "PG vs flat guide", href: appPath("/blog/pg-vs-flat-chandigarh-students") });
  }
  if (universitySlug === "chitkara-university") {
    links.push({ label: "PG near Chitkara (legacy hub)", href: appPath("/pg-near-chitkara-university") });
    links.push({ label: "Rajpura rentals", href: appPath("/cities/rajpura") });
    links.push({ label: "PG near CGC Landran", href: appPath("/pg-near-cgc-landran") });
  }
  return links;
}

export function cityHubLinks(citySlug: string): InternalLink[] {
  const city = getSeoEntity(citySlug, "city");
  if (!city) return [];
  const links: InternalLink[] = [{ label: `${city.name} rentals`, href: appPath(seoEntityPath(city)) }];
  if (city.browseHref) links.push({ label: "Browse on map", href: appPath(city.browseHref) });

  const localities = [
    "sector-70",
    "sector-68",
    "sector-123-kharar",
    "sector-125-kharar",
    "sunny-enclave",
    "sector-14-chandigarh",
    "sector-15-chandigarh",
    "sector-16-chandigarh",
    "sector-17-chandigarh",
    "rajpura-town",
    "banur-chitkara-belt",
    "sector-81-mohali",
    "sector-80-mohali",
    "chilla-mohali",
    "sarabha-nagar",
    "model-town",
    "brs-nagar",
    "pakhowal-road",
    "focal-point",
  ];
  for (const locSlug of localities) {
    const loc = getSeoEntity(locSlug, "locality");
    if (loc?.parentSlug === citySlug) {
      links.push({ label: loc.name, href: appPath(seoEntityPath(loc)) });
    }
  }
  return links;
}

export function localityHubLinks(locality: SeoEntity): InternalLink[] {
  const links: InternalLink[] = [];
  if (locality.parentSlug) {
    const parent = getSeoEntity(locality.parentSlug, "city");
    if (parent) links.push({ label: parent.name, href: appPath(seoEntityPath(parent)) });
  }
  if (locality.browseHref) links.push({ label: "Live map", href: appPath(locality.browseHref) });

  for (const slug of locality.relatedSlugs ?? []) {
    const uni = getSeoEntity(slug, "university");
    if (uni) {
      links.push({ label: `PG near ${uni.name}`, href: appPath(`/universities/${slug}/pg`) });
    }
    const road = getSeoEntity(slug, "road");
    if (road) links.push({ label: road.name, href: appPath(seoEntityPath(road)) });
  }

  return links;
}

export function entityInternalLinks(entity: SeoEntity): InternalLink[] {
  switch (entity.type) {
    case "university":
    case "university_pg":
    case "university_hostel":
    case "university_flat":
      return universityHubLinks(entity.slug);
    case "city":
      return cityHubLinks(entity.slug);
    case "locality":
      return localityHubLinks(entity);
    case "landmark":
    case "road":
    case "society":
      return entity.browseHref ?
          [
            { label: `Rentals near ${entity.name}`, href: appPath(entity.browseHref) },
            ...(entity.city ?
              [{ label: `${entity.city} city page`, href: appPath(`/cities/${entity.city.toLowerCase().replace(/\s+/g, "-")}`) }]
            : []),
          ]
        : [];
    case "guide":
      return [
        { label: "Rent calculator", href: appPath("/tools/rent-calculator") },
        { label: "PG for rent", href: appPath("/pg-for-rent") },
        { label: "Flats for rent", href: appPath("/flats-for-rent") },
      ];
    case "comparison":
      for (const slug of entity.relatedSlugs ?? []) {
        const city = getSeoEntity(slug, "city");
        if (city) return [cityHubLinks(slug)[0], cityHubLinks(slug)[1]].filter(Boolean) as InternalLink[];
      }
      return [];
    default:
      return [];
  }
}

export function nearbyPlaceLinks(entity: SeoEntity): InternalLink[] {
  const links: InternalLink[] = [];
  for (const name of entity.nearbyLandmarks ?? []) {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/,/g, "");
    const loc = getSeoEntity(slug, "locality") ?? getSeoEntity(slug);
    if (loc) links.push({ label: loc.name, href: appPath(seoEntityPath(loc)) });
  }
  for (const slug of entity.relatedSlugs ?? []) {
    const related = getSeoEntity(slug, "university") ?? getSeoEntity(slug, "city") ?? getSeoEntity(slug, "locality");
    if (related) links.push({ label: related.name, href: appPath(seoEntityPath(related)) });
    const pg = getUniversitySubPage(slug, "university_pg");
    if (pg) links.push({ label: `PG near ${related?.name ?? slug}`, href: appPath(seoEntityPath(pg)) });
  }
  return links.slice(0, 8);
}
