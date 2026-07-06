"use client";

import { telLink, whatsappLink } from "@/lib/builders/format";
import {
  formatContactPhoneLabel,
  projectWhatsAppMessage,
  resolveProjectContact,
  type LeadRouting,
} from "@/lib/builders/project-contact";
import { trackProjectContactClicked } from "@/lib/ga4";

interface ProjectStickyAnalytics {
  projectId?: string;
  projectSlug: string;
  citySlug: string;
  placement?: string;
}

interface ProjectStickyCtaProps {
  phone?: string | null;
  whatsapp?: string | null;
  leadRouting?: LeadRouting;
  projectName?: string;
  onEnquire?: () => void;
  analytics?: ProjectStickyAnalytics;
}

export default function ProjectStickyCta({
  phone: builderPhone,
  whatsapp: builderWhatsapp,
  leadRouting = "platform",
  projectName,
  onEnquire,
  analytics,
}: ProjectStickyCtaProps) {
  const { phone, whatsapp: wa } = resolveProjectContact(
    builderPhone,
    builderWhatsapp,
    leadRouting
  );
  const msg = projectWhatsAppMessage(projectName || "your project");

  function trackContact(mode: "call" | "whatsapp" | "enquire") {
    if (!analytics) return;
    trackProjectContactClicked({
      projectId: analytics.projectId,
      projectSlug: analytics.projectSlug,
      citySlug: analytics.citySlug,
      mode,
      placement: analytics.placement,
    });
  }

  return (
    <div className="lux-sticky-bar fixed bottom-0 left-0 right-0 z-40 p-3 md:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={telLink(phone)}
          onClick={() => trackContact("call")}
          className="lux-btn-outline flex-1 py-3 text-center text-xs sm:text-sm"
        >
          Call
        </a>
        <a
          href={whatsappLink(wa, msg)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContact("whatsapp")}
          className="lux-btn-whatsapp flex-1 py-3 text-center text-xs sm:text-sm"
        >
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            trackContact("enquire");
            onEnquire?.();
          }}
          className="lux-btn-gold flex-1 py-3 text-xs sm:text-sm"
        >
          Enquire
        </button>
      </div>
    </div>
  );
}
