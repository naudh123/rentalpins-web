import SaleShell from "@/components/sale/SaleShell";

export default function SaleMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SaleShell>{children}</SaleShell>;
}
