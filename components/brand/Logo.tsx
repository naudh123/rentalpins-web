import Image from "next/image";
import Link from "next/link";

interface Props {
  href?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: { img: 32, word: "text-base" },
  md: { img: 40, word: "text-lg" },
  lg: { img: 56, word: "text-2xl" },
};

export default function Logo({
  href = "/",
  size = "md",
  showTagline = false,
  className = "",
}: Props) {
  const s = sizes[size];
  const inner = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo/logo.png"
        alt=""
        width={s.img}
        height={s.img}
        className="shrink-0 object-contain"
        priority={size !== "sm"}
      />
      <div className="flex flex-col leading-none">
        <span className={`font-serif font-bold tracking-tight ${s.word}`}>
          <span className="rp-wordmark-navy">Rental</span>
          <span className="rp-wordmark-orange">Pins</span>
        </span>
        {showTagline && (
          <span className="mt-1 text-[10px] font-medium tracking-wide text-[var(--muted)] sm:text-xs">
            Rent Anything, Anywhere
          </span>
        )}
      </div>
    </div>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="no-underline">
      {inner}
    </Link>
  );
}
