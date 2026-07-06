import { FieldValue, type Timestamp } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";
import { adminDb, safeAdminRead } from "@/lib/firebase-admin";
import { slugify } from "@/lib/builders/format";
import { catalogCoordinates } from "@/lib/builders/tricity-coordinates";
import { rankSimilarProjects } from "@/lib/builders/similar-projects";
import { mergeProjectEnrichment } from "@/lib/builders/project-enrichment";
import { buildDummyInventoryForProject } from "@/lib/builders/project-dummy-inventory";
import type {
  Builder,
  BuilderProject,
  BuilderStatus,
  CreateBuilderInput,
  CreateLeadInput,
  CreateProjectInput,
  CreateSelfServiceProjectInput,
  CreateUnitInput,
  InventorySummary,
  ProjectLead,
  ProjectMasterPlan,
  ProjectUnit,
  UnitStatus,
} from "@/lib/types/builder-microsite";

export const BUILDERS_COL = "builders";
export const PROJECTS_COL = "builder_projects";
export const UNITS_COL = "project_units";
export const LEADS_COL = "project_leads";
export const MASTER_PLANS_COL = "project_master_plans";

function readDb<T>(fn: (db: Firestore) => Promise<T>, fallback: T): Promise<T> {
  return safeAdminRead(fn, fallback);
}

function tsToMs(v: unknown): number {
  if (v && typeof v === "object" && "toMillis" in v) {
    return (v as Timestamp).toMillis();
  }
  return 0;
}

function docToBuilder(id: string, data: Record<string, unknown>): Builder {
  return {
    id,
    name: (data.name as string) || "",
    slug: (data.slug as string) || "",
    description: (data.description as string) || "",
    logoUrl: (data.logoUrl as string) || null,
    coverImageUrl: (data.coverImageUrl as string) || null,
    phone: (data.phone as string) || null,
    whatsapp: (data.whatsapp as string) || null,
    email: (data.email as string) || null,
    website: (data.website as string) || null,
    address: (data.address as string) || null,
    city: (data.city as string) || null,
    state: (data.state as string) || null,
    country: (data.country as string) || "India",
    reraNumber: (data.reraNumber as string) || null,
    establishedYear:
      typeof data.establishedYear === "number" ? data.establishedYear : null,
    socialLinks: (data.socialLinks as Builder["socialLinks"]) || {},
    galleryUrls: Array.isArray(data.galleryUrls) ? (data.galleryUrls as string[]) : [],
    team: Array.isArray(data.team) ? (data.team as Builder["team"]) : [],
    status: (data.status as BuilderStatus) || "draft",
    isFeatured: data.isFeatured === true,
    builderPlan: (data.builderPlan as Builder["builderPlan"]) || "basic",
    planStatus: (data.planStatus as Builder["planStatus"]) || "trial",
    planStartDateMs: tsToMs(data.planStartDate) || null,
    planEndDateMs: tsToMs(data.planEndDate) || null,
    featuredUntilMs: tsToMs(data.featuredUntil) || null,
    maxProjects: typeof data.maxProjects === "number" ? data.maxProjects : 5,
    maxLeads: typeof data.maxLeads === "number" ? data.maxLeads : 100,
    allowedModules: Array.isArray(data.allowedModules)
      ? (data.allowedModules as string[])
      : ["profile", "microsite"],
    viewCount: typeof data.viewCount === "number" ? data.viewCount : 0,
    enquiryCount: typeof data.enquiryCount === "number" ? data.enquiryCount : 0,
    createdAtMs: tsToMs(data.createdAt),
    updatedAtMs: tsToMs(data.updatedAt),
    createdBy: (data.createdBy as string) || null,
    ownerUserId: (data.ownerUserId as string) || null,
    leadRouting: (data.leadRouting as Builder["leadRouting"]) || "platform",
    source: "web",
  };
}

function sortByUpdatedAtMs<T extends { updatedAtMs: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.updatedAtMs - a.updatedAtMs);
}

