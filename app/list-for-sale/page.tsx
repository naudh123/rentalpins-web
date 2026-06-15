import type { Metadata } from "next";
import ListForSaleLandingPage from "@/components/sale/ListForSaleLandingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getListForSalePageByPath } from "@/lib/sale/list-for-sale-config";

const PATH = "/list-for-sale";

export const metadata: Metadata = (() => {
  const config = getListForSalePageByPath(PATH);
  if (!config) return {};
  return buildPageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: config.path,
    locale: "en_IN",
  });
})();

export default function Page() {
  const config = getListForSalePageByPath(PATH)!;
  return <ListForSaleLandingPage config={config} />;
}
