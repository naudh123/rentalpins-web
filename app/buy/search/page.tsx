import type { Metadata } from "next";
import { Suspense } from "react";
import SearchMap from "@/components/map/SearchMap";
import { appPath, siteUrl } from "@/lib/config";
import { fetchListingsInBounds } from "@/lib/listings";
import { boundsAroundCenter } from "@/lib/map-bounds";
import { BUY_SEARCH_PATH } from "@/lib/sale/buy-app-paths";
import { applyBuySearchDefaults, parseSearchUrlState } from "@/lib/search-url";
import { robotsForSearchPage } from "@/lib/seo/indexing-policy";

const canonical = `${siteUrl}${appPath(BUY_SEARCH_PATH)}`;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const urlState = applyBuySearchDefaults(parseSearchUrlState(params));
  const hasViewportQuery =
    urlState.bounds != null ||
    urlState.centerLat != null ||
    urlState.centerLng != null ||
    Boolean(params.lat || params.lng || params.north);

  return {
    title: "Buy map — properties for sale near you",
    description:
      "Browse flats, villas, and plots for sale on the RentalPins buy map. Filter by price and BHK, compare comps, and contact owners directly.",
    alternates: { canonical },
    robots: robotsForSearchPage(hasViewportQuery),
    openGraph: {
      title: "RentalPins buy map",
      description:
        "Interactive map of owner-direct property for sale across Mohali, Kharar, Zirakpur and Tricity.",
      url: canonical,
      siteName: "RentalPins",
      type: "website",
    },
  };
}

function SearchFallback() {
  return (
    <div className="sale-theme flex h-[60vh] items-center justify-center text-[var(--muted)]">
      Loading buy map…
    </div>
  );
}

export default async function BuySearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const urlState = applyBuySearchDefaults(parseSearchUrlState(params));

  let initialListings: Awaited<ReturnType<typeof fetchListingsInBounds>>["listings"] = [];
  let initialTotalInBounds = 0;
  let initialFilteredCount = 0;
  let initialResultsMayBeIncomplete = false;
  let initialPrefixCapActive: boolean | undefined;

  const ssrBounds =
    urlState.bounds ??
    (urlState.centerLat != null && urlState.centerLng != null
      ? boundsAroundCenter(urlState.centerLat, urlState.centerLng, urlState.zoom ?? 12)
      : null);

  if (ssrBounds) {
    try {
      const result = await Promise.race([
        fetchListingsInBounds(ssrBounds, urlState.filters, {
          zoom: urlState.zoom,
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("SSR listings timeout")), 8_000);
        }),
      ]);
      initialListings = result.listings;
      initialTotalInBounds = result.totalInBounds;
      initialFilteredCount = result.filteredCount;
      initialResultsMayBeIncomplete = result.resultsMayBeIncomplete ?? false;
      initialPrefixCapActive = result.prefixCapActive;
    } catch {
      // Client map will fetch on load.
    }
  }

  return (
    <div className="sale-theme h-full" data-transaction="sale">
      <Suspense fallback={<SearchFallback />}>
        <SearchMap
          initialListings={initialListings}
          initialTotalInBounds={initialTotalInBounds}
          initialFilteredCount={initialFilteredCount}
          initialResultsMayBeIncomplete={initialResultsMayBeIncomplete}
          initialPrefixCapActive={initialPrefixCapActive}
          forceSaleMode
        />
      </Suspense>
    </div>
  );
}
