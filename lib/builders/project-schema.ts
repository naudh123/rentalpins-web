import { siteUrl, appPath } from "@/lib/config";
import { builderPath, projectPath } from "@/lib/builders/project-paths";
import type { Builder, BuilderProject } from "@/lib/types/builder-microsite";

function abs(path: string): string {
  return `${siteUrl}${appPath(path)}`;
}

export function buildBuilderJsonLd(builder: Builder) {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    name: builder.name,
    description: builder.description || `${builder.name} — verified builder on RentalPins`,
    url: `${siteUrl}${builderPath(builder.slug)}`,
    logo: builder.logoUrl || undefined,
    image: builder.coverImageUrl || builder.logoUrl || undefined,
    telephone: builder.phone || undefined,
    email: builder.email || undefined,
    address: builder.address
      ? {
          "@type": "PostalAddress",
          streetAddress: builder.address,
          addressLocality: builder.city || undefined,
          addressRegion: builder.state || undefined,
          addressCountry: builder.country,
        }
      : undefined,
    foundingDate: builder.establishedYear
      ? `${builder.establishedYear}-01-01`
      : undefined,
  };
}

export function buildProjectJsonLd(project: BuilderProject) {
  const description =
    project.aiSearchSnippet ||
    project.seoDescription ||
    project.description ||
    `${project.name} by ${project.builderName}`;

  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateListing", "Residence"],
    name: project.name,
    description,
    url: `${siteUrl}${projectPath(project.citySlug, project.slug)}`,
    image: project.galleryUrls[0] || undefined,
    keywords: project.seoKeywords?.length
      ? project.seoKeywords.join(", ")
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability:
        project.status === "sold-out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      price: project.priceMin || undefined,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: project.address || undefined,
      addressLocality: project.city,
      addressRegion: project.state || undefined,
      addressCountry: project.country,
    },
    geo:
      project.latitude && project.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: project.latitude,
            longitude: project.longitude,
          }
        : undefined,
  };
}

export function buildProjectBreadcrumbs(project: BuilderProject) {
  return [
    { name: "Home", url: abs("/") },
    { name: "Builders", url: abs("/builders") },
    { name: project.builderName, url: abs(builderPath(project.builderSlug)) },
    {
      name: project.name,
      url: abs(projectPath(project.citySlug, project.slug)),
    },
  ];
}

export function buildBuilderBreadcrumbs(builder: Builder) {
  return [
    { name: "Home", url: abs("/") },
    { name: "Builders", url: abs("/builders") },
    { name: builder.name, url: abs(builderPath(builder.slug)) },
  ];
}
