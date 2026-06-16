import Image from "next/image";

/** Pin mark heights — nav is tuned for header bars. */
const HEIGHT = {
  nav: "h-10 max-h-10",
  sm: "h-10 max-h-10",
  md: "h-11 max-h-11",
  lg: "h-14 max-h-14",
  hero: "h-36 w-auto sm:h-40 md:h-44 lg:h-48",
} as const;

interface Props {
  size?: keyof typeof HEIGHT;
  className?: string;
  priority?: boolean;
}

/** Pin mark from the official logo (blue pin + orange chevron). */
export default function BrandMark({
  size = "hero",
  className = "",
  priority = false,
}: Props) {
  const hClass = HEIGHT[size];

  return (
    <Image
      src="/logo/logo-pin.png"
      alt=""
      width={503}
      height={700}
      className={`${hClass} w-auto shrink-0 object-contain object-center ${className}`}
      priority={priority}
    />
  );
}
