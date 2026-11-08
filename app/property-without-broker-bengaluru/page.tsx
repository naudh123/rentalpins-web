import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("property-without-broker-bengaluru");
export const metadata = meta;
export default Page;
