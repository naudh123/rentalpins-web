import { cityPageExports, staticParamsForCities } from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForCities();
}

const { generateMetadata, Page } = cityPageExports();
export { generateMetadata };
export default Page;
