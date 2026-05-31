import { getAuth } from "firebase-admin/auth";
import type { DecodedIdToken } from "firebase-admin/auth";
import { adminDb } from "./firebase-admin";

export async function verifyAuthToken(
  request: Request
): Promise<DecodedIdToken | null> {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) return null;
  try {
    return await getAuth().verifyIdToken(header.slice(7));
  } catch {
    return null;
  }
}

export async function getUserRole(uid: string): Promise<string> {
  const snap = await adminDb.collection("users").doc(uid).get();
  return (snap.data()?.role as string) || "user";
}

export function isAdminRole(role: string): boolean {
  return role === "admin" || role === "sysadmin";
}
