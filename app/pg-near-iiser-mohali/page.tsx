import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("pg-near-iiser-mohali");
export const metadata = meta;
export default Page;
