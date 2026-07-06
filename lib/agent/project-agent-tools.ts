import { tool } from "ai";
import { z } from "zod";
import {
  formatIndianPrice,
  formatPriceRange,
  formatSizeRange,
  whatsappLink,
} from "@/lib/builders/format";
import { estimateEmi } from "@/lib/builders/project-emi";
import { projectPath } from "@/lib/builders/project-paths";
import { sendProjectLeadEmail } from "@/lib/builders/project-lead-email";
import { PLATFORM_SALES_PHONE } from "@/lib/builders/project-contact";
import {
  createLead,
  findSimilarProjects,
  listUnitsForProject,
} from "@/lib/builders/builders-server";
import { loadPublishedProjectsPool, loadProjectAgentBundle } from "@/lib/agent/project-agent-context";
import { resolveLeadProjectContext } from "@/lib/agent/project-lead-resolver";
import {
  findProjectInCatalog,
  formatProjectRichRecord,
  formatUnitDetail,
  searchAllProjectFaqs,
} from "@/lib/agent/project-data-formatter";
import {
  searchProjectConciergeFaqs,
  type ProjectAgentBundle,
} from "@/lib/agent/project-agent-knowledge";
import type { CreateLeadInput, BuilderProject } from "@/lib/types/builder-microsite";
import { searchAreaGuides, getMarketInsight } from "@/lib/agent/knowledge";
import { appPath } from "@/lib/config";

export interface ProjectAgentToolCallbacks {
  onEnquirySubmitted?: (params: { leadId: string; name: string }) => void;
  onContactHandoff?: (params: { interest?: string; summary: string }) => void;
  sessionId?: string;
}

async function registerProjectLead(
  params: {
    project: NonNullable<ProjectAgentBundle["project"]> | null;
    citySlug: string | null;
    sessionId?: string;
    interestedProjectName?: string;
    input: Omit<CreateLeadInput, "builderId" | "projectId" | "source">;
  },
  callbacks: ProjectAgentToolCallbacks
) {
  const phone = params.input.phone.replace(/\D/g, "").slice(-10);
  if (phone.length !== 10) {
    return { success: false as const, error: "Invalid phone — need 10-digit Indian mobile." };
  }

  const email = params.input.email?.trim() || "pending@rentalpins.com";

  const ctx = params.project
    ? {
        builderId: params.project.builderId,
        projectId: params.project.id,
        projectName: params.project.name,
        projectSlug: params.project.slug,
        builderName: params.project.builderName,
        citySlug: params.project.citySlug,
      }
    : await resolveLeadProjectContext({
        interestedProjectName: params.interestedProjectName,
        citySlug: params.citySlug,
      });

  if (!ctx) {
    return { success: false as const, error: "Could not resolve project/builder for this lead." };
  }

  const leadPayload: CreateLeadInput = {
    builderId: ctx.builderId,
    projectId: ctx.projectId ?? undefined,
    source: "project_agent",
    ...params.input,
    phone,
    email,
    hearAboutUs: params.input.hearAboutUs ?? "Project AI concierge",
  };

  const leadId = await createLead(leadPayload);

  void sendProjectLeadEmail({
    leadId,
    input: leadPayload,
    projectName: ctx.projectName ?? params.interestedProjectName,
    builderName: ctx.builderName,
    citySlug: ctx.citySlug,
  }).catch(console.error);

  if (params.sessionId) {
    const { adminDb } = await import("@/lib/firebase-admin");
    await adminDb
      .collection("agent_conversations")
      .doc(params.sessionId)
      .set({ leadId, leadCreatedAt: new Date().toISOString() }, { merge: true })
      .catch(console.error);
  }

  callbacks.onEnquirySubmitted?.({ leadId, name: params.input.name });

  const projectLabel = ctx.projectName ?? params.interestedProjectName ?? "Tricity projects";

  return {
    success: true as const,
    leadId,
    message: `Lead registered for ${projectLabel}. Our team at +91 ${PLATFORM_SALES_PHONE} and admin@rentalpins.com will follow up shortly.`,
    whatsAppSales: whatsappLink(
      PLATFORM_SALES_PHONE,
      `New enquiry: ${params.input.name} (${phone}) re: ${projectLabel}. ${params.input.message?.slice(0, 120) ?? ""}`
    ),
    projectPath: ctx.projectId && ctx.citySlug && ctx.projectSlug
      ? appPath(projectPath(ctx.citySlug, ctx.projectSlug))
      : appPath("/projects"),
  };
}

