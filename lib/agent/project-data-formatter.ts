/**
 * Rich project data formatting for the Project Concierge agent.
 * Surfaces every stored field so the agent can answer deep buyer questions.
 */

import { formatIndianPrice, formatPriceRange, formatSizeRange } from "@/lib/builders/format";
import { estimateEmi } from "@/lib/builders/project-emi";
import { projectPath } from "@/lib/builders/project-paths";
import { appPath } from "@/lib/config";
import type {
  Builder,
  BuilderProject,
  InventorySummary,
  ProjectFaq,
  ProjectUnit,
} from "@/lib/types/builder-microsite";

export function formatUnitDetail(u: ProjectUnit): string {
  const label = u.plotNumber || u.bhk || u.block || u.id.slice(0, 8);
  const parts = [
    label,
    u.status,
    u.price != null ? formatIndianPrice(u.price) : "price TBC",
    u.size != null ? `${u.size} ${u.sizeUnit}` : null,
    u.facing ? `${u.facing} facing` : null,
    u.isCorner ? "corner" : null,
    u.isParkFacing ? "park-facing" : null,
    u.roadWidth ? `${u.roadWidth} road` : null,
    u.bookingAmount != null ? `booking ${formatIndianPrice(u.bookingAmount)}` : null,
    u.notes?.trim() ? u.notes.trim().slice(0, 80) : null,
  ].filter(Boolean);
  return `- ${parts.join(" · ")}`;
}

export function formatBuilderBlock(builder: Builder | null): string {
  if (!builder) return "";
  const lines = [
    builder.establishedYear ? `Est. ${builder.establishedYear}` : null,
    builder.reraNumber ? `RERA ${builder.reraNumber}` : null,
    builder.address ? builder.address : null,
    builder.phone ? `Phone ${builder.phone}` : null,
    builder.website ? builder.website : null,
    builder.description?.trim() ? builder.description.trim().slice(0, 400) : null,
  ].filter(Boolean);
  return lines.length ? `\n### Builder profile\n${lines.join("\n")}` : "";
}

export function formatProjectFaqsBlock(faqs: ProjectFaq[], limit = 8): string {
  if (!faqs.length) return "";
  return `\n### Project FAQs\n${faqs
    .slice(0, limit)
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n")}`;
}

