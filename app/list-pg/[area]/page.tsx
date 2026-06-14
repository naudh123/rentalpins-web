import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SupplyLandingPage from "@/components/seo/SupplyLandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getListPgAreaConfig, getListPgAreaSlugs } from "@/lib/supply-pages-config";

export function generateStaticParams() {
  return getListPgAreaSlugs().map((area) => ({ area }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const config = getListPgAreaConfig(area);
  if (!config) return {};
  return buildPageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: config.path,
    locale: "en_IN",
  });
}

export default async function Page({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const config = getListPgAreaConfig(area);
  if (!config) notFound();
  return <SupplyLandingPage config={config} />;
}
