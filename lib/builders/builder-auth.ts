import { getUserRole, isAdminRole } from "@/lib/firebase-auth-server";
import { adminDb } from "@/lib/firebase-admin";
import type { BuilderUserRole } from "@/lib/types/builder-microsite";

const BUILDERS_COL = "builders";

export async function isBuilderModuleAdmin(uid: string): Promise<boolean> {
  const role = await getUserRole(uid);
  return isAdminRole(role) || role === "superadmin";
}

export async function getBuilderUserAccess(
  uid: string,
  builderId: string
): Promise<BuilderUserRole | "admin" | null> {
  if (await isBuilderModuleAdmin(uid)) return "admin";

  const snap = await adminDb
    .collection("builder_users")
    .where("userId", "==", uid)
    .where("builderId", "==", builderId)
    .limit(1)
    .get();

  if (snap.empty) return null;
  return (snap.docs[0].data().role as BuilderUserRole) || null;
}

export async function canManageBuilder(
  uid: string,
  builderId: string
): Promise<boolean> {
  const access = await getBuilderUserAccess(uid, builderId);
  if (access === "admin" || access === "builder_admin") return true;
  const snap = await adminDb.collection(BUILDERS_COL).doc(builderId).get();
  if (!snap.exists) return false;
  return snap.data()?.ownerUserId === uid;
}

/** Leads are platform inventory — only RentalPins admins access the CRM. */
export async function canManageLeads(uid: string): Promise<boolean> {
  return isBuilderModuleAdmin(uid);
}

export async function canEditUnitStatus(
  uid: string,
  builderId: string
): Promise<boolean> {
  return canManageBuilder(uid, builderId);
}

export async function canManageProject(
  uid: string,
  project: { builderId: string; ownerUserId?: string | null }
): Promise<boolean> {
  if (project.ownerUserId === uid) return true;
  return canManageBuilder(uid, project.builderId);
}
