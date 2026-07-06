/**
 * Builder / project brand palettes — derived from public developer websites (Jul 2026).
 * Applied as CSS variables on `.builder-luxury` for premium microsite theming.
 */

import { TRICITY_BUILDERS, TRICITY_PROJECTS } from "@/lib/builders/tricity-catalog";

export interface BrandTheme {
  id: string;
  label: string;
  primary: string;
  primaryDeep: string;
  accent: string;
  accentHover: string;
  accentMuted: string;
  surface: string;
  surfaceElevated: string;
  heroGlow: string;
  heroEyebrow: string;
  /** Text on accent buttons (gold btn default = primary) */
  accentText?: string;
}

export const DEFAULT_BRAND_THEME: BrandTheme = {
  id: "rentalpins",
  label: "RentalPins Luxury",
  primary: "#1E3A6E",
  primaryDeep: "#0a1628",
  accent: "#FBB316",
  accentHover: "#D4B03A",
  accentMuted: "#F3E8C8",
  surface: "#FAF7F2",
  surfaceElevated: "#F0EBE0",
  heroGlow: "rgba(251, 179, 22, 0.2)",
  heroEyebrow: "Premium Development",
  accentText: "#1E3A6E",
};

function theme(
  id: string,
  label: string,
  primary: string,
  accent: string,
  extra: Partial<BrandTheme> = {}
): BrandTheme {
  return {
    ...DEFAULT_BRAND_THEME,
    id,
    label,
    primary,
    accent,
    primaryDeep: extra.primaryDeep ?? primary,
    accentHover: extra.accentHover ?? accent,
    accentMuted: extra.accentMuted ?? DEFAULT_BRAND_THEME.accentMuted,
    surface: extra.surface ?? DEFAULT_BRAND_THEME.surface,
    surfaceElevated: extra.surfaceElevated ?? DEFAULT_BRAND_THEME.surfaceElevated,
    heroGlow: extra.heroGlow ?? DEFAULT_BRAND_THEME.heroGlow,
    heroEyebrow: extra.heroEyebrow ?? "Premium Development",
    accentText: extra.accentText ?? primary,
    ...extra,
  };
}

