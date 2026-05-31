"use client";

import { useEffect } from "react";
import { recordRecentlyViewed } from "@/lib/recently-viewed";

interface Props {
  listingId: string;
}

/** Persists this listing in local recently-viewed history (browser only). */
export default function RecentlyViewedRecorder({ listingId }: Props) {
  useEffect(() => {
    recordRecentlyViewed(listingId);
  }, [listingId]);

  return null;
}
