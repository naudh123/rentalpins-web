import Image from "next/image";

const HEIGHT = {
  sm: "h-9",
  md: "h-11",
  lg: "h-14",
  hero: "h-28 w-auto sm:h-32 md:h-36 lg:h-40",
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
