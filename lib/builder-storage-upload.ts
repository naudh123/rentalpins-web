import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type UploadTask,
} from "firebase/storage";
import { getClientStorage } from "./firebase-client";
import { resizeImageForUpload } from "./image-resize";
import { withTimeout, yieldToMain } from "@/lib/async-timeout";

const UPLOAD_TIMEOUT_MS = 90_000;

function uploadBytesWithProgress(
  task: UploadTask,
  onProgress?: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        if (!snapshot.totalBytes) return;
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.(pct);
      },
      reject,
      () => resolve()
    );
  });
}

export type BuilderAssetKind =
  | "builder-logo"
  | "builder-cover"
  | "builder-gallery"
  | "project-gallery"
  | "project-brochure"
  | "project-master-plan";

function builderAssetPath(
  uid: string,
  kind: BuilderAssetKind,
  entityId: string,
  extra?: string
): string {
  const ts = Date.now().toString();
  switch (kind) {
    case "builder-logo":
      return `builder-assets/${uid}/builders/${entityId}/logo.jpg`;
    case "builder-cover":
      return `builder-assets/${uid}/builders/${entityId}/cover.jpg`;
    case "builder-gallery":
      return `builder-assets/${uid}/builders/${entityId}/gallery/${ts}.jpg`;
    case "project-gallery":
      return `builder-assets/${uid}/projects/${entityId}/gallery/${ts}.jpg`;
    case "project-brochure":
      return `builder-assets/${uid}/projects/${entityId}/brochure.pdf`;
    case "project-master-plan":
      return `builder-assets/${uid}/projects/${entityId}/master-plan/${extra || ts}.jpg`;
    default:
      return `builder-assets/${uid}/misc/${ts}.jpg`;
  }
}

/** Upload a builder/project image (resized JPEG). */
export async function uploadBuilderImage(
  uid: string,
  file: File,
  kind: Exclude<BuilderAssetKind, "project-brochure">,
  entityId: string,
  extra?: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storage = getClientStorage();
  const path = builderAssetPath(uid, kind, entityId, extra);
  const storageRef = ref(storage, path);

  onProgress?.(2);
  const prepared = await resizeImageForUpload(file);
  onProgress?.(10);
  await yieldToMain();

  const task = uploadBytesResumable(storageRef, prepared, {
    contentType: prepared.type || "image/jpeg",
  });

  await withTimeout(
    uploadBytesWithProgress(task, (uploadPct) => {
      onProgress?.(10 + Math.round(uploadPct * 0.85));
    }),
    UPLOAD_TIMEOUT_MS,
    "Image upload timed out. Check your connection and try again."
  );

  onProgress?.(98);
  const url = await withTimeout(
    getDownloadURL(storageRef),
    15_000,
    "Could not finalize image upload."
  );
  onProgress?.(100);
  return url;
}

/** Upload a project brochure PDF (max 15 MB). */
export async function uploadBuilderPdf(
  uid: string,
  file: File,
  projectId: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new Error("Brochure must be a PDF file.");
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error("Brochure must be under 15 MB.");
  }

  const storage = getClientStorage();
  const path = builderAssetPath(uid, "project-brochure", projectId);
  const storageRef = ref(storage, path);

  const task = uploadBytesResumable(storageRef, file, {
    contentType: "application/pdf",
  });

  await withTimeout(
    uploadBytesWithProgress(task, onProgress),
    UPLOAD_TIMEOUT_MS,
    "Brochure upload timed out."
  );

  return withTimeout(getDownloadURL(storageRef), 15_000, "Could not finalize brochure upload.");
}
