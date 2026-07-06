import { basePath } from "@/lib/config";
import type { AgentSurface } from "./types";

export interface FloatingAgentContext {
  surface: AgentSurface;
  transactionType: "rent" | "sale";
  citySlug?: string;
  projectSlug?: string;
  projectName?: string;
  title: string;
  subtitle: string;
  /** Map routes — float above map controls (mobile sheet, view toggle). */
  placement?: "map" | "default";
}

const HIDDEN_PREFIXES = [
  "/admin",
  "/auth",
  "/chat",
  "/advisor",
  "/developers",
] as const;

function normalizePath(pathname: string | null): string {
  if (!pathname) return "/";
  if (basePath && pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length) || "/";
  }
  return pathname;
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Whether the global floating assistant should render on this route. */
export function shouldShowFloatingAgent(pathname: string | null): boolean {
  const path = normalizePath(pathname);
  return !HIDDEN_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Route-aware agent mode for the floating widget. */
export function resolveFloatingAgentContext(pathname: string | null): FloatingAgentContext {
  const path = normalizePath(pathname);

  if (path === "/search" || path.startsWith("/search/")) {
    return {
      surface: "map",
      transactionType: "rent",
      title: "Ask AI",
      subtitle: "Rent map copilot",
      placement: "map",
    };
  }

  if (path === "/buy/search" || path.startsWith("/buy/search/")) {
    return {
      surface: "map",
      transactionType: "sale",
      title: "Ask AI",
      subtitle: "Buy map copilot",
      placement: "map",
    };
  }

  const projectDetail = path.match(/^\/projects\/([^/]+)\/([^/]+)\/?$/);
  if (projectDetail) {
    const [, citySlug, projectSlug] = projectDetail;
    const projectName = slugToTitle(projectSlug);
    return {
      surface: "project",
      transactionType: "sale",
      citySlug,
      projectSlug,
      projectName,
      title: "Ask AI",
      subtitle: projectName,
    };
  }

  const projectCity = path.match(/^\/projects\/([^/]+)\/?$/);
  if (projectCity) {
    const citySlug = projectCity[1];
    return {
      surface: "project",
      transactionType: "sale",
      citySlug,
      title: "Ask AI",
      subtitle: `${slugToTitle(citySlug)} projects`,
    };
  }

  if (path === "/projects" || path.startsWith("/projects/")) {
    return {
      surface: "project",
      transactionType: "sale",
      title: "Ask AI",
      subtitle: "Tricity developer projects",
    };
  }

  if (path.startsWith("/buy")) {
    return {
      surface: "advisor",
      transactionType: "sale",
      title: "Ask AI",
      subtitle: "Tricity property advisor",
    };
  }

  return {
    surface: "advisor",
    transactionType: "rent",
    title: "Ask AI",
    subtitle: "Rent, buy & invest in Tricity",
  };
}
