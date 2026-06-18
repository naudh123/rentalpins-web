import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingDetailRoute, {
  type ListingDetailChannel,
} from "@/components/listings/ListingDetailRoute";
import { extractListingIdFromSlugParam } from "@/lib/listing-slug";
import { createCategoryAuthorityPage } from "@/lib/seo/category-authority-page";
import type { ListingCategorySegment } from "@/lib/seo/listing-category-segments";
import { getCityBySlug } from "@/lib/cities-config";

function createSegmentPage(segment: ListingCategorySegment, channel: ListingDetailChannel = "rent") {
  const cityPage = createCategoryAuthorityPage(segment);

  async function generateMetadata({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }): Promise<Metadata> {
    const { slug } = await params;
    if (extractListingIdFromSlugParam(slug)) {
      const { generateMetadata: listingMeta } = await import(
        "@/components/listings/ListingDetailRoute"
      );
      return listingMeta({
        params: Promise.resolve({ id: slug }),
        searchParams: Promise.resolve({}),
      });
    }
    if (channel === "rent" && getCityBySlug(slug)?.status === "live") {
      return cityPage.generateMetadata({ params: Promise.resolve({ city: slug }) });
    }
    return { title: "Not found" };
  }

  async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }) {
    const { slug } = await params;

    if (extractListingIdFromSlugParam(slug)) {
      return (
        <ListingDetailRoute
          params={Promise.resolve({ id: slug })}
          searchParams={searchParams}
          channel={channel}
          expectedSegment={segment}
        />
      );
    }

    if (channel === "rent") {
      const city = getCityBySlug(slug);
      if (city?.status === "live") {
        const { Page: CityPage } = createCategoryAuthorityPage(segment);
        return <CityPage params={Promise.resolve({ city: slug })} />;
      }
    }

    notFound();
  }

  return { generateMetadata, Page };
}

export const propertyRentPage = createSegmentPage("property", "rent");
export const equipmentRentPage = createSegmentPage("equipment", "rent");
export const vehiclesRentPage = createSegmentPage("vehicles", "rent");
export const furnitureRentPage = createSegmentPage("furniture", "rent");
export const electronicsRentPage = createSegmentPage("electronics", "rent");
export const appliancesRentPage = createSegmentPage("appliances", "rent");
export const propertyBuyPage = createSegmentPage("property", "buy");
