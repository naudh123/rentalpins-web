import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type UploadTask,
} from "firebase/storage";
import { getClientStorage } from "./firebase-client";
import { resizeImageForUpload, resizeImageVariant } from "./image-resize";
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

/**
 * Listing photos get unique timestamped paths and are never edited in place,
 * so browsers and CDNs may cache them for a year.
 */
export const LISTING_IMAGE_CACHE_CONTROL = "public, max-age=31536000, immutable";

/** Display copies, matching the sizes the Flutter app and media functions use. */
export const LISTING_IMAGE_VARIANTS = {
  thumbnail: { suffix: "thumb", maxDimension: 640, quality: 0.74 },
  icon: { suffix: "icon", maxDimension: 200, quality: 0.72 },
} as const;

/** Storage path for one size of a listing photo. */
export function listingImagePath(
  uid: string,
  ts: string,
  index: number,
  suffix: "full" | "thumb" | "icon"
): string {
  return `listings/${uid}/${ts}_img_${index}_${suffix}.jpg`;
}

async function uploadOne(
  path: string,
  data: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(getClientStorage(), path);
  const task = uploadBytesResumable(storageRef, data, {
    contentType: data.type || "image/jpeg",
    cacheControl: LISTING_IMAGE_CACHE_CONTROL,
  });
  await withTimeout(
    uploadBytesWithProgress(task, (pct) => onProgress?.(pct)),
    UPLOAD_TIMEOUT_MS,
    "Photo upload timed out. Check your connection and try again."
  );
  return withTimeout(
    getDownloadURL(storageRef),
    15_000,
    "Could not finalize photo upload. Please try again."
  );
}

/**
 * Upload one listing image as three files: full (≤1600px), thumbnail (≤640px,
 * used by search cards) and icon (≤200px). Search pages load the small copies,
 * which keeps Cloud Storage download costs down.
 */
export async function uploadListingImage(
  uid: string,
  file: File,
  index: number,
  onProgress?: (pct: number) => void
): Promise<UploadedImageUrls> {
  const ts = Date.now().toString();

  onProgress?.(2);
  const prepared = await resizeImageForUpload(file);
  onProgress?.(8);
  await yieldToMain();

  // Full photo: 8% → 80%.
  const full = await uploadOne(listingImagePath(uid, ts, index, "full"), prepared, (pct) =>
    onProgress?.(8 + Math.round(pct * 0.72))
  );

  // Small copies from the already-downscaled photo (cheaper to decode).
  // A failure here must not lose the upload: fall back to the full URL.
  const variantUrl = async (
    key: keyof typeof LISTING_IMAGE_VARIANTS,
    base: number
  ): Promise<string> => {
    const spec = LISTING_IMAGE_VARIANTS[key];
    try {
      const small = await resizeImageVariant(prepared, spec.maxDimension, spec.quality);
      return await uploadOne(listingImagePath(uid, ts, index, spec.suffix), small, (pct) =>
        onProgress?.(base + Math.round(pct * 0.09))
      );
    } catch (err) {
      console.warn(`Listing photo ${spec.suffix} upload failed; using full photo`, err);
      return full;
    }
  };

  const thumbnail = await variantUrl("thumbnail", 80);
  const icon = await variantUrl("icon", 90);
  onProgress?.(100);

  return { full, thumbnail, icon };
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
