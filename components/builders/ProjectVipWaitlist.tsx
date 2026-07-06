"use client";

import { daysUntilLaunch } from "@/lib/builders/project-scarcity";

interface ProjectVipWaitlistProps {
  launchDate: string | null;
  status: string;
  onJoinWaitlist: () => void;
}

export default function ProjectVipWaitlist({
  launchDate,
  status,
  onJoinWaitlist,
}: ProjectVipWaitlistProps) {
  const days = daysUntilLaunch(launchDate);
  const show =
    status === "upcoming" || (days != null && days > 0 && days <= 365);
  if (!show) return null;

  return (
    <div className="lux-vip-banner rounded-2xl border border-[var(--lux-accent-muted)] bg-gradient-to-r from-[var(--lux-surface)] to-[var(--lux-surface-elevated)] p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="lux-eyebrow">VIP Registration</p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[var(--lux-primary)]">
            {days != null && days > 0
              ? `${days} day${days === 1 ? "" : "s"} to launch`
              : "Pre-launch interest open"}
          </h3>
          <p className="mt-2 max-w-lg text-sm text-[var(--muted)]">
            Join the priority list for early pricing, unit selection, and exclusive launch
            invitations before public release.
          </p>
        </div>
        <button type="button" onClick={onJoinWaitlist} className="lux-btn-gold shrink-0 px-8 py-3">
          Join VIP Waitlist
        </button>
      </div>
    </div>
  );
}
