"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import InventorySummaryCards from "@/components/builders/InventorySummaryCards";
import ProjectLeadForm from "@/components/builders/ProjectLeadForm";
import ProjectStickyCta from "@/components/builders/ProjectStickyCta";
import ProjectContactBar from "@/components/builders/ProjectContactBar";
import ProjectVideoSection from "@/components/builders/ProjectVideoSection";
import ProjectConstructionTimeline from "@/components/builders/ProjectConstructionTimeline";
import ProjectSimilarCarousel from "@/components/builders/ProjectSimilarCarousel";
import GatedAssetModal from "@/components/builders/GatedAssetModal";
import ProjectNeighborhoodPanel from "@/components/builders/ProjectNeighborhoodPanel";
import ProjectEmiCalculator from "@/components/builders/ProjectEmiCalculator";
import ProjectFloorPlanExplorer from "@/components/builders/ProjectFloorPlanExplorer";
import ProjectVirtualTourEmbed from "@/components/builders/ProjectVirtualTourEmbed";
import ProjectVipWaitlist from "@/components/builders/ProjectVipWaitlist";
import ProjectSavedUnitsPanel from "@/components/builders/ProjectSavedUnitsPanel";
import BuilderCredibilityBlock from "@/components/builders/BuilderCredibilityBlock";
import ProjectMasterPlanPreview from "@/components/builders/ProjectMasterPlanPreview";
import ProjectParallaxHero from "@/components/builders/luxury/ProjectParallaxHero";
import ProjectGalleryLightbox from "@/components/builders/luxury/ProjectGalleryLightbox";
import {
  BuilderLuxuryShell,
  LuxuryGlassPanel,
  LuxurySectionHeader,
  LuxuryStatChip,
} from "@/components/builders/luxury/LuxuryUI";
import LuxuryFaqSection from "@/components/builders/luxury/LuxuryFaqSection";
import {
  builderPath,
  projectPlotsPath,
  projectMasterPlanPath,
} from "@/lib/builders/project-paths";
import {
  formatPriceRange,
  formatSizeRange,
} from "@/lib/builders/format";
import {
  formatAvailabilityLabel,
  formatPossessionLabel,
} from "@/lib/builders/project-scarcity";
import { appPath } from "@/lib/config";
import { getBrandTheme } from "@/lib/builders/brand-themes";
import { resolveProjectMedia } from "@/lib/builders/project-media";
import { resolveProjectDisplayImage } from "@/lib/builders/project-placeholder";
import type {
  Builder,
  BuilderProject,
  InventorySummary,
  ProjectFaq,
  ProjectUnit,
} from "@/lib/types/builder-microsite";
import ProjectLocationMap from "@/components/builders/ProjectLocationMap";

