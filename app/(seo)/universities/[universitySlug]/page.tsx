import {
  universityPageExports,
  staticParamsForUniversities,
} from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForUniversities();
}

const { generateMetadata, Page } = universityPageExports();
export { generateMetadata };
export default Page;
