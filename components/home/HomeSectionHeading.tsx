interface Props {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

/** Consistent eyebrow + H2 + subtitle block for home sections. */
export default function HomeSectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
}: Props) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-orange)]">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 font-serif text-[1.75rem] leading-tight text-[var(--brand-navy)] sm:text-4xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}
