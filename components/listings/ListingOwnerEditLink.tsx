"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { ownerListingEditPath } from "@/lib/listing-path";
import type { TransactionType } from "@/lib/transaction-type";

interface Props {
  listingId: string;
  ownerUid: string;
  transactionType?: TransactionType;
}

export default function ListingOwnerEditLink({
  listingId,
  ownerUid,
  transactionType,
}: Props) {
  const { user } = useAuth();

  if (!user || user.uid !== ownerUid) return null;

  return (
    <Link
      href={ownerListingEditPath({ id: listingId, transactionType })}
      className="text-sm font-medium text-[var(--accent)] hover:underline"
    >
      Edit listing
    </Link>
  );
}
