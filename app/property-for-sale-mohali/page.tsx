import { saleMarketingPageExports } from "@/lib/seo/sale-marketing-page-factory";

const { metadata: meta, Page } = saleMarketingPageExports("property-for-sale-mohali");
export const metadata = meta;
export default Page;
