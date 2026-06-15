import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { appPath } from "@/lib/config";
import {
  BUY_EXPLORE_LINKS,
  COMPANY_LINKS,
  EXPLORE_LINKS,
  LEGAL_LINKS,
  SOCIAL_LINKS,
} from "@/lib/site-links";

interface Props {
  variant?: "rent" | "sale";
}

export default function SiteFooter({ variant = "rent" }: Props) {
  const isSale = variant === "sale";
  const exploreLinks = isSale ? BUY_EXPLORE_LINKS : EXPLORE_LINKS;
  const accentHover = isSale
    ? "hover:text-[var(--sale-gold)]"
    : "hover:text-[var(--brand-orange)]";
  const accentBorder = isSale
    ? "hover:border-[var(--sale-gold)] hover:text-[var(--sale-gold)]"
    : "hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange)]";

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Logo href={appPath(isSale ? "/buy" : "/")} size="sm" showTagline />
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
            {isSale
              ? "Map-first property for sale — flats, villas, and plots across Chandigarh Tricity. Owner-direct, separate from rentals."
              : "Map-first rentals — rooms, PG, flats, vehicles and more across India and global hubs. Contact owners directly."}
          </p>
          <div className="mt-4 flex gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--muted)] transition ${accentBorder}`}
              >
                {s.abbr}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                {"external" in link && link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-[var(--text)] ${accentHover}`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className={`text-[var(--text)] ${accentHover}`}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Company
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`text-[var(--text)] ${accentHover}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Legal
          </p>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`text-[var(--text)] ${accentHover}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Support:{" "}
            <a href="mailto:support@rentalpins.com" className={accentHover}>
              support@rentalpins.com
            </a>
            {" · "}
            <a href="tel:+919915209240" className={accentHover}>
              +91 99152 09240
            </a>
          </p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4 text-center text-xs text-[var(--muted)] sm:px-6">
        © {new Date().getFullYear()} RentalPins — Shimle Ale Sardar (Partnership Firm). Made with love in Punjab, India.
      </p>
    </footer>
  );
}
