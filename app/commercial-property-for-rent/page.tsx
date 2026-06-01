import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("commercial-property-for-rent");
export const metadata = meta;
export default Page;
