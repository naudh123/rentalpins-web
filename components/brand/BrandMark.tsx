import Image from "next/image";

const BOX = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  hero: "h-[6.2rem] w-[5.1rem] sm:h-[6.5rem] sm:w-[5.35rem] md:h-[7.8rem] md:w-[6.4rem] lg:h-[10.4rem] lg:w-[8.5rem]",
} as const;

interface Props {
  size?: keyof typeof BOX;
  className?: string;
  priority?: boolean;
}

/** Pin-only crop from master logo — hides baked-in wordmark and tagline. */
export default function BrandMark({
  size = "hero",
  className = "",
  priority = false,
}: Props) {
  return (
    <div
      className={`rp-brand-mark relative shrink-0 overflow-hidden ${BOX[size]} ${className}`}
      aria-hidden
    >
      <Image
        src="/logo/logo.png"
        alt=""
        width={512}
        height={512}
        className="rp-brand-mark__img"
        priority={priority}
      />
    </div>
  );
}
