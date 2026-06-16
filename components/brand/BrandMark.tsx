import Image from "next/image";

/** Pin occupies ~top 41% of the square master logo asset (1024×1024). */
const PIN_VIEWPORT = 0.41;

const WIDTH = {
  sm: "w-9",
  md: "w-11",
  lg: "w-16",
  hero: "w-[7.5rem] sm:w-32 md:w-36 lg:w-40",
} as const;

interface Props {
  size?: keyof typeof WIDTH;
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
      className={`rp-brand-mark shrink-0 overflow-hidden ${WIDTH[size]} ${className}`}
      style={{ aspectRatio: `1 / ${PIN_VIEWPORT}` }}
      aria-hidden
    >
      <Image
        src="/logo/logo.png"
        alt=""
        width={1024}
        height={1024}
        className="rp-brand-mark__img block h-auto w-full max-w-none"
        priority={priority}
      />
    </div>
  );
}
