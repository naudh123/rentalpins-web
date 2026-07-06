"use client";

import Link from "next/link";
import { appPath } from "@/lib/config";
import type { TransactionType } from "@/lib/transaction-type";

interface Props {
  value: TransactionType;
  listingId?: string | null;
  /** Draft/live edits — intent is fixed on the listing document. */
  locked?: boolean;
}

function postHref(type: TransactionType, listingId?: string | null): string {
  const base = type === "sale" ? "/buy/post" : "/post";
  if (listingId) return appPath(`${base}?listingId=${listingId}`);
  return appPath(base);
}

/** Rent vs sell — separate maps and buyer audiences. */
export default function PostListingIntentSwitch({ value, listingId, locked }: Props) {
  const isRent = value === "rent";

  return (
    <div
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)]/50 p-4"
      role="group"
      aria-label="Listing type"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-navy)]">
        What are you listing?
      </p>
      <div className="mt-3 flex gap-2">
        {locked ? (
          <span
            className={`flex-1 rounded-full px-3 py-2.5 text-center text-sm font-semibold ${
              isRent
                ? "bg-[var(--brand-orange)] text-white"
                : "bg-[var(--brand-amber)] text-[var(--brand-navy)]"
            }`}
          >
            {isRent ? "Rent out" : "Sell property"}
          </span>
        ) : (
          <>
            <Link
              href={postHref("rent", listingId)}
              aria-current={isRent ? "page" : undefined}
              className={`flex-1 rounded-full px-3 py-2.5 text-center text-sm font-semibold transition ${
                isRent
                  ? "bg-[var(--brand-orange)] text-white shadow-sm"
                  : "border border-[var(--border)] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-orange)]/40"
              }`}
            >
              Rent out
            </Link>
            <Link
              href={postHref("sale", listingId)}
              aria-current={!isRent ? "page" : undefined}
              className={`flex-1 rounded-full px-3 py-2.5 text-center text-sm font-semibold transition ${
                !isRent
                  ? "bg-[var(--brand-amber)] text-[var(--brand-navy)] shadow-sm"
                  : "border border-[var(--border)] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-amber)]/50"
              }`}
            >
              Sell property
            </Link>
          </>
        )}
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)]">
        {isRent ? (
          <>
            <span className="font-medium text-[var(--brand-navy)]">Rent map</span> — monthly rent,
            PG, and tenant search. Not for properties you want to sell.
          </>
        ) : (
          <>
            <span className="font-medium text-[var(--brand-navy)]">Buy map</span> — one-time sale
            price for buyers. Separate from rentals.
          </>
        )}
      </p>
    </div>
  );
}
