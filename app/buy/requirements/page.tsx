import type { Metadata } from "next";
import {
  BuyRequirementsSeoPage,
  buyRequirementsMetadata,
} from "@/lib/sale/buy-requirements-page";

export async function generateMetadata(): Promise<Metadata> {
  return buyRequirementsMetadata();
}

export default function BuyRequirementsIndexPage() {
  return <BuyRequirementsSeoPage />;
}
