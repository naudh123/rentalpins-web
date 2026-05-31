"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { appPath } from "@/lib/config";
import { safeReturnPath } from "@/lib/listing-links";
import { trackEvent } from "@/lib/ga4";

interface Props {
  listingId?: string;
}

function backMeta(href: string): { label: string; destination: string } {
  if (href.includes("/search")) {
    return { label: "Back to map", destination: "map" };
  }
  if (href.includes("/rentals")) {
    return { label: "Back to city", destination: "city" };
  }
  if (href.includes("/saved-listings")) {
    return { label: "Back to saved", destination: "saved" };
  }
  if (href.includes("/chat")) {
    return { label: "Back to messages", destination: "chat" };
  }
  if (/\/u\/[^/]+/.test(href)) {
    return { label: "Back to profile", destination: "profile" };
  }
  const home = appPath("/");
  if (href === home || href.endsWith(`${home}/`)) {
    return { label: "Back to home", destination: "home" };
  }
  return { label: "Back", destination: "other" };
}

export default function ListingBackLink({ listingId }: Props) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const href = safeReturnPath(from);
  const { label, destination } = backMeta(href);

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-orange)] hover:underline"
      onClick={() =>
        trackEvent("listing_back_clicked", {
          destination,
          has_from_param: from ? "yes" : "no",
          ...(listingId ? { listing_id: listingId } : {}),
        })
      }
    >
      ← {label}
    </Link>
  );
}
