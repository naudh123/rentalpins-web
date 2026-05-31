"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { appPath, publicSiteUrl } from "@/lib/config";
import { trackEvent } from "@/lib/ga4";

interface Props {
  disabled?: boolean;
}

export default function CopySearchLinkButton({ disabled = false }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const copiedResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedResetTimerRef.current) clearTimeout(copiedResetTimerRef.current);
    };
  }, []);

  async function copyLink() {
    if (disabled) return;
    setError("");
    // Prefer the live URL — viewport sync uses history.replaceState, which is
    // always current even if useSearchParams hasn't re-rendered yet.
    const liveQs =
      typeof window !== "undefined" ? window.location.search.replace(/^\?/, "") : "";
    const qs = liveQs || searchParams.toString();
    const path = appPath(pathname || "/search");
    const url = `${publicSiteUrl()}${path}${qs ? `?${qs}` : ""}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "RentalPins map search",
          url,
        });
        trackEvent("search_link_copied", {
          has_filters: qs.length > 0 ? "yes" : "no",
          method: "native_share",
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("search_link_copied", {
        has_filters: qs.length > 0 ? "yes" : "no",
        method: "clipboard",
      });
      if (copiedResetTimerRef.current) clearTimeout(copiedResetTimerRef.current);
      copiedResetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (typeof window !== "undefined") {
        window.prompt("Copy this search link:", url);
        trackEvent("search_link_copied", {
          has_filters: qs.length > 0 ? "yes" : "no",
          method: "manual_prompt",
        });
        return;
      }
      setError("Copy failed");
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={() => void copyLink()}
        disabled={disabled}
        className="rp-btn rp-btn-ghost px-3 py-1.5 text-xs"
        title={disabled ? "Wait for map results to finish loading" : "Copy link to this map view"}
        aria-busy={disabled}
      >
        {copied ? "Copied!" : "Share search"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Search link copied." : error ? `Share failed. ${error}` : ""}
      </span>
      {error && (
        <span className="text-[10px] text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
