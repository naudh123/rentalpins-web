/**
 * Indexed or high-value routes that must not be redirected, renamed, or canonical-changed.
 * Includes legacy paths that 308 to canonical (middleware) — both are protected from SEO overrides.
 */
export const protectedRoutes = [
  "/",
  "/invest",
  "/pg-near-chandigarh-university",
  "/blog/kharar-pg-guide-chandigarh-university",
  // Legacy rentals (308 → /rentals/in/…)
  "/rentals/chandigarh",
  "/rentals/chandigarh/mohali",
  "/rentals/chandigarh/panchkula",
  "/rentals/chandigarh/zirakpur",
  "/rentals/chandigarh/kharar",
  "/rentals/chandigarh/landran",
  "/rentals/chandigarh/banur",
  "/rentals/ludhiana",
  "/rentals/ludhiana/sarabha-nagar",
  "/rentals/ludhiana/model-town",
  "/rentals/ludhiana/pakhowal-road",
  "/rentals/ludhiana/brs-nagar",
  "/rentals/ludhiana/focal-point",
  "/rentals/delhi",
  "/rentals/delhi/dwarka",
  "/rentals/delhi/mukherjee-nagar",
  // Canonical rentals hubs
  "/rentals/in/chandigarh",
  "/rentals/in/chandigarh/mohali",
  "/rentals/in/chandigarh/panchkula",
  "/rentals/in/chandigarh/zirakpur",
  "/rentals/in/chandigarh/kharar",
  "/rentals/in/chandigarh/landran",
  "/rentals/in/chandigarh/banur",
  "/rentals/in/ludhiana",
  "/rentals/in/ludhiana/sarabha-nagar",
  "/rentals/in/ludhiana/model-town",
  "/rentals/in/ludhiana/pakhowal-road",
  "/rentals/in/ludhiana/brs-nagar",
  "/rentals/in/ludhiana/focal-point",
  "/rentals/in/delhi",
  "/rentals/in/delhi/dwarka",
  "/rentals/in/delhi/mukherjee-nagar",
  // GSC short hub URLs
  "/rentals/mohali",
  "/rentals/kharar",
  "/rentals/kharar/chandigarh-university",
  "/rentals/chandigarh-university",
  "/rentals/zirakpur",
] as const;

export type ProtectedRoute = (typeof protectedRoutes)[number];

export function isProtectedRoute(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return (protectedRoutes as readonly string[]).includes(normalized);
}

/** Block noindex/redirect overrides on protected paths. */
export function assertSafeSeoMutation(pathname: string, action: string): void {
  if (isProtectedRoute(pathname)) {
    throw new Error(
      `SEO mutation "${action}" blocked on protected route: ${pathname}`
    );
  }
}
