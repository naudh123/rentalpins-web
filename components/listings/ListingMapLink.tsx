"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/ga4";

interface Props {
  href: string;
  listingId: string;
  className?: string;
  /** GA4 dimension for where the link was shown (e.g. similar_rail, location_snippet). */
  linkSource?: string;
  children: ReactNode;
}

export default function ListingMapLink({
  href,
  listingId,
  className,
  linkSource,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent("listing_map_link_clicked", {
          listing_id: listingId,
          ...(linkSource ? { link_source: linkSource } : {}),
        })
      }
    >
      {children}
    </Link>
  );
}
