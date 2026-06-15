import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buyPageMetadata, BuyPage } from "@/lib/seo/buy-page-factory";
import { getBuyHub, getBuyHubSlugs } from "@/lib/sale/buy-pages-config";

export function generateStaticParams() {
  return getBuyHubSlugs().map((hub) => ({ hub }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hub: string }>;
}): Promise<Metadata> {
  const { hub } = await params;
  if (!getBuyHub(hub)) return { title: "Buy property | RentalPins" };
  return buyPageMetadata(hub);
}

export default async function BuyHubPage({
  params,
}: {
  params: Promise<{ hub: string }>;
}) {
  const { hub } = await params;
  if (!getBuyHub(hub)) notFound();
  return <BuyPage hubSlug={hub} />;
}
