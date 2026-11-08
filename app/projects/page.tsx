import type { Metadata } from "next";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import LuxuryFaqSection from "@/components/builders/luxury/LuxuryFaqSection";
import ProjectsIndexClient from "@/components/builders/ProjectsIndexClient";
import {
  BuilderLuxuryShell,
  LuxuryIndexHero,
} from "@/components/builders/luxury/LuxuryUI";
import { appPath, siteUrl } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildConversationalFaqs } from "@/lib/seo/conversational-faqs";
import { TRICITY_PROJECT_CITIES } from "@/lib/builders/tricity-cities";
import { listProjects } from "@/lib/builders/builders-server";

export const metadata: Metadata = buildPageMetadata({
  title: "Real estate projects",
  description:
    "Explore new and upcoming real estate projects across India. Compare price ranges, amenities, and book site visits on RentalPins.",
  path: "/projects",
});

export default async function ProjectsIndexPage() {
  const faqs = buildConversationalFaqs("projects", {});
  const projects = await listProjects(true);

  return (
    <MarketingShell>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${siteUrl}${appPath("/")}` },
          { name: "Projects", url: `${siteUrl}${appPath("/projects")}` },
        ]}
      />
      <FAQSchema faqs={faqs} />
      <BuilderLuxuryShell>
        <LuxuryIndexHero
          eyebrow="Chandigarh Tricity · Ultra-Premium Collection"
          title="Exceptional real estate projects"
          description="Discover curated developer launches across Mohali, Chandigarh, Panchkula, Zirakpur, Kharar, Landran and Banur — each with bespoke brand microsites, live plot inventory, and white-glove buyer enquiries on RentalPins."
        />

        <div className="mx-auto max-w-6xl px-4 pb-16">
          <div className="flex flex-wrap gap-3">
            <Link href={appPath("/projects/post")} className="lux-btn-gold">
              List your project
            </Link>
            <Link href={appPath("/my-projects")} className="lux-btn-outline">
              My projects
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="mt-10 text-sm text-[var(--muted)]">
              No published projects yet. Admins can seed the Tricity catalog from{" "}
              <Link
                href={appPath("/admin/builders")}
                className="font-semibold text-[var(--lux-accent)] hover:underline"
              >
                Admin → Builders
              </Link>
              .
            </p>
          ) : (
            <ProjectsIndexClient projects={projects} />
          )}

          <div className="mt-12 flex flex-wrap gap-2">
            {TRICITY_PROJECT_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={appPath(`/projects/${c.slug}`)}
                className="lux-city-pill"
              >
                {c.label}
              </Link>
            ))}
          </div>

          <LuxuryFaqSection faqs={faqs} className="mt-16" />
        </div>
      </BuilderLuxuryShell>
    </MarketingShell>
  );
}
