"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostListingForm from "@/components/post/PostListingForm";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";

function PostPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      const next = listingId ? `/post?listingId=${listingId}` : "/post";
      router.replace(appPath(`/auth/login?next=${encodeURIComponent(next)}`));
    }
  }, [user, loading, router, listingId]);

  if (loading) {
    return <p className="p-8 text-center text-[var(--muted)]">Loading…</p>;
  }

  if (!user) return null;

  return <PostListingForm listingId={listingId} />;
}

export default function PostListingPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-[var(--muted)]">Loading…</p>}>
      <PostPageContent />
    </Suspense>
  );
}
