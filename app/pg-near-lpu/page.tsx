import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("pg-near-lpu");
export const metadata = meta;
export default Page;
