import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import PostProjectForm from "@/components/builders/PostProjectForm";
import { BuilderLuxuryShell } from "@/components/builders/luxury/LuxuryUI";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "List your project on RentalPins",
  description:
    "Developers and colonizers: create a free project microsite on RentalPins. We capture buyer enquiries and deliver qualified leads to you.",
  path: "/projects/post",
  noIndex: true,
});

export default function PostProjectPage() {
  return (
    <MarketingShell>
      <BuilderLuxuryShell>
        <div className="mx-auto max-w-2xl px-4 py-12">
          <p className="lux-eyebrow">For developers</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[var(--brand-navy)]">
            List your project
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            Create your microsite in minutes for Chandigarh Tricity. Buyer phone and email are
            captured on every enquiry — we qualify and sell you verified leads.
          </p>
          <div className="mt-8">
            <PostProjectForm />
          </div>
        </div>
      </BuilderLuxuryShell>
    </MarketingShell>
  );
}
