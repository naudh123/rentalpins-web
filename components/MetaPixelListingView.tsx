"use client";

import { useEffect } from "react";
import { trackPropertyViewContent } from "@/lib/meta-pixel";

type MetaPixelListingViewProps = {
  propertyType?: string;
  city?: string;
};

export default function MetaPixelListingView({ propertyType, city }: MetaPixelListingViewProps) {
  useEffect(() => {
    trackPropertyViewContent({
      property_type: propertyType ?? "",
      city: city ?? "",
    });
  }, [propertyType, city]);

  return null;
}
