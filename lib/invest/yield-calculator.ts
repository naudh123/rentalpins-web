import { estimateEmi } from "@/lib/builders/project-emi";

export interface YieldCalculatorInput {
  /** Total property price in paise. */
  buyPrice: number;
  /** Down payment in paise. */
  downPayment: number;
  /** Expected monthly rent in paise. */
  monthlyRent: number;
  /** Annual maintenance + society charges in paise. */
  annualMaintenance: number;
  /** Vacancy buffer as fraction (e.g. 0.08 = ~1 month/year). */
  vacancyRate: number;
  /** Loan annual rate % p.a. */
  loanRatePercent: number;
  /** Loan tenure in years. */
  loanTenureYears: number;
}

export interface YieldCalculatorResult {
  loanPrincipal: number;
  emi: number;
  grossYieldPercent: number;
  netYieldPercent: number;
  monthlyCashFlow: number;
  annualRentGross: number;
  annualRentNet: number;
  breakEvenRent: number;
  totalMonthlyOutflow: number;
}

export function computeYield(input: YieldCalculatorInput): YieldCalculatorResult {
  const buyPrice = Math.max(0, input.buyPrice);
  const downPayment = Math.min(Math.max(0, input.downPayment), buyPrice);
  const loanPrincipal = Math.max(0, buyPrice - downPayment);
  const emi = estimateEmi(loanPrincipal, input.loanRatePercent, input.loanTenureYears);

  const monthlyRent = Math.max(0, input.monthlyRent);
  const annualRentGross = monthlyRent * 12;
  const vacancyLoss = annualRentGross * Math.max(0, Math.min(1, input.vacancyRate));
  const maintenance = Math.max(0, input.annualMaintenance);
  const annualRentNet = Math.max(0, annualRentGross - vacancyLoss - maintenance);

  const grossYieldPercent = buyPrice > 0 ? (annualRentGross / buyPrice) * 100 : 0;
  const netYieldPercent = buyPrice > 0 ? (annualRentNet / buyPrice) * 100 : 0;

  const totalMonthlyOutflow = emi + maintenance / 12;
  const monthlyCashFlow = monthlyRent * (1 - input.vacancyRate) - totalMonthlyOutflow;

  /** Rent needed to cover EMI + maintenance (ignoring vacancy). */
  const breakEvenRent =
    emi + maintenance / 12 > 0 ? Math.ceil(emi + maintenance / 12) : 0;

  return {
    loanPrincipal,
    emi,
    grossYieldPercent,
    netYieldPercent,
    monthlyCashFlow,
    annualRentGross,
    annualRentNet,
    breakEvenRent,
    totalMonthlyOutflow,
  };
}

export function formatYieldPercent(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  return `${value.toFixed(2)}%`;
}

export function formatCashFlow(paise: number): string {
  if (!Number.isFinite(paise)) return "—";
  const sign = paise >= 0 ? "+" : "−";
  const abs = Math.abs(Math.round(paise));
  if (abs >= 1_00_00_000) {
    return `${sign}₹${(abs / 1_00_00_000).toFixed(2)}Cr/mo`;
  }
  if (abs >= 1_00_000) {
    return `${sign}₹${Math.round(abs / 1_00_000)}L/mo`;
  }
  return `${sign}₹${abs.toLocaleString("en-IN")}/mo`;
}
