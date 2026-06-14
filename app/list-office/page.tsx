import { supplyRootPageExports } from "@/lib/seo/supply-page-factory";

const { metadata, Page } = supplyRootPageExports("/list-office");
export { metadata };
export default Page;
