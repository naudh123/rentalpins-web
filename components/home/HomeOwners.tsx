import Link from "next/link";
import { appPath } from "@/lib/config";
import { HOME_OWNERS, type HomeLink } from "@/lib/seo/home-page-content";
import { ArrowIcon } from "@/components/home/HomeIcons";

interface Props {
  listPropertyLinks: HomeLink[];
}

function LinkList({ title, links }: { title: string; links: readonly HomeLink[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={appPath(link.href)}
              className="inline-block rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:border-white/60 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Supply-side band: rent / sell / project listing paths + city landings. */
export default function HomeOwners({ listPropertyLinks }: Props) {
  return (
    <section
      aria-labelledby="home-owners-heading"
      className="relative overflow-hidden bg-[var(--brand-navy-dark)] px-4 py-16 text-white sm:px-6 md:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_100%_0%,rgba(232,80,26,0.28),transparent),radial-gradient(ellipse_50%_60%_at_0%_100%,rgba(30,58,110,0.9),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff9b73]">
            {HOME_OWNERS.eyebrow}
          </p>
          <h2
            id="home-owners-heading"
            className="mt-3 font-serif text-[1.75rem] leading-tight sm:text-4xl"
          >
            {HOME_OWNERS.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/75">{HOME_OWNERS.subtitle}</p>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {HOME_OWNERS.paths.map((path) => (
            <li
              key={path.title}
              className="flex flex-col rounded-2xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold">{path.title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-white/70">{path.desc}</p>
              <Link
                href={appPath(path.cta.href)}
                data-cta="home-owner-list"
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[var(--brand-navy)] transition hover:bg-[#fff1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {path.cta.label}
                <ArrowIcon />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-8 border-t border-white/12 pt-10 md:grid-cols-2">
          <LinkList title={HOME_OWNERS.listCityTitle} links={listPropertyLinks} />
          <LinkList title={HOME_OWNERS.noBrokerTitle} links={HOME_OWNERS.noBrokerLinks} />
        </div>
      </div>
    </section>
  );
}
