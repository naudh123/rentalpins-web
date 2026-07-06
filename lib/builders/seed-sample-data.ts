import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import {
  BUILDERS_COL,
  PROJECTS_COL,
  UNITS_COL,
  MASTER_PLANS_COL,
  getBuilderBySlug,
} from "@/lib/builders/builders-server";
import {
  SAMPLE_BUILDER,
  SAMPLE_PROJECT,
  SAMPLE_PLOTS,
  SAMPLE_MASTER_PLAN,
} from "@/lib/builders/sample-data";

export interface SeedSampleResult {
  message: string;
  builderId: string;
  builderSlug: string;
  projectId?: string;
  projectSlug?: string;
  urls: {
    builder: string;
    project: string;
    plots: string;
    masterPlan: string;
  };
}

export async function seedBuilderSampleData(
  createdBy = "dev-seed"
): Promise<SeedSampleResult> {
  const existing = await getBuilderBySlug(SAMPLE_BUILDER.slug);
  if (existing) {
    const projectSnap = await adminDb
      .collection(PROJECTS_COL)
      .where("builderId", "==", existing.id)
      .limit(1)
      .get();
    const projectId = projectSnap.docs[0]?.id;
    return {
      message: "Sample data already exists.",
      builderId: existing.id,
      builderSlug: existing.slug,
      projectId,
      projectSlug: SAMPLE_PROJECT.slug,
      urls: {
        builder: `/builders/${SAMPLE_BUILDER.slug}`,
        project: `/projects/${SAMPLE_PROJECT.citySlug}/${SAMPLE_PROJECT.slug}`,
        plots: `/projects/${SAMPLE_PROJECT.citySlug}/${SAMPLE_PROJECT.slug}/plots`,
        masterPlan: `/projects/${SAMPLE_PROJECT.citySlug}/${SAMPLE_PROJECT.slug}/master-plan`,
      },
    };
  }

  const now = FieldValue.serverTimestamp();
  const builderRef = adminDb.collection(BUILDERS_COL).doc();

  await builderRef.set({
    ...SAMPLE_BUILDER,
    status: "published",
    isFeatured: true,
    builderPlan: "premium",
    planStatus: "active",
    planStartDate: now,
    planEndDate: null,
    featuredUntil: null,
    maxProjects: 10,
    maxLeads: 500,
    allowedModules: ["profile", "microsite", "plot_finder", "crm"],
    viewCount: 0,
    enquiryCount: 0,
    team: [{ name: "Rajesh Kumar", role: "Sales Head", phone: "+91 98765 43210" }],
    createdAt: now,
    updatedAt: now,
    createdBy,
    source: "web",
  });

  const projectRef = adminDb.collection(PROJECTS_COL).doc();
  await projectRef.set({
    builderId: builderRef.id,
    builderName: SAMPLE_BUILDER.name,
    builderSlug: SAMPLE_BUILDER.slug,
    ...SAMPLE_PROJECT,
    totalUnits: SAMPLE_PLOTS.length,
    availableUnits: 1,
    reservedUnits: 1,
    soldUnits: 1,
    isPublished: true,
    isFeatured: true,
    featuredUntil: null,
    seoTitle: `${SAMPLE_PROJECT.name} — Plots in Mohali`,
    seoDescription: SAMPLE_PROJECT.description.slice(0, 160),
    viewCount: 0,
    enquiryCount: 0,
    videoUrls: [],
    constructionUpdates: ["Phase 1 infrastructure complete — March 2026"],
    createdAt: now,
    updatedAt: now,
    createdBy,
    source: "web",
  });

  for (const plot of SAMPLE_PLOTS) {
    await adminDb.collection(UNITS_COL).doc().set({
      projectId: projectRef.id,
      builderId: builderRef.id,
      unitType: "plot",
      plotNumber: plot.plotNumber,
      block: null,
      tower: null,
      floor: null,
      bhk: null,
      size: plot.size,
      sizeUnit: plot.sizeUnit,
      facing: plot.facing,
      roadWidth: "40 ft",
      isCorner: plot.isCorner ?? false,
      isParkFacing: plot.isParkFacing ?? false,
      price: plot.price,
      bookingAmount: plot.price ? Math.round(plot.price * 0.1) : null,
      status: plot.status,
      notes: null,
      imageUrls: [],
      floorPlanUrls: [],
      hotspots: plot.hotspots,
      createdAt: now,
      updatedAt: now,
      source: "web",
    });
  }

  await adminDb.collection(MASTER_PLANS_COL).doc(projectRef.id).set({
    projectId: projectRef.id,
    builderId: builderRef.id,
    defaultImageUrl: SAMPLE_MASTER_PLAN.defaultImageUrl,
    angles: SAMPLE_MASTER_PLAN.angles,
    updatedAt: now,
  });

  return {
    message: "Sample data seeded successfully.",
    builderId: builderRef.id,
    builderSlug: SAMPLE_BUILDER.slug,
    projectId: projectRef.id,
    projectSlug: SAMPLE_PROJECT.slug,
    urls: {
      builder: `/builders/${SAMPLE_BUILDER.slug}`,
      project: `/projects/${SAMPLE_PROJECT.citySlug}/${SAMPLE_PROJECT.slug}`,
      plots: `/projects/${SAMPLE_PROJECT.citySlug}/${SAMPLE_PROJECT.slug}/plots`,
      masterPlan: `/projects/${SAMPLE_PROJECT.citySlug}/${SAMPLE_PROJECT.slug}/master-plan`,
    },
  };
}
