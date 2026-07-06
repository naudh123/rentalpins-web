import InvestHubClient from "@/components/invest/InvestHubClient";
import InvestPageHero from "@/components/invest/InvestPageHero";
import { INVEST_HUB } from "@/lib/invest/invest-hub-content";

export default function InvestPage() {
  return (
    <>
      <InvestPageHero title={INVEST_HUB.title} subtitle={INVEST_HUB.subtitle} />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <InvestHubClient />
      </div>
    </>
  );
}
