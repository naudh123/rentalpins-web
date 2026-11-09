// Paginated city hub: /rentals/{country}/{city}/page/{n} (n ≥ 2)
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import HubListingsPage from "@/components/seo/HubListingsPage";
import { hubPageMetadata, loadHubPage, resolveHub } from "@/lib/seo/hub-page-route";

type Params = { country: string; city: string; page: string };

export const revalidate = 7200;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { country, city, page } = await params;
  const hub = resolveHub(country, city);
  if (!hub) return { title: "Not Found" };
  const hubPage = await loadHubPage(hub, page);
  if (!hubPage) return { title: "Not Found" };
  return hubPageMetadata(hub, hubPage);
}

export default async function CityHubPage({ params }: { params: Promise<Params> }) {
  const { country, city, page } = await params;
  const hub = resolveHub(country, city);
  if (!hub) notFound();
  // /page/1 is the hub itself.
  if (page === "1") permanentRedirect(hub.basePath);
  const hubPage = await loadHubPage(hub, page);
  if (!hubPage) notFound();

  return (
    <HubListingsPage
      placeName={hub.placeName}
      basePath={hub.basePath}
      hubPage={hubPage}
      crumbs={hub.crumbs}
      relatedLinks={hub.relatedLinks}
    />
  );
}
