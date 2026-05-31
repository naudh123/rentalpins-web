import {
  ownerHasContactPhone,
  type OwnerTrust,
} from "@/lib/owner-trust";
import OwnerTrustBadges from "@/components/listings/OwnerTrustBadges";
import ListingOwnerProfileLink from "@/components/listings/ListingOwnerProfileLink";

interface Props {
  ownerTrust: OwnerTrust | null;
  ownerPhone: string;
  ownerUid: string;
  listingId: string;
}

export default function ListingOwnerTrust({
  ownerTrust,
  ownerPhone,
  ownerUid,
  listingId,
}: Props) {
  const hasContact = ownerHasContactPhone(ownerTrust, ownerPhone);
  if (!hasContact && !ownerTrust?.displayName) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-3">
      <OwnerTrustBadges
        phoneVerified={Boolean(ownerTrust?.phoneVerified)}
        showDirectContact={hasContact}
      />
      {ownerTrust?.displayName && (
        <span className="text-xs text-[var(--muted)]">
          Listed by{" "}
          {ownerUid ? (
            <ListingOwnerProfileLink
              ownerUid={ownerUid}
              displayName={ownerTrust.displayName}
              listingId={listingId}
              linkSource="trust_line"
            />
          ) : (
            <span className="font-medium text-[var(--text)]">{ownerTrust.displayName}</span>
          )}
        </span>
      )}
    </div>
  );
}
