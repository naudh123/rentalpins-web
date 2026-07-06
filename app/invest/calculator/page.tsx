import type { Metadata } from "next";
import InvestPageHero from "@/components/invest/InvestPageHero";
import InvestYieldCalculator from "@/components/invest/InvestYieldCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { INVEST_CALCULATOR_PATH } from "@/lib/invest/invest-paths";

export const metadata: Metadata = buildPageMetadata({
  title: "Investment yield calculator | RentalPins Invest",
  description:
    "Model gross and net rental yield, EMI, cash flow, and break-even rent for Tricity property investments. Indicative only — verify with live rent comps.",
  path: INVEST_CALCULATOR_PATH,
});

export default async function InvestCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const price = typeof params.price === "string" ? params.price : undefined;
  const rent = typeof params.rent === "string" ? params.rent : undefined;

  return (
    <>
      <InvestPageHero
        title="Yield & cash-flow calculator"
        subtitle="Underwrite rental yield with your buy price, loan terms, expected rent, and maintenance. Pull rent comps from the rent map before finalising assumptions."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <InvestYieldCalculator initialBuyLakh={price ?? "75"} initialRentK={rent ?? "22"} />
      </div>
    </>
  );
}
