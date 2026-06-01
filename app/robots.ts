import type { MetadataRoute } from "next";
import { appPath, deployEnv, siteUrl } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const sitemap = `${siteUrl}${appPath("/sitemap.xml")}`;

  if (deployEnv === "staging") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap,
    };
  }

  const disallow = ["/api/", "/chat/", "/profile/", "/auth/", "/post/", "/saved-listings/", "/saved-searches/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "Googlebot", allow: "/", disallow },
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "anthropic-ai", allow: "/", disallow },
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "Amazonbot", allow: "/", disallow },
    ],
    sitemap: [
      sitemap,
      `${siteUrl}${appPath("/city-sitemap.xml")}`,
      `${siteUrl}${appPath("/locality-sitemap.xml")}`,
      `${siteUrl}${appPath("/listing-sitemap.xml")}`,
      `${siteUrl}${appPath("/blog-sitemap.xml")}`,
      `${siteUrl}${appPath("/category-sitemap.xml")}`,
      `${siteUrl}${appPath("/sitemap-cities.xml")}`,
      `${siteUrl}${appPath("/sitemap-localities.xml")}`,
      `${siteUrl}${appPath("/sitemap-listings.xml")}`,
      `${siteUrl}${appPath("/sitemap-blog.xml")}`,
    ],
  };
}
