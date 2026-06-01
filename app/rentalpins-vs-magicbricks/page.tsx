import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("rentalpins-vs-magicbricks");
export const metadata = meta;
export default Page;
