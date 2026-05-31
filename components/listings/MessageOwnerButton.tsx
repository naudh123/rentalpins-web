"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  ensureChatRoom,
  tryIncrementInquiry,
} from "@/lib/chat";
import { appPath } from "@/lib/config";
import { trackEvent, trackLeadStarted, trackLeadSubmitted } from "@/lib/ga4";

interface Props {
  listingId: string;
  sellerUid: string;
  listingTitle: string;
  listingImage: string;
  className?: string;
  /** Shorter label + compact tap target for mobile contact bar. */
  compact?: boolean;
  /** GA4 `lead_placement` for contact funnel segmentation. */
  leadPlacement?: string;
}

export default function MessageOwnerButton({
  listingId,
  sellerUid,
  listingTitle,
  listingImage,
  className = "",
  compact = false,
  leadPlacement,
}: Props) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    if (!user) {
      const next = appPath(`/chat?listing=${listingId}`);
      trackEvent("contact_owner_login_redirect", {
        listing_id: listingId,
        contact_mode: "chat",
        ...(leadPlacement ? { lead_placement: leadPlacement } : {}),
      });
      router.push(appPath(`/auth/login?next=${encodeURIComponent(next)}`));
      return;
    }
    if (user.uid === sellerUid) {
      setError("You cannot message yourself on your own listing.");
      return;
    }

    setBusy(true);
    try {
      trackLeadStarted(listingId, "chat", leadPlacement);
      const roomId = await ensureChatRoom({
        listingId,
        sellerUid,
        buyerUid: user.uid,
        listingTitle,
        listingImage,
      });
      await tryIncrementInquiry(listingId);
      trackLeadSubmitted(listingId, "chat", leadPlacement);
      router.push(appPath(`/chat?room=${roomId}`));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not start chat";
      setError(message);
      trackEvent("contact_owner_failed", {
        listing_id: listingId,
        contact_mode: "chat",
        ...(leadPlacement ? { lead_placement: leadPlacement } : {}),
      });
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-busy={busy}
        className={
          compact
            ? "flex min-h-11 w-full min-w-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-2.5 text-xs font-semibold text-[var(--text)] hover:border-[var(--accent)] disabled:opacity-50"
            : "w-full rounded-full border border-[var(--border)] py-3.5 text-center font-medium text-[var(--text)] hover:border-[var(--accent)] disabled:opacity-50 sm:w-auto sm:min-w-[160px] sm:px-6"
        }
      >
        {busy ? "…" : compact ? "Message" : "Message owner"}
      </button>
      <span className="sr-only" aria-live="polite">
        {busy ? "Opening chat with owner." : error ? error : ""}
      </span>
      {error && (
        <p className="mt-2 text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