async function enrichProjectsBuilderSlug(
  projects: BuilderProject[]
): Promise<BuilderProject[]> {
  const needsSlug = projects.filter((p) => !p.builderSlug?.trim() && p.builderId);
  if (needsSlug.length === 0) return projects;

  const slugByBuilderId = new Map<string, string>();
  const builderIds = [...new Set(needsSlug.map((p) => p.builderId))];

  await Promise.all(
    builderIds.map(async (id) => {
      const builder = await getBuilderById(id);
      if (builder?.slug) slugByBuilderId.set(id, builder.slug);
    })
  );

  return projects.map((p) => {
    if (p.builderSlug?.trim()) return p;
    const slug = slugByBuilderId.get(p.builderId);
    return slug ? { ...p, builderSlug: slug } : p;
  });
}

function applyVerifiedCatalogCoordinates(project: BuilderProject): BuilderProject {
  const verified = catalogCoordinates(project.slug, {
    latitude: project.latitude ?? undefined,
    longitude: project.longitude ?? undefined,
  });
  const enriched = mergeProjectEnrichment(
    verified
      ? { ...project, latitude: verified.latitude, longitude: verified.longitude }
      : project
  );
  return enriched;
}

function docToProject(id: string, data: Record<string, unknown>): BuilderProject {
  return applyVerifiedCatalogCoordinates({
    id,
    builderId: (data.builderId as string) || "",
    builderName: (data.builderName as string) || "",
    builderSlug: (data.builderSlug as string) || "",
    name: (data.name as string) || "",
    slug: (data.slug as string) || "",
    description: (data.description as string) || "",
    projectType: (data.projectType as BuilderProject["projectType"]) || "plots",
    status: (data.status as BuilderProject["status"]) || "ongoing",
    reraNumber: (data.reraNumber as string) || null,
    address: (data.address as string) || null,
    city: (data.city as string) || "",
    citySlug: (data.citySlug as string) || "",
    state: (data.state as string) || null,
    country: (data.country as string) || "India",
    latitude: typeof data.latitude === "number" ? data.latitude : null,
    longitude: typeof data.longitude === "number" ? data.longitude : null,
    totalArea: (data.totalArea as string) || null,
    totalUnits: typeof data.totalUnits === "number" ? data.totalUnits : 0,
    availableUnits: typeof data.availableUnits === "number" ? data.availableUnits : 0,
    reservedUnits: typeof data.reservedUnits === "number" ? data.reservedUnits : 0,
    soldUnits: typeof data.soldUnits === "number" ? data.soldUnits : 0,
    comingSoonUnits: typeof data.comingSoonUnits === "number" ? data.comingSoonUnits : 0,
    priceMin: typeof data.priceMin === "number" ? data.priceMin : null,
    priceMax: typeof data.priceMax === "number" ? data.priceMax : null,
    sizeMin: typeof data.sizeMin === "number" ? data.sizeMin : null,
    sizeMax: typeof data.sizeMax === "number" ? data.sizeMax : null,
    sizeUnit: (data.sizeUnit as BuilderProject["sizeUnit"]) || "sq-yd",
    possessionDate: (data.possessionDate as string) || null,
    amenities: Array.isArray(data.amenities) ? (data.amenities as string[]) : [],
    galleryUrls: Array.isArray(data.galleryUrls) ? (data.galleryUrls as string[]) : [],
    videoUrls: Array.isArray(data.videoUrls) ? (data.videoUrls as string[]) : [],
    brochureUrl: (data.brochureUrl as string) || null,
    paymentPlan: (data.paymentPlan as string) || null,
    faqs: Array.isArray(data.faqs) ? (data.faqs as BuilderProject["faqs"]) : [],
    nearbyLandmarks: Array.isArray(data.nearbyLandmarks)
      ? (data.nearbyLandmarks as string[])
      : [],
    constructionUpdates: Array.isArray(data.constructionUpdates)
      ? (data.constructionUpdates as string[])
      : [],
    masterPlanImageUrl: (data.masterPlanImageUrl as string) || null,
    virtualTourUrl: (data.virtualTourUrl as string) || null,
    launchDate: (data.launchDate as string) || null,
    floorPlanUrls: Array.isArray(data.floorPlanUrls) ? (data.floorPlanUrls as string[]) : [],
    testimonials: Array.isArray(data.testimonials)
      ? (data.testimonials as BuilderProject["testimonials"])
      : [],
    isPublished: data.isPublished === true,
    isFeatured: data.isFeatured === true,
    featuredUntilMs: tsToMs(data.featuredUntil) || null,
    seoTitle: (data.seoTitle as string) || null,
    seoDescription: (data.seoDescription as string) || null,
    seoKeywords: Array.isArray(data.seoKeywords)
      ? (data.seoKeywords as string[])
      : [],
    aiSearchSnippet: (data.aiSearchSnippet as string) || null,
    viewCount: typeof data.viewCount === "number" ? data.viewCount : 0,
    enquiryCount: typeof data.enquiryCount === "number" ? data.enquiryCount : 0,
    createdAtMs: tsToMs(data.createdAt),
    updatedAtMs: tsToMs(data.updatedAt),
    createdBy: (data.createdBy as string) || null,
    ownerUserId: (data.ownerUserId as string) || null,
    leadRouting: (data.leadRouting as BuilderProject["leadRouting"]) || "platform",
    source: "web",
  });
}

