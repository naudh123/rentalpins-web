import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("pg-for-rent");
export const metadata = meta;
export default Page;
