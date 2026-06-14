import ListPropertyCTA from "@/components/seo/ListPropertyCTA";
import SupplyAudienceSection from "@/components/seo/SupplyAudienceSection";
import AreaSupplyDemandSection from "@/components/seo/AreaSupplyDemandSection";
import StickySeoCTA from "@/components/seo/StickySeoCTA";
import {
  getBrowseHref,
  getListPropertyHref,
  type SupplyIntent,
} from "@/lib/seo-links";

export type SeoSupplyLayout = "full" | "blog" | "commercial";

interface Props {
  layout?: SeoSupplyLayout;
  cityName?: string;
  areaName?: string;
  categoryName?: string;
  citySlug?: string;
  areaSlug?: string;
  intent?: SupplyIntent;
  nearbyAreaLabels?: string[];
  rentalTypes?: string[];
  lowListings?: boolean;
  lat?: number;
  lng?: number;
  zoom?: number;
  placeQuery?: string;
  category?: string;
  keywords?: string;
  browseHref?: string;
  listHref?: string;
  showHero?: boolean;
  showInline?: boolean;
  showAudience?: boolean;
  showAreaSupply?: boolean;
  showBottom?: boolean;
  showSticky?: boolean;
  headlineOverride?: string;
  bodyOverride?: string;
}

export default function SeoSupplyBlocks({
  layout = "full",
  cityName,
  areaName,
  categoryName,
  citySlug,
  areaSlug,
  intent = "general",
  nearbyAreaLabels = [],
  rentalTypes = [],
  lowListings = false,
  lat,
  lng,
  zoom,
  placeQuery,
  category,
  keywords,
  browseHref: browseHrefProp,
  listHref: listHrefProp,
  showHero = true,
  showInline = true,
  showAudience = true,
  showAreaSupply = true,
  showBottom = true,
  showSticky = true,
  headlineOverride,
  bodyOverride,
}: Props) {
  const browseHref = browseHrefProp ?? getBrowseHref({
    citySlug,
    areaSlug,
    lat,
    lng,
    zoom,
    placeQuery: placeQuery ?? areaName ?? cityName,
    category,
    keywords,
  });
  const listHref = listHrefProp ?? getListPropertyHref({ citySlug, areaSlug, intent });

  if (layout === "blog") {
    return (
      <>
        <ListPropertyCTA
          variant="blog"
          cityName={cityName}
          areaName={areaName}
          intent={intent}
          browseHref={browseHref}
          listHref={listHref}
          citySlug={citySlug}
          areaSlug={areaSlug}
          headlineOverride={headlineOverride}
          bodyOverride={bodyOverride}
        />
        <ListPropertyCTA
          variant="bottom"
          cityName={cityName}
          areaName={areaName}
          intent={intent}
          browseHref={browseHref}
          listHref={listHref}
          citySlug={citySlug}
          areaSlug={areaSlug}
          headlineOverride={headlineOverride}
          bodyOverride={bodyOverride}
        />
        {showSticky ? (
          <StickySeoCTA
            browseHref={browseHref}
            listHref={listHref}
            citySlug={citySlug}
            areaSlug={areaSlug}
            intent={intent}
            placeQuery={placeQuery ?? areaName ?? cityName}
          />
        ) : null}
      </>
    );
  }

  const resolvedIntent = layout === "commercial" ? "commercial" : intent;

  return (
    <>
      {showHero ? (
        <ListPropertyCTA
          variant="hero"
          cityName={cityName}
          areaName={areaName}
          categoryName={categoryName}
          intent={resolvedIntent}
          browseHref={browseHref}
          listHref={listHref}
          citySlug={citySlug}
          areaSlug={areaSlug}
          headlineOverride={headlineOverride}
          bodyOverride={bodyOverride}
        />
      ) : null}
      {showInline ? (
        <ListPropertyCTA
          variant="inline"
          cityName={cityName}
          areaName={areaName}
          categoryName={categoryName}
          intent={resolvedIntent}
          browseHref={browseHref}
          listHref={listHref}
          citySlug={citySlug}
          areaSlug={areaSlug}
          headlineOverride={headlineOverride}
          bodyOverride={bodyOverride}
        />
      ) : null}
      {showAudience ? (
        <SupplyAudienceSection
          intent={resolvedIntent}
          citySlug={citySlug}
          areaSlug={areaSlug}
          listHref={listHref}
        />
      ) : null}
      {showAreaSupply && cityName ? (
        <AreaSupplyDemandSection
          cityName={cityName}
          areaName={areaName ?? cityName}
          nearbyAreas={nearbyAreaLabels}
          rentalTypes={rentalTypes}
          lowListings={lowListings}
          intent={resolvedIntent}
          citySlug={citySlug}
          areaSlug={areaSlug}
          browseHref={browseHref}
          listHref={listHref}
        />
      ) : null}
      {showBottom ? (
        <ListPropertyCTA
          variant="bottom"
          cityName={cityName}
          areaName={areaName}
          categoryName={categoryName}
          intent={resolvedIntent}
          browseHref={browseHref}
          listHref={listHref}
          citySlug={citySlug}
          areaSlug={areaSlug}
          headlineOverride={headlineOverride}
          bodyOverride={bodyOverride}
        />
      ) : null}
      {showSticky ? (
        <StickySeoCTA
          browseHref={browseHref}
          listHref={listHref}
          citySlug={citySlug}
          areaSlug={areaSlug}
          intent={resolvedIntent}
          placeQuery={placeQuery ?? areaName ?? cityName}
        />
      ) : null}
    </>
  );
}
