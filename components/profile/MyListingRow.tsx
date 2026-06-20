"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkClosedModal from "@/components/profile/MarkClosedModal";
import type { OwnerListing } from "@/lib/my-listings";
import { formatPrice } from "@/lib/format";
import {
  listingPublicPath,
  listingToSlugInput,
  ownerListingActivatePath,
  ownerListingBoostPath,
  ownerListingEditPath,
  ownerListingLeadsPath,
  ownerListingRenewPath,
} from "@/lib/listing-path";
import {
  daysUntilMs,
  expiryUrgency,
  expiryUrgencyClass,
  markClosedLabel,
  ownerListingStatusHint,
  ownerListingStatusLabel,
  statusBadgeClass,
} from "@/lib/owner-listing-lifecycle";
import {
  archiveListingByOwner,
  markListingAsClosed,
} from "@/lib/callable-functions";
import { duplicateListingAsDraft } from "@/lib/duplicate-listing";
import { getClientDb } from "@/lib/firebase-client";
import { mapCallableError } from "@/lib/auth-errors";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";

interface Props {
  listing: OwnerListing;
}

export default function MyListingRow({ listing }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [actionError, setActionError] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const priceLabel = formatPrice(listing.price, listing.priceUnit, listing.homeIso);
  const editHref = ownerListingEditPath(listing);
  const activateHref = ownerListingActivatePath(listing.id);
  const renewHref = ownerListingRenewPath(listing.id);
  const leadsHref = ownerListingLeadsPath(listing.id);
  const boostHref = ownerListingBoostPath(listing.id);
  const statusLabel = ownerListingStatusLabel(listing.status, {
    transactionType: listing.transactionType,
    deactivatedReason: listing.deactivatedReason,
  });

  const viewHref =
    listing.status === "live"
      ? listingPublicPath(
          listingToSlugInput({
            id: listing.id,
            title: listing.title,
            locationName: listing.locationName,
            lat: listing.lat ?? 0,
            lng: listing.lng ?? 0,
            category: listing.category,
            subCategory: "",
            urlSlug: listing.urlSlug,
            transactionType: listing.transactionType,
          })
        )
      : null;

  const daysLeft = daysUntilMs(listing.listingExpiresAtMs);
  const savedDaysLeft = daysUntilMs(listing.listingDeleteAtMs);
  const isSaved = listing.status === "expired" || listing.status === "rented";
  const urgency = listing.status === "live" ? expiryUrgency(daysLeft) : "ok";
  const canArchive = listing.status !== "archived";

  async function handleMarkClosed(leaseEndAtMs?: number) {
    const reason = listing.transactionType === "sale" ? "sold" : "rented";
    await markListingAsClosed({
      listingId: listing.id,
      reason,
      leaseEndAtMs,
    });
  }

  async function handleArchive() {
    if (
      !window.confirm(
        "Archive this property? It will be removed from your list. This cannot be undone from the app."
      )
    ) {
      return;
    }
    setBusyAction("archive");
    setActionError("");
    try {
      await archiveListingByOwner(listing.id);
    } catch (err) {
      setActionError(mapCallableError(err));
    } finally {
      setBusyAction(null);
    }
  }

  async function handleDuplicate() {
    if (!user) return;
    setBusyAction("duplicate");
    setActionError("");
    try {
      const newId = await duplicateListingAsDraft(getClientDb(), listing.id, user.uid);
      router.push(appPath(ownerListingEditPath({ id: newId, transactionType: listing.transactionType })));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not duplicate");
    } finally {
      setBusyAction(null);
    }
  }

  const btn =
    "rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--brand-navy)] hover:border-[color-mix(in_srgb,var(--brand-navy)_25%,var(--border))] disabled:opacity-50";
  const btnPrimary =
    "rounded-full bg-[var(--brand-orange)] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-105 disabled:opacity-50";

  return (
    <>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-3 transition hover:border-[color-mix(in_srgb,var(--brand-navy)_25%,var(--border))]">
        <div className="flex gap-3">
          <Link
            href={editHref}
            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-elevated)]"
          >
            {listing.imageUrl ? (
              <Image src={listing.imageUrl} alt="" fill className="object-cover" sizes="64px" />
            ) : (
              <div className="flex h-full items-center justify-center text-xl opacity-40">📷</div>
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={editHref}
                className="truncate font-medium text-[var(--brand-navy)] hover:underline"
              >
                {listing.title}
              </Link>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusBadgeClass(listing.status)}`}
              >
                {statusLabel}
              </span>
              {listing.isUnpaidDraft && (
                <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-orange-800">
                  Payment pending
                </span>
              )}
              {listing.isPromoted && listing.status === "live" && (
                <span className="rp-badge shrink-0">Featured</span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
              {listing.locationName || listing.category}
            </p>
            <p className="mt-1 text-sm text-[var(--brand-orange)]">{priceLabel}</p>

            {listing.status === "live" && daysLeft != null && (
              <p className={`mt-1 text-[10px] ${expiryUrgencyClass(urgency)}`}>
                {urgency === "critical"
                  ? `Expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"} — renew soon`
                  : urgency === "soon"
                    ? `${daysLeft} days left on map`
                    : `${daysLeft} days left on map`}{" "}
                · {listing.viewsCount} views · {listing.inquiryCount} inquiries
              </p>
            )}

            {isSaved && savedDaysLeft != null && (
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                Saved for {savedDaysLeft} more days
                {listing.currentPlanName ? ` · last plan: ${listing.currentPlanName}` : ""}
                {listing.leaseEndAtMs ? (
                  <> · lease ends {new Date(listing.leaseEndAtMs).toLocaleDateString()}</>
                ) : null}
              </p>
            )}

            {listing.status === "draft" && !listing.isUnpaidDraft && (
              <p className="mt-1 text-[10px] text-[var(--muted)]">Draft saved — activate when ready</p>
            )}

            {listing.status === "archived" && (
              <p className="mt-1 text-[10px] text-[var(--muted)]">Archived — read only</p>
            )}

            {listing.status !== "archived" && (
              <p className="mt-1 text-xs text-[var(--muted)]">
                {ownerListingStatusHint(listing.status)}
              </p>
            )}
          </div>
        </div>

        {listing.status !== "archived" && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-3">
            <Link href={editHref} className={btn}>
              {isSaved ? "Edit details" : "Edit"}
            </Link>

            {(listing.status === "draft" || isSaved) && (
              <Link href={activateHref} className={btnPrimary}>
                {isSaved ? "Re-list" : "Activate"}
              </Link>
            )}

            {listing.status === "live" && (
              <>
                <Link href={renewHref} className={btnPrimary}>
                  Renew
                </Link>
                <Link href={leadsHref} className={btn}>
                  Leads ({listing.inquiryCount})
                </Link>
                <Link href={boostHref} className={btn}>
                  Boost
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                  onClick={() => setShowClosedModal(true)}
                >
                  {markClosedLabel(listing.transactionType)}
                </button>
              </>
            )}

            {viewHref && (
              <Link href={viewHref} className={btn}>
                View live
              </Link>
            )}

            <button
              type="button"
              disabled={busyAction === "duplicate"}
              className={btn}
              onClick={() => void handleDuplicate()}
            >
              {busyAction === "duplicate" ? "Copying…" : "Duplicate"}
            </button>

            {canArchive && (
              <button
                type="button"
                disabled={busyAction === "archive"}
                className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 disabled:opacity-50"
                onClick={() => void handleArchive()}
              >
                {busyAction === "archive" ? "Archiving…" : "Archive"}
              </button>
            )}
          </div>
        )}

        {actionError && <p className="mt-2 text-xs text-red-600">{actionError}</p>}
      </div>

      <MarkClosedModal
        open={showClosedModal}
        transactionType={listing.transactionType}
        onClose={() => setShowClosedModal(false)}
        onConfirm={handleMarkClosed}
      />
    </>
  );
}
