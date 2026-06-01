import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("rental-app-india");
export const metadata = meta;
export default Page;
