import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Contact RentalPins for support, partnerships, press and account help. Map-based rentals across India and international hubs.",
  keywords: ["RentalPins contact", "rental support India", "RentalPins help"],
  alternates: {
    canonical: canonicalUrl("/contact"),
  },
  openGraph: {
    title: "Contact RentalPins",
    description: "Reach RentalPins for support and partnerships.",
    url: canonicalUrl("/contact"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact RentalPins",
    description: "Support and enquiries for the RentalPins marketplace.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function Contact() {
  return (
    <MarketingShell>
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-64 rounded-full bg-gradient-to-br from-[#1E3A6E]/[0.07] via-transparent to-[#E8501A]/[0.06] blur-3xl"
          aria-hidden
        />
        <h1 className="font-serif text-4xl font-bold tracking-tight text-[#1E3A6E] sm:text-5xl">
          Contact us
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          We&apos;re here to help. Reach out anytime.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <ContactCard
            icon="✉️"
            label="Email us"
            value="support@rentalpins.com"
            href="mailto:support@rentalpins.com"
            description="General queries, support, and feedback. We typically respond within 24 hours."
          />
          <ContactCard
            icon="📞"
            label="Call us"
            value="+91-9915209240"
            href="tel:+919915209240"
            description="Monday to Saturday, 10:00 AM — 6:00 PM IST."
          />
          <ContactCard
            icon="🌐"
            label="Website"
            value="www.rentalpins.com"
            href="https://www.rentalpins.com"
            description="Explore city hubs, blog, and company information."
          />
          <ContactCard
            icon="📍"
            label="Office"
            value="[Ludhiana 141205]"
            description="Shimle Ale Sardar (Partnership Firm), trading as RentalPins."
          />
        </div>

        <section className="mt-14">
          <h2 className="mb-6 border-b border-slate-200 pb-3 font-serif text-2xl font-bold text-[#1E3A6E]">
            How can we help?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <HelpCard
              title="General support"
              description="Account, listings, or bookings — our team is ready to assist."
              email="support@rentalpins.com"
            />
            <HelpCard
              title="Business & partnerships"
              description="Integrations, partnerships, or press — we would love to hear from you."
              email="support@rentalpins.com"
            />
            <HelpCard
              title="Grievances"
              description="Complaints are acknowledged within 24 hours per our policy."
              email="support@rentalpins.com"
            />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="mb-4 border-b border-slate-200 pb-3 font-serif text-2xl font-bold text-[#1E3A6E]">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            <FaqItem
              question="How do I create a rental listing?"
              answer="Use the RentalPins Android app or website at www.rentalpins.com: sign up with your mobile number and create a listing. Add photos and price; your listing is pinned to your location."
            />
            <FaqItem
              question="Is RentalPins free to use?"
              answer="Signing up and browsing is free. Listing and booking terms are described in our Terms and in-app pricing where applicable."
            />
            <FaqItem
              question="How are payments processed?"
              answer="Payments are handled securely through Razorpay where offered — UPI, cards, net banking, and more."
            />
            <FaqItem
              question="How do I verify my account?"
              answer="During sign-up you verify your mobile number via OTP. This helps keep the community trusted."
            />
            <FaqItem
              question="I have a complaint. What should I do?"
              answer="Email support@rentalpins.com with details. Our Grievance Officer will acknowledge within 24 hours and work toward resolution per our timelines."
            />
          </div>
        </section>
      </div>
    </MarketingShell>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  description,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 text-2xl">{icon}</div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          className="break-all text-lg font-semibold text-[#1E3A6E] underline decoration-[#E8501A]/30 underline-offset-2 hover:text-[#E8501A]"
        >
          {value}
        </a>
      ) : (
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

function HelpCard({
  title,
  description,
  email,
}: {
  title: string;
  description: string;
  email: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-2 font-semibold text-slate-900">{title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-slate-600">
        {description}
      </p>
      <a
        href={`mailto:${email}`}
        className="mt-4 inline-block text-sm font-medium text-[#1E3A6E] hover:text-[#E8501A]"
      >
        {email} →
      </a>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm open:shadow-md">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-slate-900 transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        {question}
        <span className="shrink-0 text-xl leading-none text-slate-400 transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="border-t border-slate-100 px-5 pb-4 pt-0 text-sm leading-relaxed text-slate-600">
        {answer}
      </div>
    </details>
  );
}
