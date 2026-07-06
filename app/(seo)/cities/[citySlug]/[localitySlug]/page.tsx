import { localityPageExports, staticParamsForLocalities } from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForLocalities();
}

const { generateMetadata, Page } = localityPageExports();
export { generateMetadata };
export default Page;
