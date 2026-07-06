/** Simple home-loan EMI estimate (reducing balance, monthly). */
export function estimateEmi(
  principal: number,
  annualRatePercent = 8.5,
  tenureYears = 20
): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const r = annualRatePercent / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function formatEmi(amount: number): string {
  if (amount <= 0) return "—";
  return `₹${Math.round(amount).toLocaleString("en-IN")}/mo`;
}
