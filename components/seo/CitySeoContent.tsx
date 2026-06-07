import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog-types";
import type { CitySEOConfig } from "@/lib/seo/city-seo-config";
import { appPath } from "@/lib/config";
import CitySeoBlogLinks from "@/components/seo/CitySeoBlogLinks";

export default function CitySeoContent({
  config,
  relatedGuides = [],
}: {
  config: CitySEOConfig;
  relatedGuides?: BlogPostSummary[];
}) {
  return (
    <section
      aria-labelledby="city-seo-content-heading"
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#E8501A]">
          {config.placeName} rental guide
        </p>
        <h2
          id="city-seo-content-heading"
          className="mt-2 font-serif text-2xl font-bold text-[#1E3A6E] sm:text-3xl"
        >
          Rent in {config.placeName} — areas, rents & tips
        </h2>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700">
          {config.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        {config.bestAreas.length > 0 ? (
          <div className="mt-10">
            <h3 className="font-serif text-xl font-bold text-[#1E3A6E]">
              Best areas to rent in {config.placeName}
            </h3>
            <ul className="mt-4 space-y-4">
              {config.bestAreas.map((area) => (
                <li
                  key={area.name}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
                >
                  {area.href ? (
                    <Link
                      href={appPath(area.href)}
                      className="font-semibold text-[#1E3A6E] hover:text-[#E8501A] hover:underline"
                    >
                      {area.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-[#1E3A6E]">{area.name}</span>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {area.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {config.averageRent.length > 0 ? (
          <div className="mt-10">
            <h3 className="font-serif text-xl font-bold text-[#1E3A6E]">
              Average rent in {config.placeName}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Indicative ranges from active market behavior — compare live listings on the map
              for exact pricing.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-4 font-semibold">Type</th>
                    <th className="py-2 pr-4 font-semibold">Typical range</th>
                    <th className="py-2 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {config.averageRent.map((row) => (
                    <tr key={row.label} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-800">{row.label}</td>
                      <td className="py-3 pr-4 text-[#E8501A]">{row.range}</td>
                      <td className="py-3 text-slate-600">{row.note ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {config.universities.length > 0 ? (
          <div className="mt-10">
            <h3 className="font-serif text-xl font-bold text-[#1E3A6E]">
              Universities & student rental demand
            </h3>
            <ul className="mt-4 space-y-3">
              {config.universities.map((uni) => (
                <li key={uni.name} className="text-sm leading-relaxed text-slate-700">
                  <span className="font-semibold text-slate-900">{uni.name}:</span>{" "}
                  {uni.description}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {config.transport.length > 0 ? (
          <div className="mt-10">
            <h3 className="font-serif text-xl font-bold text-[#1E3A6E]">
              Transport & connectivity
            </h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              {config.transport.map((item) => (
                <li key={item.slice(0, 48)}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {config.sections?.map((section) => (
          <div key={section.title} className="mt-10">
            <h3 className="font-serif text-xl font-bold text-[#1E3A6E]">
              {section.title}
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}

        <CitySeoBlogLinks placeName={config.placeName} posts={relatedGuides} />
      </div>
    </section>
  );
}
