import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "rent-it-dev-6bcfd",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
};

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(serviceAccount.clientEmail?.trim() && serviceAccount.privateKey?.trim());
}

export function isFirebaseAdminCredentialError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    /Could not load the default credentials/i.test(msg) ||
    /Firebase Admin is not configured/i.test(msg)
  );
}

let _adminDb: Firestore | undefined;

/** Lazily obtain Firestore — throws when Admin credentials are missing (API/write paths). */
export function requireAdminDb(): Firestore {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin is not configured");
  }
  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }
  if (!_adminDb) {
    _adminDb = getFirestore();
  }
  return _adminDb;
}

/** Legacy export for API routes and writes — requires configured credentials. */
export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    const db = requireAdminDb();
    const value = Reflect.get(db as object, prop, receiver);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(db)
      : value;
  },
});

/** Graceful Firestore read for SSG/sitemap when Admin is unavailable at build time. */
export async function safeAdminRead<T>(
  fn: (db: Firestore) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isFirebaseAdminConfigured()) return fallback;
  try {
    return await fn(requireAdminDb());
  } catch (err) {
    if (isFirebaseAdminCredentialError(err)) {
      console.warn(
        "[firebase-admin] read skipped:",
        err instanceof Error ? err.message : err
      );
      return fallback;
    }
    throw err;
  }
}
