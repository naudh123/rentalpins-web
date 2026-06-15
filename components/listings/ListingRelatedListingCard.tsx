"use client";

import { usePathname, useSearchParams } from "next/navigation";
import ListingCard from "@/components/listings/ListingCard";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";
import type { ListingCard as ListingCardType } from "@/lib/types/listing";

interface Props {
  listing: ListingCardType;
  section: "similar" | "owner" | "recently_viewed";
  sourceListingId: string;
}

export default function ListingRelatedListingCard({
  listing,
  section,
  sourceListingId,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnPath = pathname;

  return (
    <div
      onClickCapture={() =>
        trackEvent("listing_related_clicked", {
          listing_id: listing.id,
          source_listing_id: sourceListingId,
          section,
        })
      }
    >
      <ListingCard listing={listing} source="list" returnPath={returnPath} />
    </div>
  );
}
