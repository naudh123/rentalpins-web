import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SupplyLandingPage from "@/components/seo/SupplyLandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getListPropertyCityConfig,
  getListPropertyCitySlugs,
} from "@/lib/supply-pages-config";

export function generateStaticParams() {
  return getListPropertyCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const config = getListPropertyCityConfig(city);
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
  const config = getListPropertyCityConfig(city);
  if (!config) notFound();
  return <SupplyLandingPage config={config} />;
}
