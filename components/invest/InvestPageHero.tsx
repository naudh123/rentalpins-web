interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function InvestPageHero({ eyebrow = "RentalPins Invest", title, subtitle }: Props) {
  return (
    <section className="invest-theme rp-gradient-hero border-b border-[var(--border)]">
      <div className="mx-auto max-w-4xl px-4 py-12 text-center md:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--invest-emerald)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
