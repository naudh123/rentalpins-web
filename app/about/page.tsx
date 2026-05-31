import type { Metadata } from "next";
import MarketingShell from "@/components/MarketingShell";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About us",
  description:
    "RentalPins is a map-first rental marketplace connecting renters with owners across India (Chandigarh Tricity, Ludhiana, Delhi, Jaipur, Lucknow, Mumbai and more) and hubs in the UK, Kenya and Nigeria.",
  keywords: [
    "RentalPins",
    "about RentalPins",
    "rental marketplace India",
    "map based rentals",
  ],
  alternates: {
    canonical: canonicalUrl("/about"),
  },
  openGraph: {
    title: "About RentalPins",
    description:
      "Location-first rental marketplace — discover and list rentals on a live map.",
    url: canonicalUrl("/about"),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About RentalPins",
    description: "Map-first rentals across India and global city hubs.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function About() {
  return (
    <MarketingShell>
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-64 rounded-full bg-gradient-to-br from-[#1E3A6E]/[0.07] via-transparent to-[#E8501A]/[0.06] blur-3xl"
          aria-hidden
        />
        <h1 className="font-serif text-4xl font-bold tracking-tight text-[#1E3A6E] sm:text-5xl">
          About us
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Rent anything, anywhere — discover rentals around you.
        </p>

        <div className="mt-10 space-y-4 leading-relaxed text-slate-600">
          <p>
            <span className="font-semibold text-[#1E3A6E]">RentalPins</span> is a
            location-based rental marketplace that connects people who have
            something to rent with those who need it — right in their
            neighbourhood. Whether it&apos;s a property, equipment, vehicle, or
            everyday items, RentalPins makes it simple to discover, list, and
            book rentals nearby using real-time location technology.
          </p>
          <p>
            We believe renting should be as easy as pinning a location on a map.
            That&apos;s why we built a platform where every listing is tied to a
            real place, making rental discovery visual, local, and instant.
          </p>
        </div>

        <Section title="Who we are">
          <p className="text-slate-600">
            RentalPins is owned and operated by{" "}
            <span className="font-semibold text-[#1E3A6E]">
              Shimle Ale Sardar
            </span>
            , a registered Partnership Firm based in India. We are a team of
            builders and problem-solvers passionate about making the rental
            economy more accessible, transparent, and community-driven. Our
            platform is designed to serve users globally — from individuals
            looking for a short-term rental to businesses managing multiple
            listings across cities.
          </p>
        </Section>

        <Section title="What we do">
          <p className="mb-4 text-slate-600">
            RentalPins is built around one core idea: location-first rental
            discovery. Here&apos;s how the platform works:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon="📍"
              title="Discover nearby rentals"
              description="Browse rental listings pinned on an interactive map. Find what's available around you — sorted by distance, category, and price."
            />
            <FeatureCard
              icon="📝"
              title="List in minutes"
              description="Create a rental listing with photos, pricing, and availability. Your listing is automatically pinned to your location for maximum visibility."
            />
            <FeatureCard
              icon="🔒"
              title="Verified users"
              description="Every user verifies their mobile number via OTP during sign-up, ensuring a trusted community of renters and listers."
            />
            <FeatureCard
              icon="💳"
              title="Secure payments"
              description="All transactions are processed securely through Razorpay. Pay with confidence using UPI, cards, net banking, and more."
            />
            <FeatureCard
              icon="🔔"
              title="Real-time alerts"
              description="Get instant push notifications on booking requests, messages, and updates — so you never miss a rental opportunity."
            />
            <FeatureCard
              icon="🌍"
              title="Built for scale"
              description="Whether you're renting in one city or managing listings across the country, RentalPins is built as a global SaaS platform ready to grow with you."
            />
          </div>
        </Section>

        <Section title="Our mission">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-6 shadow-sm">
            <p className="text-lg italic leading-relaxed text-slate-700">
              &quot;To make renting anything, anywhere as simple as dropping a
              pin — by connecting communities through location-powered technology
              and building a rental ecosystem that is transparent, accessible,
              and trusted.&quot;
            </p>
          </div>
        </Section>

        <Section title="Why RentalPins?">
          <ul className="list-disc space-y-3 pl-5 text-slate-600">
            <li>
              <span className="font-medium text-slate-900">
                Location-first approach:
              </span>{" "}
              Every listing is pinned to a real location, making search results
              hyper-relevant to where you are.
            </li>
            <li>
              <span className="font-medium text-slate-900">
                For renters & listers:
              </span>{" "}
              Whether you&apos;re looking to rent or earn from your idle assets,
              RentalPins serves both sides of the marketplace.
            </li>
            <li>
              <span className="font-medium text-slate-900">
                Mobile-first design:
              </span>{" "}
              Designed for on-the-go use with a seamless mobile app experience
              on Android.
            </li>
            <li>
              <span className="font-medium text-slate-900">Trust & safety:</span>{" "}
              OTP-verified users, secure payments via Razorpay, and transparent
              listings create a safe rental environment.
            </li>
            <li>
              <span className="font-medium text-slate-900">No hidden fees:</span>{" "}
              What you see is what you pay. We believe in clear, upfront pricing
              for every rental.
            </li>
          </ul>
        </Section>

        <Section title="Get in touch">
          <p className="mb-4 text-slate-600">
            Have questions, feedback, or partnership inquiries? We&apos;d love to
            hear from you.
          </p>
          <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-600">
              <span className="font-medium text-slate-900">Operated by:</span>{" "}
              Shimle Ale Sardar (Partnership Firm)
            </p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-900">Email:</span>{" "}
              <a
                href="mailto:support@rentalpins.com"
                className="font-medium text-[#1E3A6E] underline decoration-[#E8501A]/40 underline-offset-2 hover:text-[#E8501A]"
              >
                support@rentalpins.com
              </a>
            </p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-900">Website:</span>{" "}
              <a
                href="https://www.rentalpins.com"
                className="font-medium text-[#1E3A6E] underline decoration-[#E8501A]/40 underline-offset-2 hover:text-[#E8501A]"
              >
                www.rentalpins.com
              </a>
            </p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-900">Address:</span>{" "}
              [Ludhiana 141205]
            </p>
          </div>
        </Section>
      </div>
    </MarketingShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 border-b border-slate-200 pb-3 font-serif text-2xl font-bold text-[#1E3A6E]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 text-2xl">{icon}</div>
      <h3 className="mb-1 font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
