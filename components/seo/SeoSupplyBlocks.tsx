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
  showAudience?: boolean;
  showAreaSupply?: boolean;
  showSticky?: boolean;
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
  showAudience = true,
  showAreaSupply = true,
  showSticky = true,
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
