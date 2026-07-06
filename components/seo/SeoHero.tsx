interface Props {
  h1: string;
  intro: string;
  children?: React.ReactNode;
}

export default function SeoHero({ h1, intro, children }: Props) {
  return (
    <article className="rp-gradient-hero px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">{h1}</h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">{intro}</p>
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </article>
  );
}
