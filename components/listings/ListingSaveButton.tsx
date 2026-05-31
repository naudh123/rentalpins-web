"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSavedListings } from "@/components/providers/SavedListingsProvider";
import { appPath } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";

interface Props {
  listingId: string;
  size?: "sm" | "md";
  className?: string;
  /** Optional: if provided, uses this as the post-login redirect. */
  nextUrl?: string;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "#E8501A" : "none"}
      stroke={filled ? "#E8501A" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function ListingSaveButton({
  listingId,
  size = "md",
  className = "",
  nextUrl,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggleSaved, loaded } = useSavedListings();
  const [busy, setBusy] = useState(false);

  const saved = useMemo(() => loaded && isSaved(listingId), [loaded, isSaved, listingId]);

  const padding = size === "sm" ? "p-1.5" : "p-2";
  const dims = size === "sm" ? "h-9 w-9" : "h-10 w-10";

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      const next =
        nextUrl || appPath(`/listings/${listingId}`);
      trackEvent("listing_save_login_redirect", { listing_id: listingId });
      router.push(
        appPath(`/auth/login?next=${encodeURIComponent(next)}`)
      );
      return;
    }

    if (busy) return;
    setBusy(true);
    try {
      const currentlySaved = saved;
      await toggleSaved(listingId);
      if (!currentlySaved) {
        // saved event is already tracked in saveListing()
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!loaded || busy}
      aria-label={saved ? "Saved listing" : "Save listing"}
      aria-pressed={saved}
      aria-busy={busy}
      className={`inline-flex items-center justify-center rounded-full border transition ${
        saved
          ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      } ${padding} ${dims} ${className}`}
    >
      <HeartIcon filled={saved} />
      <span className="sr-only" aria-live="polite">
        {busy ? "Updating save." : saved ? "Listing saved." : ""}
      </span>
    </button>
  );
}

