import { appleAppSiteAssociation } from "@/lib/mobile/apple-app-site-association";

export function GET() {
  const body = appleAppSiteAssociation();
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
