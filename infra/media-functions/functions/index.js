"use strict";

/**
 * RentalPins media functions (Firebase codebase "media").
 *
 * Deployed separately from the main app functions so a deploy here can never
 * touch them:  cd infra/media-functions && firebase deploy --only functions:media
 *
 * - optimizeListingMedia: on every upload under listings/, shrink _icon/_thumb
 *   files in place to real 200px / 640px JPEGs (keeping their download token, so
 *   existing URLs keep working) and give every photo/video a 1-year cache header.
 * - backfillListingMedia: private HTTP job that applies the same to existing
 *   files (mode=storage) and creates real thumbnails for web-posted listings whose
 *   thumbnail URL is the full photo (mode=firestore). Supports dryRun=1 and paging.
 */

const crypto = require("node:crypto");
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const {
  CACHE_CONTROL,
  RESIZED_FLAG,
  MIN_BYTES_TO_RESIZE,
  variantOf,
  isListingMedia,
  isListingImage,
  resizeBuffer,
  downloadUrl,
  pathFromDownloadUrl,
  siblingPath,
} = require("./resize");

admin.initializeApp();

const BUCKET = "rent-it-dev-6bcfd.firebasestorage.app";
const REGION = "us-central1"; // must match the bucket location

/**
 * Shrink an _icon/_thumb file in place. Keeps all custom metadata (including
 * firebaseStorageDownloadTokens) so every saved download URL stays valid.
 * Returns {before, after} bytes, or null when skipped.
 */
async function resizeInPlace(file, meta, variant, dryRun) {
  const custom = meta.metadata || {};
  const size = Number(meta.size || 0);
  if (custom[RESIZED_FLAG] === "1" || size < MIN_BYTES_TO_RESIZE) return null;

  const [input] = await file.download();
  const output = await resizeBuffer(input, variant);
  if (output.length >= input.length) return null;
  if (!dryRun) {
    await file.save(output, {
      resumable: false,
      metadata: {
        contentType: "image/jpeg",
        cacheControl: CACHE_CONTROL,
        metadata: { ...custom, [RESIZED_FLAG]: "1" },
      },
    });
  }
  return { before: input.length, after: output.length };
}

async function ensureCacheHeader(file, meta, dryRun) {
  if (meta.cacheControl === CACHE_CONTROL) return false;
  if (!dryRun) await file.setMetadata({ cacheControl: CACHE_CONTROL });
  return true;
}

/** Process one listing file: resize variants, set cache header on everything. */
async function processFile(file, meta, dryRun) {
  const result = { resized: null, cacheSet: false };
  const variant = variantOf(file.name);
  if (variant) {
    result.resized = await resizeInPlace(file, meta, variant, dryRun);
    if (result.resized) return result; // save() already set the cache header
  }
  result.cacheSet = await ensureCacheHeader(file, meta, dryRun);
  return result;
}

exports.optimizeListingMedia = onObjectFinalized(
  { bucket: BUCKET, region: REGION, memory: "1GiB", timeoutSeconds: 120, concurrency: 4, maxInstances: 20 },
  async (event) => {
    const obj = event.data;
    if (!isListingMedia(obj.name)) return;
    const file = admin.storage().bucket(obj.bucket).file(obj.name);
    try {
      const r = await processFile(file, obj, false);
      if (r.resized) logger.info("resized", { path: obj.name, ...r.resized });
    } catch (err) {
      logger.error("optimizeListingMedia failed", { path: obj.name, err: String(err) });
    }
  }
);

/** Run tasks with a small concurrency limit. */
async function pool(items, limit, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}

async function backfillStorage({ pageToken, pageSize, dryRun }) {
  const bucket = admin.storage().bucket(BUCKET);
  const [files, nextQuery] = await bucket.getFiles({
    prefix: "listings/",
    maxResults: pageSize,
    autoPaginate: false,
    pageToken: pageToken || undefined,
  });
  const stats = { scanned: files.length, resized: 0, bytesBefore: 0, bytesAfter: 0, cacheSet: 0, errors: 0 };
  await pool(files, 8, async (file) => {
    if (!isListingMedia(file.name)) return;
    try {
      const r = await processFile(file, file.metadata, dryRun);
      if (r.resized) {
        stats.resized++;
        stats.bytesBefore += r.resized.before;
        stats.bytesAfter += r.resized.after;
      }
      if (r.cacheSet) stats.cacheSet++;
    } catch (err) {
      stats.errors++;
      logger.warn("backfill storage error", { path: file.name, err: String(err) });
    }
  });
  return { ...stats, nextPageToken: nextQuery?.pageToken || null };
}

