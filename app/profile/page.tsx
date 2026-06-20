"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import AccountUnavailable from "@/components/auth/AccountUnavailable";
import MyListingRow from "@/components/profile/MyListingRow";
import PortfolioSummaryCard from "@/components/profile/PortfolioSummaryCard";
import RenewalReminderBanner from "@/components/profile/RenewalReminderBanner";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/components/providers/AuthProvider";
import { mapAuthError } from "@/lib/auth-errors";
import { getClientDb } from "@/lib/firebase-client";
import { parseOwnerListing, type OwnerListing } from "@/lib/my-listings";
import { buildOwnerPortfolioSummary } from "@/lib/owner-portfolio";
import { appPath, requirePhoneVerification } from "@/lib/config";

type PropertyFilter = "all" | "rent" | "sale";

function mergeOwnerListings(...groups: OwnerListing[][]): OwnerListing[] {
  const byId = new Map<string, OwnerListing>();
  for (const rows of groups) {
    for (const row of rows) byId.set(row.id, row);
  }
  return Array.from(byId.values()).sort((a, b) => {
    const aMs = a.deactivatedAtMs || a.createdAtMs;
    const bMs = b.deactivatedAtMs || b.createdAtMs;
    return bMs - aMs;
  });
}

function filterByMode(listings: OwnerListing[], mode: PropertyFilter): OwnerListing[] {
  if (mode === "all") return listings;
  return listings.filter((l) => l.transactionType === mode);
}

