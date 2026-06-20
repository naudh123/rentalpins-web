"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";
import { getClientDb } from "@/lib/firebase-client";
import { fetchBoostPlans, CREDIT_PACKS, type BoostPlanRow } from "@/lib/boost-plans";
import {
  createRazorpayOrderForCredits,
  finalizeBoost,
  verifyAndAddCredits,
} from "@/lib/callable-functions";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import { mapCallableError } from "@/lib/auth-errors";
import { appPath } from "@/lib/config";
import { parseOwnerListing } from "@/lib/my-listings";

function BoostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId") || "";
  const { user, profile, loading } = useAuth();

  const [listingTitle, setListingTitle] = useState("");
  const [listingActive, setListingActive] = useState(false);
  const [creditBalance, setCreditBalance] = useState(0);
  const [plans, setPlans] = useState<BoostPlanRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace(appPath(`/auth/login?next=/post/boost?listingId=${listingId}`));
    }
  }, [user, loading, router, listingId]);

  useEffect(() => {
    if (!user) return;
    const db = getClientDb();
    return onSnapshot(doc(db, "users", user.uid), (snap) => {
      const data = snap.data();
      setCreditBalance(Number(data?.premiumTokens) || 0);
    });
  }, [user]);

  useEffect(() => {
    if (!listingId || !user) return;
    const db = getClientDb();
    return onSnapshot(doc(db, "listings", listingId), (snap) => {
      if (!snap.exists()) {
        setListingActive(false);
        return;
      }
      const data = snap.data();
      if (String(data.ownerUid) !== user.uid) {
        setListingActive(false);
        return;
      }
      const parsed = parseOwnerListing(snap.id, data as Record<string, unknown>);
      setListingTitle(parsed?.title || "Listing");
      setListingActive(data.isActive === true);
    });
  }, [listingId, user]);

  useEffect(() => {
    if (!user) return;
    void fetchBoostPlans(getClientDb()).then(setPlans).catch(console.error);
  }, [user]);

  async function runBoost(plan: BoostPlanRow) {
    if (!listingId || !user) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      if (creditBalance < plan.creditCost) {
        setError(`Need ${plan.creditCost} credits (you have ${creditBalance}). Buy credits below.`);
        setBusy(false);
        return;
      }
      await finalizeBoost({ listingId, boostPlanId: plan.id });
      setSuccess(`Boost activated for ${plan.durationDays} days!`);
    } catch (err) {
      setError(mapCallableError(err));
    } finally {
      setBusy(false);
    }
  }

  async function buyCredits(productId: string) {
    if (!user || !profile) return;
    setBusy(true);
    setError("");
    try {
      const order = await createRazorpayOrderForCredits({ productId });
      await openRazorpayCheckout({
        key: order.key,
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        currency: order.currency,
        listingId,
        userName: profile.displayName || user.displayName || "RentalPins User",
        userEmail: profile.email || user.email || undefined,
        userPhone: profile.phone || user.phoneNumber || undefined,
        onSuccess: async () => {
          try {
            await verifyAndAddCredits({ orderId: order.orderId, productId });
            setSuccess("Credits added to your account.");
          } catch (e) {
            setError(mapCallableError(e));
          } finally {
            setBusy(false);
          }
        },
        onDismiss: () => setBusy(false),
      });
    } catch (err) {
      setError(mapCallableError(err));
      setBusy(false);
    }
  }

  if (!listingId) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-[var(--muted)]">Missing listing ID.</p>
        <Link href={appPath("/profile")} className="mt-4 text-[var(--accent)]">
          My properties
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="p-8 text-center text-[var(--muted)]">Loading…</p>;
  }

  if (!listingActive) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="font-serif text-2xl">Listing not live</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Boost is only available for live listings.
        </p>
        <Link href={appPath("/profile")} className="mt-6 text-[var(--accent)]">
          My properties
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 pb-28 md:pb-8">
      <Link href={appPath("/profile")} className="text-sm text-[var(--muted)]">
        ← My properties
      </Link>
      <h1 className="mt-4 font-serif text-2xl text-[var(--brand-navy)]">Boost listing</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{listingTitle}</p>

      <div className="rp-card mt-6 p-4">
        <p className="text-sm text-[var(--muted)]">Your credit balance</p>
        <p className="font-serif text-3xl text-[var(--brand-orange)]">{creditBalance}</p>
      </div>

      {success && (
        <p className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {success}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <h2 className="mt-8 text-sm font-semibold text-[var(--brand-navy)]">Boost plans</h2>
      <ul className="mt-3 space-y-2">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-4"
          >
            <div>
              <p className="font-medium">{plan.planName}</p>
              <p className="text-xs text-[var(--muted)]">
                {plan.durationDays} days · {plan.creditCost} credits
              </p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void runBoost(plan)}
              className="rounded-full bg-[var(--brand-orange)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              Boost
            </button>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-sm font-semibold text-[var(--brand-navy)]">Buy credits</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {CREDIT_PACKS.map((pack) => (
          <li key={pack.productId}>
            <button
              type="button"
              disabled={busy}
              onClick={() => void buyCredits(pack.productId)}
              className="w-full rounded-xl border border-[var(--border)] p-3 text-left hover:border-[var(--brand-orange)] disabled:opacity-50"
            >
              <p className="font-semibold text-[var(--brand-navy)]">{pack.credits} credits</p>
              <p className="text-xs text-[var(--muted)]">₹{pack.priceInr}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BoostPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-[var(--muted)]">Loading…</p>}>
      <BoostContent />
    </Suspense>
  );
}
