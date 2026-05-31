"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";
import {
  subscribeListingReviews,
  upsertListingReview,
} from "@/lib/listing-reviews";
import type { ListingReview } from "@/lib/types/listing-review";

interface Props {
  listingId: string;
  ownerUid: string;
  /** Server aggregate shown before live subscription updates. */
  initialReviewCount?: number;
  initialAvgRating?: number;
}

function stars(n: number): string {
  const full = Math.max(0, Math.min(5, Math.round(n)));
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export default function ListingReviews({
  listingId,
  ownerUid,
  initialReviewCount = 0,
  initialAvgRating = 0,
}: Props) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<ListingReview[]>([]);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const myReview = useMemo(
    () => reviews.find((r) => r.reviewerUid === user?.uid) ?? null,
    [reviews, user?.uid]
  );
  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  const displayCount = reviews.length > 0 ? reviews.length : initialReviewCount;
  const displayAvg =
    reviews.length > 0 ? avg : initialReviewCount > 0 ? initialAvgRating : 0;

  useEffect(() => {
    trackEvent("listing_reviews_section_viewed", {
      listing_id: listingId,
      review_count: initialReviewCount,
    });
  }, [initialReviewCount, listingId]);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    }
  }, [myReview]);

  useEffect(() => {
    return subscribeListingReviews(listingId, setReviews, (err) => {
      setError(err.message);
    });
  }, [listingId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      trackEvent("listing_review_login_redirect", { listing_id: listingId });
      setError("Sign in to leave a review.");
      return;
    }
    if (user.uid === ownerUid) {
      setError("You cannot review your own listing.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const reviewerName =
        profile?.displayName || user.displayName || profile?.phone || "Member";
      await upsertListingReview({
        listingId,
        reviewerUid: user.uid,
        reviewerName,
        rating,
        comment,
      });
      trackEvent("listing_review_submitted", { listing_id: listingId, rating });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save review");
    } finally {
      setBusy(false);
    }
  }

  function onRatingKeyDown(e: React.KeyboardEvent, current: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setRating(Math.min(5, current + 1));
      if (error) setError("");
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setRating(Math.max(1, current - 1));
      if (error) setError("");
    }
  }

  return (
    <section
      className="rp-card mt-4 scroll-mt-24 p-5"
      id="listing-reviews"
      aria-labelledby="listing-reviews-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="listing-reviews-heading" className="rp-label mb-0 uppercase tracking-wider">
          Reviews
        </h2>
        <p className="text-sm text-[var(--muted)]" aria-live="polite">
          {displayCount > 0
            ? `${displayAvg.toFixed(1)} / 5 (${displayCount} review${displayCount === 1 ? "" : "s"})`
            : "No reviews yet"}
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-3 space-y-3 border-b border-[var(--border-subtle)] pb-4"
        aria-label="Leave a review"
      >
        {!user && (
          <p className="text-sm text-[var(--muted)]">
            <Link
              href={appPath(`/auth/login?next=${encodeURIComponent(`/listings/${listingId}`)}`)}
              className="font-semibold text-[var(--brand-orange)] hover:underline"
            >
              Sign in
            </Link>{" "}
            to rate this listing.
          </p>
        )}
        <fieldset disabled={busy || !user} className="space-y-3">
          <legend className="text-sm text-[var(--muted)]">Your rating (required)</legend>
          <div
            className="flex flex-wrap gap-1"
            role="radiogroup"
            aria-label="Star rating"
            aria-required="true"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                tabIndex={rating === n ? 0 : -1}
                onClick={() => {
                  setRating(n);
                  if (error) setError("");
                }}
                onKeyDown={(e) => onRatingKeyDown(e, n)}
                className={`rounded-lg px-2.5 py-1 text-lg leading-none transition ${
                  rating >= n
                    ? "text-[var(--brand-orange)]"
                    : "text-[var(--muted)] opacity-50 hover:opacity-80"
                }`}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
              >
                {rating >= n ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (error) setError("");
            }}
            rows={2}
            maxLength={300}
            placeholder="Optional comment about this listing"
            aria-label="Review comment"
            className="rp-input min-h-[76px] resize-y"
            disabled={busy}
            aria-describedby="review-char-count"
          />
          <div className="flex items-center justify-between gap-2">
            <span id="review-char-count" className="text-xs text-[var(--muted)]">
              {comment.length}/300
            </span>
            <button
              type="submit"
              className="rp-btn rp-btn-secondary px-4 py-2 text-sm"
              disabled={busy || !user}
              aria-busy={busy}
            >
              {busy ? "Saving…" : myReview ? "Update review" : "Post review"}
            </button>
          </div>
        </fieldset>
        <span className="sr-only" aria-live="polite">
          {savedFlash
            ? "Review saved."
            : error
              ? error
              : ""}
        </span>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {savedFlash && (
          <p className="text-sm font-medium text-emerald-700" role="status">
            Thanks — your review was saved.
          </p>
        )}
      </form>

      <ul className="mt-4 space-y-3">
        {reviews.slice(0, 8).map((r) => (
          <li key={r.id} className="rounded-lg border border-[var(--border-subtle)] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--brand-navy)]">{r.reviewerName}</p>
              <p className="text-sm text-[var(--brand-orange)]">{stars(r.rating)}</p>
            </div>
            {r.comment && (
              <p className="mt-1 text-sm leading-relaxed text-[var(--text)]/85">{r.comment}</p>
            )}
          </li>
        ))}
        {!reviews.length && (
          <li className="text-sm text-[var(--muted)]">Be the first to review this listing.</li>
        )}
      </ul>
    </section>
  );
}
