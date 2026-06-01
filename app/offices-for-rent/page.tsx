import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("offices-for-rent");
export const metadata = meta;
export default Page;
