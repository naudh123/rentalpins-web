"use client";

import Link from "next/link";
import { useEffect } from "react";
import { navigateToFlutterApp } from "@/lib/gtag";
import { trackPropertyViewContent } from "@/lib/meta-pixel";

type Props = {
  appUrl: string;
  fromUrl: string;
  city: string;
  propertyType: string;
};

/**
 * Avoids embedding app.rentalpins.com in an iframe on www (Chrome / GSC
 * "Possible Phishing on User Login"). Tracks ViewContent then navigates top-level.
 */
export default function ListingAppHandoff({
  appUrl,
  fromUrl,
  city,
  propertyType,
}: Props) {
  useEffect(() => {
    trackPropertyViewContent({
      property_type: propertyType ?? "",
      city: city ?? "",
    });
    const t = window.setTimeout(() => {
      navigateToFlutterApp(appUrl);
    }, 200);
    return () => window.clearTimeout(t);
  }, [appUrl, city, propertyType]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0f2749] via-[#152f55] to-[#0d1f3c] px-6 py-16 text-center text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,80,26,0.25), transparent)",
        }}
        aria-hidden
      />
      <div className="relative z-10 max-w-md">
        <p className="text-base leading-relaxed text-slate-200">
          Opening this listing in the official RentalPins app (secure top-level
          page)…
        </p>
        <Link
          href={fromUrl}
          className="mt-6 inline-block text-sm font-semibold text-orange-200/90 underline-offset-4 hover:text-white"
        >
          ← Back to results
        </Link>
        <a
          href={appUrl}
          className="mt-8 inline-block rounded-xl bg-[#E8501A] px-8 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-orange-900/40 transition hover:bg-[#d34415]"
        >
          Open listing now
        </a>
      </div>
    </main>
  );
}