function PropertySection({
  title,
  description,
  listings,
}: {
  title: string;
  description?: string;
  listings: OwnerListing[];
}) {
  if (!listings.length) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-[var(--brand-navy)]">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-[var(--muted)]">{description}</p>}
      <ul className="mt-3 space-y-2">
        {listings.map((l) => (
          <li key={l.id}>
            <MyListingRow listing={l} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    profile,
    loading,
    phoneVerified,
    canPostListing,
    profileError,
    refreshProfile,
    signOut,
    updateDisplayName,
  } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const [listings, setListings] = useState<OwnerListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState("");
  const [propertyFilter, setPropertyFilter] = useState<PropertyFilter>("all");

  useEffect(() => {
    if (!loading && !user) {
      router.replace(appPath("/auth/login?next=/profile"));
    }
  }, [user, loading, router]);

  useEffect(() => {
    setDisplayName(profile?.displayName || user?.displayName || "");
  }, [profile?.displayName, user?.displayName]);

  useEffect(() => {
    if (!user) return;
    const db = getClientDb();
    let activeRows: OwnerListing[] = [];
    let savedRows: OwnerListing[] = [];
    let archivedRows: OwnerListing[] = [];
    let activeReady = false;
    let savedReady = false;
    let archivedReady = false;

    function publish() {
      if (!activeReady || !savedReady || !archivedReady) return;
      setListings(mergeOwnerListings(activeRows, savedRows, archivedRows));
      setListingsLoading(false);
      setListingsError("");
    }

    const unsubActive = onSnapshot(
      query(collection(db, "listings"), where("ownerUid", "==", user.uid)),
      (snap) => {
        activeRows = snap.docs
          .map((d) => parseOwnerListing(d.id, d.data() as Record<string, unknown>, "listings"))
          .filter((l): l is OwnerListing => l !== null);
        activeReady = true;
        publish();
      },
      (err) => {
        console.error("my listings", err);
        setListingsError(mapAuthError(err));
        setListingsLoading(false);
      }
    );

    const unsubSaved = onSnapshot(
      query(collection(db, "deactivated_listings"), where("ownerUid", "==", user.uid)),
      (snap) => {
        savedRows = snap.docs
          .map((d) =>
            parseOwnerListing(d.id, d.data() as Record<string, unknown>, "deactivated_listings")
          )
          .filter((l): l is OwnerListing => l !== null);
        savedReady = true;
        publish();
      },
      (err) => {
        console.error("saved properties", err);
        setListingsError(mapAuthError(err));
        savedReady = true;
        publish();
      }
    );

    const unsubArchived = onSnapshot(
      query(collection(db, "archived_listings"), where("ownerUid", "==", user.uid)),
      (snap) => {
        archivedRows = snap.docs
          .map((d) =>
            parseOwnerListing(d.id, d.data() as Record<string, unknown>, "archived_listings")
          )
          .filter((l): l is OwnerListing => l !== null);
        archivedReady = true;
        publish();
      },
      () => {
        archivedReady = true;
        publish();
      }
    );

    return () => {
      unsubActive();
      unsubSaved();
      unsubArchived();
    };
  }, [user]);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameMessage("");
    setSavingName(true);
    try {
      await updateDisplayName(displayName);
      setNameMessage("Saved");
    } catch (err) {
      setNameMessage(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSavingName(false);
    }
  }

  const filtered = useMemo(
    () => filterByMode(listings, propertyFilter),
    [listings, propertyFilter]
  );

  const grouped = useMemo(() => {
    const live = filtered.filter((l) => l.status === "live");
    const drafts = filtered.filter((l) => l.status === "draft");
    const saved = filtered.filter((l) => l.status === "expired" || l.status === "rented");
    const archived = filtered.filter((l) => l.status === "archived");
    return { live, drafts, saved, archived };
  }, [filtered]);

  const summary = useMemo(() => buildOwnerPortfolioSummary(filtered), [filtered]);

  const filterCounts = useMemo(() => {
    const rent = listings.filter((l) => l.transactionType === "rent").length;
    const sale = listings.filter((l) => l.transactionType === "sale").length;
    return { all: listings.length, rent, sale };
  }, [listings]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[var(--muted)]">Loading profile…</p>
      </div>
    );
  }

  if (!user) return null;

  if (profileError) {
    return (
      <AccountUnavailable
        message={profileError}
        onRetry={refreshProfile}
        signInHref="/auth/login?next=/profile"
      />
    );
  }

  const propertyCount = filtered.length;
  const postHref = propertyFilter === "sale" ? appPath("/buy/post") : appPath("/post");

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-28 md:pb-8">
      <h1 className="font-serif text-3xl text-[var(--brand-navy)]">Account</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Manage your profile and rental properties
      </p>

      <section className="rp-card mt-6 p-5">
        <h2 className="rp-label uppercase tracking-wider">Profile</h2>
        <form onSubmit={handleSaveName} className="mt-4 space-y-4">
          <div>
            <label htmlFor="displayName" className="text-xs font-medium text-[var(--muted)]">
              Display name
            </label>
            <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rp-input mt-1 w-full"
              placeholder="Your name"
              maxLength={80}
            />
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-[var(--muted)]">Phone</p>
              <p className="mt-1 text-[var(--text)]">
                {profile?.phone || user.phoneNumber || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--muted)]">Email</p>
              <p className="mt-1 truncate text-[var(--text)]">
                {profile?.email || user.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--muted)]">Country</p>
              <p className="mt-1 text-[var(--text)]">{profile?.homeIso || "IN"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--muted)]">Phone verified</p>
              <p className="mt-1 text-[var(--text)]">
                {phoneVerified
                  ? "Yes"
                  : requirePhoneVerification
                    ? "Required to post"
                    : "Optional — add on listing form"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={savingName}
              className="rp-btn rp-btn-primary px-5 disabled:opacity-50"
            >
              {savingName ? "Saving…" : "Save name"}
            </button>
            {nameMessage && (
              <span
                className={`text-sm ${
                  nameMessage === "Saved" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {nameMessage}
              </span>
            )}
          </div>
        </form>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-[var(--brand-navy)]">My properties</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Property details are kept when a listing expires or is marked rented. Re-list anytime.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canPostListing && (
              <Link href={postHref} className="rp-btn rp-btn-primary px-4 py-2 text-sm">
                Add property
              </Link>
            )}
            <Link
              href={appPath("/profile/billing")}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--brand-navy)]"
            >
              Billing
            </Link>
          </div>
        </div>

        <PortfolioSummaryCard summary={summary} />
        <RenewalReminderBanner listings={filtered} />

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["all", "All", filterCounts.all],
              ["rent", "Rent", filterCounts.rent],
              ["sale", "Sale", filterCounts.sale],
            ] as const
          ).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPropertyFilter(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                propertyFilter === key
                  ? "bg-[var(--brand-navy)] text-white"
                  : "border border-[var(--border)] text-[var(--brand-navy)]"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {listingsLoading && (
          <p className="mt-6 text-center text-sm text-[var(--muted)]">Loading properties…</p>
        )}

        {listingsError && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {listingsError}
          </p>
        )}

        {!listingsLoading && !listingsError && propertyCount > 0 && (
          <>
            <PropertySection title="Live on map" listings={grouped.live} />
            <PropertySection
              title="Drafts"
              description="Saved but not activated yet."
              listings={grouped.drafts}
            />
            <PropertySection
              title="Saved properties"
              description="Expired or rented — details kept. Re-list when vacant."
              listings={grouped.saved}
            />
            <PropertySection
              title="Archived"
              description="Removed from active inventory."
              listings={grouped.archived}
            />
          </>
        )}

        {!listingsLoading && !listingsError && propertyCount === 0 && listings.length > 0 && (
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            No {propertyFilter === "all" ? "" : propertyFilter} properties in this filter.
          </p>
        )}

        {!listingsLoading && !listingsError && listings.length === 0 && (
          <div className="mt-6">
            <EmptyState
              icon="🏠"
              title="No properties yet"
              description="Add your first rental property. When it expires or gets rented, we keep the details so you can re-list in a few clicks."
              actionHref={
                canPostListing ? appPath("/post") : appPath("/auth/login?next=/post")
              }
              actionLabel={canPostListing ? "Add a property" : "Sign in to post"}
            />
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
        <Link href={appPath("/saved-listings")} className="text-sm font-medium text-[var(--brand-orange)]">
          Saved listings →
        </Link>
        <Link href={appPath("/saved-searches")} className="text-sm font-medium text-[var(--brand-orange)]">
          Saved searches →
        </Link>
        <Link href={appPath("/chat")} className="text-sm font-medium text-[var(--brand-orange)]">
          Messages →
        </Link>
        <button
          type="button"
          onClick={() => signOut().then(() => router.push(appPath("/")))}
          className="text-sm font-medium text-[var(--muted)] hover:text-red-600"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
