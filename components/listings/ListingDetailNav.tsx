"use client";

import { Suspense } from "react";
import ListingBackLink from "@/components/listings/ListingBackLink";
import ListingShareBar from "@/components/listings/ListingShareBar";
import type { ListingDetail } from "@/lib/types/listing";

interface Props {
  listing: ListingDetail;
}

function NavInner({ listing }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <ListingBackLink listingId={listing.id} />
      <ListingShareBar listing={listing} />
    </div>
  );
}

export default function ListingDetailNav({ listing }: Props) {
  return (
    <Suspense
      fallback={
        <span className="text-sm text-[var(--muted)]">Loading…</span>
      }
    >
      <NavInner listing={listing} />
    </Suspense>
  );
}
