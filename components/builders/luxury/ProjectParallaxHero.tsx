"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { LuxuryBreadcrumbs } from "@/components/builders/luxury/LuxuryUI";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ProjectParallaxHeroProps {
  imageUrl?: string;
  title: string;
  subtitle: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  chips: ReactNode;
  actions: ReactNode;
  eyebrow?: string;
}

export default function ProjectParallaxHero({
  imageUrl,
  title,
  subtitle,
  breadcrumbs,
  chips,
  actions,
  eyebrow = "Premium Development",
}: ProjectParallaxHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "28%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "12%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduceMotion ? 1 : 0.85]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[72vh] overflow-hidden bg-[var(--lux-primary-deep)] sm:min-h-[80vh]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1 bg-gradient-to-r from-transparent via-[var(--lux-accent)] to-transparent opacity-90"
        aria-hidden
      />
      {imageUrl ? (
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: imageY, scale: imageScale }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="h-[120%] w-full object-cover object-center" />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--lux-primary)] to-[var(--lux-primary-deep)]" />
      )}

      <motion.div className="lux-hero-overlay absolute inset-0" style={{ opacity: overlayOpacity }} />

      <motion.div
        className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 sm:min-h-[80vh] sm:pb-16"
        style={{ y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <LuxuryBreadcrumbs light items={breadcrumbs} />

          <p className="lux-eyebrow mt-6 text-[var(--lux-accent)]">{eyebrow}</p>
          <h1 className="mt-2 max-w-4xl font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
            {title}
          </h1>
          <div className="lux-gold-rule mt-5 !via-[var(--lux-accent)] opacity-90" />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-2">{chips}</div>
          <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
        </motion.div>
      </motion.div>

      {!reduceMotion && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/50"
          >
            <span className="text-[0.6rem] uppercase tracking-[0.2em]">Scroll</span>
            <span className="h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
          </motion.div>
        </div>
      )}
    </section>
  );
}
