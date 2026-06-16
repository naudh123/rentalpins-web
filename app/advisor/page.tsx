import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import ComingSoonPlaceholder from "@/components/marketing/ComingSoonPlaceholder";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** TODO: AI property advisor — budget, purpose, and timeline-based location shortlist. */
export const metadata: Metadata = buildPageMetadata({
  title: "AI property advisor | RentalPins",
  description:
    "Use RentalPins AI to shortlist rent, buy, or investment locations based on your budget and goals. Advisor launching soon.",
  path: "/advisor",
  robots: { index: false, follow: true },
});

export default function AdvisorPage() {
  return (
    <MarketingShell>
      <ComingSoonPlaceholder
        eyebrow="RentalPins AI"
        title="AI property advisor"
        description="Tell us your budget, purpose, and timeline — we will shortlist map areas for rent, buy, invest, or commercial use. Launching soon."
        primaryCta={{ label: "Open rent map", href: "/search" }}
        secondaryCta={{ label: "Open buy map", href: "/buy/search" }}
      />
    </MarketingShell>
  );
}
