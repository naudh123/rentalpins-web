import Link from "next/link";
import BrandMark from "@/components/brand/BrandMark";

interface Props {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
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
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandMark size={s.mark} priority={size !== "sm"} />
      <span className={`font-serif font-bold leading-none tracking-tight ${s.word}`}>
        <span className="rp-wordmark-navy">Rental</span>
        <span className="rp-wordmark-orange">Pins</span>
      </span>
    </div>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="no-underline">
      {inner}
    </Link>
  );
}
