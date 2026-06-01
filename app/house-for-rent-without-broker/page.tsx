import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("house-for-rent-without-broker");
export const metadata = meta;
export default Page;
