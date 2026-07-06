import {
  universitySubPageExports,
  staticParamsForUniversities,
} from "@/lib/seo/seo-page-factory";

export function generateStaticParams() {
  return staticParamsForUniversities();
}

const { generateMetadata, Page } = universitySubPageExports("university_pg");
export { generateMetadata };
export default Page;
