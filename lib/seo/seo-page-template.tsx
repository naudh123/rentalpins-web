import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import SeoHero from "@/components/seo/SeoHero";
import LiveListingsBlock from "@/components/seo/LiveListingsBlock";
import RentTrendBlock from "@/components/seo/RentTrendBlock";
import AreaGuideBlock from "@/components/seo/AreaGuideBlock";
import NearbyPlacesBlock from "@/components/seo/NearbyPlacesBlock";
import FaqBlock from "@/components/seo/FaqBlock";
import InternalLinksBlock from "@/components/seo/InternalLinksBlock";
import RevenueCtaBlock from "@/components/seo/RevenueCtaBlock";
import AiAdvisorBlock from "@/components/seo/AiAdvisorBlock";
import SchemaJsonLd from "@/components/seo/SchemaJsonLd";
import NoInventoryGuideBlock from "@/components/seo/NoInventoryGuideBlock";
import { appPath } from "@/lib/config";
import { getAreaConfig } from "@/lib/area-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import {
  buildSeoDescription,
  buildSeoFaqs,
  buildSeoIntro,
  buildSeoTitle,
  seoEntityPath,
  shouldIndexSeoPage,
} from "@/lib/seo/seoData";
import { entityInternalLinks, nearbyPlaceLinks } from "@/lib/seo/internalLinks";
import { buildSeoPageSchemaBundle, breadcrumbItemsFromPaths } from "@/lib/seo/schema";
import type { SeoEntity } from "@/lib/seo/seoTypes";

export const SEO_PAGE_REVALIDATE = 86400;

function pageH1(entity: SeoEntity): string {
  switch (entity.type) {
    case "university_pg":
      return `PG Near ${entity.name}`;
    case "university_hostel":
      return `Hostels Near ${entity.name}`;
    case "university_flat":
      return `Flats Near ${entity.name}`;
    case "locality":
      return `Rentals in ${entity.name}`;
    default:
      return entity.name;
  }
}

function commuteNote(entity: SeoEntity): string | undefined {
  if (entity.type.startsWith("university")) {
    return `Students often compare walk time from ${entity.name} gates with auto or bike commute from adjoining sectors — use map pin distance, not vague locality titles.`;
  }
  if (entity.demandProfile === "corporate") {
    return `IT Park and corporate belt commuters should factor daily travel time when comparing headline rent across phases and sectors.`;
  }
  return undefined;
}

function safetyNote(entity: SeoEntity): string | undefined {
  if (entity.demandProfile === "student") {
    return `For girls PG and hostels, confirm curfew, visitor rules, and caretaker presence. Parents should visit shortlisted pins in daylight before session deposit.`;
  }
  return undefined;
}

async function loadListings(entity: SeoEntity) {
  const areaSlug = entity.areaSlug;
  if (!areaSlug) return [];
  const area = getAreaConfig("", areaSlug) ?? getAreaConfig(areaSlug);
  if (!area) return [];
  return fetchAreaListings(area, 12);
}

function defaultBrowseHref(entity: SeoEntity): string {
  return entity.browseHref ?? "/search";
}

export async function renderSeoEntityPage(entity: SeoEntity) {
  const listings = await loadListings(entity);
  const listingCount = listings.length;
  const path = seoEntityPath(entity);
  const intro = entity.intro ?? buildSeoIntro(entity, listingCount);
  const faqs = buildSeoFaqs(entity, listingCount);
  const internalLinks = entityInternalLinks(entity);
  const nearby = nearbyPlaceLinks(entity);
  const browseHref = defaultBrowseHref(entity);
  const isStudent =
    entity.demandProfile === "student" || entity.type.startsWith("university");
  const isGuide = entity.type === "guide";
  const isTool = entity.type === "calculator";
  const isComparison = entity.type === "comparison";

  const breadcrumbs = [
    { name: "Home", path: "/" },
    ...(entity.type.startsWith("university") ?
      [
        { name: "Universities", path: "/universities/chandigarh-university" },
        ...(entity.type !== "university" ?
          [{ name: entity.name, path: `/universities/${entity.slug}` }]
        : []),
      ]
    : entity.type === "city" || entity.type === "locality" ?
      [
        ...(entity.type === "locality" && entity.parentSlug ?
          [{ name: entity.parentSlug.replace(/-/g, " "), path: `/cities/${entity.parentSlug}` }]
        : []),
      ]
    : []),
    { name: pageH1(entity), path },
  ];

  const schemas = buildSeoPageSchemaBundle({
    pageName: buildSeoTitle(entity),
    description: buildSeoDescription(entity, listingCount),
    path,
    breadcrumbs: breadcrumbItemsFromPaths(breadcrumbs),
    faqs,
    listings,
    isGuide,
    isTool,
  });

  const listingsTitle =
    entity.type === "university_pg" ? `Live PG listings near ${entity.name}`
    : entity.type === "university_hostel" ? `Hostels near ${entity.name}`
    : entity.type === "university_flat" ? `Flats near ${entity.name}`
    : `Live listings — ${entity.name}`;

  return (
    <MarketingShell>
      <SchemaJsonLd schemas={schemas} />
      <SeoHero h1={pageH1(entity)} intro={intro}>
        <Link href={appPath(browseHref)} className="rp-btn rp-btn-primary px-6 py-2.5">
          Browse on map
        </Link>
        <Link href={appPath("/post")} className="rp-btn rp-btn-secondary px-6 py-2.5">
          List property free
        </Link>
      </SeoHero>

      <RentTrendBlock
        areaName={entity.name}
        rentRange={entity.rentRange}
        listingCount={listingCount}
        demandProfile={entity.demandProfile}
      />

      {!isGuide && !isTool && !isComparison ?
        <LiveListingsBlock
          title={listingsTitle}
          placeName={entity.city ?? entity.name}
          browseHref={browseHref}
          listings={listings}
        />
      : null}

      {listingCount === 0 && !isGuide && !isTool && !isComparison ?
        <NoInventoryGuideBlock areaName={entity.name} browseHref={browseHref} />
      : null}

      <AreaGuideBlock
        areaName={entity.name}
        city={entity.city}
        propertyTypes={entity.propertyTypes}
        commuteNote={commuteNote(entity)}
        safetyNote={safetyNote(entity)}
      />

      <NearbyPlacesBlock links={nearby} />

      <AiAdvisorBlock areaName={entity.name} />

      <RevenueCtaBlock isStudentArea={isStudent} isSociety={entity.type === "society"} />

      <FaqBlock faqs={faqs} />

      <InternalLinksBlock links={internalLinks} />
    </MarketingShell>
  );
}

export function seoEntityMetadata(entity: SeoEntity, listingCount = 0) {
  const path = seoEntityPath(entity);
  const indexable = shouldIndexSeoPage(entity, listingCount);
  const title = buildSeoTitle(entity);
  const description = buildSeoDescription(entity, listingCount);

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "RentalPins",
    },
  };
}
