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

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: "Googlebot", allow: "/", disallow: "/api/" },
      { userAgent: "GPTBot", allow: "/", disallow: "/api/" },
      { userAgent: "ChatGPT-User", allow: "/", disallow: "/api/" },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: "/api/" },
      { userAgent: "Google-Extended", allow: "/", disallow: "/api/" },
      { userAgent: "PerplexityBot", allow: "/", disallow: "/api/" },
      { userAgent: "anthropic-ai", allow: "/", disallow: "/api/" },
      { userAgent: "ClaudeBot", allow: "/", disallow: "/api/" },
      { userAgent: "Amazonbot", allow: "/", disallow: "/api/" },
    ],
    sitemap,
  };
}
