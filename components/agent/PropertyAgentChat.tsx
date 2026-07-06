"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import AgentListingCards from "@/components/agent/AgentListingCards";
import { extractListingPreviewsFromParts, formatAgentChatError } from "@/lib/agent/chat-ui";
import { appPath } from "@/lib/config";
import { getClientAuth } from "@/lib/firebase-client";
import { agentToolLabels } from "@/lib/agent/prompts";
import { extractMapPathFromText } from "@/lib/agent/map-url";
import type { AgentSurface } from "@/lib/agent/types";
import AgentSuggestedPrompts from "./AgentSuggestedPrompts";
import AgentQuickLeadForm from "./AgentQuickLeadForm";
import { extractContactFromMessages } from "@/lib/agent/contact-extraction";

interface Props {
  surface?: AgentSurface;
  transactionType?: "rent" | "sale";
  /** When surface=project on a microsite */
  projectId?: string;
  projectSlug?: string;
  citySlug?: string;
  projectName?: string;
  /** When false, chat is disabled (OPENAI_API_KEY missing on server). */
  agentEnabled?: boolean;
  compact?: boolean;
  className?: string;
  onApplyMapPath?: (path: string) => void;
}

function getMessageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((part) => part.type === "text" && part.text)
    .map((part) => part.text)
    .join("");
}

function getToolParts(parts: { type: string; state?: string }[]) {
  return parts.filter((part) => part.type.startsWith("tool-"));
}

function renderTextWithLinks(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\]\(\/[^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\((\/[^)]+)\)$/);
    if (match) {
      return (
        <Link key={i} href={appPath(match[2])} className="font-semibold text-[var(--accent)] underline">
          {match[1]}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function PropertyAgentChat({
  surface = "advisor",
  transactionType = "rent",
  projectId,
  projectSlug,
  citySlug,
  projectName,
  agentEnabled = true,
  compact = false,
  className = "",
  onApplyMapPath,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: appPath("/api/agent/chat"),
        prepareSendMessagesRequest: async ({ id, messages }) => {
          const token = await getClientAuth().currentUser?.getIdToken();
          const body: Record<string, unknown> = {
            messages,
            sessionId: id,
            surface,
            transactionType: surface === "project" ? "sale" : transactionType,
          };
          if (surface === "project") {
            if (projectId) body.projectId = projectId;
            else if (projectSlug && citySlug) {
              body.projectSlug = projectSlug;
              body.citySlug = citySlug;
            } else if (citySlug) {
              body.citySlug = citySlug;
            }
          }
          return {
            body,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          };
        },
      }),
    [surface, transactionType, projectId, projectSlug, citySlug]
  );

  const { messages, sendMessage, status, error, id: sessionId } = useChat({ transport });
  const isLoading = status === "submitted" || status === "streaming";

  const inferredBudget = useMemo(
    () => extractContactFromMessages(messages).budgetRange ?? "",
    [messages]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agentEnabled) return;
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput("");
  }

  function applyMapFromMessage(text: string) {
    const path = extractMapPathFromText(text);
    if (!path) return;
    if (onApplyMapPath) {
      onApplyMapPath(path);
    } else {
      router.push(appPath(path));
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {!agentEnabled && (
        <div
          className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          <p className="font-semibold">AI concierge offline</p>
          <p className="mt-1 text-amber-900/90">
            Set <code className="text-xs">OPENAI_API_KEY</code> in{" "}
            <code className="text-xs">.env.local</code> (or Vercel production env), then restart
            the dev server. You can still enquire via the form or call{" "}
            <a href="tel:+919915061640" className="font-semibold underline">
              +91 9915061640
            </a>
            .
          </p>
        </div>
      )}

      <div
        ref={scrollRef}
        className={
          compact
            ? "max-h-[320px] min-h-[200px] space-y-3 overflow-y-auto pr-1"
            : "min-h-[360px] max-h-[520px] space-y-4 overflow-y-auto pr-1"
        }
      >
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-6 text-center text-sm text-[var(--muted)]">
            <span className="text-lg" aria-hidden>
              ✦
            </span>
            <p className="mt-2">
              {surface === "project" ? (
                <>
                  Ask about plots, pricing, EMI, RERA, or book a site visit
                  {projectName ? ` at ${projectName}` : " across Tricity projects"} — I use live
                  inventory and project tools, not guesses.
                </>
              ) : (
                <>
                  Ask about areas, budgets, projects, or say &ldquo;show me on the map&rdquo; — I use
                  live RentalPins tools, not guesses.
                </>
              )}
              {user ? " Signed in — I can use your saved searches and prior chats." : ""}
            </p>
          </div>
        )}

        {messages.map((message) => {
          const text = getMessageText(message.parts);
          const toolParts = getToolParts(message.parts);
          const listingPreviews = extractListingPreviewsFromParts(message.parts);
          const mapPath = text ? extractMapPathFromText(text) : null;

          return (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <span
                  className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-navy)] text-xs text-white"
                  aria-hidden
                >
                  AI
                </span>
              )}
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-[var(--brand-navy)] text-white"
                    : "border border-[var(--border)] bg-white text-[var(--text)]"
                }`}
              >
                {toolParts.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {toolParts.map((part, index) => {
                      const toolName = part.type.replace("tool-", "");
                      const label = agentToolLabels[toolName] ?? toolName;
                      const running =
                        part.state === "input-streaming" || part.state === "input-available";
                      return (
                        <span
                          key={`${message.id}-tool-${index}`}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]"
                        >
                          {running ? "…" : "✓"} {label}
                        </span>
                      );
                    })}
                  </div>
                )}

                {text && (
                  <div className="whitespace-pre-wrap [&_a]:text-[var(--accent)]">
                    {renderTextWithLinks(text)}
                  </div>
                )}

                {listingPreviews.length > 0 && message.role === "assistant" && (
                  <AgentListingCards
                    listings={listingPreviews}
                    transactionType={transactionType}
                  />
                )}

                {mapPath && message.role === "assistant" && (
                  <button
                    type="button"
                    onClick={() => applyMapFromMessage(text)}
                    className="mt-3 rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Open on map
                  </button>
                )}

                {message.role === "assistant" && !text && isLoading && (
                  <span className="text-[var(--muted)]">Thinking…</span>
                )}
              </div>
            </div>
          );
        })}

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {formatAgentChatError(error.message)}
          </p>
        )}
      </div>

      {messages.length === 0 && agentEnabled && (
        <AgentSuggestedPrompts
          surface={surface}
          transactionType={transactionType}
          projectName={projectName}
          onSelect={(prompt) => sendMessage({ text: prompt })}
          disabled={isLoading}
          className="mt-4"
        />
      )}

      {surface === "project" && (
        <AgentQuickLeadForm
          sessionId={sessionId}
          projectId={projectId}
          citySlug={citySlug}
          projectSlug={projectSlug}
          projectName={projectName}
          defaultBudget={inferredBudget}
          className="mt-4"
        />
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            !agentEnabled
              ? "AI concierge unavailable — add OPENAI_API_KEY to enable"
              : surface === "showcase"
                ? "Ask about RentalPins as a PropTech platform…"
                : surface === "project"
                  ? "Budget, plot size, site visit date, or compare projects…"
                  : "Budget, area, BHK, rent or buy…"
          }
          disabled={isLoading || !agentEnabled}
          aria-label="Message the property agent"
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !agentEnabled || !input.trim()}
          className="rp-btn rp-btn-primary shrink-0 rounded-xl px-4 py-3 text-sm disabled:opacity-50"
        >
          {isLoading ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
