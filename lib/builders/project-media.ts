/**
 * Official builder logos & project hero photos (public developer / listing sites, Jul 2026).
 * Used at display time and patched into Firestore on re-seed.
 */

import { resolveBuilderSlug } from "@/lib/builders/brand-themes";
import {
  isGenericProjectPlaceholder,
  isUnreliableHeroUrl,
} from "@/lib/builders/project-placeholder";

export interface ProjectMedia {
  heroUrl: string | null;
  logoUrl: string | null;
  galleryUrls: string[];
}

/** Verified builder logos (HTTP 200/301 in Jul 2026 checks). */
export const BUILDER_LOGO_URLS: Record<string, string> = {
  "jubilee-group":
    "https://jubileemohali.co.in/wp-content/uploads/2026/05/Jubilee-City-Garden-Logo.webp",
  "dlf-new-chandigarh": "https://dlfgroupindia.com/img/logo.png",
  "sbp-group": "https://www.sbpgroup.in/wp-content/uploads/2023/11/sbpnew-logog-png.png",
  "omaxe-group": "https://www.omaxe.com/assets/front/images/omaxe-logo.webp",
  "gillco-group": "https://gillcogroup.com/gillco-logo-original.png",
  "homeland-group": "https://homelandgroup.in/images/home-land-logo.jpg",
  "hero-realty": "https://herorealty.in/images/logo-lg.png",
  "tdi-infratech": "https://tdicitymohali.com/assets/img/comman/logo.svg",
  "srg-group":
    "https://srggroup.in/wp-content/uploads/2025/05/496339879_122093384072884944_5252330009848745318_n-removebg-preview.png",
  "medallion-homes":
    "https://themedallionmohali.co/wp-content/uploads/2026/06/ChatGPT-Image-Jun-15-2026-08_01_52-PM-103x103.png",
  "turnstone-realty":
    "https://themedallionmohali.co/wp-content/uploads/2026/06/ChatGPT-Image-Jun-15-2026-08_01_52-PM-103x103.png",
  "emaar-india": "https://properties.emaar.com/en/assets/images/logo.svg",
  "godrej-properties":
    "https://www.godrejproperties.com/images/revamp/godrej_properties_logo.svg",
  "ats-infrastructure": "https://www.atsinfrastructure.com/images/logo.png",
  "velora-buildtech": "https://veloraurbano.org/wp-content/uploads/2025/10/velora-bg.png",
  "stj-group": "https://nadarproperties.com/wp-content/uploads/2022/07/logo.png",
  "bajwa-developers":
    "https://www.sunnyenclave.com/wp-content/uploads/2019/05/sunny-enclave-logo.png",
  "affinity-builders":
    "https://affinitybuilders.in/wp-content/uploads/2023/05/affinity-logo.png",
  "mb-infrabuild": "https://mbinfrabuild.com/wp-content/uploads/2022/06/logo.png",
  "alc-group": "https://acquirestate.com/storage/alc-crosswalk-mohali-acquire-estate-3.webp",
  "bestech-group": "https://www.sbpgroup.in/wp-content/uploads/2023/11/sbpnew-logog-png.png",
  "mahakali-developers": "https://www.sbpgroup.in/wp-content/uploads/2023/11/sbpnew-logog-png.png",
};

