import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "RentalPins refund and cancellation policy — how bookings and provider policies work on the rental marketplace.",
  keywords: ["RentalPins refunds", "cancellation policy"],
  alternates: {
    canonical: canonicalUrl("/refund-policy"),
  },
  openGraph: {
    title: "Refund Policy | RentalPins",
    description: "Refunds and cancellations on RentalPins.",
    url: canonicalUrl("/refund-policy"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | RentalPins",
    description: "RentalPins refund and cancellation information.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RefundPolicy() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-[#1E3A6E]">
          Refund &amp; cancellation policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: May 10, 2026</p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm leading-relaxed text-slate-700">
          <p>
            Refunds and cancellations are subject to the policies of the individual
            service providers and the terms shown at checkout in the RentalPins app
            where applicable. RentalPins does not guarantee refunds and acts as a
            platform connecting users; disputes between renters and listers should
            be raised via support where the transaction was facilitated.
          </p>
          <p className="mt-6">
            For questions, contact{" "}
            <a
              href="mailto:support@rentalpins.com"
              className="font-semibold text-[#1E3A6E] hover:text-[#E8501A]"
            >
              support@rentalpins.com
            </a>
            .
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
