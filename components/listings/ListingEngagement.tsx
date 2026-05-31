"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { formatListedAgo } from "@/lib/format-time";
import { trackEvent } from "@/lib/ga4";

interface Props {
  listingId: string;
  listedAt: string;
  initialViews: number;
  inquiryCount: number;
}

const SESSION_PREFIX = "rp_viewed_";

export default function ListingEngagement({
  listingId,
  listedAt,
  initialViews,
  inquiryCount,
}: Props) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const sessionKey = `${SESSION_PREFIX}${listingId}`;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(sessionKey)) return;

    sessionStorage.setItem(sessionKey, "1");

    void fetch(apiUrl(`/api/listings/${listingId}/view`), { method: "POST" })
      .then((res) => {
        if (!res.ok) {
          trackEvent("listing_view_count_failed", {
            listing_id: listingId,
            status: String(res.status),
          });
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.viewsCount === "number") {
          setViews(data.viewsCount);
          trackEvent("listing_view_counted", {
            listing_id: listingId,
            views_count: data.viewsCount,
          });
        } else {
          setViews((v) => v + 1);
        }
      })
      .catch(() => {
        trackEvent("listing_view_count_failed", {
          listing_id: listingId,
          status: "network",
        });
        setViews((v) => v + 1);
      });
  }, [listingId]);

  const listedLabel = formatListedAgo(listedAt);

  return (
    <p className="mt-2 text-xs text-[var(--muted)]" aria-live="polite">
      <span className="font-medium text-[var(--text)]/80">{listedLabel}</span>
      <span aria-hidden className="mx-1.5">
        ·
      </span>
      {views.toLocaleString()} {views === 1 ? "view" : "views"}
      <span aria-hidden className="mx-1.5">
        ·
      </span>
      {inquiryCount.toLocaleString()}{" "}
      {inquiryCount === 1 ? "inquiry" : "inquiries"}
    </p>
  );
}