/** Builder-level brand themes (public website colours). */
export const BUILDER_BRAND_THEMES: Record<string, BrandTheme> = {
  "dlf-new-chandigarh": theme("dlf", "DLF", "#00386B", "#046BD2", {
    primaryDeep: "#111111",
    accentHover: "#045CB4",
    accentMuted: "#D6E8F7",
    heroGlow: "rgba(4, 107, 210, 0.22)",
    heroEyebrow: "DLF New Chandigarh",
    surface: "#F0F5FA",
    surfaceElevated: "#EEF2F8",
    accentText: "#FFFFFF",
  }),
  "omaxe-group": theme("omaxe", "Omaxe", "#0063AF", "#E61E25", {
    primaryDeep: "#004A82",
    accentHover: "#FF2A33",
    accentMuted: "#FAD4D6",
    heroGlow: "rgba(230, 30, 37, 0.2)",
    heroEyebrow: "Omaxe Township Living",
    accentText: "#FFFFFF",
  }),
  "emaar-india": theme("emaar", "Emaar", "#2F7BBF", "#BD2426", {
    primaryDeep: "#1E5A8A",
    accentHover: "#D42E30",
    accentMuted: "#F5D4D5",
    heroGlow: "rgba(189, 36, 38, 0.2)",
    heroEyebrow: "Emaar Mohali Hills",
    surface: "#F5F9FD",
    accentText: "#FFFFFF",
  }),
  "godrej-properties": theme("godrej", "Godrej", "#27262E", "#5FB233", {
    primaryDeep: "#141414",
    accent: "#5FB233",
    accentHover: "#DAA845",
    accentMuted: "#D5EDD8",
    heroGlow: "rgba(95, 178, 51, 0.18)",
    heroEyebrow: "Godrej Tricity Living",
    accentText: "#FFFFFF",
  }),
  "ats-infrastructure": theme("ats", "ATS", "#3D2314", "#C75B3A", {
    primaryDeep: "#1A0F09",
    accent: "#B84A28",
    accentHover: "#D4562F",
    accentMuted: "#F5E6DF",
    heroGlow: "rgba(184, 74, 40, 0.25)",
    heroEyebrow: "Casa Española Collection",
    surface: "#FBF6F2",
    surfaceElevated: "#F3EBE4",
  }),
  "homeland-group": theme("homeland", "Homeland", "#1A1A1A", "#DA532C", {
    primaryDeep: "#0A0A0A",
    accentHover: "#E8653F",
    accentMuted: "#F5E0D8",
    heroGlow: "rgba(218, 83, 44, 0.22)",
    heroEyebrow: "Homeland Regalia",
    surface: "#FAF8F4",
    accentText: "#FFFFFF",
  }),
  "jubilee-group": theme("jubilee", "Jubilee", "#111111", "#0693E3", {
    primaryDeep: "#000000",
    accentHover: "#C8A47E",
    accentMuted: "#D0EBFA",
    heroGlow: "rgba(6, 147, 227, 0.2)",
    heroEyebrow: "Jubilee City Living",
    accentText: "#FFFFFF",
  }),
  "medallion-homes": theme("medallion", "Medallion", "#111111", "#046BD2", {
    primaryDeep: "#000000",
    accentHover: "#066AAB",
    accentMuted: "#D6E8F7",
    heroGlow: "rgba(4, 107, 210, 0.24)",
    heroEyebrow: "Medallion Collection",
    accentText: "#FFFFFF",
  }),
  "turnstone-realty": theme("turnstone", "Turnstone", "#111111", "#046BD2", {
    primaryDeep: "#000000",
    accentHover: "#066AAB",
    accentMuted: "#D6E8F7",
    heroEyebrow: "The Medallion IT City",
    accentText: "#FFFFFF",
  }),
  "sbp-group": theme("sbp", "SBP Group", "#00365A", "#DC214C", {
    primaryDeep: "#0E5584",
    accentHover: "#E03030",
    accentMuted: "#FAD4DC",
    heroGlow: "rgba(220, 33, 76, 0.2)",
    heroEyebrow: "SBP City of Dreams",
    accentText: "#FFFFFF",
  }),
  "gillco-group": theme("gillco", "Gillco", "#0A4F3B", "#C4A265", {
    primaryDeep: "#063528",
    accentHover: "#D4B576",
    accentMuted: "#F3E8C8",
    heroGlow: "rgba(196, 162, 101, 0.22)",
    heroEyebrow: "Gillco Valley Living",
    surface: "#F8F6F2",
    accentText: "#0A4F3B",
  }),
  "stj-group": theme("stj", "STJ Group", "#08415C", "#00AEFF", {
    primaryDeep: "#004274",
    accentHover: "#6FABCA",
    accentMuted: "#D0EBFA",
    heroGlow: "rgba(0, 174, 255, 0.2)",
    heroEyebrow: "STJ Townships",
    accentText: "#FFFFFF",
  }),
  "velora-buildtech": theme("velora", "Velora", "#32373C", "#85BA47", {
    primaryDeep: "#1A1A1A",
    accentHover: "#709C3C",
    accentMuted: "#D8EDCC",
    heroGlow: "rgba(133, 186, 71, 0.22)",
    heroEyebrow: "Velora Urbano",
    accentText: "#FFFFFF",
  }),
  "epique-real-ventures": theme("epique", "Epique", "#1B2838", "#E8B923", {
    primaryDeep: "#0E141D",
    heroEyebrow: "Epique Plotted Living",
  }),
  "ks-group": theme("ks", "KS Group", "#161E2D", "#DB1D23", {
    primaryDeep: "#000000",
    accentHover: "#C03813",
    accentMuted: "#FAD4D6",
    heroGlow: "rgba(219, 29, 35, 0.28)",
    heroEyebrow: "KS One O8 · Sky Living",
    surface: "#F7F7F7",
    accentText: "#FFFFFF",
  }),
  "affinity-builders": theme("affinity", "Affinity", "#1E2A4A", "#B76E79", {
    primaryDeep: "#0F1528",
    accent: "#C98994",
    accentHover: "#D9A0AA",
    accentMuted: "#F5E8EA",
    heroGlow: "rgba(183, 110, 121, 0.22)",
    heroEyebrow: "Affinity Belgravia",
  }),
  "mb-infrabuild": theme("mb-infrabuild", "MB Infrabuild", "#1A472A", "#8FBC8F", {
    primaryDeep: "#0D2818",
    accent: "#2E7D4E",
    accentHover: "#3D9960",
    accentMuted: "#D8EDDF",
    heroGlow: "rgba(46, 125, 78, 0.2)",
    heroEyebrow: "Beverly Golf Avenue",
    accentText: "#FFFFFF",
  }),
  "hero-realty": theme("hero", "Hero", "#1A1A1A", "#EE2E24", {
    primaryDeep: "#0D0D0D",
    accent: "#E31837",
    accentHover: "#FF3347",
    accentMuted: "#FAD4D8",
    heroGlow: "rgba(227, 24, 55, 0.2)",
    heroEyebrow: "Hero Homes Mohali",
    accentText: "#FFFFFF",
  }),
  "tdi-infratech": theme("tdi", "TDI", "#254085", "#009ADE", {
    primaryDeep: "#1A305E",
    accentHover: "#4268CA",
    accentMuted: "#D0EBFA",
    heroGlow: "rgba(0, 154, 222, 0.22)",
    heroEyebrow: "TDI City Mohali",
    surface: "#FBF6F4",
    accentText: "#FFFFFF",
  }),
  "srg-group": theme("srg", "SRG Group", "#111111", "#046BD2", {
    primaryDeep: "#000000",
    accentHover: "#066AAB",
    accentMuted: "#D6E8F7",
    heroGlow: "rgba(4, 107, 210, 0.22)",
    heroEyebrow: "Marbella Grand",
    accentText: "#FFFFFF",
  }),
  "gmada-tricity": theme("gmada", "GMADA", "#1E4A8C", "#2E8B57", {
    primaryDeep: "#0F2748",
    accent: "#2563A8",
    accentHover: "#3B7BC4",
    accentMuted: "#D4E4F7",
    heroGlow: "rgba(37, 99, 168, 0.18)",
    heroEyebrow: "GMADA Master Plan",
    accentText: "#FFFFFF",
  }),
  "hlp-infratech": theme("hlp", "HLP", "#1A365D", "#38A169", {
    primaryDeep: "#0D2137",
    accent: "#2F855A",
    accentHover: "#38A169",
    accentMuted: "#C6F6D5",
    heroEyebrow: "HLP Palmillas",
    accentText: "#FFFFFF",
  }),
  "vishranti-developers": theme("vishranti", "Vishranti", "#234E52", "#4FD1C5", {
    primaryDeep: "#122729",
    accent: "#319795",
    accentHover: "#38B2AC",
    accentMuted: "#C4F1EF",
    heroEyebrow: "Vishranti Township",
    accentText: "#FFFFFF",
  }),
  "bajwa-developers": theme("bajwa", "Sunny Enclave", "#1B3A5F", "#F97316", {
    primaryDeep: "#0F2438",
    accent: "#F97316",
    accentHover: "#EA580C",
    accentMuted: "#FFEDD5",
    heroGlow: "rgba(249, 115, 22, 0.22)",
    heroEyebrow: "Sunny Enclave Kharar",
    accentText: "#FFFFFF",
  }),
  "log-hut-builders": theme("log-hut", "Log Hut", "#3D2914", "#A67C52", {
    primaryDeep: "#1F150A",
    accent: "#8B6914",
    accentHover: "#A67C52",
    accentMuted: "#EDE4D4",
    heroEyebrow: "Log Hut Model Town",
    surface: "#FAF6F0",
  }),
  "smart-city-developers": theme("smart-city", "Smart City", "#0F3460", "#16C79A", {
    primaryDeep: "#071A30",
    accent: "#16C79A",
    accentHover: "#1EE3B0",
    accentMuted: "#C8F7EC",
    heroEyebrow: "Smart City Mohali",
    accentText: "#0F3460",
  }),
  "subhash-mangat-group": theme("subhash-mangat", "Subhash Mangat", "#1A472A", "#D4AF37", {
    primaryDeep: "#0D2818",
    heroEyebrow: "Aura Valley Living",
  }),
  "7c-realty": theme("7c", "7C Realty", "#1B3A4B", "#E09F3E", {
    primaryDeep: "#0E1E28",
    accent: "#E09F3E",
    heroEyebrow: "7C Aerotro Homes",
  }),
  "jtpl-township": theme("jtpl", "JTPL", "#2D3748", "#48BB78", {
    primaryDeep: "#1A202C",
    accent: "#38A169",
    accentHover: "#48BB78",
    accentMuted: "#C6F6D5",
    heroEyebrow: "JTPL City Plots",
    accentText: "#FFFFFF",
  }),
  "ansal-api": theme("ansal", "Ansal API", "#1A365D", "#ECC94B", {
    primaryDeep: "#0D2137",
    accent: "#D69E2E",
    heroEyebrow: "Ansal API Sector 115",
  }),
  "klv-buildtech": theme("klv", "KLV", "#171923", "#D4AF37", {
    primaryDeep: "#0A0B0F",
    heroEyebrow: "KLV Signature Towers",
  }),
  "ananta-housing": theme("ananta", "Ananta", "#2D3748", "#667EEA", {
    primaryDeep: "#1A202C",
    accent: "#5A67D8",
    accentHover: "#667EEA",
    accentMuted: "#E0E7FF",
    heroEyebrow: "Ananta Aspire",
    accentText: "#FFFFFF",
  }),
  "unnati-developers": theme("unnati", "Unnati", "#276749", "#68D391", {
    primaryDeep: "#1C4532",
    accent: "#48BB78",
    accentMuted: "#C6F6D5",
    heroEyebrow: "Palm Valley Panchkula",
    accentText: "#FFFFFF",
  }),
  "elysium-homes": theme("elysium", "Elysium", "#44337A", "#B794F4", {
    primaryDeep: "#322659",
    accent: "#9F7AEA",
    accentMuted: "#E9D8FD",
    heroEyebrow: "The Elysium",
    accentText: "#FFFFFF",
  }),
  "abc-developers": theme("abc", "ABC Developers", "#1E3A6E", "#E8501A", {
    heroGlow: "rgba(232, 80, 26, 0.2)",
    heroEyebrow: "ABC Greens",
    accentText: "#FFFFFF",
  }),
  "alc-group": theme("alc", "ALC Group", "#1A2744", "#E85D04", {
    primaryDeep: "#0D1526",
    accentHover: "#F97316",
    accentMuted: "#FDEAD7",
    heroGlow: "rgba(232, 93, 4, 0.22)",
    heroEyebrow: "Highway Commercial",
    accentText: "#FFFFFF",
  }),
  "bestech-group": theme("bestech", "Bestech", "#0C2340", "#00A651", {
    primaryDeep: "#061528",
    accent: "#00A651",
    accentHover: "#008C44",
    accentMuted: "#D4F0E0",
    heroGlow: "rgba(0, 166, 81, 0.18)",
    heroEyebrow: "Grade-A Business Tower",
    accentText: "#FFFFFF",
  }),
  "mahakali-developers": theme("mahakali", "MK Tech Park", "#2D3748", "#F6AD55", {
    primaryDeep: "#1A202C",
    accent: "#ED8936",
    accentHover: "#DD6B20",
    accentMuted: "#FEEBC8",
    heroGlow: "rgba(237, 137, 54, 0.22)",
    heroEyebrow: "Industrial & Warehousing",
    accentText: "#1A202C",
  }),
};

