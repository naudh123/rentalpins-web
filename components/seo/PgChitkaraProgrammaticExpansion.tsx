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
  { label: "Boys PG near Chitkara", href: "/universities/chitkara-university/pg" },
  { label: "Girls PG near Chitkara", href: "/universities/chitkara-university/pg" },
  { label: "PG in Rajpura", href: "/cities/rajpura" },
  { label: "PG near Banur", href: "/rentals/in/chandigarh/banur" },
  { label: "PG near Landran", href: "/rentals/in/chandigarh/landran" },
  { label: "AC PG", href: "/rentals/in/chandigarh/pg" },
  { label: "Food included PG", href: "/universities/chitkara-university/pg" },
  { label: "Single room PG", href: "/rentals/in/chandigarh" },
  { label: "Double sharing PG", href: "/cities/rajpura/rajpura-town" },
  { label: "Flats near Chitkara", href: "/universities/chitkara-university/flats" },
  { label: "Hostels near Chitkara", href: "/universities/chitkara-university/hostel" },
  { label: "PG near CGC Landran", href: "/pg-near-cgc-landran" },
];

const CHITKARA_EXTRA_FAQS = [
  {
    question: "What is the average PG rent near Chitkara University Rajpura?",
    answer:
      "Typical PG rent near Chitkara ranges from ₹6,000–₹12,000/month depending on sharing, AC, and food plan. Browse live Tricity map pins around Rajpura and Banur for current owner prices.",
  },
  {
    question: "Which areas are closest to Chitkara University?",
    answer:
      "Rajpura town, Banur, and the Rajpura–Patiala highway belt are common student PG clusters — confirm ride or walk time on the map pin before paying deposit.",
  },
  {
    question: "Is food included in PG rent near Chitkara?",
    answer:
      "Many owners offer mess plans — confirm meals, laundry, Wi‑Fi and AC surcharges in your first WhatsApp before semester deposit.",
  },
  {
    question: "Is Rajpura safe for girls PG near Chitkara?",
    answer:
      "Shortlist girls PG with curfew and security rules, visit in daylight with parents during admission, and confirm warden or caretaker presence before paying advance.",
  },
];

const CHECKLIST = [
  "Confirm boys, girls or co-ed suitability with the owner.",
  "Compare Rajpura town vs Banur commute time to Chitkara gates on the map.",
  "Inspect mess quality, bathroom sharing ratio and ventilation.",
  "Agree deposit refund rules and photograph room condition at handover.",
  "Message owners from RentalPins pins — avoid broker unlock fees on duplicate listings.",
];

export default async function PgChitkaraProgrammaticExpansion() {
  const area = getAreaConfig("", "banur") ?? getAreaConfig("chandigarh");
  const listings = area ? await fetchAreaListings(area, 12) : [];
  const nearby = nearbyPlaceLinks({
    id: "chitkara-expansion",
    type: "university",
    name: "Chitkara University",
    slug: "chitkara-university",
    indexable: true,
    nearbyLandmarks: ["Rajpura", "Banur", "Landran"],
    relatedSlugs: ["rajpura", "banur-chitkara-belt", "landran", "cgc-landran"],
  });

  return (
    <>
      <LiveListingsBlock
        title="Live PG listings near Chitkara University"
        placeName="Rajpura / Chitkara belt"
        browseHref="/rentals/in/chandigarh/pg"
        listings={listings}
      />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="chitkara-pg-types-heading">
        <h2 id="chitkara-pg-types-heading" className="rp-section-title text-lg">
          PG types near Chitkara University
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
        areaName="Chitkara University, Rajpura"
        rentRange="₹6,000–₹12,000"
        listingCount={listings.length}
        demandProfile="student"
      />

      <AreaGuideBlock
        areaName="Chitkara University"
        city="Rajpura"
        propertyTypes={["PG", "Hostels", "Flats", "Rooms"]}
        commuteNote="Chitkara students often rent in Rajpura town and Banur — compare map pin distance to campus gates and bus/auto commute, not vague 'near Chitkara' classified titles."
        safetyNote="For girls PG, confirm curfew, visitor rules and security. Parents should shortlist three pins and visit in one trip before semester deposit."
      />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="chitkara-safety-heading">
        <h2 id="chitkara-safety-heading" className="rp-section-title text-lg">
          Safety guide &amp; student checklist
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {CHECKLIST.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </section>

      <NearbyPlacesBlock title="Nearby areas &amp; guides" links={nearby} />

      <AiAdvisorBlock areaName="Chitkara University, Rajpura" />

      <RevenueCtaBlock isStudentArea />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby="chitkara-owner-cta-heading">
        <h2 id="chitkara-owner-cta-heading" className="rp-section-title text-lg">
          For PG owners near Chitkara University
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

      <FaqBlock faqs={CHITKARA_EXTRA_FAQS} heading="More FAQs — PG near Chitkara University" />
    </>
  );
}
