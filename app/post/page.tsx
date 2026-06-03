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

  if (loading) {
    return <p className="p-8 text-center text-[var(--muted)]">Loading…</p>;
  }

  if (!user) {
    return <PostAuthGate listingId={listingId} />;
  }

  if (needsPhoneLink && !allowUnverifiedOwnerContact) {
    return <PostAuthGate listingId={listingId} />;
  }

  return <PostListingForm listingId={listingId} />;
}

export default function PostListingPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-[var(--muted)]">Loading…</p>}>
      <PostPageContent />
    </Suspense>
  );
}
