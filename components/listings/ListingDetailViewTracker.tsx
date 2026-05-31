"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/ga4";

interface Props {
  listingId: string;
  category: string;
  subCategory?: string;
  isPromoted: boolean;
  hasOwnerPhone: boolean;
  hasOwnerUid: boolean;
  photoCount: number;
  hasDescription: boolean;
  reviewCount?: number;
}

/** Fires once per page load for listing detail analytics. */
export default function ListingDetailViewTracker({
  listingId,
  category,
  subCategory = "",
  isPromoted,
  hasOwnerPhone,
  hasOwnerUid,
  photoCount,
  hasDescription,
  reviewCount = 0,
}: Props) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    trackEvent("listing_detail_viewed", {
      listing_id: listingId,
      category,
      ...(subCategory ? { sub_category: subCategory } : {}),
      is_promoted: isPromoted ? "yes" : "no",
      has_owner_phone: hasOwnerPhone ? "yes" : "no",
      has_owner_uid: hasOwnerUid ? "yes" : "no",
      photo_count: photoCount,
      has_description: hasDescription ? "yes" : "no",
      review_count: reviewCount,
    });
  }, [
    category,
    hasDescription,
    hasOwnerPhone,
    hasOwnerUid,
    isPromoted,
    listingId,
    photoCount,
    reviewCount,
    subCategory,
  ]);

  return null;
}
