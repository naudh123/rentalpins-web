"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { getClientAuth } from "@/lib/firebase-client";
import { appPath } from "@/lib/config";
import type { AgentMetricsSummary } from "@/lib/agent/metrics";

function isAdminRole(role?: string): boolean {
  return role === "admin" || role === "sysadmin" || role === "superadmin";
}

export default function AgentMetricsDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<AgentMetricsSummary | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setBusy(true);
    setError("");
    try {
      const token = await getClientAuth().currentUser?.getIdToken();
      if (!token) throw new Error("Could not get auth token");

      const res = await fetch(appPath("/api/agent/metrics?days=7"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load metrics");
      setMetrics(data as AgentMetricsSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load metrics");
    } finally {
      setBusy(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && isAdminRole(profile?.role)) {
      void load();
    }
  }, [user, profile?.role, load]);

  if (authLoading) {
    return <p className="text-sm text-[var(--muted)]">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-[var(--border)] p-6 text-center">
        <p className="text-sm text-[var(--muted)]">Sign in with an admin account to view agent metrics.</p>
        <Link href={appPath("/auth/login")} className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]">
          Sign in
        </Link>
      </div>
    );
  }

  if (!isAdminRole(profile?.role)) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Admin access required. Your role: {profile?.role ?? "user"}.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">Last 7 days · server-side Firestore logs</p>
        <button
          type="button"
          onClick={() => void load()}
          disabled={busy}
          className="rp-btn rounded-full border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-50"
        >
          {busy ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      {metrics && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Sessions" value={String(metrics.totalSessions)} />
            <MetricCard label="High intent" value={String(metrics.highIntentSessions)} />
            <MetricCard
              label="Conversion signal"
              value={
                metrics.totalSessions > 0
                  ? `${Math.round((metrics.highIntentSessions / metrics.totalSessions) * 100)}%`
                  : "—"
              }
            />
          </div>

          <section>
            <h2 className="font-serif text-xl text-[var(--brand-navy)]">By surface</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(metrics.bySurface).map(([surface, count]) => (
                <span
                  key={surface}
                  className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-sm"
                >
                  {surface}: <strong>{count}</strong>
                </span>
              ))}
              {Object.keys(metrics.bySurface).length === 0 && (
                <span className="text-sm text-[var(--muted)]">No sessions yet.</span>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[var(--brand-navy)]">Top tools</h2>
            <ul className="mt-3 space-y-2">
              {metrics.topTools.map((t) => (
                <li
                  key={t.tool}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                >
                  <span>{t.tool}</span>
                  <span className="font-semibold">{t.count}</span>
                </li>
              ))}
              {metrics.topTools.length === 0 && (
                <li className="text-sm text-[var(--muted)]">No tool usage logged yet.</li>
              )}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[var(--brand-navy)]">Recent sessions</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                    <th className="px-2 py-2">Surface</th>
                    <th className="px-2 py-2">Score</th>
                    <th className="px-2 py-2">Msgs</th>
                    <th className="px-2 py-2">Tools</th>
                    <th className="px-2 py-2">Summary</th>
                    <th className="px-2 py-2">Alert</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentSessions.map((row) => (
                    <tr key={row.sessionId} className="border-b border-[var(--border)]">
                      <td className="px-2 py-2">
                        {row.surface}
                        {row.highIntent && (
                          <span className="ml-1 rounded bg-green-100 px-1.5 text-[10px] text-green-800">
                            hot
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-2">{row.intentScore}</td>
                      <td className="px-2 py-2">{row.userMessageCount}</td>
                      <td className="px-2 py-2 text-xs text-[var(--muted)]">
                        {row.toolsUsed.slice(0, 3).join(", ") || "—"}
                      </td>
                      <td className="max-w-xs truncate px-2 py-2 text-[var(--muted)]">
                        {row.summary ?? row.sessionId.slice(0, 12)}
                      </td>
                      <td className="px-2 py-2 text-xs">
                        {row.notifiedAtMs ? (
                          <span className="text-green-700">emailed</span>
                        ) : row.highIntent && row.surface === "showcase" ? (
                          <span className="text-amber-700">pending</span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5 text-center">
      <p className="text-2xl font-bold text-[var(--brand-navy)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
