/** Heuristics when a seller posts on the rent flow by mistake. */

const SALE_TITLE_HINT =
  /\b(for sale|sell(?:ing)?|sale price|asking price|outright|freehold)\b/i;

export function looksLikeSaleTitleOnRentFlow(title: string): boolean {
  return SALE_TITLE_HINT.test(title.trim());
}

export function looksLikeSalePriceOnRentFlow(price: string, priceUnit: string): boolean {
  const n = Number(String(price).replace(/,/g, "").trim());
  if (!Number.isFinite(n) || n <= 0) return false;
  if (priceUnit === "per month" && n >= 500_000) return true;
  if (priceUnit === "per year" && n >= 5_000_000) return true;
  return false;
}

export function rentFlowLooksLikeSaleListing(
  title: string,
  price: string,
  priceUnit: string
): boolean {
  return (
    looksLikeSaleTitleOnRentFlow(title) || looksLikeSalePriceOnRentFlow(price, priceUnit)
  );
}
