import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BuyerRequirementsBoard from "@/components/buy/BuyerRequirementsBoard";
import FAQSchema from "@/components/seo/FAQSchema";
import { HubFaqSection } from "@/components/seo/MarketInsightsBlock";
import { appPath, siteUrl } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { getCityBySlug, getAllCities } from "@/lib/cities-config";
import { BUY_REQUIREMENTS_PATH } from "@/lib/sale/buy-app-paths";
import { BUY_HUB_SLUGS } from "@/lib/sale/buy-pages-config";

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

  const boardCity =
    city && (BUY_HUB_SLUGS as readonly string[]).includes(city) ? city : undefined;

  return (
    <>
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
            <Link
              href={appPath(`${BUY_REQUIREMENTS_PATH}/post`)}
              className="rp-btn rp-btn-secondary px-6 py-3"
            >
              Post requirement
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <BuyerRequirementsBoard city={boardCity} />

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
    </>
  );
}
