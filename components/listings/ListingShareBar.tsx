"use client";

import { useEffect, useRef, useState } from "react";
import { trackListingShared } from "@/lib/ga4";

interface Props {
  listingId: string;
  title: string;
  url: string;
}

export default function ListingShareBar({ listingId, title, url }: Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const copiedResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
    return () => {
      if (copiedResetTimerRef.current) clearTimeout(copiedResetTimerRef.current);
    };
  }, []);

  async function shareListing() {
    setError("");
    setBusy(true);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text: title, url });
        trackListingShared(listingId, "native_share");
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackListingShared(listingId, "clipboard");
      if (copiedResetTimerRef.current) clearTimeout(copiedResetTimerRef.current);
      copiedResetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (typeof window !== "undefined") {
        window.prompt("Copy this listing link:", url);
        trackListingShared(listingId, "manual_prompt");
        return;
      }
      setError("Share failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void shareListing()}
        disabled={busy}
        aria-busy={busy}
        className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-navy)] disabled:opacity-60"
      >
        {copied ? "Copied!" : canNativeShare ? "Share" : "Copy link"}
      </button>
      <span className="sr-only" aria-live="polite">
        {busy
          ? "Sharing listing."
          : copied
            ? "Listing link copied."
            : error
              ? `Share failed. ${error}`
              : ""}
      </span>
      {error && (
        <span className="text-xs text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
