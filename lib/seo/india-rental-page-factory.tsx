import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndiaRentalLandingPage from "@/components/seo/india/IndiaRentalLandingPage";
import {
  getIndianRentalPageConfig,
  indianRentalPagePath,
} from "@/lib/rental-area-config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function indiaRentalPageExports(hubSlug: string, areaSlug?: string) {
  const config = getIndianRentalPageConfig(hubSlug, areaSlug);
  if (!config) {
    throw new Error(`Unknown India GSC rental page: ${hubSlug}/${areaSlug ?? ""}`);
  }

  const mohaliKeywords =
    hubSlug === "mohali"
      ? [
          "flats for rent in mohali",
          "flat for rent mohali",
          "rent in mohali",
          config.areaSlug === "sector-70"
            ? "flat for rent sector 70 mohali"
            : config.areaSlug === "phase-7"
              ? "flats for rent phase 7 mohali"
              : "mohali rentals",
        ]
      : [];

  const jaipurKeywords =
    hubSlug === "jaipur"
      ? [
          "flats for rent in jaipur",
          "pg in malviya nagar jaipur",
          "flat for rent vaishali nagar jaipur",
          config.areaSlug === "malviya-nagar"
            ? "pg malviya nagar jaipur"
            : config.areaSlug === "vaishali-nagar"
              ? "flat vaishali nagar jaipur"
              : config.areaSlug === "mansarovar"
                ? "flat mansarovar jaipur"
                : "jaipur rentals",
        ]
      : [];

  const metadata: Metadata = buildPageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: indianRentalPagePath(hubSlug, areaSlug),
    keywords: [
      config.h1,
      `rent ${config.areaName}`,
      `rentals ${config.cityLabel}`,
      "RentalPins",
      "no broker",
      ...mohaliKeywords,
      ...jaipurKeywords,
    ],
    locale: "en_IN",
  });

  function Page() {
    const resolved = getIndianRentalPageConfig(hubSlug, areaSlug);
    if (!resolved) notFound();
    return <IndiaRentalLandingPage config={resolved} />;
  }

  return { metadata, Page };
}
