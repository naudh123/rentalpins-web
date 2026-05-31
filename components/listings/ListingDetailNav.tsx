"use client";

import { Suspense } from "react";
import ListingBackLink from "@/components/listings/ListingBackLink";
import ListingShareBar from "@/components/listings/ListingShareBar";

interface Props {
  listingId: string;
  title: string;
  listingUrl: string;
}

function NavInner({ listingId, title, listingUrl }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <ListingBackLink listingId={listingId} />
      <ListingShareBar listingId={listingId} title={title} url={listingUrl} />
    </div>
  );
}

export default function ListingDetailNav(props: Props) {
  return (
    <Suspense
      fallback={
        <span className="text-sm text-[var(--muted)]">Loading…</span>
      }
    >
      <NavInner {...props} />
    </Suspense>
  );
}
