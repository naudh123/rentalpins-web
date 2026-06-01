import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("property-without-broker-mohali");
export const metadata = meta;
export default Page;
