import { slugEntityPageExports, staticParamsForType } from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForType("calculator", "slug");
}

const { generateMetadata, Page } = slugEntityPageExports("calculator", "slug");
export { generateMetadata };
export default Page;
