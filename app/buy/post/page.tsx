"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PostListingForm from "@/components/post/PostListingForm";
import PostAuthGate from "@/components/post/PostAuthGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { allowUnverifiedOwnerContact } from "@/lib/config";

function BuyPostPageContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const { user, loading, needsPhoneLink } = useAuth();

  const inner = loading ? (
    <p className="p-8 text-center text-[var(--muted)]">Loading…</p>
  ) : !user ? (
    <PostAuthGate listingId={listingId} transactionType="sale" />
  ) : needsPhoneLink && !allowUnverifiedOwnerContact ? (
    <PostAuthGate listingId={listingId} transactionType="sale" />
  ) : (
    <PostListingForm listingId={listingId} transactionType="sale" />
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
        List for sale
      </p>
      <h1 className="mt-2 font-serif text-2xl text-[var(--brand-navy)]">
        Post your property for sale
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Owner-direct listings on the RentalPins buy map — separate from rentals.
      </p>
      <div className="mt-6">{inner}</div>
    </div>
  );
}

export default function BuyPostPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-[var(--muted)]">Loading…</p>}>
      <BuyPostPageContent />
    </Suspense>
  );
}
