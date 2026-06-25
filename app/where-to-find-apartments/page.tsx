import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("where-to-find-apartments");

export const metadata = meta;
export default Page;
