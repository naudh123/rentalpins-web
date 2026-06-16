import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import ComingSoonPlaceholder from "@/components/marketing/ComingSoonPlaceholder";
import { appPath } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** TODO: Full RentalPins Invest — growth corridors, market reports, project insights. */
export const metadata: Metadata = buildPageMetadata({
  title: "Property investment | RentalPins Invest",
  description:
    "Explore growth corridors and investment-ready property opportunities on RentalPins. Market intelligence launching soon.",
  path: "/invest",
  robots: { index: false, follow: true },
});

export default function InvestPage() {
  return (
    <MarketingShell>
      <ComingSoonPlaceholder
        eyebrow="RentalPins Invest"
        title="Investment intelligence is coming soon"
        description="Compare locations, discover growth corridors, and explore investment-ready property opportunities across Chandigarh Tricity and beyond."
        primaryCta={{ label: "Browse properties for sale", href: "/buy/search" }}
        secondaryCta={{ label: "Back to homepage", href: "/" }}
      />
    </MarketingShell>
  );
}
