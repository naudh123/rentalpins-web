import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Property investment | RentalPins Invest",
  description:
    "Tricity investment decision workspace — compare corridors, underwrite yield, explore RERA projects, and discover owner-direct sale inventory on RentalPins Invest.",
  path: "/invest",
  robots: { index: true, follow: true },
});

export default function InvestLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
