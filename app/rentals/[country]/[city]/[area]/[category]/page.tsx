import { notFound } from "next/navigation";
import CategoryHubPage from "@/components/seo/CategoryHubPage";
import {
  categoryHubMetadata,
  resolveCategoryHub,
} from "@/lib/seo/render-category-hub";
import { getAllAreas, RENTAL_COUNTRY_SLUGS } from "@/lib/cities-config";
import { RENTAL_CATEGORIES } from "@/lib/seo/categories";
import { isRentalCategorySlug } from "@/lib/seo/categories";

export function generateStaticParams() {
  return getAllAreas().flatMap((area) =>
    RENTAL_CATEGORIES.map((cat) => ({
      country: area.parentCountrySlug,
      city: area.parentSlug,
      area: area.slug,
      category: cat.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params:
    | Promise<{ country: string; city: string; area: string; category: string }>
    | { country: string; city: string; area: string; category: string };
}) {
  const resolved = await Promise.resolve(params);
  if (!isRentalCategorySlug(resolved.category)) return { title: "Not Found" };
  const ctx = await resolveCategoryHub(
    resolved.country,
    resolved.city,
    resolved.category,
    resolved.area
  );
  return categoryHubMetadata(
    ctx,
    `/rentals/${resolved.country}/${resolved.city}/${resolved.area}/${resolved.category}`
  );
}

export const revalidate = 7200;

export default async function AreaCategoryPage({
  params,
}: {
  params:
    | Promise<{ country: string; city: string; area: string; category: string }>
    | { country: string; city: string; area: string; category: string };
}) {
  const resolved = await Promise.resolve(params);
  if (
    !RENTAL_COUNTRY_SLUGS.includes(
      resolved.country as (typeof RENTAL_COUNTRY_SLUGS)[number]
    ) ||
    !isRentalCategorySlug(resolved.category)
  ) {
    notFound();
  }

  const ctx = await resolveCategoryHub(
    resolved.country,
    resolved.city,
    resolved.category,
    resolved.area
  );

  return (
    <CategoryHubPage
      city={ctx.city}
      category={ctx.category}
      area={ctx.areaContent ?? undefined}
      listings={ctx.listings}
      mapHref={ctx.mapHref}
    />
  );
}
