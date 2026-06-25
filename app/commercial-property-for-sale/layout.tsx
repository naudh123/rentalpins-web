import SaleShell from "@/components/sale/SaleShell";

export default function CommercialSaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SaleShell>{children}</SaleShell>;
}
