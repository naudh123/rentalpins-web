"use client";

import { telLink, whatsappLink } from "@/lib/builders/format";
import {
  formatContactPhoneLabel,
  projectWhatsAppMessage,
  resolveProjectContact,
  type LeadRouting,
} from "@/lib/builders/project-contact";

interface ProjectContactBarProps {
  projectName: string;
  builderPhone?: string | null;
  builderWhatsapp?: string | null;
  leadRouting?: LeadRouting;
  onEnquire?: () => void;
  onBrochure?: () => void;
  hasBrochure?: boolean;
  variant?: "hero" | "inline";
}

export default function ProjectContactBar({
  projectName,
  builderPhone,
  builderWhatsapp,
  leadRouting = "platform",
  onEnquire,
  onBrochure,
  hasBrochure,
  variant = "hero",
}: ProjectContactBarProps) {
  const { phone, whatsapp } = resolveProjectContact(
    builderPhone,
    builderWhatsapp,
    leadRouting
  );
  const msg = projectWhatsAppMessage(projectName);
  const isHero = variant === "hero";

  return (
    <div className={`flex flex-wrap gap-2 ${isHero ? "" : "w-full"}`}>
      <a
        href={whatsappLink(whatsapp, msg)}
        target="_blank"
        rel="noopener noreferrer"
        className={
          isHero
            ? "lux-btn-whatsapp lux-btn-whatsapp--hero px-5 py-2.5"
            : "lux-btn-whatsapp flex-1 py-3 text-center text-sm"
        }
      >
        WhatsApp Concierge
      </a>
      <a
        href={telLink(phone)}
        className={
          isHero
            ? "lux-btn-outline border-white/30 bg-white/10 px-5 py-2.5 text-white hover:border-white hover:bg-white/20"
            : "lux-btn-outline flex-1 py-3 text-center text-sm"
        }
      >
        Call {formatContactPhoneLabel(phone)}
      </a>
      {onEnquire && (
        <button
          type="button"
          onClick={onEnquire}
          className={isHero ? "lux-btn-gold px-5 py-2.5" : "lux-btn-gold flex-1 py-3 text-sm"}
        >
          Private Enquiry
        </button>
      )}
      {hasBrochure && onBrochure && (
        <button
          type="button"
          onClick={onBrochure}
          className={
            isHero
              ? "lux-btn-outline border-white/30 bg-white/10 px-5 py-2.5 text-white hover:border-white hover:bg-white/20"
              : "lux-btn-outline flex-1 py-3 text-sm"
          }
        >
          Brochure
        </button>
      )}
    </div>
  );
}
