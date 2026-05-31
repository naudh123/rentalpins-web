"use client";

import { callHttpsFunction } from "@/lib/firebase-callable";
import { clampPostListingAiText } from "@/lib/post-listing-limits";

const IMPROVE_REGION = "asia-south1";
/** Cloud Function timeout is 60s — client abort slightly after. */
const IMPROVE_TIMEOUT_MS = 65_000;

export interface ImproveListingTextInput {
  title: string;
  description: string;
  listingId?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  subCategory?: string;
  locationName?: string;
  forceRefresh?: boolean;
}

export interface ImproveListingTextResult {
  success: boolean;
  cached?: boolean;
  improvedTitle: string;
  improvedDescription: string;
  titleTrimmed?: boolean;
  descriptionTrimmed?: boolean;
  detectedLanguage?: string;
  socialCaption?: string;
  hashtags?: string;
  seoMeta?: string;
}

/**
 * Mirrors Flutter `PostListingSheet._improveWithAI` → `improveListingText` (asia-south1).
 *
 * In-form improve (Flutter): title, description, latitude, longitude, category, subCategory.
 * Post-publish persist (Flutter): above + listingId + locationName (reverse-geocoded).
 *
 * Server uses lat/lng in `getOrFetchLandmarks` (Google Places Nearby Search, cached by geohash).
 */
export async function improveListingText(
  input: ImproveListingTextInput
): Promise<ImproveListingTextResult> {
  const title = input.title.trim();
  const description = input.description.trim();
  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  const payload: Record<string, unknown> = {
    title,
    description,
    category: input.category ?? "",
    subCategory: input.subCategory ?? "",
  };

  if (input.listingId?.trim()) payload.listingId = input.listingId.trim();
  if (input.locationName?.trim()) payload.locationName = input.locationName.trim();
  if (
    typeof input.latitude === "number" &&
    Number.isFinite(input.latitude) &&
    typeof input.longitude === "number" &&
    Number.isFinite(input.longitude)
  ) {
    payload.latitude = input.latitude;
    payload.longitude = input.longitude;
  }
  if (input.forceRefresh) payload.forceRefresh = true;

  const data = await callHttpsFunction<{
    success?: boolean;
    cached?: boolean;
    improvedTitle?: string;
    improvedDescription?: string;
    detectedLanguage?: string;
    socialCaption?: string;
    hashtags?: string;
    seoMeta?: string;
  }>("improveListingText", payload, IMPROVE_REGION, {
    timeoutMs: IMPROVE_TIMEOUT_MS,
    refreshAuthToken: true,
  });

  const clamped = clampPostListingAiText(
    (data.improvedTitle ?? title).toString(),
    (data.improvedDescription ?? description).toString()
  );

  return {
    success: data.success === true,
    cached: data.cached === true,
    improvedTitle: clamped.title,
    improvedDescription: clamped.description,
    titleTrimmed: clamped.titleTrimmed,
    descriptionTrimmed: clamped.descriptionTrimmed,
    detectedLanguage: data.detectedLanguage,
    socialCaption: data.socialCaption,
    hashtags: data.hashtags,
    seoMeta: data.seoMeta,
  };
}

/** After publish — persist `listing_content` + `searchText` (Flutter background upload). */
export async function persistListingContentAfterAi(
  input: ImproveListingTextInput & { listingId: string }
): Promise<void> {
  await improveListingText({ ...input, listingId: input.listingId });
}

/** Wait for persist before navigation; non-fatal if this times out. */
export const PERSIST_LISTING_CONTENT_TIMEOUT_MS = 8_000;

export async function persistListingContentAfterAiWithTimeout(
  input: ImproveListingTextInput & { listingId: string },
  timeoutMs = PERSIST_LISTING_CONTENT_TIMEOUT_MS
): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      persistListingContentAfterAi(input),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("persist_listing_content_timeout")),
          timeoutMs
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
