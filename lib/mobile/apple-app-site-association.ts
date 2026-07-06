/** Default iOS bundle id from Flutter Runner (update when App Store bundle changes). */
export const DEFAULT_IOS_APP_BUNDLE_ID = "com.example.rentitClean";

export const IOS_UNIVERSAL_LINK_PATHS = [
  "/listings/*",
  "/buy/listings/*",
  "/projects/*",
  "/buy/projects/*",
  "/?listing=*",
] as const;

export function iosAppBundleId(): string {
  return (
    process.env.IOS_APP_BUNDLE_ID?.trim() ||
    process.env.NEXT_PUBLIC_IOS_APP_BUNDLE_ID?.trim() ||
    DEFAULT_IOS_APP_BUNDLE_ID
  );
}

export function appleTeamId(): string | null {
  const id =
    process.env.APPLE_TEAM_ID?.trim() ||
    process.env.NEXT_PUBLIC_APPLE_TEAM_ID?.trim();
  return id || null;
}

export function appleAppSiteAssociation() {
  const teamId = appleTeamId();
  const bundleId = iosAppBundleId();

  return {
    applinks: {
      apps: [] as string[],
      details: [
        {
          appID: teamId ? `${teamId}.${bundleId}` : `REPLACE_WITH_TEAM_ID.${bundleId}`,
          paths: [...IOS_UNIVERSAL_LINK_PATHS],
        },
      ],
    },
  };
}
