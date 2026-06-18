import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type UploadTask,
} from "firebase/storage";
import { getClientStorage } from "./firebase-client";
import { resizeImageForUpload } from "./image-resize";
import { withTimeout, yieldToMain } from "@/lib/async-timeout";

export interface UploadedImageUrls {
  full: string;
  thumbnail: string;
  icon: string;
}

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

/** Upload one listing image (web uses same URL for all sizes in v1). */
export async function uploadListingImage(
  uid: string,
  file: File,
  index: number,
  onProgress?: (pct: number) => void
): Promise<UploadedImageUrls> {
  const ts = Date.now().toString();
  const storage = getClientStorage();
  const path = `listings/${uid}/${ts}_img_${index}_full.jpg`;
  const storageRef = ref(storage, path);

  onProgress?.(2);
  const prepared = await resizeImageForUpload(file);
  onProgress?.(8);

  await yieldToMain();

  const task = uploadBytesResumable(storageRef, prepared, {
    contentType: prepared.type || "image/jpeg",
  });

  await withTimeout(
    uploadBytesWithProgress(task, (uploadPct) => {
      onProgress?.(8 + Math.round(uploadPct * 0.85));
    }),
    UPLOAD_TIMEOUT_MS,
    "Photo upload timed out. Check your connection and try again."
  );

  onProgress?.(96);
  const url = await withTimeout(
    getDownloadURL(storageRef),
    15_000,
    "Could not finalize photo upload. Please try again."
  );
  onProgress?.(100);

  return { full: url, thumbnail: url, icon: url };
}

/** Upload multiple photos sequentially (stable indices for storage paths). */
export async function uploadListingImages(
  uid: string,
  files: File[],
  startIndex = 0,
  onProgress?: (fileIndex: number, pct: number) => void
): Promise<UploadedImageUrls[]> {
  const results: UploadedImageUrls[] = [];
  for (let i = 0; i < files.length; i++) {
    const uploaded = await uploadListingImage(uid, files[i], startIndex + i, (pct) =>
      onProgress?.(i, pct)
    );
    results.push(uploaded);
    await yieldToMain();
  }
  return results;
}
