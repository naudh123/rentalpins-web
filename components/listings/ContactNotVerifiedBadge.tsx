/** Small label for listings with form contact mobile not OTP-verified. */

export default function ContactNotVerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-amber-800 ${className}`}
      title="Owner contact number is not verified with OTP yet"
    >
      Contact not verified
    </span>
  );
}
