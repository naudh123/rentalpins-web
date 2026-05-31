import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import { SavedListingsProvider } from "@/components/providers/SavedListingsProvider";
import AppShell from "@/components/layout/AppShell";
import {
  JsonLdOrganization,
  JsonLdSoftwareApplication,
  JsonLdWebsite,
} from "@/components/JsonLd";
import { gaMeasurementId, siteUrl, deployEnv } from "@/lib/config";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RentalPins — Rent Anything, Anywhere",
    template: "%s | RentalPins",
  },
  description:
    "Global rental marketplace. Map search, verified owners, WhatsApp contact.",
  robots: deployEnv === "staging" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A6E",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body>
        <JsonLdOrganization />
        <JsonLdWebsite />
        <JsonLdSoftwareApplication />
        <AuthProvider>
          <SavedListingsProvider>
            <AppShell>{children}</AppShell>
          </SavedListingsProvider>
          <AnalyticsProvider />
        </AuthProvider>
        {gaMeasurementId && deployEnv !== "staging" && (
          <>
            {/* Default-deny consent mode — upgrades to granted after user accepts. */}
            <Script id="ga4-consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  ad_storage: 'denied',
                  wait_for_update: 500
                });
              `}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
