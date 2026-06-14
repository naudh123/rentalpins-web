import { supplyRootPageExports } from "@/lib/seo/supply-page-factory";

const { metadata, Page } = supplyRootPageExports("/list-warehouse");
export { metadata };
export default Page;
