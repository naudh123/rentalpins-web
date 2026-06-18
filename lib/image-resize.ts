import { withTimeout, yieldToMain } from "@/lib/async-timeout";

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const SKIP_RESIZE_BYTES = 1_500_000;

function isLikelyImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|heic|heif|bmp)$/i.test(file.name);
}

function isSmallJpeg(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    file.size <= SKIP_RESIZE_BYTES &&
    (file.type === "image/jpeg" || name.endsWith(".jpg") || name.endsWith(".jpeg"))
  );
}

async function bitmapToJpegFile(bitmap: ImageBitmap, file: File, quality: number): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }
  ctx.drawImage(bitmap, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

async function resizeImageCore(
  file: File,
  maxDimension: number,
  quality: number
): Promise<File> {
  if (typeof createImageBitmap !== "function") return file;

  let bitmap: ImageBitmap | null = null;
  try {
    try {
      // Decode at reduced size — avoids loading 12MP+ frames into memory.
      bitmap = await createImageBitmap(file, {
        resizeWidth: maxDimension,
        resizeHeight: maxDimension,
        resizeQuality: "medium",
      });
    } catch {
      bitmap = await createImageBitmap(file);
      const longest = Math.max(bitmap.width, bitmap.height);
      if (longest <= maxDimension && file.size <= SKIP_RESIZE_BYTES) {
        return file;
      }
      if (longest > maxDimension) {
        const scale = maxDimension / longest;
        const scaled = await createImageBitmap(bitmap, {
          resizeWidth: Math.round(bitmap.width * scale),
          resizeHeight: Math.round(bitmap.height * scale),
          resizeQuality: "medium",
        });
        bitmap.close();
        bitmap = scaled;
      }
    }

    if (bitmap.width <= maxDimension && bitmap.height <= maxDimension && isSmallJpeg(file)) {
      return file;
    }

    return await bitmapToJpegFile(bitmap, file, quality);
  } finally {
    bitmap?.close();
  }
}

/** Downscale large photos before upload to save bandwidth and keep the UI responsive. */
export async function resizeImageForUpload(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<File> {
  if (!isLikelyImage(file)) return file;

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `${file.name || "Photo"} is too large (max ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))}MB). Try a screenshot or lower camera resolution.`
    );
  }

  const lower = file.name.toLowerCase();
  if (file.type === "image/gif" || lower.endsWith(".gif")) return file;
  if (file.type === "image/svg+xml" || lower.endsWith(".svg")) return file;
  if (isSmallJpeg(file)) return file;

  await yieldToMain();

  return withTimeout(
    resizeImageCore(file, maxDimension, quality),
    25_000,
    "Photo processing took too long. Try a smaller image or screenshot."
  );
}
