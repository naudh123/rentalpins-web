import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommercialLandingPage from "@/components/seo/commercial/CommercialLandingPage";
import {
  COMMERCIAL_LONDON_AREA_SLUGS,
  commercialLondonAreaPath,
  getCommercialLondonArea,
} from "@/lib/commercial-london-config";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ area: string }>;
}

export function generateStaticParams() {
  return COMMERCIAL_LONDON_AREA_SLUGS.map((area) => ({ area }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area } = await params;
  const config = getCommercialLondonArea(area);
  if (!config) return {};

  return buildPageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: commercialLondonAreaPath(config.slug),
    keywords: [
      config.h1,
      `commercial property ${config.locationName}`,
      `office to rent ${config.locationName}`,
      `shop to let ${config.locationName}`,
      "commercial property London",
      "RentalPins",
    ],
    locale: "en_GB",
  });
}

export default async function CommercialLondonAreaPage({ params }: PageProps) {
  const { area } = await params;
  const config = getCommercialLondonArea(area);
  if (!config) notFound();

  return <CommercialLandingPage config={config} />;
}
