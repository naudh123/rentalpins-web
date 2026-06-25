import { saleMarketingPageExports } from "@/lib/seo/sale-marketing-page-factory";

const { metadata: meta, Page } = saleMarketingPageExports("commercial-property-for-sale");
export const metadata = meta;
export default Page;
