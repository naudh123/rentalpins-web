import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("rent-without-broker");
export const metadata = meta;
export default Page;