/** Default cover when a project has no dedicated photo. */
export const BUILDER_HERO_URLS: Record<string, string> = {
  "jubilee-group":
    "https://jubileemohali.co.in/wp-content/uploads/2026/06/1000318714-1024x555.png",
  "medallion-homes":
    "https://themedallionmohali.co/wp-content/uploads/2026/06/10071e92b14.jpg",
  "velora-buildtech":
    "https://acquirestate.com/storage/velora-urbano/road-velora-urbano.webp",
  "dlf-new-chandigarh":
    "https://dlfnewchandigarh.in/wp-content/uploads/2026/02/dlf-new-chd.webp",
  "sbp-group": "https://www.sbpgroup.in/wp-content/uploads/2023/10/somc007.jpg",
  "omaxe-group": "https://www.omaxe.com/cityhome/thum/citybanner_7234.jpg",
  "godrej-properties":
    "https://chandigarhprojects.com/godrej/images/godrej-chandigarh-banner.webp",
  "gillco-group": "https://static.squareyards.com/resources/images/chandigarh/project-image/gillco-valley-project-project-large-image1.jpg",
  "homeland-group": "https://homelandgroup.in/images/banner/banner-01.jpg",
  "hero-realty":
    "https://static.squareyards.com/resources/images/chandigarh/project-image/hero-homes-project-project-large-image1.jpg",
  "srg-group":
    "https://srggroup.in/wp-content/uploads/2025/05/ced48e53458e8a85547107330eb1fdc2.jpg",
  "ats-infrastructure":
    "https://acquirestate.com/storage/ats-casa-espana/front-elevation-casa-espana.webp",
  "turnstone-realty":
    "https://themedallionmohali.co/wp-content/uploads/2026/06/10071e92b14.jpg",
  "emaar-india":
    "https://static.squareyards.com/resources/images/chandigarh/project-image/emaar-mohali-hills-project-project-large-image1.jpg",
  "gmada-tricity":
    "https://ecocitynewchandigarh.com/wp-content/uploads/2022/09/cropped-download-1.jpg",
  "stj-group":
    "https://static.squareyards.com/resources/images/chandigarh/tn-projectflagship/tn-wwic-imperial-heights-flagshipimg1.jpeg",
  "bajwa-developers":
    "https://www.sbpgroup.in/wp-content/uploads/2023/10/somc007.jpg",
  "epique-real-ventures":
    "https://epiquerealventures.com/wp-content/uploads/2026/01/Amayra-image-03.webp",
  "subhash-mangat-group":
    "https://framerusercontent.com/images/mKq8Dw4UXt7Fz9qZUvP2fy5NTJo.webp",
  "vishranti-developers":
    "https://balleballehomes.com/wp-content/uploads/2025/06/ChatGPT-Image-Jun-18-2025-03_00_08-PM-1-1024x683.png",
  "ansal-api":
    "https://img.staticmb.com/mbphoto/property/cropped_images/ver2/XIwvQlc61t8ZIpanz4mAnTVK4849dMlZ2NghAgMmUJKlKTnVXS82/Photo_h300_w450/85378121_3_creenshot20260703at3.29.29PM_300_450.jpg",
  "alc-group": "https://acquirestate.com/storage/alc-crosswalk-mohali-acquire-estate-3.webp",
  "bestech-group": "https://www.sbpgroup.in/wp-content/uploads/2023/10/COD-Zirakpur-Township-1-scaled.jpg",
  "mahakali-developers": "https://www.sbpgroup.in/wp-content/uploads/2023/10/somc007.jpg",
};

