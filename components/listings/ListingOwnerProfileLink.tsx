"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";

interface Props {
  ownerUid: string;
  displayName: string;
  listingId: string;
  className?: string;
  /** GA4 dimension for link placement (e.g. trust_line, owner_rail). */
  linkSource?: string;
  children?: ReactNode;
}

export default function ListingOwnerProfileLink({
  ownerUid,
  displayName,
  listingId,
  className = "font-medium text-[var(--text)] underline-offset-2 hover:underline",
  linkSource,
  children,
}: Props) {
  return (
    <Link
      href={appPath(`/u/${ownerUid}`)}
      className={className}
      onClick={() =>
        trackEvent("listing_owner_profile_clicked", {
          listing_id: listingId,
          owner_uid: ownerUid,
          ...(linkSource ? { link_source: linkSource } : {}),
        })
      }
    >
      {children ?? displayName}
    </Link>
  );
}