/** Project-level refinements (override builder theme). */
export const PROJECT_BRAND_THEMES: Record<string, Partial<BrandTheme>> = {
  "ats-casa-espana": {
    heroEyebrow: "Casa Española · Ready to Move",
    heroGlow: "rgba(184, 74, 40, 0.3)",
    surface: "#FBF6F2",
  },
  "sbp-medicity-new-chandigarh": {
    primary: "#00365A",
    primaryDeep: "#0E5584",
    accent: "#DC214C",
    heroEyebrow: "SBP Medicity · Ultra Luxury",
    heroGlow: "rgba(220, 33, 76, 0.28)",
  },
  "dlf-hyde-park-estate": {
    heroEyebrow: "Hyde Park Estate · Mullanpur",
    primary: "#00386B",
    primaryDeep: "#111111",
    accent: "#046BD2",
  },
  "gillco-valley": {
    primary: "#0A4F3B",
    accent: "#C4A265",
    surface: "#F8F6F2",
    heroEyebrow: "Gillco Valley · Kharar",
  },
  "gillco-meraqui": {
    primary: "#0A4F3B",
    accent: "#C4A265",
    heroEyebrow: "Meraqui · Sector 126 · Luxury Apartments",
  },
  "gillco-parkhills": {
    primary: "#0A4F3B",
    accent: "#C4A265",
    heroEyebrow: "Parkhills · Premium Plots",
  },
  "jubilee-city-gardens": {
    accent: "#0693E3",
    accentHover: "#C8A47E",
    heroEyebrow: "Jubilee City Gardens · Mohali",
  },
  "velora-urbano": {
    accent: "#85BA47",
    accentHover: "#709C3C",
    heroEyebrow: "Velora Urbano · Zirakpur",
  },
  "tdi-city-mohali": {
    primary: "#254085",
    accent: "#009ADE",
    heroEyebrow: "TDI City · Sector 118",
  },
  "emaar-mohali-hills": {
    heroEyebrow: "Mohali Hills · Plotted Estate",
  },
  "emaar-the-views": {
    heroEyebrow: "The Views · Emaar Residences",
  },
  "ks-one-o8": {
    primary: "#161E2D",
    primaryDeep: "#000000",
    accent: "#DB1D23",
    heroEyebrow: "108 Metres · PR-7 Skyline",
    heroGlow: "rgba(219, 29, 35, 0.32)",
  },
  "the-medallion-sector-82a": {
    heroEyebrow: "IT City · Ready to Move",
  },
  "marbella-grand": {
    heroEyebrow: "Marbella Grand · Sector 82A",
  },
  "sunny-enclave-kharar": {
    heroEyebrow: "Sector 125 · Mega Township",
  },
  "jubilee-techyards": {
    heroEyebrow: "Sector 102A · IT Park",
  },
  "sbp-rio-one": {
    heroEyebrow: "VIP Road · Retail Hub",
  },
  "sbp-city-square": {
    heroEyebrow: "Sector 127 · Commercial",
  },
  "homeland-global-park": {
    heroEyebrow: "Sector 75 · Global Park",
  },
  "alc-crosswalk": {
    heroEyebrow: "Highway · Crosswalk",
  },
  "bestech-business-tower": {
    heroEyebrow: "Sector 66 · Grade-A Offices",
  },
  "mk-technology-park": {
    heroEyebrow: "Landran · Industrial Hub",
  },
  "sbp-siel-industrial-estate": {
    heroEyebrow: "Rajpura · NH-44 Industrial",
  },
  "sbp-industrial-park-tepla": {
    heroEyebrow: "Tepla Road · Industrial",
  },
};

