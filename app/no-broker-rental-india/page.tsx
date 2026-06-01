import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("no-broker-rental-india");
export const metadata = meta;
export default Page;
