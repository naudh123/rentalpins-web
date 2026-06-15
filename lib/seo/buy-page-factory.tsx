import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuyLandingPage from "@/components/sale/BuyLandingPage";
import { appPath, siteUrl } from "@/lib/config";
import { CHANDIGARH_AREAS } from "@/lib/area-config";
import {
  buyPagePath,
  getBuyPageConfig,
  type BuyPageConfig,
} from "@/lib/sale/buy-pages-config";
import { fetchAreaListings } from "@/lib/seo-listings";

export function buyPageMetadata(
  hubSlug: string,
  areaSlug?: string
): Metadata {
  const page = getBuyPageConfig(hubSlug, areaSlug);
  if (!page) return { title: "Buy property | RentalPins" };
  const path = buyPagePath(hubSlug, areaSlug);
  const canonical = `${siteUrl}${appPath(path)}`;
  return {
    title: `${page.headline} | RentalPins Buy`,
    description: page.subhead,
    alternates: { canonical },
    openGraph: {
      title: page.headline,
      description: page.subhead,
      url: canonical,
      siteName: "RentalPins",
      type: "website",
    },
    keywords: [
      page.headline,
      `property for sale ${page.areaName}`,
      `flats for sale ${page.cityName}`,
      "RentalPins Buy",
      "owner direct",
      "no broker",
      "Chandigarh Tricity",
    ],
  };
}

export async function BuyPage({
  hubSlug,
  areaSlug,
}: {
  hubSlug: string;
  areaSlug?: string;
}) {
  const page: BuyPageConfig | null = getBuyPageConfig(hubSlug, areaSlug);
  if (!page) notFound();

  const area = CHANDIGARH_AREAS.find((a) => a.slug === page.listingAreaSlug);
  const listings = area
    ? await fetchAreaListings(area, 12, { transactionType: "sale" })
    : [];

  return <BuyLandingPage page={page} listings={listings} />;
}

/** @deprecated Use buyPageMetadata */
export function buyHubMetadata(slug: string): Metadata {
  return buyPageMetadata(slug);
}

/** @deprecated Use BuyPage */
export async function BuyHubPage({ slug }: { slug: string }) {
  return <BuyPage hubSlug={slug} />;
}
