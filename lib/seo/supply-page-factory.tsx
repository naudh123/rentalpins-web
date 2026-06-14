import type { Metadata } from "next";
import SupplyLandingPage from "@/components/seo/SupplyLandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getSupplyPageByPath,
  type SupplyPageConfig,
} from "@/lib/supply-pages-config";

function metadataFor(config: SupplyPageConfig): Metadata {
  return buildPageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: config.path,
    keywords: [
      config.h1,
      "list property free",
      "RentalPins",
      config.cityName ?? "",
      config.areaName ?? "",
    ].filter(Boolean),
    locale: "en_IN",
  });
}

export function supplyRootPageExports(path: string) {
  const config = getSupplyPageByPath(path);
  if (!config) {
    throw new Error(`Unknown supply page path: ${path}`);
  }
  return {
    metadata: metadataFor(config),
    Page: () => <SupplyLandingPage config={config} />,
  };
}
