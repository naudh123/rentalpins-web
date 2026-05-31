/** Post listing field limits — aligned with Flutter `PostListingSheet` (title max differs on web). */

export const POST_LISTING_TITLE_MIN = 10;
export const POST_LISTING_TITLE_MAX = 80;
export const POST_LISTING_DESC_MIN = 30;
export const POST_LISTING_DESC_MAX = 1000;

export interface ClampPostListingAiTextResult {
  title: string;
  description: string;
  titleTrimmed: boolean;
  descriptionTrimmed: boolean;
}

/** Ensures AI output fits web form / Firestore limits before applying to the form. */
/** Same precision as Cloud Function `computeContentHash` for lat/lng. */
export function listingCoordsEqual(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): boolean {
  return (
    a.lat.toFixed(3) === b.lat.toFixed(3) &&
    a.lng.toFixed(3) === b.lng.toFixed(3)
  );
}

export function clampPostListingAiText(
  title: string,
  description: string
): ClampPostListingAiTextResult {
  let t = title.trim();
  let d = description.trim();
  const titleTrimmed = t.length > POST_LISTING_TITLE_MAX;
  const descriptionTrimmed = d.length > POST_LISTING_DESC_MAX;
  if (titleTrimmed) t = t.slice(0, POST_LISTING_TITLE_MAX);
  if (descriptionTrimmed) d = d.slice(0, POST_LISTING_DESC_MAX);
  return { title: t, description: d, titleTrimmed, descriptionTrimmed };
}
