import { supplyRootPageExports } from "@/lib/seo/supply-page-factory";

const { metadata, Page } = supplyRootPageExports("/list-commercial-property");
export { metadata };
export default Page;
