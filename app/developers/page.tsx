import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import ComingSoonPlaceholder from "@/components/marketing/ComingSoonPlaceholder";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** TODO: Developer marketplace — project listings, leads, site visits, brochure downloads. */
export const metadata: Metadata = buildPageMetadata({
  title: "Developers | RentalPins Buy",
  description:
    "Showcase projects, capture qualified buyer leads, and reach serious property seekers on the RentalPins buy map.",
  path: "/developers",
  robots: { index: false, follow: true },
});

export default function DevelopersPage() {
  return (
    <MarketingShell>
      <ComingSoonPlaceholder
        eyebrow="RentalPins for developers"
        title="Developer marketplace"
        description="List projects, capture buyer leads, and reach serious property seekers through map-based discovery. Full developer hub launching soon."
        primaryCta={{ label: "List property for sale", href: "/buy/post" }}
        secondaryCta={{ label: "Browse buy map", href: "/buy/search" }}
      />
    </MarketingShell>
  );
}
