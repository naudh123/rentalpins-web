import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("industrial-property-ludhiana");
export const metadata = meta;
export default Page;
