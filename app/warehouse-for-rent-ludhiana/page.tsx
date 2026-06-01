import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("warehouse-for-rent-ludhiana");
export const metadata = meta;
export default Page;
