import type { Metadata } from "next";
import {
  BuyRequirementsSeoPage,
  buyRequirementsMetadata,
} from "@/lib/sale/buy-requirements-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; locality: string }>;
}): Promise<Metadata> {
  const { city, locality } = await params;
  return buyRequirementsMetadata(city, locality);
}

export default async function BuyRequirementsLocalityPage({
  params,
}: {
  params: Promise<{ city: string; locality: string }>;
}) {
  const { city, locality } = await params;
  return <BuyRequirementsSeoPage city={city} locality={locality} />;
}
