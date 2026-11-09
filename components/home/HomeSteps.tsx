import { HOME_STEPS } from "@/lib/seo/home-page-content";
import { ChatIcon, HandshakeIcon, PinIcon } from "@/components/home/HomeIcons";
import HomeSectionHeading from "@/components/home/HomeSectionHeading";

const ICONS = [
  <PinIcon key="pin" className="h-6 w-6" />,
  <ChatIcon key="chat" />,
  <HandshakeIcon key="deal" />,
];

export default function HomeSteps() {
  return (
    <section aria-labelledby="home-steps-heading" className="px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <HomeSectionHeading
          id="home-steps-heading"
          eyebrow={HOME_STEPS.eyebrow}
          title={HOME_STEPS.title}
        />
        <ol className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
          {HOME_STEPS.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 md:flex-col md:gap-0">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-navy)] text-white shadow-[0_12px_30px_-12px_rgba(15,37,84,0.6)]">
                {ICONS[i]}
              </span>
              <div className="md:mt-5">
                <h3 className="text-lg font-semibold text-[var(--brand-navy)]">
                  <span className="mr-2 text-[var(--brand-orange)]">{i + 1}.</span>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
