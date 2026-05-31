"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/ga4";

interface Props {
  ownerUid: string;
  ownerName: string;
  profileUrl: string;
}

export default function OwnerProfileShareButton({
  ownerUid,
  ownerName,
  profileUrl,
}: Props) {
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

  async function shareProfile() {
    setError("");
    setBusy(true);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${ownerName} on RentalPins`,
          text: `Browse listings from ${ownerName} on RentalPins`,
          url: profileUrl,
        });
        trackEvent("owner_profile_shared", {
          owner_uid: ownerUid,
          method: "native_share",
        });
        return;
      }
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      trackEvent("owner_profile_shared", {
        owner_uid: ownerUid,
        method: "clipboard",
      });
      if (copiedResetTimerRef.current) clearTimeout(copiedResetTimerRef.current);
      copiedResetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (typeof window !== "undefined") {
        window.prompt("Copy this profile link:", profileUrl);
        trackEvent("owner_profile_shared", {
          owner_uid: ownerUid,
          method: "manual_prompt",
        });
        return;
      }
      setError("Share failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => void shareProfile()}
        disabled={busy}
        aria-busy={busy}
        className="rp-btn rp-btn-ghost px-3 py-2 text-xs disabled:opacity-60"
      >
        {copied ? "Copied!" : canNativeShare ? "Share profile" : "Copy profile link"}
      </button>
      <span className="sr-only" aria-live="polite">
        {busy
          ? "Sharing profile."
          : copied
            ? "Profile link copied."
            : error
              ? `Share failed. ${error}`
              : ""}
      </span>
      {error && (
        <span className="text-[10px] text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
