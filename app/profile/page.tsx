"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import AccountUnavailable from "@/components/auth/AccountUnavailable";
import MyListingRow from "@/components/profile/MyListingRow";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/components/providers/AuthProvider";
import { mapAuthError } from "@/lib/auth-errors";
import { getClientDb } from "@/lib/firebase-client";
import { parseOwnerListing, type OwnerListing } from "@/lib/my-listings";
import { appPath, requirePhoneVerification } from "@/lib/config";

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
    const q = query(collection(db, "listings"), where("ownerUid", "==", user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs
          .map((d) => parseOwnerListing(d.id, d.data() as Record<string, unknown>))
          .filter((l): l is OwnerListing => l !== null)
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setListings(rows);
        setListingsLoading(false);
        setListingsError("");
      },
      (err) => {
        console.error("my listings", err);
        setListingsError(mapAuthError(err));
        setListingsLoading(false);
      }
    );
    return () => unsub();
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

  const liveCount = listings.filter((l) => l.isActive).length;
  const draftCount = listings.length - liveCount;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-28 md:pb-8">
      <h1 className="font-serif text-3xl text-[var(--brand-navy)]">Account</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Manage your profile and listings
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
                {phoneVerified ? "Yes" : requirePhoneVerification ? "Required to post" : "Optional"}
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
            <h2 className="font-serif text-xl text-[var(--brand-navy)]">My listings</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {liveCount} live · {draftCount} draft
            </p>
          </div>
          {canPostListing && (
            <Link href={appPath("/post")} className="rp-btn rp-btn-primary px-4 py-2 text-sm">
              Post new
            </Link>
          )}
        </div>

        {listingsLoading && (
          <p className="mt-6 text-center text-sm text-[var(--muted)]">Loading listings…</p>
        )}

        {listingsError && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {listingsError}
          </p>
        )}

        {!listingsLoading && !listingsError && listings.length > 0 && (
          <ul className="mt-4 space-y-2">
            {listings.map((l) => (
              <li key={l.id}>
                <MyListingRow listing={l} />
              </li>
            ))}
          </ul>
        )}

        {!listingsLoading && !listingsError && listings.length === 0 && (
          <div className="mt-6">
            <EmptyState
              icon="📋"
              title="No listings yet"
              description="Post your first rental and activate it with a plan to go live on the map."
              actionHref={
                canPostListing
                  ? appPath("/post")
                  : appPath("/auth/login?next=/post")
              }
              actionLabel={canPostListing ? "Post a listing" : "Sign in to post"}
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
