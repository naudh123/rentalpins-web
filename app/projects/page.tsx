import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import { appPath, siteUrl } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getAllCities } from "@/lib/cities-config";

export const metadata: Metadata = buildPageMetadata({
  title: "Real estate projects | RentalPins Buy",
  description:
    "Explore new and upcoming real estate projects across India. Compare price ranges, amenities, and book site visits on RentalPins.",
  path: "/projects",
});

const SAMPLE_PROJECTS = [
  {
    slug: "green-valley-residences",
    name: "Green Valley Residences",
    city: "Mohali",
    locality: "New Chandigarh",
    priceRange: "₹45L – ₹1.2Cr",
    types: ["2 BHK", "3 BHK", "Penthouse"],
    amenities: ["Clubhouse", "Parking", "Power backup"],
  },
  {
    slug: "tricity-heights",
    name: "Tricity Heights",
    city: "Zirakpur",
    locality: "VIP Road",
    priceRange: "₹35L – ₹90L",
    types: ["2 BHK", "3 BHK"],
    amenities: ["Gym", "Swimming pool", "24×7 security"],
  },
];

export default function ProjectsIndexPage() {
  const faqs = buildConversationalFaqs("projects", {});

  return (
    <MarketingShell>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${siteUrl}${appPath("/")}` },
          { name: "Projects", url: `${siteUrl}${appPath("/projects")}` },
        ]}
      />
      <FAQSchema faqs={faqs} />
      <article className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-serif text-3xl text-[var(--brand-navy)]">Real estate projects</h1>
        <p className="mt-4 text-[var(--muted)]">
          Discover developer projects with structured price ranges, amenities, and site visit CTAs.
          RentalPins helps buyers and investors find projects through crawlable, map-connected pages.
        </p>

        <ul className="mt-8 space-y-4">
          {SAMPLE_PROJECTS.map((p) => (
            <li key={p.slug} className="rounded-xl border border-[var(--border)] p-5">
              <h2 className="font-serif text-xl">
                <Link
                  href={appPath(`/projects/mohali/${p.slug}`)}
                  className="hover:text-[var(--brand-orange)]"
                >
                  {p.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {p.locality}, {p.city} · {p.priceRange}
              </p>
              <p className="mt-2 text-sm">{p.types.join(" · ")}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-2">
          {getAllCities()
            .filter((c) => c.status === "live")
            .slice(0, 6)
            .map((c) => (
              <Link
                key={c.slug}
                href={appPath(`/projects/${c.slug}`)}
                className="text-sm font-semibold text-[var(--brand-orange)] hover:underline"
              >
                Projects in {c.name}
              </Link>
            ))}
        </div>

        <HubFaqSection faqs={faqs} className="mt-10" />
      </article>
    </MarketingShell>
  );
}
