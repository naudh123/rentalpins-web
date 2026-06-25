import { marketingPageExports } from "@/lib/seo/marketing-page-factory";

const { metadata: meta, Page } = marketingPageExports("apartment-rental-listings");

export const metadata = meta;
export default Page;