export function docToUnit(id: string, data: Record<string, unknown>): ProjectUnit {
  return {
    id,
    projectId: (data.projectId as string) || "",
    builderId: (data.builderId as string) || "",
    unitType: (data.unitType as ProjectUnit["unitType"]) || "plot",
    plotNumber: (data.plotNumber as string) || null,
    block: (data.block as string) || null,
    tower: (data.tower as string) || null,
    floor: typeof data.floor === "number" ? data.floor : null,
    bhk: (data.bhk as string) || null,
    size: typeof data.size === "number" ? data.size : null,
    sizeUnit: (data.sizeUnit as ProjectUnit["sizeUnit"]) || "sq-yd",
    facing: (data.facing as string) || null,
    roadWidth: (data.roadWidth as string) || null,
    isCorner: data.isCorner === true,
    isParkFacing: data.isParkFacing === true,
    price: typeof data.price === "number" ? data.price : null,
    bookingAmount: typeof data.bookingAmount === "number" ? data.bookingAmount : null,
    status: (data.status as UnitStatus) || "available",
    notes: (data.notes as string) || null,
    imageUrls: Array.isArray(data.imageUrls) ? (data.imageUrls as string[]) : [],
    floorPlanUrls: Array.isArray(data.floorPlanUrls)
      ? (data.floorPlanUrls as string[])
      : [],
    hotspots: (data.hotspots as ProjectUnit["hotspots"]) || {},
    createdAtMs: tsToMs(data.createdAt),
    updatedAtMs: tsToMs(data.updatedAt),
    source: "web",
  };
}

function docToLead(id: string, data: Record<string, unknown>): ProjectLead {
  return {
    id,
    builderId: (data.builderId as string) || "",
    projectId: (data.projectId as string) || null,
    unitId: (data.unitId as string) || null,
    projectName: (data.projectName as string) || null,
    citySlug: (data.citySlug as string) || null,
    source: (data.source as ProjectLead["source"]) || "project_page",
    name: (data.name as string) || "",
    phone: (data.phone as string) || "",
    email: (data.email as string) || null,
    message: (data.message as string) || null,
    preferredVisitDate: (data.preferredVisitDate as string) || null,
    budgetRange: (data.budgetRange as string) || null,
    preferredSize: (data.preferredSize as string) || null,
    buyingTimeline: (data.buyingTimeline as string) || null,
    purchasePurpose: (data.purchasePurpose as string) || null,
    hearAboutUs: (data.hearAboutUs as string) || null,
    leadStatus: (data.leadStatus as ProjectLead["leadStatus"]) || "new",
    notes: (data.notes as string) || null,
    assignedTo: (data.assignedTo as string) || null,
    followUpDateMs: tsToMs(data.followUpDate) || null,
    createdAtMs: tsToMs(data.createdAt),
    updatedAtMs: tsToMs(data.updatedAt),
    source_channel: "web",
    platformManaged: data.platformManaged !== false,
    visibleToBuilder: data.visibleToBuilder === true,
    leadSoldAtMs: tsToMs(data.leadSoldAt) || null,
  };
}

