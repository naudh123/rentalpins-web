"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSavedListings } from "@/components/providers/SavedListingsProvider";
import { subscribeSavedListingCards } from "@/lib/saved-listing-cards";
import type { ListingCard } from "@/lib/types/listing";
import { formatListingPrice } from "@/lib/listing-price";
import { appPath } from "@/lib/config";
import {
  getInvestShortlist,
  removeFromInvestShortlist,
  updateInvestShortlistNotes,
  type InvestShortlistEntry,
} from "@/lib/invest/saved-invest-shortlist";
import { INVEST_CORRIDORS } from "@/lib/invest/invest-corridors";

export default function InvestShortlistClient() {
  const { user } = useAuth();
  const { savedListingIds } = useSavedListings();
  const [entries, setEntries] = useState<InvestShortlistEntry[]>([]);
  const [cards, setCards] = useState<Map<string, ListingCard>>(new Map());

  useEffect(() => {
    setEntries(getInvestShortlist());
  }, [savedListingIds]);

  useEffect(() => {
    if (!user || entries.length === 0) return;
    const ids = entries.map((e) => e.listingId);
    const unsub = subscribeSavedListingCards(
      ids,
      (listings) => {
        const map = new Map<string, ListingCard>();
        for (const l of listings) map.set(l.id, l);
        setCards(map);
      },
      () => {}
    );
    return unsub;
  }, [user, entries]);

  function handleNotesChange(listingId: string, notes: string) {
    updateInvestShortlistNotes(listingId, { notes });
    setEntries(getInvestShortlist());
  }

  function handleRemove(listingId: string) {
    removeFromInvestShortlist(listingId);
    setEntries(getInvestShortlist());
  }

  if (entries.length === 0) {
    return (
      <div className="invest-theme mt-8 rounded-xl border border-dashed border-[var(--border)] p-10 text-center">
        <p className="text-[var(--muted)]">Your invest shortlist is empty.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Save listings from the buy map, then add invest notes here.
        </p>
        <Link
          href={appPath("/buy/search")}
          className="mt-4 inline-block rounded-full bg-[var(--invest-emerald)] px-6 py-2.5 text-sm font-semibold text-white"
        >
          Open buy map
        </Link>
      </div>
    );
  }

  return (
    <ul className="invest-theme mt-8 space-y-4">
      {entries.map((entry) => {
        const card = cards.get(entry.listingId);
        const cardPrice =
          card != null
            ? formatListingPrice({
                price: card.price,
                priceUnit: card.priceUnit,
                category: card.category,
                subCategory: card.subCategory,
                transactionType: card.transactionType,
                homeIso: card.homeIso,
              })
            : null;
        return (
          <li
            key={entry.listingId}
            className="rounded-xl border border-[var(--border)] bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-[var(--brand-navy)]">
                  {card?.title ?? entry.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {entry.priceLabel ?? cardPrice ?? "Price on request"} ·{" "}
                  {entry.locality ?? card?.locationName ?? "Tricity"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(entry.listingId)}
                className="text-xs text-[var(--muted)] hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Invest notes
              <textarea
                defaultValue={entry.notes}
                onBlur={(e) => handleNotesChange(entry.listingId, e.target.value)}
                className="rp-input mt-2 min-h-[72px] w-full text-sm normal-case"
                placeholder="Target yield, society checks, corridor thesis…"
              />
            </label>
            {entry.corridorId && (
              <p className="mt-2 text-xs text-[var(--invest-emerald)]">
                Corridor: {INVEST_CORRIDORS.find((c) => c.id === entry.corridorId)?.name ?? entry.corridorId}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link
                href={appPath(`/listing/${entry.listingId}`)}
                className="font-semibold text-[var(--invest-emerald)] hover:underline"
              >
                View listing
              </Link>
              <Link
                href={appPath("/invest/calculator")}
                className="font-semibold text-[var(--muted)] hover:underline"
              >
                Run calculator
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
