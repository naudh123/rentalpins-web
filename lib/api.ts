import { basePath } from "./config";

/**
 * API path prefix. Uses NEXT_PUBLIC_BASE_PATH from build, or infers /staging
 * from the browser URL when env is unset (local dev visiting /staging/* links).
 */
export function resolveApiBasePath(): string {
  if (basePath) return basePath;
  if (typeof window !== "undefined") {
    const { pathname } = window.location;
    if (pathname === "/staging" || pathname.startsWith("/staging/")) {
      return "/staging";
    }
  }
  return "";
}

/** Client-side API URL (respects NEXT_PUBLIC_BASE_PATH for /staging deploys). */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${resolveApiBasePath()}${p}`;
}

/** Fallback URL without /staging when primary path 404s in local dev. */
export function apiUrlFallback(path: string): string | null {
  const p = path.startsWith("/") ? path : `/${path}`;
  const resolved = resolveApiBasePath();
  if (resolved === "/staging" && !basePath) {
    return p;
  }
  return null;
}
