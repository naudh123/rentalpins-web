import type { Metadata } from "next";
import {
  BuyRequirementsSeoPage,
  buyRequirementsMetadata,
} from "@/lib/sale/buy-requirements-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  return buyRequirementsMetadata(city);
}

export default async function BuyRequirementsCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  return <BuyRequirementsSeoPage city={city} />;
}
