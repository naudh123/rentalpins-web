interface Props {
  areaName: string;
  city?: string;
  propertyTypes?: string[];
  commuteNote?: string;
  safetyNote?: string;
}

export default function AreaGuideBlock({
  areaName,
  city,
  propertyTypes,
  commuteNote,
  safetyNote,
}: Props) {
  const place = city ? `${areaName}, ${city}` : areaName;
  return (
    <section className="mx-auto max-w-4xl px-4 py-10" aria-labelledby="area-guide-heading">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#E8501A]">Area guide</p>
        <h2 id="area-guide-heading" className="mt-2 font-serif text-2xl font-bold text-[#1E3A6E]">
          Renting in {place}
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            {place} attracts{" "}
            {propertyTypes?.length ? propertyTypes.join(", ").toLowerCase() : "rental"} demand on RentalPins.
            Shortlist on the map, compare pins by distance and rent, then message owners on WhatsApp without broker unlock fees.
          </p>
          {commuteNote ? <p>{commuteNote}</p> : null}
          {safetyNote ? <p>{safetyNote}</p> : null}
          <p>
            Visit shortlisted units in daylight, confirm deposit refund rules, and photograph room condition at handover before paying advance rent.
          </p>
        </div>
      </div>
    </section>
  );
}
