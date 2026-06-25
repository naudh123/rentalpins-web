import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import AeoAnswerBox from "@/components/seo/AeoAnswerBox";
import AeoFaqSection, { aeoFaqsForSchema } from "@/components/seo/AeoFaqSection";
import EntityClusterLinks from "@/components/seo/EntityClusterLinks";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import StructuredData from "@/components/seo/StructuredData";
import FAQSchema from "@/components/seo/FAQSchema";
import { appPath } from "@/lib/config";
import type { GeoPageConfig } from "@/lib/seo/geo-pages-config";
import { buildArticleSchema } from "@/lib/seo/schema-helpers";
import { canonicalUrl } from "@/lib/seo";
import { getTopicCluster } from "@/lib/seo/topic-clusters";

interface Props {
  config: GeoPageConfig;
}

export default function GeoInsightPage({ config }: Props) {
  const pageUrl = canonicalUrl(config.path);
  const breadcrumbs = [
    { name: "Home", url: canonicalUrl("/") },
    ...(config.path.includes("/buy/")
      ? [{ name: "Buy", url: canonicalUrl("/buy") }]
      : [{ name: "Rentals", url: canonicalUrl("/rentals") }]),
    { name: config.title.replace(/ \| RentalPins.*/, ""), url: pageUrl },
  ];

  const cluster = config.clusterId ? getTopicCluster(config.clusterId) : undefined;
  const entityLinks = config.entityLinks.length
    ? config.entityLinks
    : (cluster?.links ?? []);

  return (
    <MarketingShell>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={aeoFaqsForSchema(config.faqs)} />
      <StructuredData
        data={buildArticleSchema({
          title: config.title,
          description: config.description,
          url: pageUrl,
          datePublished: "2024-01-01",
          authorName: "RentalPins Editorial Team",
        })}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-serif text-3xl font-bold text-[var(--brand-navy)] md:text-4xl">
          {config.title.replace(/ \| RentalPins.*/, "")}
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{config.description}</p>

        <AeoAnswerBox summary={config.answerSummary} className="mt-8" />

        <section className="mt-10 prose prose-slate max-w-none">
          <h2 className="font-serif text-2xl text-[var(--brand-navy)]">Market context</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">{config.geoExplanation}</p>
        </section>

        <EntityClusterLinks links={entityLinks} className="mt-10" />

        {config.relatedPaths.length > 0 ? (
          <section className="mt-10" aria-labelledby="related-guides-heading">
            <h2 id="related-guides-heading" className="font-serif text-xl text-[var(--brand-navy)]">
              Related guides
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {config.relatedPaths.map((path) => (
                <li key={path}>
                  <Link
                    href={appPath(path)}
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--brand-navy)] hover:border-[var(--brand-orange)]"
                  >
                    {path.split("/").filter(Boolean).slice(-1)[0]?.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <AeoFaqSection faqs={config.faqs} className="mt-12" />
      </article>
    </MarketingShell>
  );
}
