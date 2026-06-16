import Link from "next/link";
import { appPath } from "@/lib/config";

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export default function ComingSoonPlaceholder({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <section className="rp-gradient-hero">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-navy)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">{title}</h1>
        <p className="mt-4 text-[var(--muted)]">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryCta ? (
            <Link href={appPath(primaryCta.href)} className="rp-btn rp-btn-primary px-6 py-3">
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link href={appPath(secondaryCta.href)} className="rp-btn rp-btn-secondary px-6 py-3">
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
