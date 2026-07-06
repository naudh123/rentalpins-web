import type { Metadata } from "next";
import InvestAreaCompareClient from "@/components/invest/InvestAreaCompareClient";
import InvestPageHero from "@/components/invest/InvestPageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { INVEST_COMPARE_PATH } from "@/lib/invest/invest-paths";

export const metadata: Metadata = buildPageMetadata({
  title: "Compare investment areas | RentalPins Invest",
  description:
    "Side-by-side investor profiles for Mohali, Zirakpur, Kharar, and Panchkula — yield style, appreciation, liquidity, and map links.",
  path: INVEST_COMPARE_PATH,
});

export default function InvestComparePage() {
  return (
    <>
      <InvestPageHero
        title="Compare Tricity investment areas"
        subtitle="Select two to four hubs to compare budget bands, yield characteristics, risks, and links to buy map, rent comps, and guides."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <InvestAreaCompareClient />
      </div>
    </>
  );
}
