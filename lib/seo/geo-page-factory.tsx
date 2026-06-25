import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeoInsightPage from "@/components/seo/GeoInsightPage";
import { getGeoPageConfig } from "@/lib/seo/geo-pages-config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function geoPageExports(path: string) {
  const config = getGeoPageConfig(path);
  if (!config) {
    return {
      generateMetadata: async (): Promise<Metadata> => ({ title: "Not Found" }),
      default: function GeoNotFound() {
        notFound();
      },
    };
  }

  return {
    generateMetadata: async (): Promise<Metadata> =>
      buildPageMetadata({
        title: config.title,
        description: config.description,
        path: config.path,
        robots: { index: true, follow: true },
      }),
    default: function GeoPage() {
      return <GeoInsightPage config={config} />;
    },
  };
}