/** Project-specific hero photos — verified URLs only. */
export const PROJECT_HERO_URLS: Record<string, string> = {
  "jubilee-city-gardens":
    "https://jubileemohali.co.in/wp-content/uploads/2026/06/1000318714.png",
  "medallion-aeropark":
    "https://themedallionmohali.co/wp-content/uploads/2026/06/10055ba49cd.jpg",
  "the-medallion-sector-82a":
    "https://themedallionmohali.co/wp-content/uploads/2026/06/10071e92b14.jpg",
  "medallion-nova":
    "https://themedallionmohali.co/wp-content/uploads/2026/06/10055ba49cd.jpg",
  "velora-urbano": "https://acquirestate.com/storage/velora-urbano/road-velora-urbano.webp",
  "dlf-hyde-park-estate":
    "https://dlfnewchandigarh.in/wp-content/uploads/2026/02/dlf-new-chd.webp",
  "sbp-city-of-dreams": "https://www.sbpgroup.in/wp-content/uploads/2023/10/somc007.jpg",
  "sbp-medicity-new-chandigarh":
    "https://www.sbpgroup.in/wp-content/uploads/2023/10/somc007.jpg",
  "omaxe-new-chandigarh": "https://www.omaxe.com/cityhome/thum/citybanner_7234.jpg",
  "godrej-tricity-heights":
    "https://chandigarhprojects.com/godrej/images/godrej-chandigarh-banner.webp",
  "gillco-valley":
    "https://static.squareyards.com/resources/images/chandigarh/project-image/gillco-valley-project-project-large-image1.jpg",
  "gillco-meraqui":
    "https://realtypromoo.com/images/projects/gillco-meraqui-mohali-1.webp",
  "gillco-parkhills":
    "https://static.squareyards.com/resources/images/chandigarh/project-image/gillco-valley-project-project-large-image1.jpg",
  "homeland-regalia":
    "https://homziio.com/storage/imageye-imgi-83-main-header.webp",
  "homeland-heights": "https://homelandgroup.in/images/banner/banner-02.jpg",
  "hero-homes-mohali":
    "https://static.squareyards.com/resources/images/chandigarh/project-image/hero-homes-project-project-large-image1.jpg",
  "marbella-grand":
    "https://srggroup.in/wp-content/uploads/2025/05/ced48e53458e8a85547107330eb1fdc2.jpg",
  "ats-casa-espana":
    "https://acquirestate.com/storage/ats-casa-espana/front-elevation-casa-espana.webp",
  "affinity-belgravia":
    "https://files.propertywala.com/photos/89/J119273971.default.22066825.jpg",
  "beverly-golf-avenue":
    "https://static.squareyards.com/resources/images/chandigarh/project-image/beverly-golf-avenue-project-project-large-image1.jpg",
  "emaar-mohali-hills":
    "https://static.squareyards.com/resources/images/chandigarh/project-image/emaar-mohali-hills-project-project-large-image1.jpg",
  "emaar-the-views":
    "https://static.squareyards.com/resources/images/chandigarh/project-image/emaar-the-views-project-project-large-image1.jpg",
  "gmada-ecocity-new-chandigarh":
    "https://ecocitynewchandigarh.com/wp-content/uploads/2022/09/cropped-download-1.jpg",
  "gmada-aerocity-mohali":
    "https://img.squareyards.com/secondaryPortal/IN_638933821254367745-130925054205425.jpg",
  "amayra-kharar":
    "https://epiquerealventures.com/wp-content/uploads/2026/01/Amayra-image-03.webp",
  "vishranti-township":
    "https://balleballehomes.com/wp-content/uploads/2025/06/ChatGPT-Image-Jun-18-2025-03_00_08-PM-1-1024x683.png",
  "stj-the-pinnacle":
    "https://static.squareyards.com/resources/images/chandigarh/tn-projectflagship/tn-wwic-imperial-heights-flagshipimg1.jpeg",
  "aura-valley-landran":
    "https://framerusercontent.com/images/mKq8Dw4UXt7Fz9qZUvP2fy5NTJo.webp",
  "cee-dee-greenwoods":
    "https://framerusercontent.com/images/mKq8Dw4UXt7Fz9qZUvP2fy5NTJo.webp",
  "ansal-api-sector-115":
    "https://img.staticmb.com/mbphoto/property/cropped_images/ver2/XIwvQlc61t8ZIpanz4mAnTVK4849dMlZ2NghAgMmUJKlKTnVXS82/Photo_h300_w450/85378121_3_creenshot20260703at3.29.29PM_300_450.jpg",
  "jubilee-techyards":
    "https://jubileemohali.co.in/wp-content/uploads/2026/06/1000318962-1024x410.webp",
  "sbp-rio-one": "https://www.sbpgroup.in/wp-content/uploads/2023/11/1-2.jpg",
  "sbp-city-square": "https://www.sbpgroup.in/wp-content/uploads/2023/10/somc007.jpg",
  "homeland-global-park":
    "https://homziio.com/storage/detailed-homeland-global-park-homziio.webp",
  "alc-crosswalk":
    "https://acquirestate.com/storage/alc-crosswalk-mohali-acquire-estate-3.webp",
  "bestech-business-tower":
    "https://www.sbpgroup.in/wp-content/uploads/2023/10/COD-Zirakpur-Township-1-scaled.jpg",
  "mk-technology-park":
    "https://www.sbpgroup.in/wp-content/uploads/2023/10/somc007.jpg",
  "sbp-siel-industrial-estate":
    "https://www.sbpgroup.in/wp-content/uploads/2023/10/COD-Zirakpur-Township-1-scaled.jpg",
  "sbp-industrial-park-tepla":
    "https://www.sbpgroup.in/wp-content/uploads/2023/11/1-2.jpg",
};

