import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import {
  BUILDERS_COL,
  PROJECTS_COL,
  getBuilderBySlug,
} from "@/lib/builders/builders-server";
import {
  TRICITY_BUILDERS,
  TRICITY_PROJECTS,
  type TricityBuilderEntry,
  type TricityProjectEntry,
} from "@/lib/builders/tricity-catalog";
import {
  catalogBuilderLogoUrl,
  catalogGalleryUrls,
} from "@/lib/builders/project-media";
import { isGenericProjectPlaceholder, isUnreliableHeroUrl } from "@/lib/builders/project-placeholder";
import { FEATURED_PROJECT_SLUGS } from "@/lib/builders/projects-index";
import { catalogCoordinates } from "@/lib/builders/tricity-coordinates";
import {
  enrichmentPatchForSlug,
  placeholderMediaClearPatch,
  shouldClearPlaceholderMedia,
} from "@/lib/builders/project-enrichment";
import {
  buildProjectSeoBundle,
  seoBundleToFirestorePatch,
} from "@/lib/builders/project-seo-content";
import { buildDummyInventoryForProject } from "@/lib/builders/project-dummy-inventory";

export interface TricitySeedResult {
  message: string;
  buildersCreated: number;
  buildersSkipped: number;
  projectsCreated: number;
  projectsSkipped: number;
  projectsPatched: number;
  projectsSeoUpdated: number;
  projectsGalleryUpdated: number;
  projectsInventoryUpdated: number;
  projectsMediaCleared: number;
  projectUrls: string[];
}

async function findProjectDocByCityAndSlug(
  citySlug: string,
  slug: string
): Promise<FirebaseFirestore.QueryDocumentSnapshot | null> {
  const snap = await adminDb
    .collection(PROJECTS_COL)
    .where("citySlug", "==", citySlug)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  return snap.empty ? null : snap.docs[0];
}

async function patchProjectCatalogFields(
  entry: TricityProjectEntry,
  builderId: string,
  builderName: string,
  builderSlug: string
): Promise<boolean> {
  const { citySlug, slug } = entry;
  const doc = await findProjectDocByCityAndSlug(citySlug, slug);
  if (!doc) return false;
  const data = doc.data();
  const updates: Record<string, unknown> = {};
  if (!data.builderSlug) updates.builderSlug = builderSlug;
  if (!data.builderId) updates.builderId = builderId;
  if (!data.builderName) updates.builderName = builderName;

  const heroGallery = catalogGalleryUrls(slug, builderSlug);
  const existingGallery = Array.isArray(data.galleryUrls) ? data.galleryUrls : [];
  const storedHero =
    typeof existingGallery[0] === "string" ? existingGallery[0] : null;
  const needsGalleryRefresh =
    existingGallery.length === 0 ||
    isUnreliableHeroUrl(storedHero) ||
    isGenericProjectPlaceholder(storedHero);

  if (needsGalleryRefresh) {
    const nextGallery =
      heroGallery.length > 0
        ? heroGallery
        : JSON.stringify(existingGallery) !== "[]"
          ? []
          : null;
    if (nextGallery !== null) {
      updates.galleryUrls = nextGallery;
    }
  }

  const shouldFeature = FEATURED_PROJECT_SLUGS.includes(slug);
  if (data.isFeatured !== shouldFeature) {
    updates.isFeatured = shouldFeature;
  }

  const coords = catalogCoordinates(slug, {
    latitude: entry.latitude,
    longitude: entry.longitude,
  });
  if (coords) {
    if (data.latitude !== coords.latitude || data.longitude !== coords.longitude) {
      updates.latitude = coords.latitude;
      updates.longitude = coords.longitude;
    }
  }

  const enrichment = enrichmentPatchForSlug(slug);
  if (enrichment) {
    for (const [key, value] of Object.entries(enrichment)) {
      const existing = data[key];
      const isEmptyArray = Array.isArray(existing) && existing.length === 0;
      if (existing == null || existing === "" || isEmptyArray) {
        updates[key] = value;
      }
    }
  }

  if (Object.keys(updates).length === 0) return false;
  updates.updatedAt = FieldValue.serverTimestamp();
  await doc.ref.update(updates);
  return true;
}

