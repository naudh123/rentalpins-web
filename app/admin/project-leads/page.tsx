"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import BuilderAdminShell from "@/components/builders/BuilderAdminShell";
import { tricityCityLabel } from "@/lib/builders/tricity-cities";
import type { ProjectLead, LeadStatus } from "@/lib/types/builder-microsite";

const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  "site-visit-scheduled": "Site Visit Scheduled",
  negotiation: "Negotiation",
  closed: "Closed",
  lost: "Lost",
};

export default function AdminProjectLeadsPage() {
  const { user, profile } = useAuth();
  const [leads, setLeads] = useState<ProjectLead[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "sysadmin" ||
    profile?.role === "superadmin";

  useEffect(() => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }
    user.getIdToken().then((token) =>
      fetch("/api/project-leads", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => setLeads(d.leads || []))
        .finally(() => setLoading(false))
    );
  }, [user, isAdmin]);

  async function updateStatus(leadId: string, leadStatus: LeadStatus) {
    if (!user) return;
    const token = await user.getIdToken();
    await fetch(`/api/project-leads/${leadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ leadStatus }),
    });
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, leadStatus } : l))
    );
  }

  if (!isAdmin) {
    return (
      <BuilderAdminShell title="Leads">
        <p className="text-red-600">Admin access required.</p>
      </BuilderAdminShell>
    );
  }

  return (
    <BuilderAdminShell title="Project Leads (RentalPins CRM)">
      <p className="mb-4 text-sm text-[var(--muted)]">
        All self-service project enquiries are platform-managed. Qualify and sell leads to developers.
      </p>
      {loading ? (
        <p className="text-[var(--muted)]">Loading...</p>
      ) : leads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--muted)]">
          No leads yet. Enquiries from builder and project pages will appear here.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-[var(--bg-elevated)] text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {leads.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${l.phone}`} className="text-[var(--brand-navy)]">
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {l.email ? (
                      <a href={`mailto:${l.email}`} className="text-[var(--brand-navy)]">
                        {l.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="max-w-[140px] truncate px-4 py-3 text-[var(--muted)]">
                    {l.projectName || "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-[var(--muted)]">
                    {l.citySlug ? tricityCityLabel(l.citySlug) : "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">{l.source.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {l.createdAtMs
                      ? new Date(l.createdAtMs).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={l.leadStatus}
                      onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                      className="rounded border border-[var(--border)] px-2 py-1 text-xs"
                    >
                      {Object.entries(LEAD_STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BuilderAdminShell>
  );
}
