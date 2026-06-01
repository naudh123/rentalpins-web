import {
  enableNetwork,
  getDoc,
  getDocFromCache,
  type DocumentReference,
  type DocumentSnapshot,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase-client";

export function isFirestoreOfflineError(err: unknown): boolean {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  if (code === "unavailable") return true;
  const msg = err instanceof Error ? err.message : String(err);
  return /client is offline|failed to get document.*offline/i.test(msg);
}

/** Read a Firestore doc with cache + network retry when the client reports offline. */
export async function getDocResilient<T>(
  ref: DocumentReference<T>
): Promise<DocumentSnapshot<T>> {
  const db = getClientDb();
  try {
    return await getDoc(ref);
  } catch (err) {
    if (!isFirestoreOfflineError(err)) throw err;
  }

  try {
    return await getDocFromCache(ref);
  } catch {
    /* no cached document */
  }

  await enableNetwork(db);
  return getDoc(ref);
}
