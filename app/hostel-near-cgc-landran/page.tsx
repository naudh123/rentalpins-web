import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("hostel-near-cgc-landran");

export const metadata = meta;
export default Page;
