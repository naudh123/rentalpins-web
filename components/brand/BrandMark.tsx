import Image from "next/image";

const HEIGHT = {
  sm: "h-10",
  md: "h-12",
  lg: "h-16",
  hero: "h-32 w-auto sm:h-36 md:h-40 lg:h-44",
} as const;

interface Props {
  size?: keyof typeof HEIGHT;
  className?: string;
  priority?: boolean;
}

/** Pin + chevron mark (derived from master logo, no wordmark/tagline). */
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
      width={507}
      height={645}
      className={`${hClass} w-auto shrink-0 object-contain ${className}`}
      priority={priority}
    />
  );
}
