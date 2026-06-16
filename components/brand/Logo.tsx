import Link from "next/link";
import BrandMark from "@/components/brand/BrandMark";

interface Props {
  href?: string;
  size?: "nav" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  nav: { mark: "nav" as const, word: "text-base" },
  sm: { mark: "sm" as const, word: "text-base" },
  md: { mark: "md" as const, word: "text-lg" },
  lg: { mark: "lg" as const, word: "text-2xl" },
};

export default function Logo({
  href = "/",
  size = "md",
  className = "",
}: Props) {
  const s = sizes[size];
  const inner = (
    <div className={`flex shrink-0 items-center gap-2 overflow-visible ${className}`}>
      <BrandMark size={s.mark} priority={size === "nav" || size === "md"} />
      <span className={`font-serif font-bold leading-none tracking-tight ${s.word}`}>
        <span className="rp-wordmark-navy">Rental</span>
        <span className="rp-wordmark-orange">Pins</span>
      </span>
    </div>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="shrink-0 overflow-visible no-underline">
      {inner}
    </Link>
  );
}
