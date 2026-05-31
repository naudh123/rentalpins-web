import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getClientStorage } from "./firebase-client";
import { resizeImageForUpload } from "./image-resize";

export interface UploadedImageUrls {
  full: string;
  thumbnail: string;
  icon: string;
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

  onProgress?.(5);
  const prepared = await resizeImageForUpload(file);
  onProgress?.(10);
  await uploadBytes(storageRef, prepared, {
    contentType: prepared.type || "image/jpeg",
  });
  onProgress?.(90);
  const url = await getDownloadURL(storageRef);
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
  }
  return results;
}
