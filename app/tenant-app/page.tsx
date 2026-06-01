import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("tenant-app");
export const metadata = meta;
export default Page;
