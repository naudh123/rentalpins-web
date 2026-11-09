import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_GUIDES } from "@/lib/seo/home-page-content";
import { ArrowIcon } from "@/components/home/HomeIcons";
import HomeSectionHeading from "@/components/home/HomeSectionHeading";

export default function HomeGuides() {
  return (
    <section aria-labelledby="home-guides-heading" className="px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <HomeSectionHeading
          id="home-guides-heading"
          eyebrow={HOME_GUIDES.eyebrow}
          title={HOME_GUIDES.title}
          subtitle={HOME_GUIDES.subtitle}
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_GUIDES.cards.map((card) => (
            <li key={card.href}>
              <Link
                href={appPath(card.href)}
                className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-white p-6 transition hover:border-[var(--brand-navy)] hover:shadow-[0_18px_44px_-26px_rgba(15,37,84,0.5)]"
              >
                <h3 className="font-serif text-xl text-[var(--brand-navy)]">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                  {card.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-orange)]">
                  Read more
                  <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Popular guides">
          {HOME_GUIDES.more.map((link) => (
            <li key={link.href}>
              <Link
                href={appPath(link.href)}
                className="inline-block rounded-full border border-[var(--border)] bg-white px-3.5 py-1.5 text-sm text-[var(--brand-navy)] transition hover:border-[var(--brand-orange)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
