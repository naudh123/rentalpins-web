import Image from "next/image";

/** Pin marker drawn in SVG user units (viewBox 480×400). */
function Pin({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="2" rx="9" ry="3" fill="rgba(15,37,84,0.18)" />
      <path
        d="M0 0C-3 -8 -14 -16 -14 -28a14 14 0 0 1 28 0c0 12 -11 20 -14 28Z"
        fill={color}
        stroke="#fff"
        strokeWidth="2.5"
      />
      <circle cx="0" cy="-28" r="5" fill="#fff" />
    </g>
  );
}

const LABELS = [
  { text: "Rent · 2 BHK flat", dot: "var(--brand-orange)", pos: "left-[6%] top-[14%]" },
  { text: "Sell · 3 BHK resale", dot: "var(--sale-gold)", pos: "right-[5%] top-[36%]" },
  { text: "Invest · New project", dot: "var(--invest-emerald)", pos: "left-[6%] top-[57%]" },
] as const;

/**
 * Decorative illustration of the three verticals on one map. Pure SVG with a
 * fixed aspect ratio (no layout shift, nothing to download but a tiny logo).
 */
export default function HomeHeroMap() {
  return (
    <div className="relative hidden lg:block" aria-hidden>
      <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgba(232,80,26,0.14),transparent)] blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-[0_30px_80px_-30px_rgba(15,37,84,0.45)]">
        <div className="relative overflow-hidden rounded-[1.6rem]">
          <svg viewBox="0 0 480 400" className="block h-auto w-full" role="presentation">
            <rect width="480" height="400" fill="#eef2f8" />
            <path d="M-10 300C90 260 150 330 250 290S420 250 500 280V410H-10Z" fill="#d6e6f5" />
            <rect x="300" y="40" width="130" height="90" rx="14" fill="#d9eee3" />
            {[
              [30, 30, 110, 70],
              [160, 30, 110, 70],
              [30, 130, 110, 80],
              [160, 130, 110, 80],
              [300, 160, 130, 70],
            ].map(([x, y, w, h]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="10" fill="#e1e7f1" />
            ))}
            <g stroke="#fff" strokeLinecap="round" fill="none">
              <path d="M0 115H480" strokeWidth="14" />
              <path d="M150 0V300" strokeWidth="12" />
              <path d="M285 0V260" strokeWidth="10" />
              <path d="M0 230C120 220 200 245 480 140" strokeWidth="16" />
            </g>
            <path
              d="M0 230C120 220 200 245 480 140"
              stroke="#f7c873"
              strokeWidth="2"
              strokeDasharray="8 8"
              fill="none"
            />
            <Pin x={95} y={100} color="#e8501a" />
            <Pin x={360} y={195} color="#fbb316" />
            <Pin x={225} y={215} color="#0d6b5c" />
            <Pin x={225} y={95} color="#e8501a" />
            <Pin x={385} y={95} color="#0d6b5c" />
          </svg>

          {LABELS.map((label) => (
            <span
              key={label.text}
              className={`absolute ${label.pos} inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[var(--brand-navy)] shadow-md`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: label.dot }} />
              {label.text}
            </span>
          ))}

          <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-[var(--brand-navy)]/95 px-4 py-3 text-white shadow-lg">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
              <Image src="/logo/logo-pin.png" alt="" width={503} height={700} className="h-7 w-auto" />
            </span>
            <span className="text-sm leading-snug">
              <span className="block font-semibold">Owner-direct, on one map</span>
              <span className="block text-white/75">Rent, buy, sell and invest — no brokerage to search</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