/** Extra gallery images beyond the hero (microsite carousel). */
export const PROJECT_GALLERY_URLS: Record<string, string[]> = {
  "dlf-hyde-park-estate": [
    "https://dlfnewchandigarh.in/wp-content/uploads/2026/02/dlf-new-chd.webp",
    "https://dlfgroupindia.com/upload_maps/fffff-62862.jpg",
  ],
  "emaar-mohali-hills": [
    "https://static.squareyards.com/resources/images/chandigarh/project-image/emaar-mohali-hills-project-project-large-image1.jpg",
    "https://properties.emaar.com/-/media/emaar/india/images/mohali-hills/mohali-hills-banner.jpg",
  ],
  "godrej-tricity-heights": [
    "https://chandigarhprojects.com/godrej/images/godrej-chandigarh-banner.webp",
    "https://gplwebsitecdnblob.blob.core.windows.net/godrej-cdn/Files/gpl-homepage-banner-mob-1-compressed-cmpforhjt000qo0ph4l2b4vik.webp",
  ],
  "sbp-city-of-dreams": [
    "https://www.sbpgroup.in/wp-content/uploads/2023/10/somc007.jpg",
  ],
  "gillco-valley": [
    "https://static.squareyards.com/resources/images/chandigarh/project-image/gillco-valley-project-project-large-image1.jpg",
    "https://img.staticmb.com/mbimages/project/Photo_h470_w1080/2023/11/29/Project-Photo-3-Gillco-Valley-Mohali-5100663_345_1366_470_1080.jpg.webp",
    "https://img.staticmb.com/mbimages/project/Photo_h470_w1080/2021/10/11/Master-Plan-1-Gillco-Valley-Mohali-5100663_524_499_470_1080.jpg.webp",
  ],
  "homeland-regalia": [
    "https://homziio.com/storage/imageye-imgi-83-main-header.webp",
    "https://homelandgroup.in/images/banner/banner-01.jpg",
  ],
  "emaar-the-views": [
    "https://static.squareyards.com/resources/images/chandigarh/project-image/emaar-the-views-project-project-large-image1.jpg",
  ],
  "gillco-meraqui": [
    "https://realtypromoo.com/images/projects/gillco-meraqui-mohali-1.webp",
  ],
  "velora-urbano": [
    "https://acquirestate.com/storage/velora-urbano/road-velora-urbano.webp",
    "https://veloraurbano.org/wp-content/uploads/2025/11/ChatGPT-Image-Nov-1-2025-10_45_51-AM.png",
  ],
  "jubilee-city-gardens": [
    "https://jubileemohali.co.in/wp-content/uploads/2026/06/1000318714.png",
    "https://jubileemohali.co.in/wp-content/uploads/2026/06/1000318714-1024x555.png",
  ],
};

function pickHeroUrl(...candidates: Array<string | null | undefined>): string | null {
  for (const url of candidates) {
    if (url && !isUnreliableHeroUrl(url)) return url;
  }
  return null;
}

function dedupeUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    if (!url || isUnreliableHeroUrl(url) || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

export function resolveBuilderLogoUrl(
  builderSlug?: string | null,
  builderName?: string | null,
  projectSlug?: string | null
): string | null {
  const slug = resolveBuilderSlug(builderSlug, builderName, projectSlug);
  return slug ? BUILDER_LOGO_URLS[slug] ?? null : null;
}

export function resolveProjectHeroUrl(
  projectSlug?: string | null,
  builderSlug?: string | null,
  builderName?: string | null,
  storedGalleryUrl?: string | null
): string | null {
  const resolvedBuilder = resolveBuilderSlug(builderSlug, builderName, projectSlug);
  const fromStore =
    storedGalleryUrl && !isGenericProjectPlaceholder(storedGalleryUrl)
      ? storedGalleryUrl
      : null;
  const fromProject = projectSlug ? PROJECT_HERO_URLS[projectSlug] : undefined;
  const fromBuilder = resolvedBuilder ? BUILDER_HERO_URLS[resolvedBuilder] : undefined;
  const goodStore =
    fromStore && !isUnreliableHeroUrl(fromStore) ? fromStore : null;

  return pickHeroUrl(goodStore, fromProject, fromBuilder);
}

export function resolveProjectGalleryUrls(
  projectSlug?: string | null,
  builderSlug?: string | null,
  builderName?: string | null,
  storedGalleryUrls?: string[] | null
): string[] {
  const hero = resolveProjectHeroUrl(
    projectSlug,
    builderSlug,
    builderName,
    storedGalleryUrls?.[0]
  );
  const fromCatalog = projectSlug ? PROJECT_GALLERY_URLS[projectSlug] : undefined;
  const fromStore = (storedGalleryUrls ?? []).filter(
    (u) => u && !isGenericProjectPlaceholder(u) && !isUnreliableHeroUrl(u)
  );
  return dedupeUrls([...(fromStore ?? []), ...(fromCatalog ?? []), ...(hero ? [hero] : [])]);
}

export function resolveProjectMedia(
  projectSlug?: string | null,
  builderSlug?: string | null,
  builderName?: string | null,
  storedGalleryUrl?: string | null,
  storedGalleryUrls?: string[] | null
): ProjectMedia {
  const gallery = resolveProjectGalleryUrls(
    projectSlug,
    builderSlug,
    builderName,
    storedGalleryUrls ?? (storedGalleryUrl ? [storedGalleryUrl] : [])
  );
  return {
    heroUrl: gallery[0] ?? null,
    logoUrl: resolveBuilderLogoUrl(builderSlug, builderName, projectSlug),
    galleryUrls: gallery,
  };
}

/** Gallery array for Firestore seed — real photos only. */
export function catalogGalleryUrls(
  projectSlug: string,
  builderSlug: string
): string[] {
  return resolveProjectGalleryUrls(projectSlug, builderSlug, null, null);
}

export function catalogBuilderLogoUrl(builderSlug: string): string | null {
  return BUILDER_LOGO_URLS[builderSlug] ?? null;
}
