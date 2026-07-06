"use client";

import { useRef } from "react";
import Link from "next/link";
import ProjectLeadForm from "@/components/builders/ProjectLeadForm";
import ProjectStickyCta from "@/components/builders/ProjectStickyCta";
import {
  BuilderLuxuryShell,
  LuxuryBreadcrumbs,
  LuxuryGlassPanel,
  LuxurySectionHeader,
} from "@/components/builders/luxury/LuxuryUI";
import LuxuryFaqSection from "@/components/builders/luxury/LuxuryFaqSection";
import { appPath } from "@/lib/config";
import { buyProjectPath } from "@/lib/sale/buy-projects-config";
import type { BuyProjectConfig } from "@/lib/sale/buy-projects-config";
import type { BuyProjectLeadTarget } from "@/lib/builders/buy-project-bridge";

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  project: BuyProjectConfig;
  leadTarget: BuyProjectLeadTarget;
  faqs: FaqItem[];
}

export default function BuyProjectDetailClient({
  project,
  leadTarget,
  faqs,
}: Props) {
  const formRef = useRef<HTMLDivElement>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const breadcrumbs = [
    { label: "Projects", href: appPath("/buy/projects") },
    { label: project.cityName, href: appPath(`/buy/projects/${project.citySlug}`) },
    { label: project.name },
  ];

  return (
    <BuilderLuxuryShell projectSlug={project.slug}>
      <article className="mx-auto max-w-3xl px-4 pb-28 pt-10 md:pb-16">
        <LuxuryBreadcrumbs items={breadcrumbs} />
        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--lux-accent)]">
            {project.status === "upcoming" ? "Upcoming launch" : "Now selling"}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[var(--lux-primary)] md:text-4xl">
            {project.name}
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            {project.locality}, {project.cityName} · {project.priceRange}
          </p>
        </header>

        <LuxuryGlassPanel className="mt-8 p-5 md:p-6">
          <LuxurySectionHeader
            eyebrow="Overview"
            title="Property types"
            description={project.types.join(" · ")}
          />
        </LuxuryGlassPanel>

        <LuxuryGlassPanel className="mt-4 p-5 md:p-6">
          <LuxurySectionHeader eyebrow="Lifestyle" title="Amenities" />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[var(--muted)]">
            {project.amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </LuxuryGlassPanel>

        <LuxuryGlassPanel className="mt-4 p-5 md:p-6">
          <LuxurySectionHeader eyebrow="Investment" title="Why this project" />
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            {project.investmentNote}
          </p>
        </LuxuryGlassPanel>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={scrollToForm} className="lux-btn-gold px-6 py-2.5">
            Book site visit
          </button>
          <Link
            href={appPath("/buy/search")}
            className="lux-btn-outline px-6 py-2.5 no-underline"
          >
            Compare resale on map
          </Link>
          <Link
            href={appPath(`/buy/${project.citySlug}`)}
            className="lux-btn-outline px-6 py-2.5 no-underline"
          >
            Resale in {project.cityName}
          </Link>
        </div>

        <div ref={formRef} className="mt-10 scroll-mt-24">
          <LuxuryGlassPanel className="p-5 md:p-6">
            <LuxurySectionHeader
              eyebrow="Enquire"
              title="Arrange your private site visit"
              description="Share your details — our concierge team coordinates builder callbacks and brochure delivery."
            />
            <div className="mt-6">
              <ProjectLeadForm
                builderId={leadTarget.builderId}
                projectId={leadTarget.projectId}
                source="buy_project_page"
                projectName={project.name}
                analytics={{
                  projectSlug: project.slug,
                  citySlug: project.citySlug,
                  placement: "buy_project_page",
                }}
              />
            </div>
          </LuxuryGlassPanel>
        </div>

        <LuxuryFaqSection faqs={faqs} className="mt-10" />
      </article>

      <ProjectStickyCta
        leadRouting="platform"
        projectName={project.name}
        onEnquire={scrollToForm}
        analytics={{
          projectId: leadTarget.projectId,
          projectSlug: project.slug,
          citySlug: project.citySlug,
          placement: "buy_project_sticky",
        }}
      />
    </BuilderLuxuryShell>
  );
}
