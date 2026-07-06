"use client";

import { useState } from "react";
import Link from "next/link";
import ProductBadge from "@/components/brand/ProductBadge";
import { appPath } from "@/lib/config";
import {
  HOME_TRICITY_LANES,
  HOME_TRICITY_SECTION,
  type HomeTricityLane,
} from "@/lib/seo/home-page-content";

const LANE_ORDER: HomeTricityLane[] = ["rent", "buy", "invest"];

export default function HomeTricitySection() {
  const [lane, setLane] = useState<HomeTricityLane>("rent");
  const laneMeta = HOME_TRICITY_LANES[lane];

  return (
    <section className="rp-home-section border-t border-[var(--border-subtle)]">
      <div className="rp-home-section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <ProductBadge variant={lane} />
          <h2 className="mt-3 font-serif text-2xl text-[var(--brand-navy)] md:text-3xl">
            {HOME_TRICITY_SECTION.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
            {laneMeta.subtitle}
          </p>
        </div>

        <div
          className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Tricity property lane"
        >
          {LANE_ORDER.map((key) => {
            const active = lane === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setLane(key)}
                className={`rp-home-lane-tab rp-home-lane-tab--${key}${active ? " is-active" : ""}`}
              >
                {HOME_TRICITY_LANES[key].label}
              </button>
            );
          })}
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_TRICITY_SECTION.cities.map((city) => (
            <li key={`${city.name}-${lane}`}>
              <article className={`rp-home-area-card rp-home-area-card--${lane} h-full`}>
                <h3 className="font-serif text-lg text-[var(--brand-navy)]">{city.name}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {city.lanes[lane].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={appPath(link.href)}
                        className={`font-medium no-underline rp-home-tricity-link rp-home-tricity-link--${lane}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
