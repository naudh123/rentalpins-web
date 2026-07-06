import type { BuilderProject, ProjectType } from "@/lib/types/builder-microsite";

export type InvestProjectLens =
  | "all"
  | "yield"
  | "appreciation"
  | "student"
  | "plot"
  | "pre-launch";

export const INVEST_PROJECT_LENSES: { id: InvestProjectLens; label: string; hint: string }[] = [
  { id: "all", label: "All projects", hint: "Full RERA catalog" },
  { id: "yield", label: "Rental yield", hint: "Apartments & villas near tenant corridors" },
  { id: "appreciation", label: "Appreciation", hint: "Growth corridor & mixed-use launches" },
  { id: "student", label: "Student housing", hint: "Near CU / Kharar belt" },
  { id: "plot", label: "Plots", hint: "GMADA & plotted townships" },
  { id: "pre-launch", label: "Pre-launch / new", hint: "Under construction & upcoming" },
];

const STUDENT_CITY_SLUGS = new Set(["kharar", "mohali", "landran"]);
const YIELD_TYPES = new Set<ProjectType>(["apartments", "villas", "mixed-use"]);
const APPRECIATION_TYPES = new Set<ProjectType>(["mixed-use", "apartments", "commercial"]);

function isPreLaunch(project: BuilderProject): boolean {
  const status = project.status?.toLowerCase() ?? "";
  return (
    status.includes("upcoming") ||
    status.includes("pre") ||
    status.includes("launch") ||
    project.availableUnits > 0 && project.soldUnits === 0
  );
}

export function filterProjectsByInvestLens(
  projects: BuilderProject[],
  lens: InvestProjectLens
): BuilderProject[] {
  if (lens === "all") return projects;

  return projects.filter((p) => {
    switch (lens) {
      case "yield":
        return YIELD_TYPES.has(p.projectType) && p.priceMax != null && p.priceMax <= 2_00_00_000;
      case "appreciation":
        return APPRECIATION_TYPES.has(p.projectType);
      case "student":
        return STUDENT_CITY_SLUGS.has(p.citySlug) && p.projectType !== "industrial";
      case "plot":
        return p.projectType === "plots";
      case "pre-launch":
        return isPreLaunch(p);
      default:
        return true;
    }
  });
}

export function investNoteForProject(project: BuilderProject): string {
  if (project.projectType === "plots") {
    return "Plot entry — verify CLU, GMADA/MC limits, and 5–10 yr hold horizon. Liquidity slower than ready flats.";
  }
  if (project.projectType === "industrial") {
    return "Industrial — not residential investment. Confirm zoning with planning guides.";
  }
  if (STUDENT_CITY_SLUGS.has(project.citySlug) && project.projectType === "apartments") {
    return "Near student corridors — compare PG rent density on rent map before underwriting family rent assumptions.";
  }
  if (project.projectType === "apartments" || project.projectType === "villas") {
    return "Model yield with rent comps + calculator. Confirm RERA, possession, and payment plan before booking.";
  }
  return "Review RERA status, payment plan, and possession timeline. Use yield calculator for affordability stress-test.";
}
