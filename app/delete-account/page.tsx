import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Delete Account",
  description: "Request deletion of your RentalPins account and associated data.",
  alternates: {
    canonical: canonicalUrl("/delete-account"),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function DeleteAccountPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1E3A6E] sm:text-4xl">
          Delete your RentalPins account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Account and data deletion request
        </p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-lg font-bold text-[#1E3A6E]">
            To request deletion of your account and associated data
          </h2>
          <p className="mt-4 leading-relaxed text-slate-700">
            Send an email to{" "}
            <a
              href="mailto:support@rentalpins.com"
              className="font-semibold text-[#E8501A] underline decoration-[#1E3A6E]/20 underline-offset-2 hover:text-[#c44215]"
            >
              support@rentalpins.com
            </a>{" "}
            with the subject line{" "}
            <strong>&quot;Delete My Account&quot;</strong> and include the email
            address or phone number associated with your RentalPins account.
          </p>

          <h2 className="mt-10 text-lg font-bold text-[#1E3A6E]">What gets deleted</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Profile information (name, email, phone, profile photo)</li>
            <li>All rental listings and associated images</li>
            <li>Saved searches and preferences</li>
            <li>Message history</li>
            <li>Location data tied to your account</li>
          </ul>

          <h2 className="mt-10 text-lg font-bold text-[#1E3A6E]">Timeline</h2>
          <p className="mt-4 leading-relaxed text-slate-700">
            Account deletion requests are processed within{" "}
            <strong>7 business days</strong>. You will receive a confirmation email
            once your data has been permanently removed. Some data may be retained
            for up to 30 days in encrypted backups before being fully purged.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
