/** Display formatting for global listings. */

export function formatPrice(
  amount: number,
  priceUnit: string,
  homeIso?: string
): string {
  if (amount <= 0) return "Price on request";

  const currency =
    homeIso === "IN" || homeIso === "IND"
      ? "INR"
      : homeIso === "GB"
        ? "GBP"
        : homeIso === "US"
          ? "USD"
          : homeIso === "AE"
            ? "AED"
            : homeIso === "KE"
              ? "KES"
              : homeIso === "NG"
                ? "NGN"
                : undefined;

  const formatted = new Intl.NumberFormat(
    homeIso === "IN" ? "en-IN" : "en-US",
    currency
      ? { style: "currency", currency, maximumFractionDigits: 0 }
      : { maximumFractionDigits: 0 }
  ).format(amount);

  return `${formatted} ${priceUnit}`.trim();
}
