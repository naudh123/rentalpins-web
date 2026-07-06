import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarketingShell from "@/components/MarketingShell";
import ProjectLeadForm from "@/components/builders/ProjectLeadForm";
import {
  BuilderLuxuryShell,
  LuxuryBreadcrumbs,
  LuxuryGlassPanel,
  LuxuryProjectCard,
  LuxurySectionHeader,
} from "@/components/builders/luxury/LuxuryUI";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSeoEntity } from "@/lib/seo/seoData";
import { renderSeoEntityPage, seoEntityMetadata } from "@/lib/seo/seo-page-template";
import {
  getPublishedBuilderBySlug,
  incrementBuilderView,
  listProjectsForBuilder,
} from "@/lib/builders/builders-server";
import {
  buildBuilderJsonLd,
  buildBuilderBreadcrumbs,
} from "@/lib/builders/project-schema";
import { builderPath, projectPath } from "@/lib/builders/project-paths";
import { formatPriceRange, telLink, whatsappLink } from "@/lib/builders/format";
import { appPath } from "@/lib/config";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import type { BuilderProject } from "@/lib/types/builder-microsite";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ builderSlug: string }>;
}): Promise<Metadata> {
  const { builderSlug } = await params;
  const builder = await getPublishedBuilderBySlug(builderSlug);
  if (builder) {
    return buildPageMetadata({
      title: `${builder.name} — Builder Profile`,
      description:
        builder.description.slice(0, 160) ||
        `${builder.name} — verified builder on RentalPins. View ongoing and completed projects.`,
      path: builderPath(builderSlug),
      ogImage: builder.coverImageUrl || builder.logoUrl || undefined,
    });
  }
  const entity = getSeoEntity(builderSlug, "builder");
  if (!entity) return { title: "Builder not found" };
  const meta = seoEntityMetadata(entity, 0);
  return buildPageMetadata({
    title: meta.title,
    description: meta.description,
    path: `/builders/${builderSlug}`,
  });
}

export default async function BuilderProfilePage({
  params,
}: {
  params: Promise<{ builderSlug: string }>;
}) {
  const { builderSlug } = await params;
  const builder = await getPublishedBuilderBySlug(builderSlug);

  if (!builder) {
    const entity = getSeoEntity(builderSlug, "builder");
    if (!entity) notFound();
    return renderSeoEntityPage(entity);
  }

  void incrementBuilderView(builder.id);
  const projects = await listProjectsForBuilder(builder.id, true);
  const ongoing = projects.filter((p) => p.status === "ongoing" || p.status === "upcoming");
  const ready = projects.filter((p) => p.status === "ready");
  const soldOut = projects.filter((p) => p.status === "sold-out");

  const jsonLd = buildBuilderJsonLd(builder);
  const breadcrumbs = buildBuilderBreadcrumbs(builder);

  return (
    <MarketingShell>
      <BuilderLuxuryShell builderSlug={builder.slug}>
        <BreadcrumbSchema items={breadcrumbs} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero */}
        <section className="relative overflow-hidden lux-builder-hero text-white">
          {builder.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={builder.coverImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity"
            />
          )}
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <LuxuryBreadcrumbs
              light
              items={[
                { label: "Builders", href: appPath("/builders") },
                { label: builder.name },
              ]}
            />

            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end">
              {builder.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={builder.logoUrl}
                  alt={builder.name}
                  className="h-24 w-24 rounded-2xl border border-white/20 bg-white object-contain p-2 shadow-xl sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-white/10 font-serif text-3xl font-bold backdrop-blur sm:h-28 sm:w-28">
                  {builder.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="lux-eyebrow text-[var(--lux-accent-muted)]">Verified Developer</p>
                <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
                  {builder.name}
                </h1>
                <p className="mt-3 text-lg text-white/75">
                  {builder.city}
                  {builder.establishedYear ? ` · Est. ${builder.establishedYear}` : ""}
                  {builder.reraNumber ? ` · RERA ${builder.reraNumber}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {builder.leadRouting !== "platform" && builder.phone && (
                <a href={telLink(builder.phone)} className="lux-btn-gold">
                  Call Now
                </a>
              )}
              {builder.leadRouting !== "platform" && builder.whatsapp && (
                <a
                  href={whatsappLink(
                    builder.whatsapp,
                    `Hi, I'm interested in ${builder.name} projects.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-14 lg:col-span-8">
              {builder.description && (
                <section>
                  <LuxurySectionHeader eyebrow="Our Story" title="About" />
                  <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">
                    {builder.description}
                  </p>
                </section>
              )}

              {ongoing.length > 0 && (
                <ProjectSection title="Ongoing Projects" eyebrow="Now Selling" projects={ongoing} />
              )}
              {ready.length > 0 && (
                <ProjectSection title="Ready to Move" eyebrow="Immediate Possession" projects={ready} />
              )}
              {soldOut.length > 0 && (
                <ProjectSection title="Completed" eyebrow="Legacy Portfolio" projects={soldOut} />
              )}

              {builder.galleryUrls.length > 0 && (
                <section>
                  <LuxurySectionHeader eyebrow="Portfolio" title="Gallery" />
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {builder.galleryUrls.map((url) => (
                      <div key={url} className="lux-gallery-item">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <LuxurySectionHeader eyebrow="Social Proof" title="Reviews" />
                <LuxuryGlassPanel className="mt-8">
                  <p className="text-[var(--muted)]">
                    Testimonials coming soon. Be among the first to review {builder.name}.
                  </p>
                </LuxuryGlassPanel>
              </section>
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <LuxuryGlassPanel>
                <p className="lux-eyebrow">Contact</p>
                <h3 className="mt-2 font-serif text-xl font-bold text-[var(--lux-primary)]">
                  Get in touch
                </h3>
                <dl className="mt-5 space-y-4 text-sm">
                  {builder.leadRouting !== "platform" && builder.phone && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Phone
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={telLink(builder.phone)}
                          className="font-medium text-[var(--lux-primary)] hover:underline"
                        >
                          {builder.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {builder.email && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Email
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={`mailto:${builder.email}`}
                          className="font-medium text-[var(--lux-primary)] hover:underline"
                        >
                          {builder.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {builder.address && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Office
                      </dt>
                      <dd className="mt-1 text-[var(--text)]">{builder.address}</dd>
                    </div>
                  )}
                  {builder.website && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        Website
                      </dt>
                      <dd className="mt-1">
                        <a
                          href={builder.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[var(--lux-primary)] hover:underline"
                        >
                          {builder.website.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </LuxuryGlassPanel>

              <LuxuryGlassPanel>
                <p className="lux-eyebrow">Enquiry</p>
                <h3 className="mt-2 font-serif text-xl font-bold text-[var(--lux-primary)]">
                  Enquire Now
                </h3>
                <div className="mt-5">
                  <ProjectLeadForm builderId={builder.id} source="builder_page" />
                </div>
              </LuxuryGlassPanel>
            </aside>
          </div>
        </div>
      </BuilderLuxuryShell>
    </MarketingShell>
  );
}

function ProjectSection({
  title,
  eyebrow,
  projects,
}: {
  title: string;
  eyebrow: string;
  projects: BuilderProject[];
}) {
  return (
    <section>
      <LuxurySectionHeader eyebrow={eyebrow} title={title} />
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <LuxuryProjectCard
            key={p.id}
            href={appPath(projectPath(p.citySlug, p.slug))}
            name={p.name}
            imageUrl={p.galleryUrls[0]}
            city={p.city}
            status={p.status}
            priceLabel={formatPriceRange(p.priceMin, p.priceMax)}
          />
        ))}
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return [];
}
