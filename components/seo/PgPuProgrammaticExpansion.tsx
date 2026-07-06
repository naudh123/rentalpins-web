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
  { label: "Boys PG near PU", href: "/universities/panjab-university/pg" },
  { label: "Girls PG near PU", href: "/universities/panjab-university/pg" },
  { label: "PG near Sector 14", href: "/cities/chandigarh/sector-14-chandigarh" },
  { label: "PG near Sector 15", href: "/cities/chandigarh/sector-15-chandigarh" },
  { label: "PG near Sector 16", href: "/cities/chandigarh/sector-16-chandigarh" },
  { label: "PG near Sector 17", href: "/cities/chandigarh/sector-17-chandigarh" },
  { label: "AC PG", href: "/rentals/in/chandigarh/pg" },
  { label: "Food included PG", href: "/universities/panjab-university/pg" },
  { label: "Single room PG", href: "/rentals/in/chandigarh" },
  { label: "PG near PEC", href: "/pg-near-pec" },
  { label: "Flats near PU", href: "/universities/panjab-university/flats" },
  { label: "Hostels near PU", href: "/universities/panjab-university/hostel" },
];

const PU_EXTRA_FAQS = [
  {
    question: "What is the average PG rent near Panjab University Chandigarh?",
    answer:
      "Typical PG rent near PU in Sector 14–17 ranges from ₹7,000–₹18,000/month depending on sharing, AC, and food plan. Browse live Chandigarh map pins for current owner prices.",
  },
  {
    question: "Which sectors are closest to Panjab University?",
    answer:
      "Sector 14 (campus), Sector 15, Sector 16, and Sector 17 are the main student PG belts — confirm walk time on the map pin before paying deposit.",
  },
  {
    question: "Is food included in PG rent near PU?",
    answer:
      "Many owners offer mess plans — confirm meals, laundry, Wi‑Fi and AC surcharges in your first WhatsApp before semester deposit.",
  },
  {
    question: "Is Chandigarh safe for girls PG near Panjab University?",
    answer:
      "Shortlist girls PG with curfew and security rules, visit in daylight, and confirm warden or caretaker presence before paying advance rent.",
  },
];

const CHECKLIST = [
  "Confirm boys, girls or co-ed suitability with the owner.",
  "Compare Sector 14 walk time vs Sector 15–17 rent savings on the map.",
  "Inspect mess quality, bathroom sharing ratio and ventilation.",
  "Agree deposit refund rules and photograph room condition at handover.",
  "Message owners from RentalPins pins — avoid broker unlock fees on duplicate listings.",
];

/** Appended below existing PU marketing content — does not replace hero, benefits, or FAQs. */
export default async function PgPuProgrammaticExpansion() {
  const area = getAreaConfig("chandigarh");
  const listings = area ? await fetchAreaListings(area, 12) : [];
  const nearby = nearbyPlaceLinks({
    id: "pu-expansion",
    type: "university",
    name: "Panjab University",
    slug: "panjab-university",
    indexable: true,
    nearbyLandmarks: ["PGI Chandigarh", "Sector 14", "Sector 15", "Sector 17"],
    relatedSlugs: [
      "sector-14-chandigarh",
      "sector-15-chandigarh",
      "pgi-chandigarh",
      "chandigarh",
    ],
  });

  return (
    <>
      <LiveListingsBlock
        title="Live PG listings near Panjab University"
        placeName="Chandigarh / PU sectors"
        browseHref="/rentals/in/chandigarh/pg"
        listings={listings}
      />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="pu-pg-types-heading">
        <h2 id="pu-pg-types-heading" className="rp-section-title text-lg">
          PG types near Panjab University
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
        areaName="Panjab University, Chandigarh"
        rentRange="₹7,000–₹18,000"
        listingCount={listings.length}
        demandProfile="student"
      />

      <AreaGuideBlock
        areaName="Panjab University"
        city="Chandigarh"
        propertyTypes={["PG", "Hostels", "Flats", "Rooms"]}
        commuteNote="PU students typically rent in Sector 14–17 — compare map pin distance to campus gates and PEC, not vague 'near PU' classified titles."
        safetyNote="For girls PG, confirm curfew, visitor rules and security. Parents should shortlist three pins and visit in one trip before semester deposit."
      />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="pu-safety-heading">
        <h2 id="pu-safety-heading" className="rp-section-title text-lg">
          Safety guide &amp; student checklist
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {CHECKLIST.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </section>

      <NearbyPlacesBlock title="Nearby sectors &amp; guides" links={nearby} />

      <AiAdvisorBlock areaName="Panjab University, Chandigarh" />

      <RevenueCtaBlock isStudentArea />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="pu-owner-cta-heading">
        <h2 id="pu-owner-cta-heading" className="rp-section-title text-lg">
          For PG owners near Panjab University
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

      <FaqBlock faqs={PU_EXTRA_FAQS} heading="More FAQs — PG near Panjab University" />
    </>
  );
}
