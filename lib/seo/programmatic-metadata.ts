import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";
import {
  getProgrammaticPageIndexability,
  resolveCanonicalParentPath,
} from "@/lib/seo/programmatic-indexability";

export interface ProgrammaticMetadataInput {
  path: string;
  isCityLevel?: boolean;
  countrySlug: string;
  citySlug: string;
  areaSlug?: string;
  categorySlug?: string;
  listingCount: number;
  hasUniqueContent: boolean;
  base: Metadata;
}

/** Apply noindex + canonical parent rules for thin programmatic pages. */
export function applyProgrammaticIndexability(
  input: ProgrammaticMetadataInput
): Metadata {
  const policy = getProgrammaticPageIndexability({
    isCityLevel: input.isCityLevel,
    area: input.areaSlug,
    category: input.categorySlug,
    listingCount: input.listingCount,
    hasUniqueContent: input.hasUniqueContent,
  });

  const meta: Metadata = {
    ...input.base,
    robots: policy.robots,
  };

  if (!policy.includeInSitemap && !input.isCityLevel) {
    const parentPath = resolveCanonicalParentPath({
      countrySlug: input.countrySlug,
      citySlug: input.citySlug,
      areaSlug: input.areaSlug,
      categorySlug: input.categorySlug,
    });
    meta.alternates = {
      ...input.base.alternates,
      canonical: canonicalUrl(parentPath),
    };
  }

  return meta;
}
