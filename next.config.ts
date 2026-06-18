import type { NextConfig } from "next";

/** Only set on hosted staging (e.g. www.rentalpins.com/staging). Leave unset for local dev. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(self), microphone=()",
  },
];

if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "production") {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    // Vercel Image Optimization returns 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED)
    // on this project — serve public assets and Firebase URLs directly instead.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "*.firebasestorage.app" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
