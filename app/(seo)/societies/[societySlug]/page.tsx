import { slugEntityPageExports, staticParamsForType } from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForType("society", "societySlug");
}

const { generateMetadata, Page } = slugEntityPageExports("society", "societySlug");
export { generateMetadata };
export default Page;
