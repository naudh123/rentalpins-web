import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("warehouse-chandigarh");
export const metadata = meta;
export default Page;