export function createProjectAgentTools(
  bundle: ProjectAgentBundle | null,
  citySlug: string | null,
  callbacks: ProjectAgentToolCallbacks = {},
  projectCatalog: BuilderProject[] = []
) {
  const project = bundle?.project ?? null;

  async function catalogPool() {
    if (projectCatalog.length) return projectCatalog;
    return loadPublishedProjectsPool(citySlug ?? undefined);
  }

  return {
    lookupProjectDetails: tool({
      description:
        "Load COMPLETE data for any Tricity project by name or slug — description, RERA, payment plan, amenities, landmarks, construction updates, FAQs, inventory counts, media. Use for deep questions about any project.",
      inputSchema: z.object({
        query: z.string().describe("Project name or slug, e.g. Gillco Valley or gillco-valley"),
      }),
      execute: async ({ query }) => {
        const pool = await catalogPool();
        const hit = findProjectInCatalog(pool, query);
        if (!hit) {
          return { found: false, message: `No project matching "${query}". Try searchTricityProjects.` };
        }
        const full = await loadProjectAgentBundle(hit.id);
        if (full) {
          const p = full.project;
          return {
            found: true,
            summary: formatProjectRichRecord(p, { includeDescription: true }),
            inventory: full.summary,
            unitSample: full.allUnits.slice(0, 15).map(formatUnitDetail),
            builder: full.builder
              ? { name: full.builder.name, rera: full.builder.reraNumber, est: full.builder.establishedYear }
              : null,
            path: appPath(projectPath(p.citySlug, p.slug)),
          };
        }
        return {
          found: true,
          summary: formatProjectRichRecord(hit, { includeDescription: true }),
          path: appPath(projectPath(hit.citySlug, hit.slug)),
        };
      },
    }),

    getProjectDetails: tool({
      description:
        "Full facts for the current project — pricing, inventory, amenities, RERA, possession, payment plan, landmarks. Always call for project-specific questions.",
      inputSchema: z.object({}),
      execute: async () => {
        if (!bundle) return { error: "No project loaded — use lookupProjectDetails or searchTricityProjects." };
        const p = bundle.project;
        return {
          summary: formatProjectRichRecord(p, { includeDescription: true }),
          name: p.name,
          builder: p.builderName,
          builderProfile: bundle.builder
            ? {
                establishedYear: bundle.builder.establishedYear,
                rera: bundle.builder.reraNumber,
                description: bundle.builder.description?.slice(0, 400),
              }
            : null,
          type: p.projectType,
          status: p.status,
          city: p.city,
          address: p.address,
          totalArea: p.totalArea,
          price: formatPriceRange(p.priceMin, p.priceMax),
          size: formatSizeRange(p.sizeMin, p.sizeMax, p.sizeUnit),
          possession: p.possessionDate,
          launchDate: p.launchDate,
          rera: p.reraNumber,
          paymentPlan: p.paymentPlan,
          amenities: p.amenities,
          landmarks: p.nearbyLandmarks,
          constructionUpdates: p.constructionUpdates,
          testimonials: p.testimonials,
          videos: p.videoUrls,
          virtualTour: p.virtualTourUrl,
          brochure: p.brochureUrl,
          floorPlans: p.floorPlanUrls.length,
          faqs: p.faqs,
          inventory: bundle.summary,
          units: bundle.allUnits.slice(0, 20).map(formatUnitDetail),
          emiAtMinPrice:
            p.priceMin != null
              ? Math.round(estimateEmi(p.priceMin, 8.5, 20))
              : null,
          path: appPath(projectPath(p.citySlug, p.slug)),
          salesPhone: PLATFORM_SALES_PHONE,
        };
      },
    }),

    listProjectUnits: tool({
      description: "Filter live plot/unit inventory — use for specific plot numbers, facing, budget caps.",
      inputSchema: z.object({
        status: z
          .enum(["available", "reserved", "sold", "coming-soon", "all"])
          .optional(),
        maxPriceCr: z.number().optional(),
        minSize: z.number().optional(),
        facing: z.string().optional(),
        projectName: z.string().optional().describe("Required on directory chat when no active project"),
        limit: z.number().min(1).max(40).optional(),
      }),
      execute: async ({ status, maxPriceCr, minSize, facing, limit, projectName }) => {
        let targetProject = project;
        if (projectName && !targetProject) {
          const pool = await catalogPool();
          targetProject = findProjectInCatalog(pool, projectName);
        }
        if (!targetProject) {
          return { units: [], message: "Specify projectName or open a project page." };
        }
        let units = await listUnitsForProject(targetProject.id);
        if (status && status !== "all") units = units.filter((u) => u.status === status);
        if (maxPriceCr)
          units = units.filter((u) => (u.price ?? Infinity) <= maxPriceCr * 1_00_00_000);
        if (minSize) units = units.filter((u) => (u.size ?? 0) >= minSize);
        if (facing) units = units.filter((u) => u.facing?.toLowerCase().includes(facing.toLowerCase()));
        return {
          project: targetProject.name,
          units: units.slice(0, limit ?? 20).map((u) => ({
            id: u.id,
            plot: u.plotNumber,
            status: u.status,
            price: formatIndianPrice(u.price),
            size: u.size,
            sizeUnit: u.sizeUnit,
            facing: u.facing,
            bhk: u.bhk,
          })),
          total: units.length,
        };
      },
    }),

    compareSimilarProjects: tool({
      description: "Compare this project with similar Tricity developments — price, type, city.",
      inputSchema: z.object({ limit: z.number().min(1).max(6).optional() }),
      execute: async ({ limit }) => {
        if (!project) return { projects: [], message: "Use searchTricityProjects on directory." };
        const similar = await findSimilarProjects(project, limit ?? 4);
        return {
          projects: similar.map((s) => ({
            name: s.name,
            builder: s.builderName,
            city: s.city,
            type: s.projectType,
            status: s.status,
            price: formatPriceRange(s.priceMin, s.priceMax),
            amenities: s.amenities.slice(0, 6),
            path: appPath(projectPath(s.citySlug, s.slug)),
          })),
        };
      },
    }),

    searchTricityProjects: tool({
      description:
        "Search all published Tricity projects — returns rich rows for recommendations. Use liberally to answer budget/city/type questions.",
      inputSchema: z.object({
        query: z.string(),
        citySlug: z.string().optional(),
        projectType: z.string().optional(),
        limit: z.number().optional(),
      }),
      execute: async ({ query, citySlug: cs, projectType, limit }) => {
        const pool = await catalogPool();
        const scoped = cs ?? citySlug ? pool.filter((p) => p.citySlug === (cs ?? citySlug)?.toLowerCase()) : pool;
        const q = query.toLowerCase();
        let hits = scoped.filter((p) => {
          const blob = `${p.name} ${p.city} ${p.builderName} ${p.projectType} ${p.address ?? ""} ${p.description ?? ""} ${p.amenities.join(" ")} ${p.nearbyLandmarks.join(" ")}`.toLowerCase();
          return blob.includes(q) || q.split(/\s+/).some((t) => t.length > 2 && blob.includes(t));
        });
        if (projectType) hits = hits.filter((p) => p.projectType === projectType);
        return {
          projects: hits.slice(0, limit ?? 10).map((p) => ({
            record: formatProjectRichRecord(p, { compact: true, includeDescription: true }),
            path: appPath(projectPath(p.citySlug, p.slug)),
          })),
          total: hits.length,
        };
      },
    }),

    estimateProjectEmi: tool({
      description: "Indicative home-loan EMI for a price point.",
      inputSchema: z.object({
        priceLakh: z.number().optional(),
        ratePercent: z.number().optional(),
        tenureYears: z.number().optional(),
      }),
      execute: async ({ priceLakh, ratePercent, tenureYears }) => {
        const principal =
          (priceLakh ?? (project?.priceMin ? project.priceMin / 1_00_000 : 100)) * 1_00_000;
        const emi = estimateEmi(principal, ratePercent ?? 8.5, tenureYears ?? 20);
        return {
          principalInr: principal,
          emiPerMonth: Math.round(emi),
          note: "Indicative only — not a loan offer. Confirm with your bank.",
        };
      },
    }),

    searchProjectFaqs: tool({
      description:
        "Search buyer FAQs — platform concierge + every project's own FAQ entries (RERA, payment, site visit, NRI).",
      inputSchema: z.object({ query: z.string() }),
      execute: async ({ query }) => {
        const pool = await catalogPool();
        const platform = searchProjectConciergeFaqs(query, 4);
        const projectFaqs = searchAllProjectFaqs(pool, query, 6);
        return { faqs: [...platform, ...projectFaqs].slice(0, 8) };
      },
    }),

    getAreaContext: tool({
      description: "Market context for a city/area — buyer profile, price bands, investment notes.",
      inputSchema: z.object({ hubSlug: z.string().optional() }),
      execute: async ({ hubSlug }) => {
        const slug = hubSlug ?? project?.citySlug ?? citySlug ?? "mohali";
        return {
          insight: getMarketInsight(slug, "buy"),
          guides: searchAreaGuides(slug, 3),
        };
      },
    }),

    captureConversationLead: tool({
      description:
        "PRIMARY CONVERSION TOOL — register every qualified conversation. REQUIRES name, phone, AND budgetRange (email optional). Call in the SAME turn when user shares phone or all fields. Re-use budget from earlier user messages if already stated.",
      inputSchema: z.object({
        name: z.string(),
        phone: z.string().describe("10-digit Indian mobile"),
        email: z.string().email().optional().describe("Optional — use pending@rentalpins.com if refused"),
        budgetRange: z
          .string()
          .describe("Required — e.g. ₹80 lakh, 50L–1Cr, under 1.5 crore. Ask user if missing."),
        interestedProjectName: z.string().optional(),
        message: z.string().optional(),
        buyingTimeline: z.string().optional(),
        preferredSize: z.string().optional(),
        purchasePurpose: z.string().optional(),
        preferredVisitDate: z.string().optional(),
        unitInterest: z.string().optional(),
      }),
      execute: async (input) => {
        return registerProjectLead(
          {
            project,
            citySlug,
            sessionId: callbacks.sessionId,
            interestedProjectName: input.interestedProjectName,
            input: {
              name: input.name.trim(),
              phone: input.phone,
              email: input.email?.trim() || "pending@rentalpins.com",
              message: input.message ?? input.unitInterest,
              preferredVisitDate: input.preferredVisitDate,
              budgetRange: input.budgetRange,
              buyingTimeline: input.buyingTimeline,
              preferredSize: input.preferredSize ?? input.unitInterest,
              purchasePurpose: input.purchasePurpose,
            },
          },
          callbacks
        );
      },
    }),

    submitProjectEnquiry: tool({
      description:
        "Register enquiry when user confirms interest in a specific project. REQUIRES name, phone, and budgetRange (email optional).",
      inputSchema: z.object({
        name: z.string(),
        phone: z.string().describe("10-digit Indian mobile"),
        email: z.string().email().optional(),
        budgetRange: z.string().describe("Required — user's budget band in ₹ lakh/crore"),
        message: z.string().optional(),
        buyingTimeline: z.string().optional(),
        preferredSize: z.string().optional(),
        purchasePurpose: z.string().optional(),
        preferredVisitDate: z.string().optional(),
        unitInterest: z.string().optional(),
        interestedProjectName: z.string().optional(),
      }),
      execute: async (input) => {
        return registerProjectLead(
          {
            project,
            citySlug,
            sessionId: callbacks.sessionId,
            interestedProjectName: input.interestedProjectName ?? project?.name,
            input: {
              name: input.name.trim(),
              phone: input.phone,
              email: input.email?.trim() || "pending@rentalpins.com",
              message: input.message ?? input.unitInterest,
              preferredVisitDate: input.preferredVisitDate,
              budgetRange: input.budgetRange,
              buyingTimeline: input.buyingTimeline,
              preferredSize: input.preferredSize ?? input.unitInterest,
              purchasePurpose: input.purchasePurpose,
            },
          },
          callbacks
        );
      },
    }),

    scheduleSiteVisit: tool({
      description: "Book site visit — requires name, phone, budgetRange, and preferred date (email optional).",
      inputSchema: z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string().email().optional(),
        budgetRange: z.string().describe("Required — user's budget band"),
        preferredVisitDate: z.string(),
        notes: z.string().optional(),
        interestedProjectName: z.string().optional(),
      }),
      execute: async (input) => {
        return registerProjectLead(
          {
            project,
            citySlug,
            sessionId: callbacks.sessionId,
            interestedProjectName: input.interestedProjectName ?? project?.name,
            input: {
              name: input.name.trim(),
              phone: input.phone,
              email: input.email?.trim() || "pending@rentalpins.com",
              preferredVisitDate: input.preferredVisitDate,
              budgetRange: input.budgetRange,
              buyingTimeline: "Site visit requested",
              message: input.notes ?? `Site visit on ${input.preferredVisitDate}`,
            },
          },
          callbacks
        );
      },
    }),

    connectToSales: tool({
      description:
        "WhatsApp handoff to 9915061640. Still call captureConversationLead if you have phone + budget.",
      inputSchema: z.object({
        summary: z.string(),
        interest: z.string().optional(),
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      }),
      execute: async ({ summary, interest, name, phone, email }) => {
        callbacks.onContactHandoff?.({ summary, interest });

        if (name && phone && email && callbacks.sessionId) {
          await registerProjectLead(
            {
              project,
              citySlug,
              sessionId: callbacks.sessionId,
              interestedProjectName: project?.name,
              input: {
                name,
                phone,
                email,
                message: summary,
              },
            },
            callbacks
          ).catch(console.error);
        }

        return {
          phone: PLATFORM_SALES_PHONE,
          email: "admin@rentalpins.com",
          whatsAppUrl: whatsappLink(
            PLATFORM_SALES_PHONE,
            `Hi RentalPins, ${name ? `${name} (${phone ?? ""}, ${email ?? ""})` : "buyer"} re: ${project?.name ?? "Tricity project"}. ${summary.slice(0, 200)}`
          ),
          message: "Sales team notified. Use captureConversationLead for guaranteed CRM entry.",
        };
      },
    }),
  };
}
