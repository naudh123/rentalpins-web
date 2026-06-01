"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import { appPath } from "@/lib/config";
import { mapSearchUrl } from "@/lib/map-search-url";

interface Props {
  title: string;
  intro: string;
  category?: string;
}

export default function NearMeLandingClient({ title, intro, category }: Props) {
  const [busy, setBusy] = useState(false);
  const [geoError, setGeoError] = useState("");

  const fallbackHref = useMemo(
    () => appPath(category ? `/search?category=${encodeURIComponent(category)}` : "/search"),
    [category]
  );

  function openNearMe() {
    if (!navigator.geolocation) {
      setGeoError("Location is not supported in this browser.");
      return;
    }
    setBusy(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const href = appPath(
          mapSearchUrl(
            pos.coords.latitude,
            pos.coords.longitude,
            13,
            undefined,
            category ?? null,
            null,
            category ? `${category} near me` : "rentals near me"
          )
        );
        window.location.assign(href);
      },
      () => {
        setGeoError("Could not access location. Use map search manually.");
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  return (
    <MarketingShell>
      <section className="rp-gradient-hero px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-3xl text-[var(--brand-navy)] md:text-4xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            {intro}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={openNearMe}
              className="rp-btn rp-btn-primary px-8 py-3 disabled:opacity-50"
            >
              {busy ? "Locating..." : "Use current location"}
            </button>
            <Link href={fallbackHref} className="rp-btn rp-btn-secondary px-8 py-3">
              Open map manually
            </Link>
          </div>
          {geoError && <p className="mt-4 text-sm text-red-700">{geoError}</p>}
        </div>
      </section>
    </MarketingShell>
  );
}
