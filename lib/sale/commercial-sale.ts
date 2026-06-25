/** Commercial property for sale — subcategories under Property on the buy map. */

export const COMMERCIAL_SALE_SUBCATEGORIES = [
  "Shops",
  "Showroom",
  "Office Space",
  "Warehouse",
] as const;

export type CommercialSaleSubcategory = (typeof COMMERCIAL_SALE_SUBCATEGORIES)[number];

export function isCommercialSaleSubcategory(sub: string): boolean {
  return (COMMERCIAL_SALE_SUBCATEGORIES as readonly string[]).includes(sub);
}

export const COMMERCIAL_SALE_MARKETING_SLUG = "commercial-property-for-sale";
