import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "RentalPins – Discover Rentals Around You",
    template: "%s | RentalPins",
  },
  description:
    "RentalPins is a location-based rental marketplace that helps users discover and list rental properties and services across India.",
  keywords: [  "furnisher room for rent","luxury room for rent",  "apartment for rent",  "olx", "flat for rent","room for rent",
    "rental marketplace",
    "property rental",
    "rent houses",
    "rent services",
    "local rentals",
    "RentalPins",
  ],
  authors: [{ name: "RentalPins" }],
  creator: "RentalPins",
  publisher: "RentalPins",

  metadataBase: new URL("https://www.rentalpins.com"),

  openGraph: {
    title: "RentalPins – Discover Rentals Around You",
    description:
      "Find rental properties and services near you using location-based discovery.",
    url: "https://www.rentalpins.com",
    siteName: "RentalPins",
    images: [
  {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "RentalPins – Location Based Rental Marketplace",
  },
],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "RentalPins – Discover Rentals Around You",
    description:
      "Discover rental properties and services across India with RentalPins.",
    images: ["/logo/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
