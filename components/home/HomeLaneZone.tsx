import type { ReactNode } from "react";

export type HomeLane = "rent" | "buy" | "invest";

interface Props {
  lane: HomeLane;
  children: ReactNode;
  className?: string;
}

const ZONE_CLASS: Record<HomeLane, string> = {
  rent: "rp-home-lane-zone rp-home-lane-zone--rent",
  buy: "rp-home-lane-zone rp-home-lane-zone--buy",
  invest: "rp-home-lane-zone rp-home-lane-zone--invest",
};

export default function HomeLaneZone({ lane, children, className = "" }: Props) {
  return <div className={`${ZONE_CLASS[lane]} ${className}`.trim()}>{children}</div>;
}
