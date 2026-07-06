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
import {
  MOHALI_CAMPUS_CHECKLIST,
  MOHALI_CAMPUS_CONFIGS,
  MOHALI_CAMPUS_AI_QUESTIONS,
  mohaliCampusListingsAreaSlug,
  type MohaliCampusId,
} from "@/lib/seo/mohali-sector81-seo-config";

interface Props {
  campus: MohaliCampusId;
}

export default async function MohaliCampusPgExpansion({ campus }: Props) {
  const config = MOHALI_CAMPUS_CONFIGS[campus];
  const listingsAreaSlug = mohaliCampusListingsAreaSlug(campus);
  const area = getAreaConfig("", listingsAreaSlug);
  const listings = area ? await fetchAreaListings(area, 12) : [];
  const nearby = nearbyPlaceLinks({
    id: `${campus}-expansion`,
    type: "landmark",
    name: config.institutionName,
    slug: campus === "isb" ? "isb-mohali" : campus === "iiser" ? "iiser-mohali" : "jlpl-industrial-area-mohali",
    indexable: true,
    nearbyLandmarks: config.nearbyLandmarks,
    relatedSlugs: config.nearbyRelatedSlugs,
  });

  const listingsTitle =
    campus === "jlpl" ?
      `Live rentals near ${config.institutionName}`
    : `Live PG listings near ${config.institutionName}`;

  const propertyTypes =
    campus === "jlpl" ?
      ["Rooms", "PG", "Flats", "Commercial"]
    : ["PG", "Hostels", "Flats", "Rooms"];

  return (
    <>
      <LiveListingsBlock
        title={listingsTitle}
        placeName={config.placeName}
        browseHref={config.browseHref}
        listings={listings}
      />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby={`${campus}-pg-types-heading`}>
        <h2 id={`${campus}-pg-types-heading`} className="rp-section-title text-lg">
          {campus === "jlpl" ? "Rental options near JLPL" : `PG types near ${config.introArea}`}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {config.pgFilterLinks.map((l) => (
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
        areaName={config.placeName}
        rentRange={config.rentRange}
        listingCount={listings.length}
        demandProfile={config.demandProfile}
      />

      <AreaGuideBlock
        areaName={config.introArea}
        city="Mohali"
        propertyTypes={propertyTypes}
        commuteNote={config.commuteNote}
        safetyNote={config.safetyNote}
      />

      <section
        className="mx-auto max-w-4xl px-4 py-10"
        aria-labelledby={`${campus}-industrial-training-heading`}
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#E8501A]">
            Industrial training &amp; short stays
          </p>
          <h2
            id={`${campus}-industrial-training-heading`}
            className="mt-2 font-serif text-2xl font-bold text-[#1E3A6E]"
          >
            {config.industrialTraining.title}
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            {config.industrialTraining.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <h3 className="mt-8 text-sm font-semibold text-[var(--brand-navy)]">
            Checklist for industrial training students
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {config.industrialTraining.checklist.map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby={`${campus}-safety-heading`}>
        <h2 id={`${campus}-safety-heading`} className="rp-section-title text-lg">
          {campus === "jlpl" ? "Rental checklist near JLPL" : "Safety guide & student checklist"}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {MOHALI_CAMPUS_CHECKLIST.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      </section>

      <NearbyPlacesBlock title="Nearby sectors & landmarks" links={nearby} />

      <AiAdvisorBlock
        areaName={config.placeName}
        questions={MOHALI_CAMPUS_AI_QUESTIONS[campus]}
      />

      <RevenueCtaBlock isStudentArea={true} isSociety={campus === "jlpl"} />

      <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby={`${campus}-owner-cta-heading`}>
        <h2 id={`${campus}-owner-cta-heading`} className="rp-section-title text-lg">
          For owners near {config.introArea}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={appPath("/list-pg")} className="rp-btn rp-btn-primary px-5 py-2.5">
            Post your rental free
          </Link>
          <Link href={appPath("/post/boost")} className="rp-btn rp-btn-secondary px-5 py-2.5">
            Feature your listing on top
          </Link>
          <Link href={appPath("/advisor")} className="rp-btn border border-[var(--border)] px-5 py-2.5">
            AI rental advisor
          </Link>
        </div>
      </section>

      <FaqBlock faqs={config.extraFaqs} heading={`More FAQs — ${config.institutionName}`} />
    </>
  );
}
