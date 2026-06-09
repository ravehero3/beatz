import { useState } from "react";
import { useListBeats, useAdminFlagBeat, useAdminRestoreBeat, getListBeatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag, RefreshCw } from "lucide-react";

export default function AdminBeatsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const { data: beats, isLoading } = useListBeats({ limit: 100 });
  const flagBeat = useAdminFlagBeat();
  const restoreBeat = useAdminRestoreBeat();

  const filteredBeats = statusFilter ? (beats ?? []).filter((b) => b.status === statusFilter) : (beats ?? []);

  const statusColor = (s: string) => ({ active: { bg: "#F0FDF4", color: "#22C55E" }, flagged: { bg: "#FFFBEB", color: "#F59E0B" }, removed: { bg: "#FEF2F2", color: "#EF4444" } }[s] ?? { bg: "#F2F2F2", color: "#888888" });

  return (
    <AdminLayout>
      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>Beats</h1>
          <div style={{ display: "flex", gap: "8px" }}>
            {["", "active", "flagged", "removed"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} data-testid={`filter-${s || "all"}`} style={{ height: "32px", padding: "0 14px", borderRadius: "9999px", background: statusFilter === s ? "#0A0A0A" : "#FFFFFF", color: statusFilter === s ? "#FFFFFF" : "#444444", border: "1px solid #E5E5E5", fontFamily: "'Figtree', sans-serif", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" }}>
          {isLoading ? (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} style={{ height: "48px" }} />)}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F2F2F2", background: "#F9F9F9" }}>
                  {["Beat", "Artist", "Plays", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 500, color: "#888888", textAlign: "left", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBeats.map((beat) => {
                  const sc = statusColor(beat.status);
                  return (
                    <tr key={beat.id} data-testid={`row-beat-admin-${beat.id}`} style={{ borderBottom: "1px solid #F2F2F2" }}>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>{beat.title}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888" }}>{beat.artistName ?? "—"}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888" }}>{(beat.plays ?? 0).toLocaleString("cs-CZ")}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: "9999px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 600, background: sc.bg, color: sc.color }}>{beat.status}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {beat.status === "active" && (
                            <button onClick={() => flagBeat.mutate({ id: beat.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBeatsQueryKey() }) })} data-testid={`btn-flag-${beat.id}`} style={{ height: "28px", padding: "0 10px", borderRadius: "9999px", background: "#FFFBEB", color: "#F59E0B", border: "1px solid #FCD34D", fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Flag size={11} /> Flag
                            </button>
                          )}
                          {(beat.status === "flagged" || beat.status === "removed") && (
                            <button onClick={() => restoreBeat.mutate({ id: beat.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBeatsQueryKey() }) })} data-testid={`btn-restore-${beat.id}`} style={{ height: "28px", padding: "0 10px", borderRadius: "9999px", background: "#F0FDF4", color: "#22C55E", border: "1px solid #86EFAC", fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                              <RefreshCw size={11} /> Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