interface Props {
  project: BuilderProject;
  summary: InventorySummary;
  faqs: ProjectFaq[] | { question: string; answer: string }[];
  units: ProjectUnit[];
  similarProjects: BuilderProject[];
  builder: Builder | null;
  builderProjectCount?: number;
  masterPlanImageUrl?: string | null;
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export default function ProjectMicrositeClient({
  project,
  summary,
  faqs,
  units,
  similarProjects,
  builder,
  builderProjectCount,
  masterPlanImageUrl,
}: Props) {
  const formRef = useRef<HTMLDivElement>(null);
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [leadUnitId, setLeadUnitId] = useState<string | undefined>();
  const [leadPlotNumber, setLeadPlotNumber] = useState<string | undefined>();
  const [leadSource, setLeadSource] = useState<
    "project_page" | "vip_waitlist" | "brochure_download"
  >("project_page");

  function scrollToForm(opts?: {
    unitId?: string;
    plotNumber?: string | null;
    source?: typeof leadSource;
  }) {
    if (opts?.unitId) setLeadUnitId(opts.unitId);
    if (opts?.plotNumber) setLeadPlotNumber(opts.plotNumber ?? undefined);
    if (opts?.source) setLeadSource(opts.source);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const brandTheme = getBrandTheme(project.builderSlug, project.slug, project.builderName);
  const media = resolveProjectMedia(
    project.slug,
    project.builderSlug,
    project.builderName,
    project.galleryUrls[0],
    project.galleryUrls
  );
  const heroImage = media.heroUrl;
  const galleryImages =
    media.galleryUrls.length > 0
      ? media.galleryUrls
      : project.galleryUrls
          .map((url) => resolveProjectDisplayImage(url))
          .filter((url): url is string => url !== null);
  if (galleryImages.length === 0 && heroImage) {
    galleryImages.push(heroImage);
  }

  const availabilityLabel = formatAvailabilityLabel(summary);
  const possessionLabel = formatPossessionLabel(project.possessionDate);
  const planImage = masterPlanImageUrl || project.masterPlanImageUrl;

  return (
    <BuilderLuxuryShell
      builderSlug={project.builderSlug}
      projectSlug={project.slug}
      theme={brandTheme}
    >
      <ProjectParallaxHero
        eyebrow={brandTheme.heroEyebrow}
        imageUrl={heroImage ?? undefined}
        title={project.name}
        subtitle={
          <>
            by{" "}
            <Link
              href={appPath(builderPath(project.builderSlug))}
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              {project.builderName}
            </Link>
            {" · "}
            {project.address || project.city}
          </>
        }
        breadcrumbs={[
          { label: "Projects", href: appPath("/projects") },
          {
            label: project.builderName,
            href: appPath(builderPath(project.builderSlug)),
          },
          { label: project.name },
        ]}
        chips={
          <>
            <LuxuryStatChip className="lux-chip--hero">{formatPriceRange(project.priceMin, project.priceMax)}</LuxuryStatChip>
            <LuxuryStatChip className="lux-chip--hero">
              {formatSizeRange(project.sizeMin, project.sizeMax, project.sizeUnit)}
            </LuxuryStatChip>
            <LuxuryStatChip className="lux-chip--hero capitalize">
              {project.status.replace("-", " ")}
            </LuxuryStatChip>
            {availabilityLabel && (
              <LuxuryStatChip className="lux-chip--hero lux-chip--scarcity">
                {availabilityLabel}
              </LuxuryStatChip>
            )}
            {possessionLabel && <LuxuryStatChip className="lux-chip--hero">{possessionLabel}</LuxuryStatChip>}
            {project.reraNumber && (
              <LuxuryStatChip className="lux-chip--hero">RERA {project.reraNumber}</LuxuryStatChip>
            )}
          </>
        }
        actions={
          <>
            <ProjectContactBar
              projectName={project.name}
              builderPhone={builder?.phone}
              builderWhatsapp={builder?.whatsapp}
              leadRouting={project.leadRouting}
              onEnquire={() => scrollToForm()}
              onBrochure={
                project.brochureUrl ? () => setBrochureOpen(true) : undefined
              }
              hasBrochure={!!project.brochureUrl}
              variant="hero"
            />
            <Link
              href={appPath(projectPlotsPath(project.citySlug, project.slug))}
              className="lux-btn-outline border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20"
            >
              View Inventory
            </Link>
            {planImage && (
              <Link
                href={appPath(projectMasterPlanPath(project.citySlug, project.slug))}
                className="lux-btn-outline border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20"
              >
                Master Plan
              </Link>
            )}
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-16 pb-28 md:pb-16">
        <motion.div {...fadeUp} className="mb-16">
          <ProjectVipWaitlist
            launchDate={project.launchDate}
            status={project.status}
            onJoinWaitlist={() => scrollToForm({ source: "vip_waitlist" })}
          />
        </motion.div>

        {project.virtualTourUrl && (
          <motion.section {...fadeUp} className="mb-16">
            <LuxurySectionHeader eyebrow="Immersive" title="Virtual Tour" />
            <div className="mt-8">
              <ProjectVirtualTourEmbed
                virtualTourUrl={project.virtualTourUrl}
                title={project.name}
              />
            </div>
          </motion.section>
        )}

        <motion.section {...fadeUp} className="mb-16">
          <LuxurySectionHeader
            eyebrow="Live Inventory"
            title="Plot Availability"
            description="Real-time status across every unit in this development."
          />
          <div className="mt-8">
            <InventorySummaryCards summary={summary} />
          </div>
        </motion.section>

        {planImage && (
          <motion.section {...fadeUp} className="mb-16">
            <LuxurySectionHeader
              eyebrow="Site Map"
              title="Interactive Master Plan"
              description="Click plots on the map to view price, size, and availability."
            />
            <div className="mt-8">
              <ProjectMasterPlanPreview
                imageUrl={planImage}
                projectName={project.name}
                citySlug={project.citySlug}
                projectSlug={project.slug}
                unitCount={summary.total}
              />
            </div>
          </motion.section>
        )}

        {(units.length > 0 || project.floorPlanUrls.length > 0) && (
          <motion.section {...fadeUp} className="mb-16">
            <LuxurySectionHeader
              eyebrow="Unit Finder"
              title="Floor Plans & Availability"
              description="Filter by status and price. Save units to your shortlist."
            />
            <div className="mt-8">
              <ProjectFloorPlanExplorer
                units={units}
                projectFloorPlans={project.floorPlanUrls}
                builderId={project.builderId}
                projectId={project.id}
                projectSlug={project.slug}
                citySlug={project.citySlug}
                projectName={project.name}
                onEnquireUnit={(unitId, plotNumber) =>
                  scrollToForm({ unitId, plotNumber })
                }
              />
            </div>
          </motion.section>
        )}

        {project.description && (
          <motion.section {...fadeUp} className="mb-16">
            <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
              <div className="lg:col-span-2">
                <LuxurySectionHeader eyebrow="The Vision" title="About the Project" />
              </div>
              <div className="lg:col-span-3">
                <p className="text-lg leading-relaxed text-[var(--muted)]">{project.description}</p>
              </div>
            </div>
          </motion.section>
        )}

        {builder && (
          <motion.section {...fadeUp} className="mb-16">
            <BuilderCredibilityBlock
              builder={builder}
              project={project}
              projectCount={builderProjectCount}
            />
          </motion.section>
        )}

        {project.amenities.length > 0 && (
          <motion.section {...fadeUp} className="mb-16">
            <LuxurySectionHeader eyebrow="Curated Living" title="Amenities & Features" />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.amenities.map((a) => (
                <li key={a} className="lux-amenity">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--lux-accent-muted)] text-xs font-bold text-[var(--lux-primary)]">
                    ✓
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {project.videoUrls.length > 0 && (
          <motion.section {...fadeUp} className="mb-16">
            <LuxurySectionHeader eyebrow="Walkthrough" title="Project Videos" />
            <div className="mt-8">
              <ProjectVideoSection videoUrls={project.videoUrls} title={project.name} />
            </div>
          </motion.section>
        )}

        {galleryImages.length > 0 && (
          <motion.section {...fadeUp} className="mb-16">
            <LuxurySectionHeader eyebrow="Visual Tour" title="Gallery" />
            <div className="mt-8">
              <ProjectGalleryLightbox images={galleryImages} title={project.name} />
            </div>
          </motion.section>
        )}

        {project.latitude && project.longitude && (
          <motion.section {...fadeUp} className="mb-16">
            <LuxurySectionHeader eyebrow="Prime Location" title="Where You'll Live" />
            <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] shadow-[var(--lux-shadow)]">
              <ProjectLocationMap
                latitude={project.latitude}
                longitude={project.longitude}
                label={project.name}
                address={project.address}
              />
            </div>
            {project.nearbyLandmarks.length > 0 && (
              <div className="mt-8">
                <ProjectNeighborhoodPanel
                  landmarks={project.nearbyLandmarks}
                  latitude={project.latitude}
                  longitude={project.longitude}
                  projectName={project.name}
                />
              </div>
            )}
          </motion.section>
        )}

        <motion.section {...fadeUp} className="mb-16">
          <LuxurySectionHeader eyebrow="Investment" title="Payment & Affordability" />
          <div className="mt-8">
            <ProjectEmiCalculator
              priceMin={project.priceMin}
              priceMax={project.priceMax}
              paymentPlan={project.paymentPlan}
            />
          </div>
        </motion.section>

        {project.constructionUpdates.length > 0 && (
          <motion.section {...fadeUp} className="mb-16">
            <LuxurySectionHeader eyebrow="Progress" title="Construction Updates" />
            <div className="mt-8">
              <ProjectConstructionTimeline updates={project.constructionUpdates} />
            </div>
          </motion.section>
        )}

        <div className="lux-section-ornament" aria-hidden>
          <span>Private Consultation</span>
        </div>

        <motion.div ref={formRef} {...fadeUp} className="grid gap-10 lg:grid-cols-5">
          <section className="lg:col-span-3">
            <LuxurySectionHeader
              eyebrow="Private Consultation"
              title="Schedule Your Visit"
              description="Share your details and our team will arrange a personalised site visit."
            />
            <LuxuryGlassPanel className="mt-8">
              <ProjectLeadForm
                builderId={project.builderId}
                projectId={project.id}
                unitId={leadUnitId}
                source={leadSource}
                projectName={project.name}
                plotNumber={leadPlotNumber}
                analytics={{
                  projectSlug: project.slug,
                  citySlug: project.citySlug,
                  placement: "project_microsite",
                }}
              />
            </LuxuryGlassPanel>
          </section>
          <section className="lg:col-span-2 space-y-6">
            <LuxuryGlassPanel className="sticky top-24">
              <p className="lux-eyebrow">Quick Actions</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-[var(--lux-primary)]">
                Ready to explore?
              </h3>
              <div className="mt-6">
                <ProjectContactBar
                  projectName={project.name}
                  builderPhone={builder?.phone}
                  builderWhatsapp={builder?.whatsapp}
                  leadRouting={project.leadRouting}
                  onEnquire={() => scrollToForm()}
                  onBrochure={
                    project.brochureUrl ? () => setBrochureOpen(true) : undefined
                  }
                  hasBrochure={!!project.brochureUrl}
                  variant="inline"
                />
              </div>
              <div className="mt-4 space-y-3">
                <Link
                  href={appPath(projectPlotsPath(project.citySlug, project.slug))}
                  className="lux-btn-outline w-full"
                >
                  Browse Plot Inventory
                </Link>
                {planImage && (
                  <Link
                    href={appPath(projectMasterPlanPath(project.citySlug, project.slug))}
                    className="lux-btn-outline w-full"
                  >
                    Interactive Master Plan
                  </Link>
                )}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-[var(--muted)]">
                Verified listings on RentalPins. Call or WhatsApp{" "}
                <a href="tel:9915061640" className="font-medium text-[var(--lux-primary)]">
                  9915061640
                </a>{" "}
                for instant assistance. RERA-compliant disclosures where applicable.
              </p>
            </LuxuryGlassPanel>
            <ProjectSavedUnitsPanel
              projectId={project.id}
              onEnquireUnit={(unitId, plotNumber) =>
                scrollToForm({ unitId, plotNumber })
              }
            />
          </section>
        </motion.div>

        {similarProjects.length > 0 && (
          <motion.div {...fadeUp} className="mt-16">
            <ProjectSimilarCarousel
              projects={similarProjects}
              currentProjectId={project.id}
            />
          </motion.div>
        )}

        <LuxuryFaqSection faqs={faqs} className="mt-20" />
      </div>

      <ProjectStickyCta
        phone={builder?.phone}
        whatsapp={builder?.whatsapp}
        leadRouting={project.leadRouting}
        projectName={project.name}
        onEnquire={() => scrollToForm()}
        analytics={{
          projectId: project.id,
          projectSlug: project.slug,
          citySlug: project.citySlug,
          placement: "project_sticky",
        }}
      />

      {project.brochureUrl && (
        <GatedAssetModal
          open={brochureOpen}
          onClose={() => setBrochureOpen(false)}
          title="Download brochure"
          description="Enter your details to receive the official project brochure."
          assetUrl={project.brochureUrl}
          builderId={project.builderId}
          projectId={project.id}
          projectName={project.name}
          source="brochure_download"
        />
      )}
    </BuilderLuxuryShell>
  );
}