export function resolveBuilderSlug(
  builderSlug?: string | null,
  builderName?: string | null,
  projectSlug?: string | null
): string | null {
  const slug = builderSlug?.trim();
  if (slug && BUILDER_BRAND_THEMES[slug]) return slug;

  const catalogProject = projectSlug?.trim()
    ? TRICITY_PROJECTS.find((p) => p.slug === projectSlug.trim())
    : undefined;
  if (
    catalogProject?.builderSlug &&
    BUILDER_BRAND_THEMES[catalogProject.builderSlug]
  ) {
    return catalogProject.builderSlug;
  }

  const norm = (builderName || "").trim().toLowerCase();
  if (!norm) return slug || catalogProject?.builderSlug || null;

  const byName = TRICITY_BUILDERS.find((b) => b.name.toLowerCase() === norm);
  if (byName) return byName.slug;

  const partial = TRICITY_BUILDERS.find(
    (b) => norm.includes(b.name.toLowerCase()) || b.name.toLowerCase().includes(norm)
  );
  return partial?.slug ?? slug ?? catalogProject?.builderSlug ?? null;
}

export function getBrandTheme(
  builderSlug?: string | null,
  projectSlug?: string | null,
  builderName?: string | null
): BrandTheme {
  const resolvedSlug = resolveBuilderSlug(builderSlug, builderName, projectSlug);
  const base =
    (resolvedSlug && BUILDER_BRAND_THEMES[resolvedSlug]) || DEFAULT_BRAND_THEME;
  const override = projectSlug ? PROJECT_BRAND_THEMES[projectSlug] : undefined;
  if (!override) return base;
  return { ...base, ...override, id: override.id ?? `${base.id}-${projectSlug}` };
}

export function brandThemeToCssVars(t: BrandTheme): Record<string, string> {
  return {
    "--lux-primary": t.primary,
    "--lux-primary-deep": t.primaryDeep,
    "--lux-accent": t.accent,
    "--lux-accent-hover": t.accentHover,
    "--lux-accent-muted": t.accentMuted,
    "--lux-accent-text": t.accentText ?? t.primary,
    "--lux-surface": t.surface,
    "--lux-surface-elevated": t.surfaceElevated,
    "--lux-hero-glow": t.heroGlow,
    "--brand-navy": t.primary,
    "--sale-gold": t.accent,
    "--sale-gold-hover": t.accentHover,
    "--sale-gold-muted": t.accentMuted,
    "--sale-ivory": t.surface,
    "--sale-ivory-elevated": t.surfaceElevated,
    "--lux-navy-deep": t.primaryDeep,
    "--lux-shadow-gold": `0 20px 44px -12px color-mix(in srgb, ${t.accent} 28%, transparent)`,
  } as Record<string, string>;
}
