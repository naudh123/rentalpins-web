import { supplyRootPageExports } from "@/lib/seo/supply-page-factory";

const { metadata, Page } = supplyRootPageExports("/list-flat");
export { metadata };
export default Page;
