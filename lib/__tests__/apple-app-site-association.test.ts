import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  appleAppSiteAssociation,
  DEFAULT_IOS_APP_BUNDLE_ID,
  IOS_UNIVERSAL_LINK_PATHS,
} from "@/lib/mobile/apple-app-site-association";

describe("apple-app-site-association", () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  beforeEach(() => {
    delete process.env.APPLE_TEAM_ID;
    delete process.env.IOS_APP_BUNDLE_ID;
  });

  it("includes listing and project paths", () => {
    expect(IOS_UNIVERSAL_LINK_PATHS).toContain("/projects/*");
    expect(IOS_UNIVERSAL_LINK_PATHS).toContain("/buy/projects/*");
  });

  it("uses placeholder appID when team id is unset", () => {
    const aasa = appleAppSiteAssociation();
    expect(aasa.applinks.details[0].appID).toBe(
      `REPLACE_WITH_TEAM_ID.${DEFAULT_IOS_APP_BUNDLE_ID}`
    );
  });

  it("builds appID from env when team id is set", () => {
    process.env.APPLE_TEAM_ID = "TEAM123456";
    process.env.IOS_APP_BUNDLE_ID = "com.rentit.app";
    const aasa = appleAppSiteAssociation();
    expect(aasa.applinks.details[0].appID).toBe("TEAM123456.com.rentit.app");
  });
});
