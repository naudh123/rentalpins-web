import type { Metadata } from "next";
import { Suspense } from "react";
import SearchMap from "@/components/map/SearchMap";
import { appPath, siteUrl } from "@/lib/config";
import { fetchListingsInBounds } from "@/lib/listings";
import { boundsAroundCenter } from "@/lib/map-bounds";
import { parseSearchUrlState } from "@/lib/search-url";

const canonical = `${siteUrl}${appPath("/search")}`;

export const metadata: Metadata = {
  title: "Map search — find rentals near you",
  description:
    "Browse rooms, PG, flats, vehicles and more on the RentalPins map. Filter by category and price, save searches, and contact owners directly.",
  alternates: { canonical },
  openGraph: {
    title: "RentalPins map search",
    description:
      "Interactive map of live rental listings across India, UK, Kenya and Nigeria.",
    url: canonical,
    siteName: "RentalPins",
    type: "website",
  },
};

function SearchFallback() {
  return (
    <div className="flex h-[60vh] items-center justify-center text-[var(--muted)]">
      Loading map…
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const urlState = parseSearchUrlState(params);

  let initialListings: Awaited<ReturnType<typeof fetchListingsInBounds>>["listings"] = [];
  let initialTotalInBounds = 0;
  let initialFilteredCount = 0;
  let initialResultsMayBeIncomplete = false;
  let initialPrefixCapActive: boolean | undefined;

  // Prefer explicit bounds; otherwise derive from center + zoom so deep links
  // (e.g. hub "Browse on Map") still get a server-rendered first paint.
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
    <div className="h-full">
      <Suspense fallback={<SearchFallback />}>
        <SearchMap
          initialListings={initialListings}
          initialTotalInBounds={initialTotalInBounds}
          initialFilteredCount={initialFilteredCount}
          initialResultsMayBeIncomplete={initialResultsMayBeIncomplete}
          initialPrefixCapActive={initialPrefixCapActive}
        />
      </Suspense>
    </div>
  );
}
