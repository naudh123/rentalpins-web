export interface DeveloperProject {
  name: string;
  city: string;
}

export interface DeveloperProfile {
  slug: string;
  name: string;
  cities: string[];
  projects: DeveloperProject[];
}

/** Published developer showcase profiles — keep in sync with /developers index. */
export const DEVELOPER_PROFILES: DeveloperProfile[] = [
  {
    slug: "green-valley-builders",
    name: "Green Valley Builders",
    cities: ["Mohali"],
    projects: [{ name: "Green Valley Residences", city: "Mohali" }],
  },
  {
    slug: "tricity-builders",
    name: "Tricity Builders",
    cities: ["Mohali", "Zirakpur", "Panchkula"],
    projects: [
      { name: "Green Valley Residences", city: "Mohali" },
      { name: "Tricity Heights", city: "Zirakpur" },
    ],
  },
];

export function getDeveloperBySlug(slug: string): DeveloperProfile | undefined {
  return DEVELOPER_PROFILES.find((d) => d.slug === slug);
}

export function getDeveloperSitemapPaths(): string[] {
  return DEVELOPER_PROFILES.map((d) => `/developers/${d.slug}`);
}
