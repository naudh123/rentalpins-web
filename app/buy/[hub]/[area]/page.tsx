import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buyPageMetadata,
  BuyPage,
} from "@/lib/seo/buy-page-factory";
import {
  buyCityMoneyMetadata,
  BuyCityMoneyPage,
  isBuyCityMoneyPage,
} from "@/lib/seo/buy-city-page-factory";
import {
  getBuyPageConfig,
  getBuySubAreaParams,
} from "@/lib/sale/buy-pages-config";
import { getBuyCityMoneyPageParams } from "@/lib/seo/city-buy-seo-config";

export function generateStaticParams() {
  return [...getBuySubAreaParams(), ...getBuyCityMoneyPageParams()];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hub: string; area: string }>;
}): Promise<Metadata> {
  const { hub, area } = await params;
  if (isBuyCityMoneyPage(hub, area)) {
    return buyCityMoneyMetadata(hub, area);
  }
  if (!getBuyPageConfig(hub, area)) return { title: "Buy property | RentalPins" };
  return buyPageMetadata(hub, area);
}

export default async function Page({
  params,
}: {
  params: Promise<{ hub: string; area: string }>;
}) {
  const { hub, area } = await params;
  if (isBuyCityMoneyPage(hub, area)) {
    return <BuyCityMoneyPage country={hub} city={area} />;
  }
  if (!getBuyPageConfig(hub, area)) notFound();
  return <BuyPage hubSlug={hub} areaSlug={area} />;
}
