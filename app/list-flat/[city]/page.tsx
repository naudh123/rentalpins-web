import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SupplyLandingPage from "@/components/seo/SupplyLandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getListFlatCityConfig, getListFlatCitySlugs } from "@/lib/supply-pages-config";

export function generateStaticParams() {
  return getListFlatCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const config = getListFlatCityConfig(city);
  if (!config) return {};
  return buildPageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: config.path,
    locale: "en_IN",
  });
}

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const config = getListFlatCityConfig(city);
  if (!config) notFound();
  return <SupplyLandingPage config={config} />;
}
