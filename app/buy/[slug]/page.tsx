import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buyPageMetadata, BuyPage } from "@/lib/seo/buy-page-factory";
import { getBuyHub, getBuyHubSlugs } from "@/lib/sale/buy-pages-config";

export function generateStaticParams() {
  return getBuyHubSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getBuyHub(slug)) return { title: "Buy property | RentalPins" };
  return buyPageMetadata(slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getBuyHub(slug)) notFound();
  return <BuyPage hubSlug={slug} />;
}
