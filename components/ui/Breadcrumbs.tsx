import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: Props) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-[var(--muted)] ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
              {index > 0 && (
                <span aria-hidden className="shrink-0 opacity-40">
                  ›
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="shrink-0 hover:text-[var(--brand-navy)] hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="truncate font-medium text-[var(--text)]"
                  aria-current={isLast ? "page" : undefined}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
