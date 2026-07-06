import { slugEntityPageExports, staticParamsForType } from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForType("landmark", "landmarkSlug");
}

const { generateMetadata, Page } = slugEntityPageExports("landmark", "landmarkSlug");
export { generateMetadata };
export default Page;
