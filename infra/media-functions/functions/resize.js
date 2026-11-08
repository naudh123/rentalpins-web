"use strict";

const sharp = require("sharp");

/** Long-lived browser/CDN caching. Safe because every upload gets a unique timestamped path. */
const CACHE_CONTROL = "public, max-age=31536000, immutable";

/** Marker stored in custom metadata once a file has been resized, so triggers never loop. */
const RESIZED_FLAG = "rpResized";

/** Real sizes for the variants the apps already ask for. */
const VARIANTS = {
  icon: { width: 200, quality: 72 },
  thumb: { width: 640, quality: 74 },
};

/** Files smaller than this are assumed to already be a proper small image. */
const MIN_BYTES_TO_RESIZE = 60 * 1024;

const VARIANT_RE = /^listings\/[^/]+\/.+_(icon|thumb)\.(jpe?g)$/i;
const IMAGE_RE = /\.(jpe?g|png|webp|heic|heif)$/i;
const MEDIA_RE = /\.(jpe?g|png|webp|heic|heif|mp4|mov|webm)$/i;

/** "icon" | "thumb" | null for a storage path. */
function variantOf(path) {
  const m = VARIANT_RE.exec(path || "");
  return m ? m[1].toLowerCase() : null;
}

function isListingMedia(path) {
  return typeof path === "string" && path.startsWith("listings/") && MEDIA_RE.test(path);
}

function isListingImage(path) {
  return typeof path === "string" && path.startsWith("listings/") && IMAGE_RE.test(path);
}

/**
 * Resize to fit inside width x width (never enlarging), auto-rotate from EXIF,
 * strip metadata, re-encode as progressive mozjpeg.
 */
async function resizeBuffer(input, variant) {
  const spec = VARIANTS[variant];
  if (!spec) throw new Error(`Unknown variant ${variant}`);
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize({ width: spec.width, height: spec.width, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: spec.quality, mozjpeg: true, progressive: true })
    .toBuffer();
}

/** Firebase download URL for a path + token (same format the client SDKs return). */
function downloadUrl(bucket, path, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

/** Storage path from a Firebase download URL in the given bucket, else null. */
function pathFromDownloadUrl(url, bucket) {
  if (typeof url !== "string") return null;
  const m = /\/v0\/b\/([^/]+)\/o\/([^?]+)/.exec(url);
  if (!m || m[1] !== bucket) return null;
  try {
    return decodeURIComponent(m[2]);
  } catch {
    return null;
  }
}

/** Sibling path for a variant: ..._full.jpg -> ..._thumb.jpg; anything else -> name_thumb.jpg. */
function siblingPath(path, variant) {
  if (/_full\.[a-z0-9]+$/i.test(path)) return path.replace(/_full\.[a-z0-9]+$/i, `_${variant}.jpg`);
  return path.replace(/\.[a-z0-9]+$/i, "") + `_${variant}.jpg`;
}

module.exports = {
  CACHE_CONTROL,
  RESIZED_FLAG,
  VARIANTS,
  MIN_BYTES_TO_RESIZE,
  variantOf,
  isListingMedia,
  isListingImage,
  resizeBuffer,
  downloadUrl,
  pathFromDownloadUrl,
  siblingPath,
};
