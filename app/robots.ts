import type { MetadataRoute } from "next";
import { deployEnv } from "@/lib/config";
import { getPublicSitemapUrls } from "@/lib/seo/sitemap-config";

export default function robots(): MetadataRoute.Robots {
  const sitemap = getPublicSitemapUrls();

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
    sitemap,
  };
}
