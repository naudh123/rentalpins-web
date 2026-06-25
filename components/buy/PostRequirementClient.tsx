"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import PostAuthGate from "@/components/post/PostAuthGate";
import BuyerRequirementForm from "@/components/buy/BuyerRequirementForm";
import { appPath } from "@/lib/config";
import { BUY_REQUIREMENTS_PATH } from "@/lib/sale/buy-app-paths";

function PostRequirementContent() {
  const searchParams = useSearchParams();
  const posted = searchParams.get("posted");
  const { user, loading } = useAuth();

  if (posted) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-white p-6 text-center">
        <p className="font-semibold text-[var(--brand-navy)]">Requirement published</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sellers matching your criteria can respond through RentalPins.
        </p>
        <Link
          href={appPath(BUY_REQUIREMENTS_PATH)}
          className="rp-btn rp-btn-primary mt-4 inline-flex px-5 py-2"
        >
          View requirement board
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center text-[var(--muted)]">Loading…</p>;
  }

  if (!user) {
    return (
      <PostAuthGate
        transactionType="sale"
        redirectPath="/buy/requirements/post"
        badge="Buyer demand"
        title="Sign in to post requirement"
        description="Sign in with Google to publish your buy requirement. Your phone number stays private on the public board."
      />
    );
  }

  return <BuyerRequirementForm />;
}

export default function PostRequirementClient() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
        RentalPins Buy
      </p>
      <h1 className="mt-2 font-serif text-2xl text-[var(--brand-navy)]">Post your buy requirement</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Share budget, property type, and preferred locality. Your contact stays private on the public
        board.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-center text-[var(--muted)]">Loading…</p>}>
          <PostRequirementContent />
        </Suspense>
      </div>
    </div>
  );
}
