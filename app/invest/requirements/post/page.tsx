import type { Metadata } from "next";
import Link from "next/link";
import InvestRequirementForm from "@/components/invest/InvestRequirementForm";
import InvestPageHero from "@/components/invest/InvestPageHero";
import BuyerRequirementsBoard from "@/components/buy/BuyerRequirementsBoard";
import { appPath } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { INVEST_REQUIREMENTS_POST_PATH } from "@/lib/invest/invest-paths";

export const metadata: Metadata = buildPageMetadata({
  title: "Post investor requirement | RentalPins Invest",
  description:
    "Tell sellers and developers what you want to buy for investment — budget, hold period, target yield, and tenant profile on RentalPins.",
  path: INVEST_REQUIREMENTS_POST_PATH,
  robots: { index: false, follow: true },
});

export default function InvestRequirementsPostPage() {
  return (
    <>
      <InvestPageHero
        title="Post investor requirement"
        subtitle="Publish verified buyer demand with investment-specific fields. Your phone stays private on the public board."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-card)]">
            <InvestRequirementForm />
          </div>
          <div>
            <BuyerRequirementsBoard purposeFilter="Investment" />
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          Also browse{" "}
          <Link href={appPath("/buy/requirements")} className="font-semibold text-[var(--invest-emerald)] hover:underline">
            all buyer requirements
          </Link>
        </p>
      </div>
    </>
  );
}