// ── Builders ──

export async function getPublishedBuilderBySlug(
  slug: string
): Promise<Builder | null> {
  return readDb(async (db) => {
    const snap = await db
      .collection(BUILDERS_COL)
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return docToBuilder(doc.id, doc.data() as Record<string, unknown>);
  }, null);
}

export async function getBuilderBySlug(slug: string): Promise<Builder | null> {
  return readDb(async (db) => {
    const snap = await db
      .collection(BUILDERS_COL)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return docToBuilder(doc.id, doc.data() as Record<string, unknown>);
  }, null);
}

export async function getBuilderById(id: string): Promise<Builder | null> {
  return readDb(async (db) => {
    const snap = await db.collection(BUILDERS_COL).doc(id).get();
    if (!snap.exists) return null;
    return docToBuilder(snap.id, snap.data() as Record<string, unknown>);
  }, null);
}

export async function getBuilderByOwnerUserId(
  ownerUserId: string
): Promise<Builder | null> {
  return readDb(async (db) => {
    const snap = await db
      .collection(BUILDERS_COL)
      .where("ownerUserId", "==", ownerUserId)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return docToBuilder(doc.id, doc.data() as Record<string, unknown>);
  }, null);
}

export async function linkBuilderUser(
  userId: string,
  builderId: string,
  role: "builder_admin" | "builder_sales" = "builder_admin"
): Promise<void> {
  const existing = await adminDb
    .collection("builder_users")
    .where("userId", "==", userId)
    .where("builderId", "==", builderId)
    .limit(1)
    .get();
  if (!existing.empty) return;

  const ref = adminDb.collection("builder_users").doc();
  await ref.set({
    userId,
    builderId,
    role,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function listBuilders(publishedOnly = false): Promise<Builder[]> {
  return readDb(async (db) => {
    const snap = await db.collection(BUILDERS_COL).limit(200).get();
    let builders = snap.docs.map((d) => docToBuilder(d.id, d.data() as Record<string, unknown>));
    if (publishedOnly) {
      builders = builders.filter((b) => b.status === "published");
    }
    return sortByUpdatedAtMs(builders).slice(0, 100);
  }, []);
}

export async function createBuilder(
  input: CreateBuilderInput,
  createdBy: string,
  opts?: { ownerUserId?: string; leadRouting?: Builder["leadRouting"] }
): Promise<string> {
  const ref = adminDb.collection(BUILDERS_COL).doc();
  const now = FieldValue.serverTimestamp();
  await ref.set({
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase(),
    description: input.description?.trim() || "",
    logoUrl: input.logoUrl || null,
    coverImageUrl: input.coverImageUrl || null,
    phone: input.phone || null,
    whatsapp: input.whatsapp || input.phone || null,
    email: input.email || null,
    website: input.website || null,
    address: input.address || null,
    city: input.city || null,
    state: input.state || null,
    country: "India",
    reraNumber: input.reraNumber || null,
    establishedYear: input.establishedYear ?? null,
    socialLinks: {},
    galleryUrls: [],
    team: [],
    status: "draft",
    isFeatured: false,
    builderPlan: "basic",
    planStatus: "trial",
    planStartDate: null,
    planEndDate: null,
    featuredUntil: null,
    maxProjects: 5,
    maxLeads: 100,
    allowedModules: ["profile", "microsite"],
    viewCount: 0,
    enquiryCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy,
    ownerUserId: opts?.ownerUserId ?? null,
    leadRouting: opts?.leadRouting ?? "platform",
    source: "web",
  });
  return ref.id;
}

export async function updateBuilder(
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  await adminDb
    .collection(BUILDERS_COL)
    .doc(id)
    .update({ ...patch, updatedAt: FieldValue.serverTimestamp() });
}

// ── Projects ──

export async function getPublishedProjectBySlug(
  slug: string
): Promise<BuilderProject | null> {
  return readDb(async (db) => {
    const snap = await db
      .collection(PROJECTS_COL)
      .where("slug", "==", slug)
      .where("isPublished", "==", true)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return docToProject(doc.id, doc.data() as Record<string, unknown>);
  }, null);
}

export async function getProjectBySlugAndCity(
  citySlug: string,
  slug: string
): Promise<BuilderProject | null> {
  return readDb(async (db) => {
    const snap = await db
      .collection(PROJECTS_COL)
      .where("citySlug", "==", citySlug)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    const project = docToProject(doc.id, doc.data() as Record<string, unknown>);
    if (!project.isPublished) return null;
    return project;
  }, null);
}

export async function getProjectById(id: string): Promise<BuilderProject | null> {
  return readDb(async (db) => {
    const snap = await db.collection(PROJECTS_COL).doc(id).get();
    if (!snap.exists) return null;
    return docToProject(snap.id, snap.data() as Record<string, unknown>);
  }, null);
}

export async function listProjectsForBuilder(
  builderId: string,
  publishedOnly = false
): Promise<BuilderProject[]> {
  return readDb(async (db) => {
    const snap = await db
      .collection(PROJECTS_COL)
      .where("builderId", "==", builderId)
      .limit(100)
      .get();
    let projects = snap.docs.map((d) => docToProject(d.id, d.data() as Record<string, unknown>));
    if (publishedOnly) {
      projects = projects.filter((p) => p.isPublished);
    }
    projects = await enrichProjectsBuilderSlug(projects);
    return sortByUpdatedAtMs(projects).slice(0, 50);
  }, []);
}

export async function listProjects(publishedOnly = false): Promise<BuilderProject[]> {
  return readDb(async (db) => {
    const snap = await db.collection(PROJECTS_COL).limit(200).get();
    let projects = snap.docs.map((d) => docToProject(d.id, d.data() as Record<string, unknown>));
    if (publishedOnly) {
      projects = projects.filter((p) => p.isPublished);
    }
    projects = await enrichProjectsBuilderSlug(projects);
    return sortByUpdatedAtMs(projects).slice(0, 100);
  }, []);
}

export async function listProjectsByCity(
  citySlug: string,
  publishedOnly = true
): Promise<BuilderProject[]> {
  return readDb(async (db) => {
    const snap = await db
      .collection(PROJECTS_COL)
      .where("citySlug", "==", citySlug.toLowerCase())
      .limit(100)
      .get();
    let projects = snap.docs.map((d) => docToProject(d.id, d.data() as Record<string, unknown>));
    if (publishedOnly) {
      projects = projects.filter((p) => p.isPublished);
    }
    projects = await enrichProjectsBuilderSlug(projects);
    return sortByUpdatedAtMs(projects).slice(0, 50);
  }, []);
}

export async function findSimilarProjects(
  project: BuilderProject,
  limit = 4
): Promise<BuilderProject[]> {
  const [cityProjects, allProjects] = await Promise.all([
    listProjectsByCity(project.citySlug),
    listProjects(true),
  ]);
  const pool = cityProjects.length >= limit + 1 ? cityProjects : allProjects;
  return rankSimilarProjects(project, pool, limit);
}

export async function createProject(
  input: CreateProjectInput,
  createdBy: string,
  opts?: { ownerUserId?: string; leadRouting?: BuilderProject["leadRouting"] }
): Promise<string> {
  const builder = await getBuilderById(input.builderId);
  if (!builder) throw new Error("Builder not found");

  const ref = adminDb.collection(PROJECTS_COL).doc();
  const now = FieldValue.serverTimestamp();
  const ownerUserId = opts?.ownerUserId ?? builder.ownerUserId;
  const leadRouting = opts?.leadRouting ?? builder.leadRouting ?? "platform";
  await ref.set({
    builderId: input.builderId,
    builderName: builder.name,
    builderSlug: builder.slug,
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase(),
    description: input.description?.trim() || "",
    projectType: input.projectType,
    status: input.status || "ongoing",
    reraNumber: null,
    address: null,
    city: input.citySlug.charAt(0).toUpperCase() + input.citySlug.slice(1),
    citySlug: input.citySlug.toLowerCase(),
    state: "Punjab",
    country: "India",
    latitude: null,
    longitude: null,
    totalArea: null,
    totalUnits: 0,
    availableUnits: 0,
    reservedUnits: 0,
    soldUnits: 0,
    comingSoonUnits: 0,
    priceMin: null,
    priceMax: null,
    sizeMin: null,
    sizeMax: null,
    sizeUnit: "sq-yd",
    possessionDate: null,
    amenities: [],
    galleryUrls: [],
    videoUrls: [],
    brochureUrl: null,
    paymentPlan: null,
    faqs: [],
    nearbyLandmarks: [],
    constructionUpdates: [],
    masterPlanImageUrl: null,
    virtualTourUrl: null,
    launchDate: null,
    floorPlanUrls: [],
    testimonials: [],
    isPublished: false,
    isFeatured: false,
    featuredUntil: null,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: [],
    aiSearchSnippet: null,
    viewCount: 0,
    enquiryCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy,
    ownerUserId,
    leadRouting,
    source: "web",
  });
  return ref.id;
}

export async function listProjectsForOwner(
  ownerUserId: string
): Promise<BuilderProject[]> {
  return readDb(async (db) => {
    const snap = await db
      .collection(PROJECTS_COL)
      .where("ownerUserId", "==", ownerUserId)
      .limit(100)
      .get();
    return sortByUpdatedAtMs(
      snap.docs.map((d) => docToProject(d.id, d.data() as Record<string, unknown>))
    ).slice(0, 50);
  }, []);
}

export async function publishBuilderWhenProjectPublished(
  builderId: string
): Promise<void> {
  const builder = await getBuilderById(builderId);
  if (!builder || builder.status === "published") return;
  await updateBuilder(builderId, { status: "published" });
}

export async function updateProject(
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  await adminDb
    .collection(PROJECTS_COL)
    .doc(id)
    .update({ ...patch, updatedAt: FieldValue.serverTimestamp() });
}

export async function syncProjectUnitCounts(projectId: string): Promise<void> {
  const units = await listUnitsForProject(projectId);
  const summary = computeInventorySummary(units);
  await updateProject(projectId, {
    totalUnits: summary.total,
    availableUnits: summary.available,
    reservedUnits: summary.reserved,
    soldUnits: summary.sold,
  });
}

// ── Units ──

export async function listUnitsForProject(projectId: string): Promise<ProjectUnit[]> {
  return readDb(async (db) => {
    const snap = await db
      .collection(UNITS_COL)
      .where("projectId", "==", projectId)
      .get();
    const units = snap.docs.map((d) => docToUnit(d.id, d.data() as Record<string, unknown>));
    return units.sort((a, b) =>
      (a.plotNumber || "").localeCompare(b.plotNumber || "", undefined, { numeric: true })
    );
  }, []);
}

export async function getUnitById(id: string): Promise<ProjectUnit | null> {
  return readDb(async (db) => {
    const snap = await db.collection(UNITS_COL).doc(id).get();
    if (!snap.exists) return null;
    return docToUnit(snap.id, snap.data() as Record<string, unknown>);
  }, null);
}

export async function createUnit(input: CreateUnitInput): Promise<string> {
  const project = await getProjectById(input.projectId);
  if (!project) throw new Error("Project not found");

  const ref = adminDb.collection(UNITS_COL).doc();
  const now = FieldValue.serverTimestamp();
  await ref.set({
    projectId: input.projectId,
    builderId: project.builderId,
    unitType: input.unitType || "plot",
    plotNumber: input.plotNumber || null,
    block: null,
    tower: null,
    floor: null,
    bhk: null,
    size: input.size ?? null,
    sizeUnit: input.sizeUnit || "sq-yd",
    facing: input.facing || null,
    roadWidth: null,
    isCorner: false,
    isParkFacing: false,
    price: input.price ?? null,
    bookingAmount: null,
    status: input.status || "available",
    notes: null,
    imageUrls: [],
    floorPlanUrls: [],
    hotspots: {},
    createdAt: now,
    updatedAt: now,
    source: "web",
  });
  await syncProjectUnitCounts(input.projectId);
  return ref.id;
}

export async function updateUnit(
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  const unit = await getUnitById(id);
  await adminDb
    .collection(UNITS_COL)
    .doc(id)
    .update({ ...patch, updatedAt: FieldValue.serverTimestamp() });
  if (unit) await syncProjectUnitCounts(unit.projectId);
}

export async function deleteUnit(id: string): Promise<void> {
  const unit = await getUnitById(id);
  await adminDb.collection(UNITS_COL).doc(id).delete();
  if (unit) await syncProjectUnitCounts(unit.projectId);
}

export function computeInventorySummary(units: ProjectUnit[]): InventorySummary {
  const summary: InventorySummary = {
    total: units.length,
    available: 0,
    reserved: 0,
    sold: 0,
    comingSoon: 0,
    hold: 0,
    notReleased: 0,
  };
  for (const u of units) {
    switch (u.status) {
      case "available":
        summary.available++;
        break;
      case "reserved":
        summary.reserved++;
        break;
      case "sold":
        summary.sold++;
        break;
      case "coming-soon":
        summary.comingSoon++;
        break;
      case "hold":
        summary.hold++;
        break;
      case "not-released":
        summary.notReleased++;
        break;
    }
  }
  return summary;
}

/** Use live unit rows when present; otherwise project aggregate or slug-based demo counts. */
export function resolveInventorySummary(
  project: Pick<
    BuilderProject,
    | "slug"
    | "projectType"
    | "totalUnits"
    | "availableUnits"
    | "reservedUnits"
    | "soldUnits"
    | "comingSoonUnits"
  >,
  units: ProjectUnit[]
): InventorySummary {
  if (units.length > 0) return computeInventorySummary(units);

  if (project.totalUnits > 0) {
    return {
      total: project.totalUnits,
      available: project.availableUnits,
      reserved: project.reservedUnits,
      sold: project.soldUnits,
      comingSoon: project.comingSoonUnits,
      hold: 0,
      notReleased: 0,
    };
  }

  const demo = buildDummyInventoryForProject({
    slug: project.slug,
    projectType: project.projectType,
  });
  return {
    total: demo.totalUnits,
    available: demo.availableUnits,
    reserved: demo.reservedUnits,
    sold: demo.soldUnits,
    comingSoon: demo.comingSoonUnits,
    hold: 0,
    notReleased: 0,
  };
}

// ── Leads ──

export async function createLead(input: CreateLeadInput): Promise<string> {
  const ref = adminDb.collection(LEADS_COL).doc();
  const now = FieldValue.serverTimestamp();

  let projectName: string | null = null;
  let citySlug: string | null = null;
  if (input.projectId) {
    const project = await getProjectById(input.projectId);
    if (project) {
      projectName = project.name;
      citySlug = project.citySlug;
    }
  }

  await ref.set({
    builderId: input.builderId,
    projectId: input.projectId || null,
    unitId: input.unitId || null,
    projectName,
    citySlug,
    source: input.source,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    message: input.message?.trim() || null,
    preferredVisitDate: input.preferredVisitDate || null,
    budgetRange: input.budgetRange?.trim() || null,
    preferredSize: input.preferredSize?.trim() || null,
    buyingTimeline: input.buyingTimeline?.trim() || null,
    purchasePurpose: input.purchasePurpose?.trim() || null,
    hearAboutUs: input.hearAboutUs?.trim() || null,
    leadStatus: "new",
    notes: null,
    assignedTo: null,
    followUpDate: null,
    createdAt: now,
    updatedAt: now,
    source_channel: "web",
    platformManaged: true,
    visibleToBuilder: false,
    leadSoldAt: null,
  });

  await adminDb
    .collection(BUILDERS_COL)
    .doc(input.builderId)
    .update({ enquiryCount: FieldValue.increment(1) });

  if (input.projectId) {
    await adminDb
      .collection(PROJECTS_COL)
      .doc(input.projectId)
      .update({ enquiryCount: FieldValue.increment(1) });
  }

  return ref.id;
}

export async function listLeads(builderId?: string): Promise<ProjectLead[]> {
  return readDb(async (db) => {
    let q = db.collection(LEADS_COL).orderBy("createdAt", "desc");
    if (builderId) {
      q = db
        .collection(LEADS_COL)
        .where("builderId", "==", builderId)
        .orderBy("createdAt", "desc");
    }
    const snap = await q.limit(200).get();
    return snap.docs.map((d) => docToLead(d.id, d.data() as Record<string, unknown>));
  }, []);
}

export async function updateLead(
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  await adminDb
    .collection(LEADS_COL)
    .doc(id)
    .update({ ...patch, updatedAt: FieldValue.serverTimestamp() });
}

// ── Master Plans ──

export async function getMasterPlan(
  projectId: string
): Promise<ProjectMasterPlan | null> {
  return readDb(async (db) => {
    const snap = await db.collection(MASTER_PLANS_COL).doc(projectId).get();
    if (!snap.exists) return null;
    const data = snap.data() as Record<string, unknown>;
    return {
      projectId,
      builderId: (data.builderId as string) || "",
      defaultImageUrl: (data.defaultImageUrl as string) || null,
      angles: Array.isArray(data.angles) ? (data.angles as ProjectMasterPlan["angles"]) : [],
      updatedAtMs: tsToMs(data.updatedAt),
    };
  }, null);
}

export async function saveMasterPlan(
  projectId: string,
  builderId: string,
  data: Partial<ProjectMasterPlan>
): Promise<void> {
  await adminDb
    .collection(MASTER_PLANS_COL)
    .doc(projectId)
    .set(
      {
        projectId,
        builderId,
        defaultImageUrl: data.defaultImageUrl ?? null,
        angles: data.angles ?? [],
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

export async function incrementProjectView(projectId: string): Promise<void> {
  await safeAdminRead(async (db) => {
    await db
      .collection(PROJECTS_COL)
      .doc(projectId)
      .update({ viewCount: FieldValue.increment(1) });
  }, undefined);
}

export async function incrementBuilderView(builderId: string): Promise<void> {
  await safeAdminRead(async (db) => {
    await db
      .collection(BUILDERS_COL)
      .doc(builderId)
      .update({ viewCount: FieldValue.increment(1) });
  }, undefined);
}

/** Self-service: any signed-in user posts a project; leads route to RentalPins. */
export async function createSelfServiceProject(
  input: CreateSelfServiceProjectInput,
  uid: string
): Promise<{ builderId: string; projectId: string }> {
  let builder = await getBuilderByOwnerUserId(uid);
  let builderId: string;

  if (!builder) {
    builderId = await createBuilder(
      {
        name: input.companyName.trim(),
        slug: slugify(input.companyName),
        description: input.description,
        phone: input.phone,
        email: input.email,
        address: input.address,
        city: input.citySlug,
      },
      uid,
      { ownerUserId: uid, leadRouting: "platform" }
    );
    await linkBuilderUser(uid, builderId, "builder_admin");
    builder = await getBuilderById(builderId);
  } else {
    builderId = builder.id;
  }

  if (!builder) throw new Error("Failed to resolve builder profile");

  const projectId = await createProject(
    {
      builderId,
      name: input.projectName.trim(),
      slug: slugify(input.projectName),
      citySlug: input.citySlug.toLowerCase(),
      projectType: input.projectType,
      description: input.description,
    },
    uid,
    { ownerUserId: uid, leadRouting: "platform" }
  );

  return { builderId, projectId };
}
