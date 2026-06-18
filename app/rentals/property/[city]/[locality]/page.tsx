import { createCategoryAuthorityPage } from "@/lib/seo/category-authority-page";

const { generateMetadata, Page } = createCategoryAuthorityPage("property");
export { generateMetadata };
export default Page;
