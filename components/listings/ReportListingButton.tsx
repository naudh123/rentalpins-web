"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";
import { submitListingReport } from "@/lib/listing-reports";
import { trackEvent } from "@/lib/ga4";
import {
  LISTING_REPORT_REASONS,
  type ListingReportReason,
} from "@/lib/types/listing-report";

interface Props {
  listingId: string;
  listingTitle: string;
  ownerUid: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ReportListingButton({
  listingId,
  listingTitle,
  ownerUid,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ListingReportReason>("scam");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(done);
  doneRef.current = done;

  const close = useCallback(
    (method: "button" | "backdrop" | "escape" = "button") => {
      if (busy) return;
      setOpen((wasOpen) => {
        if (wasOpen) {
          trackEvent("listing_report_modal_closed", {
            listing_id: listingId,
            method,
            submitted: doneRef.current ? "yes" : "no",
          });
        }
        return false;
      });
      setError("");
      if (doneRef.current) {
        setDone(false);
        setDetails("");
        setReason("scam");
      }
    },
    [busy, listingId]
  );

  useEffect(() => {
    if (!open) return;
    trackEvent("listing_report_opened", { listing_id: listingId });
    const panel = panelRef.current;
    const focusTarget = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    focusTarget?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function queryFocusable() {
      if (!panel) return [] as HTMLElement[];
      return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
      );
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close("escape");
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = queryFocusable();
      if (!items.length) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (!active || active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (!active || active === last || !panel.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, listingId, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!user) {
      trackEvent("listing_report_login_redirect", { listing_id: listingId });
      router.push(
        appPath(`/auth/login?next=${encodeURIComponent(`/listings/${listingId}`)}`)
      );
      return;
    }

    if (user.uid === ownerUid) {
      setError("You cannot report your own listing.");
      return;
    }

    setBusy(true);
    try {
      await submitListingReport(user.uid, {
        listingId,
        listingTitle,
        ownerUid,
        reason,
        details,
      });
      trackEvent("listing_reported", {
        listing_id: listingId,
        report_reason: reason,
      });
      setDone(true);
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "";
      if (code === "permission-denied") {
        setError(
          "Could not send report. Ask an admin to deploy listing_reports Firestore rules."
        );
      } else {
        setError(err instanceof Error ? err.message : "Could not send report");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
        className="text-xs text-[var(--muted)] underline-offset-2 hover:text-[var(--text)] hover:underline"
      >
        Report listing
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-listing-title"
          onClick={() => close("backdrop")}
        >
          <div
            ref={panelRef}
            id="report-listing-panel"
            tabIndex={-1}
            className="rp-card w-full max-w-md p-5 shadow-xl outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <div className="text-center">
                <p className="font-serif text-xl text-[var(--brand-navy)]">
                  Report received
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Thanks — our team will review this listing.
                </p>
                <button
                  type="button"
                  className="rp-btn rp-btn-primary mt-6 w-full py-3"
                  onClick={() => close("button")}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2
                  id="report-listing-title"
                  className="font-serif text-xl text-[var(--brand-navy)]"
                >
                  Report listing
                </h2>
                <p className="mt-1 truncate text-sm text-[var(--muted)]">
                  {listingTitle}
                </p>

                {!user ? (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--muted)]">
                      Sign in to report suspicious listings.
                    </p>
                    <Link
                      href={appPath(
                        `/auth/login?next=${encodeURIComponent(`/listings/${listingId}`)}`
                      )}
                      className="rp-btn rp-btn-primary mt-4 inline-flex px-6 py-2.5"
                      onClick={() =>
                        trackEvent("listing_report_login_redirect", {
                          listing_id: listingId,
                        })
                      }
                    >
                      Sign in
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                      <label className="rp-label">Reason</label>
                      <select
                        value={reason}
                        onChange={(e) =>
                          setReason(e.target.value as ListingReportReason)
                        }
                        className="rp-input mt-1"
                        required
                      >
                        {LISTING_REPORT_REASONS.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="rp-label">Details (optional)</label>
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="What seems wrong?"
                        className="rp-input mt-1 min-h-[88px] resize-y"
                        aria-describedby="report-details-count"
                      />
                      <p id="report-details-count" className="mt-1 text-xs text-[var(--muted)]">
                        {details.length}/500
                      </p>
                    </div>
                    <span className="sr-only" aria-live="polite">
                      {busy ? "Sending report." : error ? error : done ? "Report sent." : ""}
                    </span>
                    {error && (
                      <p className="text-sm text-red-600" role="alert">
                        {error}
                      </p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        className="rp-btn rp-btn-secondary flex-1 py-3"
                        onClick={() => close("button")}
                        disabled={busy}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rp-btn rp-btn-primary flex-1 py-3"
                        disabled={busy}
                        aria-busy={busy}
                      >
                        {busy ? "Sending…" : "Submit report"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
