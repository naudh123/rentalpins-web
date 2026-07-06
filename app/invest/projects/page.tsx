import type { Metadata } from "next";
import Link from "next/link";
import InvestProjectsClient from "@/components/invest/InvestProjectsClient";
import InvestPageHero from "@/components/invest/InvestPageHero";
import { appPath } from "@/lib/config";
import { listProjects } from "@/lib/builders/builders-server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { INVEST_PROJECTS_PATH } from "@/lib/invest/invest-paths";

export const metadata: Metadata = buildPageMetadata({
  title: "Projects for investors | RentalPins Invest",
  description:
    "Browse RERA projects with an investor lens — rental yield, appreciation, student housing, plots, and pre-launch filters across Tricity.",
  path: INVEST_PROJECTS_PATH,
});

export default async function InvestProjectsPage() {
  const projects = await listProjects(true);

  return (
    <>
      <InvestPageHero
        title="Projects — investor lens"
        subtitle="Filter Tricity RERA launches by investment strategy. Verify registration, payment plans, and possession timelines before booking."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href={appPath("/projects")} className="font-semibold text-[var(--invest-emerald)] hover:underline">
            Full projects catalog →
          </Link>
          <Link href={appPath("/invest/calculator")} className="font-semibold text-[var(--muted)] hover:underline">
            Yield calculator
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="mt-10 text-sm text-[var(--muted)]">No published projects yet.</p>
        ) : (
          <InvestProjectsClient projects={projects} />
        )}
      </div>
    </>
  );
}
