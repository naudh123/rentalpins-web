"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { appPath } from "@/lib/config";
import {
  dismissSearchAlert,
  markAllSearchAlertsRead,
  markSearchAlertRead,
} from "@/lib/search-alerts";
import type { SearchAlert } from "@/lib/types/search-alert";

interface Props {
  alerts: SearchAlert[];
}

function formatPrice(price: number): string {
  if (price <= 0) return "Price on request";
  return `₹${price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default function SearchAlertsFeed({ alerts }: Props) {
  const [markingAll, setMarkingAll] = useState(false);
  const unread = alerts.filter((a) => !a.read);
  const visible = alerts.slice(0, 20);

  if (!visible.length) return null;

  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="rp-section-title">New matches</h2>
        <div className="flex items-center gap-2">
          {unread.length > 0 && (
            <span className="rounded-full bg-[var(--brand-orange)] px-2 py-0.5 text-[10px] font-bold text-white">
              {unread.length} new
            </span>
          )}
          {unread.length > 1 && (
            <button
              type="button"
              disabled={markingAll}
              className="text-[10px] font-semibold text-[var(--brand-orange)] hover:underline disabled:opacity-60"
              onClick={async () => {
                setMarkingAll(true);
                try {
                  await markAllSearchAlertsRead(unread.map((a) => a.id));
                } finally {
                  setMarkingAll(false);
                }
              }}
            >
              {markingAll ? "Marking..." : "Mark all read"}
            </button>
          )}
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {visible.map((alert) => (
          <li
            key={alert.id}
            className={`rp-card flex gap-3 p-3 ${alert.read ? "opacity-75" : ""}`}
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--border)]">
              {alert.listingImageUrl ? (
                <Image
                  src={alert.listingImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-lg opacity-40">
                  📍
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
                {alert.savedSearchName}
              </p>
              <p className="truncate text-sm font-medium">{alert.listingTitle}</p>
              <p className="text-xs text-[var(--muted)]">{formatPrice(alert.listingPrice)}</p>
              {alert.coverageMayBeIncomplete && (
                <p className="mt-1 text-[10px] leading-snug text-amber-800/90">
                  Large map area — alerts may not include every listing. Zoom in on the map
                  for full coverage.
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <Link
                  href={appPath(`/listings/${alert.listingId}`)}
                  className="text-xs font-semibold text-[var(--brand-orange)] hover:underline"
                  onClick={() => {
                    if (!alert.read) void markSearchAlertRead(alert.id);
                  }}
                >
                  View listing →
                </Link>
                {!alert.read && (
                  <button
                    type="button"
                    className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
                    onClick={() => void markSearchAlertRead(alert.id)}
                  >
                    Mark read
                  </button>
                )}
                <button
                  type="button"
                  className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
                  onClick={() => void dismissSearchAlert(alert.id)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
