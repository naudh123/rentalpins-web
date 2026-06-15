"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PostListingForm from "@/components/post/PostListingForm";
import PostAuthGate from "@/components/post/PostAuthGate";
import { useAuth } from "@/components/providers/AuthProvider";
import { allowUnverifiedOwnerContact } from "@/lib/config";
import { parseTransactionType } from "@/lib/transaction-type";

function PostPageContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const transactionType = parseTransactionType(searchParams.get("transaction"));
  const isSale = transactionType === "sale";
  const { user, loading, needsPhoneLink } = useAuth();

  const inner = loading ? (
    <p className="p-8 text-center text-[var(--muted)]">Loading…</p>
  ) : !user ? (
    <PostAuthGate listingId={listingId} />
  ) : needsPhoneLink && !allowUnverifiedOwnerContact ? (
    <PostAuthGate listingId={listingId} />
  ) : (
    <PostListingForm listingId={listingId} transactionType={transactionType} />
  );

  if (isSale) {
    return (
      <div className="sale-theme min-h-full" data-transaction="sale">
        {inner}
      </div>
    );
  }

  return inner;
}

export default function PostListingPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-[var(--muted)]">Loading…</p>}>
      <PostPageContent />
    </Suspense>
  );
}