async function clearPlaceholderProjectMedia(
  entry: TricityProjectEntry
): Promise<boolean> {
  const doc = await findProjectDocByCityAndSlug(entry.citySlug, entry.slug);
  if (!doc) return false;
  const data = doc.data();
  if (!shouldClearPlaceholderMedia(data)) return false;
  await doc.ref.update({
    ...placeholderMediaClearPatch(data),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return true;
}

async function applyProjectGalleryPatch(
  entry: TricityProjectEntry,
  builderSlug: string
): Promise<boolean> {
  const doc = await findProjectDocByCityAndSlug(entry.citySlug, entry.slug);
  if (!doc) return false;

  const gallery = catalogGalleryUrls(entry.slug, builderSlug);
  if (gallery.length === 0) return false;

  await doc.ref.update({
    galleryUrls: gallery,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return true;
}

async function applyProjectInventoryPatch(
  entry: TricityProjectEntry
): Promise<boolean> {
  const doc = await findProjectDocByCityAndSlug(entry.citySlug, entry.slug);
  if (!doc) return false;

  const counts = buildDummyInventoryForProject({
    slug: entry.slug,
    projectType: entry.projectType,
  });

  await doc.ref.update({
    totalUnits: counts.totalUnits,
    availableUnits: counts.availableUnits,
    reservedUnits: counts.reservedUnits,
    soldUnits: counts.soldUnits,
    comingSoonUnits: counts.comingSoonUnits,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return true;
}

async function applyProjectSeoPatch(
  entry: TricityProjectEntry,
  builderName: string
): Promise<boolean> {
  const doc = await findProjectDocByCityAndSlug(entry.citySlug, entry.slug);
  if (!doc) return false;

  const bundle = buildProjectSeoBundle(entry, builderName);
  const seoPatch = seoBundleToFirestorePatch(bundle);
  seoPatch.updatedAt = FieldValue.serverTimestamp();
  await doc.ref.update(seoPatch);
  return true;
}

async function patchBuilderMedia(slug: string): Promise<boolean> {
  const existing = await getBuilderBySlug(slug);
  if (!existing) return false;
  const logoUrl = catalogBuilderLogoUrl(slug);
  if (!logoUrl || existing.logoUrl === logoUrl) return false;
  await adminDb.collection(BUILDERS_COL).doc(existing.id).update({
    logoUrl,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return true;
}

async function upsertBuilder(
  entry: TricityBuilderEntry,
  createdBy: string
): Promise<{ id: string; created: boolean }> {
  const existing = await getBuilderBySlug(entry.slug);
  if (existing) {
    return { id: existing.id, created: false };
  }

  const now = FieldValue.serverTimestamp();
  const ref = adminDb.collection(BUILDERS_COL).doc();
  await ref.set({
    name: entry.name,
    slug: entry.slug,
    description: entry.description,
    logoUrl: catalogBuilderLogoUrl(entry.slug) ?? entry.logoUrl ?? null,
    coverImageUrl: entry.coverImageUrl ?? null,
    phone: entry.phone ?? null,
    whatsapp: entry.phone ?? null,
    email: entry.email ?? null,
    website: entry.website ?? null,
    address: entry.address ?? null,
    city: entry.city ?? null,
    state: entry.state ?? "Punjab",
    country: "India",
    reraNumber: entry.reraNumber ?? null,
    establishedYear: entry.establishedYear ?? null,
    socialLinks: entry.socialLinks ?? {},
    galleryUrls: entry.galleryUrls ?? [],
    team: [],
    status: "published",
    isFeatured: true,
    builderPlan: "premium",
    planStatus: "active",
    planStartDate: now,
    planEndDate: null,
    featuredUntil: null,
    maxProjects: 20,
    maxLeads: 1000,
    allowedModules: ["profile", "microsite", "plot_finder", "crm"],
    viewCount: 0,
    enquiryCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy,
    ownerUserId: null,
    leadRouting: "platform",
    source: "web",
  });
  return { id: ref.id, created: true };
}

async function createCatalogProject(
  entry: TricityProjectEntry,
  builderId: string,
  builderName: string,
  builderSlug: string,
  createdBy: string
): Promise<string> {
  const now = FieldValue.serverTimestamp();
  const ref = adminDb.collection(PROJECTS_COL).doc();
  const seo = buildProjectSeoBundle(entry, builderName);
  const inventory = buildDummyInventoryForProject({
    slug: entry.slug,
    projectType: entry.projectType,
  });

  const coords = catalogCoordinates(entry.slug, {
    latitude: entry.latitude,
    longitude: entry.longitude,
  });

  await ref.set({
    builderId,
    builderName,
    builderSlug,
    name: entry.name,
    slug: entry.slug,
    description: seo.description,
    projectType: entry.projectType,
    status: entry.status,
    reraNumber: entry.reraNumber ?? null,
    address: entry.address ?? null,
    city: entry.city,
    citySlug: entry.citySlug,
    state: entry.state ?? "Punjab",
    country: "India",
    latitude: coords?.latitude ?? entry.latitude ?? null,
    longitude: coords?.longitude ?? entry.longitude ?? null,
    totalArea: entry.totalArea ?? null,
    totalUnits: inventory.totalUnits,
    availableUnits: inventory.availableUnits,
    reservedUnits: inventory.reservedUnits,
    soldUnits: inventory.soldUnits,
    comingSoonUnits: inventory.comingSoonUnits,
    priceMin: entry.priceMin ?? null,
    priceMax: entry.priceMax ?? null,
    sizeMin: entry.sizeMin ?? null,
    sizeMax: entry.sizeMax ?? null,
    sizeUnit: entry.sizeUnit ?? "sq-yd",
    possessionDate: entry.possessionDate ?? null,
    amenities: entry.amenities,
    galleryUrls:
      catalogGalleryUrls(entry.slug, builderSlug).length > 0
        ? catalogGalleryUrls(entry.slug, builderSlug)
        : entry.galleryUrls ?? [],
    videoUrls: [],
    brochureUrl: entry.brochureUrl ?? null,
    paymentPlan: entry.paymentPlan ?? null,
    faqs: seo.faqs,
    nearbyLandmarks: entry.nearbyLandmarks ?? [],
    constructionUpdates: [],
    masterPlanImageUrl: entry.masterPlanImageUrl ?? null,
    isPublished: true,
    isFeatured:
      FEATURED_PROJECT_SLUGS.includes(entry.slug) || entry.isFeatured === true,
    featuredUntil: null,
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
    seoKeywords: seo.seoKeywords,
    aiSearchSnippet: seo.aiSearchSnippet,
    viewCount: 0,
    enquiryCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy,
    ownerUserId: null,
    leadRouting: "platform",
    source: "web",
  });
  return ref.id;
}

export async function seedTricityCatalog(
  createdBy = "tricity-catalog-seed"
): Promise<TricitySeedResult> {
  const builderIds = new Map<string, string>();
  let buildersCreated = 0;
  let buildersSkipped = 0;
  let projectsCreated = 0;
  let projectsSkipped = 0;
  let projectsPatched = 0;
  let projectsSeoUpdated = 0;
  let projectsGalleryUpdated = 0;
  let projectsInventoryUpdated = 0;
  let projectsMediaCleared = 0;
  let buildersPatched = 0;
  const projectUrls: string[] = [];

  for (const builder of TRICITY_BUILDERS) {
    const { id, created } = await upsertBuilder(builder, createdBy);
    builderIds.set(builder.slug, id);
    if (created) buildersCreated++;
    else {
      buildersSkipped++;
      if (await patchBuilderMedia(builder.slug)) buildersPatched++;
    }
  }

  for (const project of TRICITY_PROJECTS) {
    const builderId = builderIds.get(project.builderSlug);
    if (!builderId) {
      console.warn(`Builder not found for project ${project.slug}: ${project.builderSlug}`);
      continue;
    }

    const builder = TRICITY_BUILDERS.find((b) => b.slug === project.builderSlug);
    if (!builder) continue;

    const existingDoc = await findProjectDocByCityAndSlug(project.citySlug, project.slug);
    if (existingDoc) {
      if (
        await patchProjectCatalogFields(
          project,
          builderId,
          builder.name,
          builder.slug
        )
      ) {
        projectsPatched++;
      }
      if (await applyProjectSeoPatch(project, builder.name)) {
        projectsSeoUpdated++;
      }
      if (await applyProjectGalleryPatch(project, builder.slug)) {
        projectsGalleryUpdated++;
      }
      if (await applyProjectInventoryPatch(project)) {
        projectsInventoryUpdated++;
      }
      if (await clearPlaceholderProjectMedia(project)) {
        projectsMediaCleared++;
      }
      projectsSkipped++;
      projectUrls.push(`/projects/${project.citySlug}/${project.slug}`);
      continue;
    }

    await createCatalogProject(
      project,
      builderId,
      builder.name,
      builder.slug,
      createdBy
    );
    projectsCreated++;
    projectsSeoUpdated++;
    projectUrls.push(`/projects/${project.citySlug}/${project.slug}`);
  }

  return {
    message: `Tricity catalog seeded: ${buildersCreated} builders created, ${projectsCreated} projects created, ${projectsPatched} projects patched, ${projectsSeoUpdated} projects SEO updated, ${projectsGalleryUpdated} galleries updated, ${projectsInventoryUpdated} inventories updated, ${projectsMediaCleared} placeholder videos cleared, ${buildersPatched} builder logos updated.`,
    buildersCreated,
    buildersSkipped,
    projectsCreated,
    projectsSkipped,
    projectsPatched,
    projectsSeoUpdated,
    projectsGalleryUpdated,
    projectsInventoryUpdated,
    projectsMediaCleared,
    projectUrls,
  };
}
