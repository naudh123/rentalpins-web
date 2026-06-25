"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { appPath } from "@/lib/config";
import {
  deactivateBuyerRequirement,
  subscribePublicRequirements,
} from "@/lib/buyer-requirements";
import type { BuyerRequirement } from "@/lib/types/buyer-requirement";
import BuyerRequirementCard from "@/components/buy/BuyerRequirementCard";
import { BUY_REQUIREMENTS_PATH } from "@/lib/sale/buy-app-paths";

interface Props {
  city?: string;
}

export default function BuyerRequirementsBoard({ city }: Props) {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsub = subscribePublicRequirements(
      (items) => {
        setRequirements(items);
        setLoading(false);
        setError("");
      },
      { city, max: 24 },
      () => {
        setLoading(false);
        setError("Could not load requirements. Try again later.");
      }
    );
    return unsub;
  }, [city]);

  async function handleDeactivate(id: string) {
    if (!user) return;
    try {
      await deactivateBuyerRequirement(id);
    } catch {
      setError("Could not update requirement.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-[var(--brand-navy)]">Active buyer requirements</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Real demand from verified buyers — contact details stay private on the public board.
          </p>
        </div>
        <Link
          href={appPath(`${BUY_REQUIREMENTS_PATH}/post`)}
          className="rp-btn rp-btn-primary px-5 py-2.5 text-sm"
        >
          Post requirement
        </Link>
      </div>

      {loading && (
        <p className="mt-8 text-center text-sm text-[var(--muted)]">Loading requirements…</p>
      )}

      {error && !loading && (
        <p className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 text-sm text-[var(--muted)]">
          {error}{" "}
          <Link href={appPath(`${BUY_REQUIREMENTS_PATH}/post`)} className="font-semibold text-[var(--sale-gold)]">
            Post the first requirement →
          </Link>
        </p>
      )}

      {!loading && !error && requirements.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
          <p className="text-[var(--muted)]">No active requirements yet in this area.</p>
          <Link
            href={appPath(`${BUY_REQUIREMENTS_PATH}/post`)}
            className="mt-4 inline-block text-sm font-semibold text-[var(--sale-gold)] hover:underline"
          >
            Be the first to post →
          </Link>
        </div>
      )}

      {!loading && requirements.length > 0 && (
        <ul className="mt-6 space-y-4">
          {requirements.map((req) => (
            <BuyerRequirementCard
              key={req.id}
              requirement={req}
              showOwnerActions={Boolean(user && user.uid === req.userId)}
              onDeactivate={handleDeactivate}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
