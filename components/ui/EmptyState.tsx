import Link from "next/link";

interface Props {
  icon?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function EmptyState({
  icon = "◎",
  title,
  description,
  actionHref,
  actionLabel,
}: Props) {
  return (
    <div className="rp-card mx-auto max-w-sm p-6 text-center sm:p-10">
      <p className="text-4xl opacity-25" aria-hidden>
        {icon}
      </p>
      <p className="mt-4 font-medium text-[var(--brand-navy)]">{title}</p>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{description}</p>
      )}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="rp-btn rp-btn-primary mt-6 inline-flex min-h-10 px-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
