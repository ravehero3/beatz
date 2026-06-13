import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Store, ExternalLink, Save } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useAuthStore } from "@/store/authStore";

interface Storefront {
  id: string;
  slug: string | null;
  displayName: string | null;
  storeTemplate: string | null;
  playerStyle: string | null;
}

const THEMES = ["light", "grey", "dark"] as const;
const PLAYERS = ["classic", "minimal", "deck"] as const;

const THEME_LABELS: Record<string, string> = { light: "Light", grey: "Grey", dark: "Dark" };
const PLAYER_LABELS: Record<string, string> = { classic: "Classic (Grid)", minimal: "Minimal (List)", deck: "Deck (Audio)" };

export default function AdminStorefrontsPage() {
  const { token } = useAuthStore();
  const [storefronts, setStorefronts] = useState<Storefront[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [localEdits, setLocalEdits] = useState<Record<string, { storeTemplate: string; playerStyle: string }>>({});

  useEffect(() => {
    fetch("/api/admin/storefronts", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setStorefronts(data);
        const edits: Record<string, { storeTemplate: string; playerStyle: string }> = {};
        data.forEach((sf: Storefront) => {
          edits[sf.id] = { storeTemplate: sf.storeTemplate ?? "light", playerStyle: sf.playerStyle ?? "classic" };
        });
        setLocalEdits(edits);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  async function save(id: string) {
    setSaving(id);
    const edit = localEdits[id];
    await fetch(`/api/admin/storefronts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(edit),
    });
    setSaving(null);
    setSaved(id);
    setTimeout(() => setSaved(null), 1800);
  }

  return (
    <AdminLayout>
      <div style={{ padding: "32px", maxWidth: "900px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Store size={20} color="#0A0A0A" />
          <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
            Storefront Studio
          </h1>
        </div>
        <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888", marginBottom: "32px" }}>
          Set each artist's store theme and player style. Changes apply to their public storefront immediately.
        </p>

        {loading ? (
          <div style={{ color: "#888", fontFamily: "'Figtree', sans-serif", fontSize: "14px" }}>Loading storefronts…</div>
        ) : storefronts.length === 0 ? (
          <div style={{ color: "#888", fontFamily: "'Figtree', sans-serif", fontSize: "14px" }}>No artist storefronts found.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {storefronts.map((sf) => {
              const edit = localEdits[sf.id] ?? { storeTemplate: sf.storeTemplate ?? "light", playerStyle: sf.playerStyle ?? "classic" };
              const isSaving = saving === sf.id;
              const isSaved = saved === sf.id;

              return (
                <div key={sf.id} style={{
                  background: "#FFFFFF",
                  border: "1px solid #EBEBEB",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}>
                  {/* Name + link */}
                  <div style={{ flex: "1 1 160px", minWidth: 0 }}>
                    <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "15px", color: "#0A0A0A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {sf.displayName ?? "—"}
                    </div>
                    {sf.slug && (
                      <Link href={`/artists/${sf.slug}`} target="_blank">
                        <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#3B82F6", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", textDecoration: "none" }}>
                          {sf.slug} <ExternalLink size={10} />
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* Theme select */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontFamily: "'Figtree', sans-serif", fontSize: "10px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>Theme</label>
                    <select
                      value={edit.storeTemplate}
                      onChange={(e) => setLocalEdits((prev) => ({ ...prev, [sf.id]: { ...edit, storeTemplate: e.target.value } }))}
                      style={{ height: "34px", padding: "0 10px", borderRadius: "8px", border: "1px solid #E0E0E0", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#0A0A0A", background: "#FAFAFA", cursor: "pointer", outline: "none" }}
                    >
                      {THEMES.map((t) => <option key={t} value={t}>{THEME_LABELS[t]}</option>)}
                    </select>
                  </div>

                  {/* Player select */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontFamily: "'Figtree', sans-serif", fontSize: "10px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>Player</label>
                    <select
                      value={edit.playerStyle}
                      onChange={(e) => setLocalEdits((prev) => ({ ...prev, [sf.id]: { ...edit, playerStyle: e.target.value } }))}
                      style={{ height: "34px", padding: "0 10px", borderRadius: "8px", border: "1px solid #E0E0E0", fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#0A0A0A", background: "#FAFAFA", cursor: "pointer", outline: "none", minWidth: "150px" }}
                    >
                      {PLAYERS.map((p) => <option key={p} value={p}>{PLAYER_LABELS[p]}</option>)}
                    </select>
                  </div>

                  {/* Preview badge */}
                  <div style={{
                    padding: "4px 10px",
                    borderRadius: "8px",
                    background: edit.storeTemplate === "dark" ? "#0A0A0A" : edit.storeTemplate === "grey" ? "#F0F0F0" : "#F8F8F8",
                    border: "1px solid #E5E5E5",
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: edit.storeTemplate === "dark" ? "#FFFFFF" : "#666",
                    minWidth: "60px",
                    textAlign: "center",
                  }}>
                    {edit.playerStyle}
                  </div>

                  {/* Save button */}
                  <button
                    onClick={() => save(sf.id)}
                    disabled={isSaving}
                    style={{
                      height: "34px",
                      padding: "0 16px",
                      borderRadius: "8px",
                      background: isSaved ? "#16A34A" : "#0A0A0A",
                      color: "#FFFFFF",
                      border: "none",
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: isSaving ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "background 0.2s ease",
                      opacity: isSaving ? 0.6 : 1,
                      flexShrink: 0,
                    }}
                  >
                    <Save size={13} />
                    {isSaved ? "Saved!" : isSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
