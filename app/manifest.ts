import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RentalPins — Rent Anything, Anywhere",
    short_name: "RentalPins",
    description:
      "Map-first property discovery for rentals and resale across India and global hubs.",
    start_url: "/",
    display: "standalone",
    background_color: "#1E3A6E",
    theme_color: "#1E3A6E",
    lang: "en-IN",
    categories: ["business", "lifestyle"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
