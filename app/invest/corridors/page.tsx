import type { Metadata } from "next";
import InvestCorridorExplorerClient from "@/components/invest/InvestCorridorExplorerClient";
import InvestPageHero from "@/components/invest/InvestPageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { INVEST_CORRIDORS_PATH } from "@/lib/invest/invest-paths";

export const metadata: Metadata = buildPageMetadata({
  title: "Growth corridors | RentalPins Invest",
  description:
    "Explore Tricity investment corridors — Mohali IT Park, Zirakpur VIP, Kharar–CU, New Chandigarh, Kurali–Banur GMADA, and Aerocity.",
  path: INVEST_CORRIDORS_PATH,
});

export default function InvestCorridorsPage() {
  return (
    <>
      <InvestPageHero
        title="Growth corridor explorer"
        subtitle="Tricity-native belts with strategy tags, budget bands, buy map deep links, rent comps, and investment guides."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <InvestCorridorExplorerClient />
      </div>
    </>
  );
}
