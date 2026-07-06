import { slugEntityPageExports, staticParamsForType } from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForType("comparison", "slug");
}

const { generateMetadata, Page } = slugEntityPageExports("comparison", "slug");
export { generateMetadata };
export default Page;
