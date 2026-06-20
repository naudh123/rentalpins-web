import Link from "next/link";
import { appPath } from "@/lib/config";
import type { OwnerListing } from "@/lib/my-listings";
import { daysUntilMs } from "@/lib/owner-listing-lifecycle";
import { ownerListingRenewPath } from "@/lib/listing-path";

interface Props {
  listings: OwnerListing[];
}

export default function RenewalReminderBanner({ listings }: Props) {
  const expiring = listings.filter((l) => {
    if (l.status !== "live") return false;
    const days = daysUntilMs(l.listingExpiresAtMs);
    return days != null && days <= 3;
  });

  if (!expiring.length) return null;

  const first = expiring[0];

  return (
    <div className="mt-4 rounded-[var(--radius-lg)] border border-amber-200 bg-amber-50 p-4">
      <p className="font-medium text-amber-900">
        {expiring.length === 1
          ? `"${first.title}" expires soon`
          : `${expiring.length} listings expire within 3 days`}
      </p>
      <p className="mt-1 text-sm text-amber-800/90">
        Renew your plan to stay visible on the map without a gap.
      </p>
      <Link
        href={ownerListingRenewPath(first.id)}
        className="mt-3 inline-block rounded-full bg-amber-800 px-4 py-1.5 text-xs font-semibold text-white hover:brightness-105"
      >
        Renew plan
      </Link>
    </div>
  );
}
