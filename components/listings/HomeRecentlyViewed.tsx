"use client";

import RecentlyViewedRail from "@/components/listings/RecentlyViewedRail";

/** Homepage section — only renders when browser has recent listing history. */
export default function HomeRecentlyViewed() {
  return (
    <section className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <RecentlyViewedRail limit={4} />
      </div>
    </section>
  );
}
