"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import ListingCard from "@/components/listings/ListingCard";
import RecentlyViewedRail from "@/components/listings/RecentlyViewedRail";
import { subscribeSavedListings, type SavedListing } from "@/lib/saved-listings";
import { subscribeSavedListingCards } from "@/lib/saved-listing-cards";
import { appPath } from "@/lib/config";
import type { ListingCard as ListingCardType } from "@/lib/types/listing";

type SavedSort = "recent" | "price_asc" | "price_desc";

export default function SavedListingsPage() {
  const { user, loading } = useAuth();
  const [saved, setSaved] = useState<SavedListing[]>([]);
  const [cards, setCards] = useState<ListingCardType[]>([]);
  const [error, setError] = useState("");
  const [loadingCards, setLoadingCards] = useState(false);
  const [sortBy, setSortBy] = useState<SavedSort>("recent");

  useEffect(() => {
    if (!user) {
      setSaved([]);
      setCards([]);
      return;
    }
    return subscribeSavedListings(user.uid, setSaved, (err) => setError(err.message));
  }, [user]);

  const savedIds = useMemo(() => saved.map((s) => s.listingId), [saved]);

  useEffect(() => {
    if (!savedIds.length) {
      setCards([]);
      setLoadingCards(false);
      return;
    }
    setLoadingCards(true);
    const unsub = subscribeSavedListingCards(
      savedIds,
      (next) => {
        setCards(next);
        setLoadingCards(false);
      },
      (err) => {
        setError(err.message);
        setLoadingCards(false);
      }
    );
    return unsub;
  }, [savedIds]);

  const visibleCards = useMemo(() => {
    const copy = [...cards];
    if (sortBy === "price_asc") {
      copy.sort((a, b) => a.price - b.price);
      return copy;
    }
    if (sortBy === "price_desc") {
      copy.sort((a, b) => b.price - a.price);
      return copy;
    }
    return copy;
  }, [cards, sortBy]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rp-card p-8">
          <p className="text-[var(--muted)]">Sign in to view your saved listings.</p>
          <Link href={appPath("/auth/login?next=/saved-listings")} className="rp-btn rp-btn-primary mt-6 inline-flex">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="rp-badge">Your favourites</p>
          <h1 className="mt-2 font-serif text-2xl tracking-tight md:text-3xl">
            Saved listings
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Quick access to homes and rentals you shortlisted.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href={appPath("/search")} className="rp-btn rp-btn-secondary px-4 py-2 text-sm">
            Map
          </Link>
          <Link href={appPath("/saved-searches")} className="rp-btn rp-btn-ghost px-4 py-2 text-sm">
            Alerts
          </Link>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-300">
          {error.includes("index")
            ? "Deploy Firestore rules/indexes for saved listings."
            : error}
        </p>
      )}

      {loadingCards && (
        <p className="mt-8 text-sm text-[var(--muted)]">Loading saved listings…</p>
      )}

      {!loadingCards && cards.length > 0 && (
        <>
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--muted)]">
              {cards.length} active {cards.length === 1 ? "listing" : "listings"}
            </p>
            <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
              Sort
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SavedSort)}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text)]"
              >
                <option value="recent">Recently updated</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </label>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCards.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                source="list"
                returnPath={appPath("/saved-listings")}
              />
            ))}
          </div>
        </>
      )}

      {!loadingCards && savedIds.length > 0 && cards.length === 0 && (
        <div className="rp-card mt-12 p-10 text-center">
          <p className="text-4xl opacity-30" aria-hidden>
            ⏳
          </p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Your saved listings are no longer active.
          </p>
          <Link href={appPath("/search")} className="rp-btn rp-btn-primary mt-6 inline-flex">
            Find fresh listings
          </Link>
        </div>
      )}

      {!loadingCards && savedIds.length === 0 && (
        <div className="rp-card mt-12 p-10 text-center">
          <p className="text-4xl opacity-30" aria-hidden>
            ♡
          </p>
          <p className="mt-4 text-sm text-[var(--muted)]">No saved listings yet.</p>
          <Link href={appPath("/search")} className="rp-btn rp-btn-primary mt-6 inline-flex">
            Browse map
          </Link>
        </div>
      )}

      <RecentlyViewedRail limit={6} className="mt-12 border-t border-[var(--border-subtle)] pt-10" />
    </div>
  );
}

