"use client";

import Link from "next/link";
import { appPath } from "@/lib/config";
import { formatListingPrice } from "@/lib/listing-price";

export interface AgentListingPreview {
  id: string;
  title: string;
  price: number;
  location: string;
  path: string;
  imageUrl?: string;
}

interface Props {
  listings: AgentListingPreview[];
  transactionType?: "rent" | "sale";
}

export default function AgentListingCards({ listings, transactionType = "rent" }: Props) {
  if (listings.length === 0) return null;

  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {listings.map((listing) => {
        const priceLabel = formatListingPrice({
          price: listing.price,
          transactionType,
          category: "Property",
        });

        return (
          <Link
            key={listing.id}
            href={appPath(listing.path)}
            className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2.5 transition hover:border-[var(--accent)]"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-navy)]/10 text-lg text-[var(--brand-navy)]">
              {listing.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.imageUrl}
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                "⌂"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--brand-navy)]">
                {listing.title}
              </p>
              <p className="text-xs font-bold text-[var(--accent)]">{priceLabel}</p>
              <p className="truncate text-[11px] text-[var(--muted)]">{listing.location}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
