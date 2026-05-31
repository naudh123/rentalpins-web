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
  const { user, loading, needsPhoneLink } = useAuth();

  useEffect(() => {
    if (loading) return;
    const next = listingId ? `/post?listingId=${listingId}` : "/post";
    if (!user) {
      router.replace(appPath(`/auth/login?next=${encodeURIComponent(next)}`));
      return;
    }
    if (needsPhoneLink) {
      router.replace(
        appPath(`/auth/login?link=1&next=${encodeURIComponent(next)}`)
      );
    }
  }, [user, loading, needsPhoneLink, router, listingId]);

  if (loading || needsPhoneLink) {
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