/**
 * Create a real resized sibling of a full photo. Returns its download URL.
 * Reuses an existing sibling if one is already there.
 */
async function createVariant(bucket, fullPath, variant, dryRun) {
  const path = siblingPath(fullPath, variant);
  const target = bucket.file(path);
  const [exists] = await target.exists();
  if (exists) {
    const [meta] = await target.getMetadata();
    const token = String(meta.metadata?.firebaseStorageDownloadTokens || "").split(",")[0];
    if (token) return downloadUrl(BUCKET, path, token);
  }
  if (dryRun) return `dry-run:${path}`;
  const [input] = await bucket.file(fullPath).download();
  const output = await resizeBuffer(input, variant);
  const token = crypto.randomUUID();
  await target.save(output, {
    resumable: false,
    metadata: {
      contentType: "image/jpeg",
      cacheControl: CACHE_CONTROL,
      metadata: { firebaseStorageDownloadTokens: token, [RESIZED_FLAG]: "1" },
    },
  });
  return downloadUrl(BUCKET, path, token);
}

/**
 * For listings whose thumbnail/icon URL is the full photo (web uploads), create
 * real _thumb/_icon files and point the listing at them. Only image fields change.
 */
async function backfillFirestore({ startAfter, pageSize, dryRun }) {
  const db = admin.firestore();
  const bucket = admin.storage().bucket(BUCKET);
  let q = db.collection("listings").orderBy(admin.firestore.FieldPath.documentId()).limit(pageSize);
  if (startAfter) q = q.startAfter(startAfter);
  const snap = await q.get();
  const stats = { scanned: snap.size, listingsUpdated: 0, variantsCreated: 0, errors: 0 };

  await pool(snap.docs, 4, async (doc) => {
    const d = doc.data() || {};
    const fulls = Array.isArray(d.imageUrls) && d.imageUrls.length ? d.imageUrls : d.imagesFull;
    if (!Array.isArray(fulls) || !fulls.length) return;
    const thumbs = Array.isArray(d.imageThumbnails) ? [...d.imageThumbnails] : [];
    const icons = Array.isArray(d.imageIcons) ? [...d.imageIcons] : [];
    let changed = false;
    try {
      for (let i = 0; i < fulls.length; i++) {
        const fullPath = pathFromDownloadUrl(fulls[i], BUCKET);
        if (!fullPath || !isListingImage(fullPath)) continue;
        for (const [variant, list] of [["thumb", thumbs], ["icon", icons]]) {
          const current = list[i];
          const needs = !current || current === fulls[i];
          if (!needs) continue;
          list[i] = await createVariant(bucket, fullPath, variant, dryRun);
          stats.variantsCreated++;
          changed = true;
        }
      }
      if (changed) {
        stats.listingsUpdated++;
        if (!dryRun) {
          await doc.ref.update({ imageThumbnails: thumbs, imageIcons: icons });
        }
      }
    } catch (err) {
      stats.errors++;
      logger.warn("backfill firestore error", { listingId: doc.id, err: String(err) });
    }
  });

  const last = snap.docs[snap.docs.length - 1];
  return { ...stats, nextStartAfter: snap.size === pageSize && last ? last.id : null };
}

exports.backfillListingMedia = onRequest(
  { region: REGION, invoker: "private", memory: "2GiB", timeoutSeconds: 1800, maxInstances: 1 },
  async (req, res) => {
    const mode = String(req.query.mode || "");
    const dryRun = req.query.dryRun === "1";
    const pageSize = Math.min(Number(req.query.pageSize) || 500, 2000);
    try {
      if (mode === "storage") {
        res.json(await backfillStorage({ pageToken: req.query.pageToken, pageSize, dryRun }));
      } else if (mode === "firestore") {
        res.json(
          await backfillFirestore({ startAfter: req.query.startAfter, pageSize: Math.min(pageSize, 300), dryRun })
        );
      } else {
        res.status(400).json({ error: "mode must be storage or firestore" });
      }
    } catch (err) {
      logger.error("backfill failed", { mode, err: String(err) });
      res.status(500).json({ error: String(err) });
    }
  }
);
