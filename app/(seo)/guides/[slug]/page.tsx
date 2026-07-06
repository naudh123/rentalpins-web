import { slugEntityPageExports, staticParamsForType } from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForType("guide", "slug");
}

const { generateMetadata, Page } = slugEntityPageExports("guide", "slug");
export { generateMetadata };
export default Page;
