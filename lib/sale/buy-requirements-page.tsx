import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import { appPath, siteUrl } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getCityBySlug, getAllCities } from "@/lib/cities-config";
import { BUY_REQUIREMENTS_PATH } from "@/lib/sale/buy-app-paths";

function requirementsPath(city?: string, locality?: string): string {
  if (city && locality) return `/buy/requirements/${city}/${locality}`;
  if (city) return `/buy/requirements/${city}`;
  return BUY_REQUIREMENTS_PATH;
}

export async function buyRequirementsMetadata(
  city?: string,
  locality?: string
): Promise<Metadata> {
  if (!city) {
    return buildPageMetadata({
      title: "Buyer requirements | RentalPins Buy",
      description:
        "Post your property buy requirement — budget, location, and property type. Connect with sellers and developers on RentalPins.",
      path: BUY_REQUIREMENTS_PATH,
      robots: { index: true, follow: true },
    });
  }
  const cityConfig = getCityBySlug(city);
  const place = locality
    ? `${locality.replace(/-/g, " ")}, ${cityConfig?.name ?? city}`
    : (cityConfig?.name ?? city);
  return buildPageMetadata({
    title: `Buyer requirements in ${place}`,
    description: `Active buyer requirements for property in ${place}. Sellers and developers can respond through RentalPins with privacy-protected contact.`,
    path: requirementsPath(city, locality),
  });
}

export async function BuyRequirementsSeoPage({
  city,
  locality,
}: {
  city?: string;
  locality?: string;
}) {
  const cityConfig = city ? getCityBySlug(city) : null;
  if (city && (!cityConfig || cityConfig.status !== "live")) notFound();

  const place = city
    ? locality
      ? `${locality.replace(/-/g, " ")}, ${cityConfig!.name}`
      : cityConfig!.name
    : "India";

  const faqs = buildConversationalFaqs("buy-requirements", {
    city: cityConfig?.name ?? "Mohali",
    locality: locality?.replace(/-/g, " "),
  });

  const sampleRequirements = [
    {
      id: "req-1",
      propertyType: "2–3 BHK Flat",
      budget: "₹50L – ₹80L",
      locality: locality?.replace(/-/g, " ") ?? "Phase 7 / Sector 70",
      timeline: "Within 3 months",
      purpose: "Self use",
      contact: "Verified buyer · contact via RentalPins",
    },
    {
      id: "req-2",
      propertyType: "Plot / Villa",
      budget: "₹1Cr+",
      locality: cityConfig?.name ?? "Mohali",
      timeline: "Flexible",
      purpose: "Investment",
      contact: "Verified buyer · contact via RentalPins",
    },
  ];

  return (
    <MarketingShell>
      <FAQSchema faqs={faqs} />
      <section className="rp-gradient-hero">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--sale-gold)]">
            RentalPins Buy
          </p>
          <h1 className="mt-3 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">
            {city ? `Buyer requirements in ${place}` : "Buyer requirement board"}
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            Buyers post budget, property type, and preferred locality. Sellers and developers respond
            through RentalPins — personal phone numbers are not exposed publicly on requirement
            cards.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={appPath("/buy/search")} className="rp-btn rp-btn-primary px-6 py-3">
              Browse sale listings
            </Link>
            <Link href={appPath(BUY_REQUIREMENTS_PATH)} className="rp-btn rp-btn-secondary px-6 py-3">
              Post requirement
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="font-serif text-2xl">Sample buyer requirements</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Illustrative cards — full authenticated requirement board launching soon.
        </p>
        <ul className="mt-6 space-y-4">
          {sampleRequirements.map((req) => (
            <li
              key={req.id}
              className="rounded-xl border border-[var(--border)] bg-white p-5"
            >
              <h3 className="font-semibold text-[var(--brand-navy)]">{req.propertyType}</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[var(--muted)]">Budget</dt>
                  <dd>{req.budget}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Preferred locality</dt>
                  <dd>{req.locality}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Timeline</dt>
                  <dd>{req.timeline}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Purpose</dt>
                  <dd>{req.purpose}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-[var(--muted)]">{req.contact}</p>
              <Link
                href={appPath("/buy/post")}
                className="mt-3 inline-block text-sm font-semibold text-[var(--sale-gold)] hover:underline"
              >
                I have a matching property →
              </Link>
            </li>
          ))}
        </ul>

        {city && (
          <div className="mt-8">
            <h3 className="font-semibold">Other cities</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {getAllCities()
                .filter((c) => c.status === "live" && c.slug !== city)
                .slice(0, 6)
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={appPath(requirementsPath(c.slug))}
                      className="text-sm text-[var(--brand-orange)] hover:underline"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <HubFaqSection faqs={faqs} className="mt-10" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: city ? `Buyer requirements in ${place}` : "Buyer requirements",
            url: `${siteUrl}${appPath(requirementsPath(city, locality))}`,
            description: "Buyer demand board for property purchase on RentalPins.",
          }),
        }}
      />
    </MarketingShell>
  );
}
