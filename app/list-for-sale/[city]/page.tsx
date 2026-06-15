import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListForSaleLandingPage from "@/components/sale/ListForSaleLandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getListForSaleCityConfig,
  getListForSaleCitySlugs,
} from "@/lib/sale/list-for-sale-config";

export function generateStaticParams() {
  return getListForSaleCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const config = getListForSaleCityConfig(city);
  if (!config) return {};
  return buildPageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: config.path,
    locale: "en_IN",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const config = getListForSaleCityConfig(city);
  if (!config) notFound();
  return <ListForSaleLandingPage config={config} />;
}
