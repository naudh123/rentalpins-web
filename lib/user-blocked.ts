/** Matches Firestore `isNotBlocked()` — only explicit `true` blocks. */

export function isUserBlocked(
  data: { isBlocked?: unknown } | null | undefined
): boolean {
  return data?.isBlocked === true;
}
