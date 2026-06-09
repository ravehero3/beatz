import { Link } from "wouter";
import { useListBeats, useDeleteBeat, getListBeatsQueryKey } from "@workspace/api-client-react";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2 } from "lucide-react";
import StudioLayout from "./StudioLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";

export default function MyBeatsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: beats, isLoading } = useListBeats({ artistId: user?.id, limit: 100 });
  const deleteBeat = useDeleteBeat();

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteBeat.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBeatsQueryKey() }),
    });
  }

  const statusColor = (s: string) => ({ active: { bg: "#F0FDF4", color: "#22C55E" }, flagged: { bg: "#FFFBEB", color: "#F59E0B" }, removed: { bg: "#FEF2F2", color: "#EF4444" } }[s] ?? { bg: "#F2F2F2", color: "#888888" });

  return (
    <StudioLayout>
      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>My Beats</h1>
          <Link href="/studio/beats/upload">
            <button data-testid="btn-upload-beat" style={{ height: "36px", padding: "0 16px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: "'Figtree', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              <Plus size={14} /> Upload Beat
            </button>
          </Link>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" }}>
          {isLoading ? (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} style={{ height: "48px" }} />)}
            </div>
          ) : (beats ?? []).length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 24px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>♪</div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "16px", color: "#0A0A0A", marginBottom: "8px" }}>No beats yet</div>
              <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888", marginBottom: "20px" }}>Upload your first beat to get started.</div>
              <Link href="/studio/beats/upload">
                <button style={{ height: "40px", padding: "0 20px", borderRadius: "9999px", background: "#0A0A0A", color: "#FFFFFF", border: "none", fontFamily: "'Figtree', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>Upload Beat</button>
              </Link>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F2F2F2", background: "#F9F9F9" }}>
                  {["Beat", "BPM", "Genre", "Basic", "Premium", "Plays", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 500, color: "#888888", textAlign: "left", padding: "10px 16px", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(beats ?? []).map((beat) => {
                  const sc = statusColor(beat.status);
                  return (
                    <tr key={beat.id} data-testid={`row-beat-${beat.id}`} style={{ borderBottom: "1px solid #F2F2F2" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "#F2F2F2", overflow: "hidden", flexShrink: 0 }}>
                            {beat.coverUrl && <img src={beat.coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                          </div>
                          <span style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: "#0A0A0A" }}>{beat.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888" }}>{beat.bpm ?? "—"}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888" }}>{beat.genre ?? "—"}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#0A0A0A", fontWeight: 600 }}>{beat.priceBasic ? formatCurrency(Number(beat.priceBasic)) : "—"}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#0A0A0A" }}>{beat.pricePremium ? formatCurrency(Number(beat.pricePremium)) : "—"}</td>
                      <td style={{ padding: "12px 16px", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888" }}>{beat.plays?.toLocaleString("cs-CZ")}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: "9999px", fontFamily: "'Figtree', sans-serif", fontSize: "11px", fontWeight: 600, background: sc.bg, color: sc.color }}>
                          {beat.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <Link href={`/studio/beats/${beat.id}/edit`}>
                            <button data-testid={`btn-edit-beat-${beat.id}`} style={{ height: "30px", width: "30px", borderRadius: "6px", background: "#F2F2F2", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Edit2 size={13} color="#444444" />
                            </button>
                          </Link>
                          <button onClick={() => handleDelete(beat.id, beat.title)} data-testid={`btn-delete-beat-${beat.id}`} style={{ height: "30px", width: "30px", borderRadius: "6px", background: "#FEF2F2", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Trash2 size={13} color="#EF4444" />
                          </button>
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
    </StudioLayout>
  );
}
