import { slugEntityPageExports, staticParamsForType } from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForType("building", "buildingSlug");
}

const { generateMetadata, Page } = slugEntityPageExports("building", "buildingSlug");
export { generateMetadata };
export default Page;