export function formatProjectRichRecord(
  p: BuilderProject,
  opts?: { includeDescription?: boolean; compact?: boolean }
): string {
  const path = appPath(projectPath(p.citySlug, p.slug));
  const emi =
    p.priceMin != null
      ? `EMI ~₹${Math.round(estimateEmi(p.priceMin, 8.5, 20)).toLocaleString("en-IN")}/mo (indicative)`
      : null;

  const assets = [
    p.brochureUrl ? "brochure" : null,
    p.virtualTourUrl ? "virtual tour" : null,
    p.videoUrls.length ? `${p.videoUrls.length} video(s)` : null,
    p.floorPlanUrls.length ? `${p.floorPlanUrls.length} floor plan(s)` : null,
    p.masterPlanImageUrl ? "master plan" : null,
  ]
    .filter(Boolean)
    .join(", ");

  if (opts?.compact) {
    return [
      `**${p.name}** (${p.citySlug}/${p.slug})`,
      `Builder: ${p.builderName} | ${p.projectType} | ${p.status}${p.isFeatured ? " | ★featured" : ""}`,
      `Price: ${formatPriceRange(p.priceMin, p.priceMax)} | Size: ${formatSizeRange(p.sizeMin, p.sizeMax, p.sizeUnit)}`,
      `Inventory: ${p.availableUnits} avail / ${p.totalUnits} total (${p.soldUnits} sold, ${p.reservedUnits} reserved)`,
      p.possessionDate ? `Possession: ${p.possessionDate}` : null,
      p.reraNumber ? `RERA: ${p.reraNumber}` : null,
      p.paymentPlan ? `Payment: ${p.paymentPlan}` : null,
      p.launchDate ? `Launch: ${p.launchDate}` : null,
      p.amenities.length ? `Amenities: ${p.amenities.slice(0, 8).join(", ")}` : null,
      p.nearbyLandmarks.length ? `Near: ${p.nearbyLandmarks.slice(0, 5).join("; ")}` : null,
      emi,
      assets ? `Assets: ${assets}` : null,
      opts.includeDescription && p.description ? `About: ${p.description.slice(0, 280)}` : null,
      `Link: [View project](${path})`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `## ${p.name}`,
    `- **URL:** ${path}`,
    `- **Builder:** ${p.builderName} (${p.builderSlug})`,
    `- **Type / status:** ${p.projectType} · ${p.status}${p.isFeatured ? " · featured" : ""}`,
    `- **City:** ${p.city} (${p.citySlug})`,
    `- **Address:** ${p.address ?? "—"}`,
    p.latitude && p.longitude ? `- **Coords:** ${p.latitude}, ${p.longitude}` : null,
    `- **Price:** ${formatPriceRange(p.priceMin, p.priceMax)}`,
    `- **Size:** ${formatSizeRange(p.sizeMin, p.sizeMax, p.sizeUnit)}`,
    p.totalArea ? `- **Total area:** ${p.totalArea}` : null,
    `- **Units:** ${p.availableUnits} available, ${p.reservedUnits} reserved, ${p.soldUnits} sold (${p.totalUnits} total)`,
    p.possessionDate ? `- **Possession:** ${p.possessionDate}` : null,
    p.launchDate ? `- **Launch:** ${p.launchDate}` : null,
    p.reraNumber ? `- **RERA:** ${p.reraNumber}` : null,
    p.paymentPlan ? `- **Payment plan:** ${p.paymentPlan}` : null,
    emi ? `- **${emi}**` : null,
    p.amenities.length ? `- **Amenities:** ${p.amenities.join(", ")}` : null,
    p.nearbyLandmarks.length ? `- **Landmarks:** ${p.nearbyLandmarks.join("; ")}` : null,
    p.constructionUpdates.length
      ? `- **Construction:** ${p.constructionUpdates.slice(0, 4).join(" | ")}`
      : null,
    p.testimonials.length
      ? `- **Testimonials:** ${p.testimonials.map((t) => `"${t.quote}" — ${t.author}`).join("; ")}`
      : null,
    assets ? `- **Media/assets:** ${assets}` : null,
    p.description?.trim() ? `- **Description:** ${p.description.trim().slice(0, 900)}` : null,
    p.aiSearchSnippet ? `- **AI search / best deal:** ${p.aiSearchSnippet}` : null,
    p.seoKeywords.length ? `- **SEO keywords:** ${p.seoKeywords.slice(0, 20).join(", ")}` : null,
    p.faqs.length ? formatProjectFaqsBlock(p.faqs, 6) : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatProjectAgentContextFull(params: {
  project: BuilderProject;
  builder: Builder | null;
  summary: InventorySummary;
  units: ProjectUnit[];
  similarProjects: BuilderProject[];
}): string {
  const { project: p, builder, summary, units, similarProjects } = params;

  const unitLines = units.slice(0, 25).map(formatUnitDetail);
  const similarLines = similarProjects.slice(0, 5).map((s) =>
    formatProjectRichRecord(s, { compact: true })
  );

  const base = formatProjectRichRecord(p, { includeDescription: true });
  const builderBlock = formatBuilderBlock(builder);
  const projectFaqs = formatProjectFaqsBlock(p.faqs, 10);

  return `${base}
${builderBlock}
${projectFaqs}

### Live inventory (${summary.available} available / ${summary.total} total)
${unitLines.length ? unitLines.join("\n") : "No unit rows — use project-level pricing."}

### Similar projects
${similarLines.length ? similarLines.join("\n\n") : "Use compareSimilarProjects tool."}

Use \`listProjectUnits\` for filtered inventory, \`lookupProjectDetails\` for other projects.`;
}

export function formatProjectsCatalogContext(
  citySlug: string | null,
  projects: BuilderProject[]
): string {
  const pool = citySlug
    ? projects.filter((p) => p.citySlug === citySlug.toLowerCase())
    : projects;

  const byCity = new Map<string, BuilderProject[]>();
  for (const p of pool) {
    const list = byCity.get(p.citySlug) ?? [];
    list.push(p);
    byCity.set(p.citySlug, list);
  }

  const sections: string[] = [
    `## Full Tricity projects catalog (${pool.length} published)`,
    "Complete data for every project — use for budget, type, city, RERA, amenities, payment plan, and comparison questions.",
    "**RentalPins best deal:** Each project includes negotiated-pricing FAQs and SEO keywords — position RentalPins as the buyer's advisor for lowest rate + site visit coordination.",
    "For plot-level details call \`lookupProjectDetails\` then \`listProjectUnits\`.",
    "",
  ];

  for (const [city, cityProjects] of [...byCity.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    sections.push(`### ${city} (${cityProjects.length})`);
    for (const p of cityProjects) {
      sections.push(formatProjectRichRecord(p, { compact: true, includeDescription: true }));
      sections.push("");
    }
  }

  return sections.join("\n").slice(0, 48000);
}

export function searchAllProjectFaqs(
  projects: BuilderProject[],
  query: string,
  limit = 6
): ProjectFaq[] {
  const q = query.trim().toLowerCase();
  const hits: ProjectFaq[] = [];

  for (const p of projects) {
    for (const faq of p.faqs) {
      const blob = `${faq.question} ${faq.answer} ${p.name}`.toLowerCase();
      if (
        !q ||
        blob.includes(q) ||
        q.split(/\s+/).some((t) => t.length > 2 && blob.includes(t))
      ) {
        hits.push({
          question: `[${p.name}] ${faq.question}`,
          answer: faq.answer,
        });
      }
    }
  }

  return hits.slice(0, limit);
}

export function findProjectInCatalog(
  projects: BuilderProject[],
  query: string
): BuilderProject | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  const exact = projects.find((p) => p.slug === q || p.name.toLowerCase() === q);
  if (exact) return exact;

  const partial = projects.filter((p) => {
    const blob = `${p.name} ${p.slug} ${p.builderName} ${p.city}`.toLowerCase();
    return blob.includes(q) || q.split(/\s+/).every((t) => t.length < 3 || blob.includes(t));
  });

  partial.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
    if (bName.startsWith(q) && !aName.startsWith(q)) return 1;
    return aName.localeCompare(bName);
  });

  return partial[0] ?? null;
}
