import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ListingCard from "@/components/listings/ListingCard";
import OwnerTrustBadges from "@/components/listings/OwnerTrustBadges";
import OwnerProfileShareButton from "@/components/listings/OwnerProfileShareButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { appPath, siteUrl } from "@/lib/config";
import { fetchMoreFromOwner } from "@/lib/listings";
import { fetchOwnerTrust } from "@/lib/owner-trust";

interface Props {
  params: Promise<{ uid: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid } = await params;
  const ownerTrust = await fetchOwnerTrust(uid);
  const ownerName = ownerTrust?.displayName || "Lister";
  const canonical = `${siteUrl}${appPath(`/u/${uid}`)}`;

  return {
    title: `${ownerName} listings | RentalPins`,
    description: `Active listings from ${ownerName} on RentalPins.`,
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

export default async function OwnerStorefrontPage({ params }: Props) {
  const { uid } = await params;
  const ownerTrust = await fetchOwnerTrust(uid);
  const listings = await fetchMoreFromOwner(uid, "", 24);

  if (!ownerTrust && listings.length === 0) notFound();

  const ownerName = ownerTrust?.displayName || "This lister";
  const profileUrl = `${siteUrl}${appPath(`/u/${uid}`)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8">
      <Breadcrumbs
        className="mb-4"
        items={[
          { label: "Home", href: appPath("/") },
          { label: "Map", href: appPath("/search") },
          { label: ownerName },
        ]}
      />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="rp-badge">Public profile</p>
          <h1 className="mt-2 font-serif text-2xl tracking-tight md:text-3xl">
            {ownerName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-sm text-[var(--muted)]">
              {listings.length} active {listings.length === 1 ? "listing" : "listings"}
            </p>
            <OwnerTrustBadges phoneVerified={Boolean(ownerTrust?.phoneVerified)} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <OwnerProfileShareButton
            ownerUid={uid}
            ownerName={ownerName}
            profileUrl={profileUrl}
          />
          <Link href={appPath("/search")} className="rp-btn rp-btn-secondary px-4 py-2 text-sm">
            Back to map
          </Link>
        </div>
      </div>

      {listings.length > 0 ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              source="list"
              returnPath={appPath(`/u/${uid}`)}
            />
          ))}
        </div>
      ) : (
        <div className="rp-card mt-10 p-10 text-center">
          <p className="text-4xl opacity-30" aria-hidden>
            🏠
          </p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            No active listings from this lister right now.
          </p>
          <Link href={appPath("/search")} className="rp-btn rp-btn-primary mt-6 inline-flex">
            Browse map
          </Link>
        </div>
      )}
    </div>
  );
}
