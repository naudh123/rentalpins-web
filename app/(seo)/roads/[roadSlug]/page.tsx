import { slugEntityPageExports, staticParamsForType } from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForType("road", "roadSlug");
}

const { generateMetadata, Page } = slugEntityPageExports("road", "roadSlug");
export { generateMetadata };
export default Page;
