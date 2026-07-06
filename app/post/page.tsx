"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PostListingForm from "@/components/post/PostListingForm";
import PostAuthGate from "@/components/post/PostAuthGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { allowUnverifiedOwnerContact } from "@/lib/config";

function PostPageContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const { user, loading, needsPhoneLink } = useAuth();

  const inner = loading ? (
    <p className="p-8 text-center text-[var(--muted)]">Loading…</p>
  ) : !user ? (
    <PostAuthGate listingId={listingId} />
  ) : needsPhoneLink && !allowUnverifiedOwnerContact ? (
    <PostAuthGate listingId={listingId} />
  ) : (
    <PostListingForm listingId={listingId} transactionType="rent" />
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
        List for rent
      </p>
      <h1 className="mt-2 font-serif text-2xl text-[var(--brand-navy)]">
        Post your property for rent
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        PGs, flats, rooms, and commercial — renters find you on the RentalPins rent map. Selling?
        Use the buy flow instead.
      </p>
      <div className="mt-6">{inner}</div>
    </div>
  );
}

export default function PostListingPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-[var(--muted)]">Loading…</p>}>
      <PostPageContent />
    </Suspense>
  );
}
