import { FieldValue } from "firebase-admin/firestore";
import {
  BUILDERS_COL,
  getBuilderBySlug,
} from "@/lib/builders/builders-server";
import { adminDb } from "@/lib/firebase-admin";
import { PLATFORM_BUILDER } from "@/lib/builders/platform-builder-data";

export interface SeedPlatformBuilderResult {
  message: string;
  builderId: string;
  builderSlug: string;
  created: boolean;
}

/** Ensures the platform sales desk builder exists for static buy project leads. */
export async function seedPlatformBuilder(
  createdBy = "platform-seed"
): Promise<SeedPlatformBuilderResult> {
  const existing = await getBuilderBySlug(PLATFORM_BUILDER.slug);
  if (existing) {
    if (existing.status !== "published" || existing.leadRouting !== "platform") {
      await adminDb.collection(BUILDERS_COL).doc(existing.id).update({
        status: "published",
        leadRouting: "platform",
        phone: PLATFORM_BUILDER.phone,
        whatsapp: PLATFORM_BUILDER.whatsapp,
        email: PLATFORM_BUILDER.email,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return {
        message: "Platform builder updated to published/platform routing.",
        builderId: existing.id,
        builderSlug: existing.slug,
        created: false,
      };
    }
    return {
      message: "Platform builder already exists.",
      builderId: existing.id,
      builderSlug: existing.slug,
      created: false,
    };
  }

  const now = FieldValue.serverTimestamp();
  const ref = adminDb.collection(BUILDERS_COL).doc();

  await ref.set({
    name: PLATFORM_BUILDER.name,
    slug: PLATFORM_BUILDER.slug,
    description: PLATFORM_BUILDER.description,
    logoUrl: null,
    coverImageUrl: null,
    phone: PLATFORM_BUILDER.phone,
    whatsapp: PLATFORM_BUILDER.whatsapp,
    email: PLATFORM_BUILDER.email,
    website: PLATFORM_BUILDER.website,
    address: PLATFORM_BUILDER.address,
    city: PLATFORM_BUILDER.city,
    state: PLATFORM_BUILDER.state,
    country: "India",
    reraNumber: null,
    establishedYear: null,
    socialLinks: {},
    galleryUrls: [],
    team: [],
    status: PLATFORM_BUILDER.status,
    isFeatured: true,
    builderPlan: "premium",
    planStatus: "active",
    planStartDate: now,
    planEndDate: null,
    featuredUntil: null,
    maxProjects: 50,
    maxLeads: 5000,
    allowedModules: ["profile", "microsite", "crm"],
    viewCount: 0,
    enquiryCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy,
    ownerUserId: null,
    leadRouting: PLATFORM_BUILDER.leadRouting,
    source: "web",
  });

  return {
    message: "Platform builder created.",
    builderId: ref.id,
    builderSlug: PLATFORM_BUILDER.slug,
    created: true,
  };
}
