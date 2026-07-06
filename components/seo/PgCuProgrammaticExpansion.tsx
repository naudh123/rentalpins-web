import Link from "next/link";
import LiveListingsBlock from "@/components/seo/LiveListingsBlock";
import RentTrendBlock from "@/components/seo/RentTrendBlock";
import AreaGuideBlock from "@/components/seo/AreaGuideBlock";
import NearbyPlacesBlock from "@/components/seo/NearbyPlacesBlock";
import FaqBlock from "@/components/seo/FaqBlock";
import AiAdvisorBlock from "@/components/seo/AiAdvisorBlock";
import RevenueCtaBlock from "@/components/seo/RevenueCtaBlock";
import { appPath } from "@/lib/config";
import { getAreaConfig } from "@/lib/area-config";
import { fetchAreaListings } from "@/lib/seo-listings";
import { nearbyPlaceLinks } from "@/lib/seo/internalLinks";

const PG_FILTER_LINKS = [
  { label: "Boys PG near CU", href: "/universities/chandigarh-university/pg" },
  { label: "Girls PG near CU", href: "/blog/pg-near-chandigarh-university-for-girls" },
  { label: "AC PG", href: "/rentals/kharar/chandigarh-university" },
  { label: "Non-AC PG", href: "/rentals/kharar/chandigarh-university" },
  { label: "Food included PG", href: "/universities/chandigarh-university/pg" },
  { label: "Single room PG", href: "/rentals/kharar" },
  { label: "Double sharing PG", href: "/rentals/kharar" },
  { label: "Triple sharing PG", href: "/rentals/kharar" },
  { label: "PG near Sector 123 Kharar", href: "/cities/kharar/sector-123-kharar" },
  { label: "PG near Sector 125 Kharar", href: "/cities/kharar/sector-125-kharar" },
  { label: "PG near Sunny Enclave", href: "/cities/kharar/sunny-enclave" },
];

const CU_EXTRA_FAQS = [
  {
    question: "What is the average PG rent near Chandigarh University?",
    answer:
      "Typical PG rent near CU ranges from ₹5,000–₹14,000/month depending on sharing, AC, and food plan. Browse live Kharar map pins for current owner prices.",
  },
  {
    question: "Which areas are closest to Chandigarh University?",
    answer:
      "Kharar town, Kharar–Landran road, Sector 123, Sector 125, Sunny Enclave and Gillco Valley are common CU-belt clusters — confirm walk or ride time on the map pin.",
  },
  {
    question: "Is food included in PG rent near CU?",
    answer:
      "Many owners offer mess plans — confirm meals, laundry, Wi‑Fi and AC surcharges in your first WhatsApp before session deposit.",
  },
  {
    question: "Is Kharar safe for girls PG near CU?",
    answer:
      "Shortlist girls PG with curfew and security rules, visit in daylight with parents during admission, and confirm warden or caretaker presence before paying advance.",
  },
];

const CHECKLIST = [
  "Confirm boys, girls or co-ed suitability with the owner.",
  "Inspect food quality, bathroom sharing ratio and ventilation.",
  "Agree deposit refund rules and photograph room condition at handover.",
  "Compare total monthly cost: rent + meals + utilities + commute.",
  "Message owners from RentalPins pins — avoid broker unlock fees on duplicate listings.",
];

/** Appended below existing CU marketing content — does not replace hero, benefits, or FAQs. */
export default async function PgCuProgrammaticExpansion() {
  const area = getAreaConfig("", "kharar");
  const listings = area ? await fetchAreaListings(area, 12) : [];
  const nearby = nearbyPlaceLinks({
    id: "cu-expansion",
    type: "university",
    name: "Chandigarh University",
    slug: "chandigarh-university",
    indexable: true,
    nearbyLandmarks: ["Sector 123 Kharar", "Sector 125 Kharar", "Sunny Enclave", "Landran"],
    relatedSlugs: ["kharar", "landran", "sector-123-kharar"],
  });

  return (
    <>
      <LiveListingsBlock
        title="Live PG listings near Chandigarh University"
        placeName="Kharar / CU belt"
        browseHref="/rentals/kharar/chandigarh-university"
        listings={listings}
      />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="cu-pg-types-heading">
        <h2 id="cu-pg-types-heading" className="rp-section-title text-lg">
          PG types near Chandigarh University
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {PG_FILTER_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={appPath(l.href)}
                className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-orange)] hover:underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <RentTrendBlock
        areaName="Chandigarh University belt"
        rentRange="₹5,000–₹14,000"
        listingCount={listings.length}
        demandProfile="student"
      />

      <AreaGuideBlock
        areaName="Chandigarh University"
        city="Kharar"
        propertyTypes={["PG", "Hostel", "Flats", "Rooms"]}
        commuteNote="CU students often rent in Kharar town, Sector 123/125 and Sunny Enclave — compare map pin distance to campus gates, not vague 'near CU' titles."
        safetyNote="For girls PG, confirm curfew, visitor rules and security. Parents should visit shortlisted pins in one trip during admission weeks."
      />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="cu-safety-heading">
        <h2 id="cu-safety-heading" className="rp-section-title text-lg">
          Safety guide &amp; student checklist
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {CHECKLIST.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </section>

      <NearbyPlacesBlock title="Nearby areas &amp; guides" links={nearby} />

      <AiAdvisorBlock areaName="Chandigarh University, Kharar" />

      <RevenueCtaBlock isStudentArea />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="cu-owner-cta-heading">
        <h2 id="cu-owner-cta-heading" className="rp-section-title text-lg">
          For PG owners near CU
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={appPath("/list-pg")} className="rp-btn rp-btn-primary px-5 py-2.5">
            Post your PG free
          </Link>
          <Link href={appPath("/post/boost")} className="rp-btn rp-btn-secondary px-5 py-2.5">
            Feature your PG on top
          </Link>
          <Link href={appPath("/advisor")} className="rp-btn border border-[var(--border)] px-5 py-2.5">
            AI PG Finder
          </Link>
        </div>
      </section>

      <FaqBlock faqs={CU_EXTRA_FAQS} heading="More FAQs — PG near CU" />
    </>
  );
}
