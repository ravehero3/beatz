import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import StudioLayout from "./StudioLayout";

const LAYOUTS = [
  { id: "light", label: "Light", bg: "#FFFFFF", text: "#0A0A0A", preview: ["#FFFFFF", "#F5F5F5", "#E5E5E5"] },
  { id: "grey", label: "Grey", bg: "#F5F5F5", text: "#0A0A0A", preview: ["#F5F5F5", "#EBEBEB", "#D4D4D4"] },
  { id: "dark", label: "Dark", bg: "#0A0A0A", text: "#FFFFFF", preview: ["#0A0A0A", "#141414", "#1F1F1F"] },
];

const PLAYERS = [
  {
    id: "classic",
    label: "Classic",
    desc: "Square cover art with waveform below",
    preview: (
      <div style={{ padding: "10px", background: "#F9F9F9", borderRadius: "8px", fontSize: "10px", color: "#888" }}>
        <div style={{ width: "100%", aspectRatio: "1", background: "#E5E5E5", borderRadius: "6px", marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAAAAA", fontSize: "20px" }}>♪</div>
        <div style={{ fontWeight: 700, color: "#0A0A0A", marginBottom: "4px", fontSize: "11px" }}>Beat Title</div>
        <div style={{ display: "flex", gap: "2px", marginBottom: "6px" }}>
          {[40, 60, 45, 80, 55, 70, 35, 65, 50, 75, 45, 60].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h * 0.2}px`, background: i < 5 ? "#0A0A0A" : "#E5E5E5", borderRadius: "1px" }} />
          ))}
        </div>
        <div style={{ height: "22px", background: "#0A0A0A", borderRadius: "11px" }} />
      </div>
    ),
  },
  {
    id: "minimal",
    label: "Minimal",
    desc: "Compact rows with inline waveform",
    preview: (
      <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F9F9F9", padding: "6px 8px", borderRadius: "8px" }}>
            <div style={{ width: "28px", height: "28px", background: "#E5E5E5", borderRadius: "4px", flexShrink: 0 }} />
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid #E5E5E5", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", gap: "1px", alignItems: "center" }}>
              {[30, 60, 45, 80, 55, 70, 35, 65, 50, 75, 45, 60, 40, 70, 55, 65].map((h, j) => (
                <div key={j} style={{ flex: 1, height: `${h * 0.18}px`, background: j < 6 ? "#0A0A0A" : "#E5E5E5", borderRadius: "1px" }} />
              ))}
            </div>
            <div style={{ width: "32px", height: "18px", background: "#0A0A0A", borderRadius: "9px", flexShrink: 0 }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "deck",
    label: "Deck",
    desc: "Wide DJ-style cards with large waveform",
    preview: (
      <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {[1, 2].map((i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr", background: "#F9F9F9", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ background: "#E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#AAAAAA" }}>♪</div>
            <div style={{ padding: "6px 8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ height: "8px", width: "60%", background: "#0A0A0A", borderRadius: "4px" }} />
                <div style={{ height: "16px", width: "30%", background: "#0A0A0A", borderRadius: "8px" }} />
              </div>
              <div style={{ display: "flex", gap: "1px", alignItems: "center", marginBottom: "2px" }}>
                {[30, 60, 45, 80, 55, 70, 35, 65, 50, 75, 45, 60, 40, 70, 55, 65, 45, 80, 55, 70].map((h, j) => (
                  <div key={j} style={{ flex: 1, height: `${h * 0.14}px`, background: j < 8 ? "#A78BFA" : "#333", borderRadius: "1px" }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const F = "'Figtree', sans-serif";

function SInput({ value, onChange, placeholder, type = "text", mono }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; mono?: boolean }) {
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid #E5E5E5", fontFamily: mono ? "'Courier New', monospace" : F, fontSize: "14px", outline: "none", boxSizing: "border-box", background: "#FFFFFF" }}
      onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
      onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
    />
  );
}

export default function StoreSettingsPage() {
  const { token } = useAuthStore();
  const [layout, setLayout] = useState("light");
  const [player, setPlayer] = useState("classic");
  const [bankIban, setBankIban] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/artists/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.storeTemplate) setLayout(data.storeTemplate);
        if (data.playerStyle) setPlayer(data.playerStyle);
        if (data.bankIban) setBankIban(data.bankIban);
        if (data.bankAccountName) setBankAccountName(data.bankAccountName);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/artists/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ storeTemplate: layout, playerStyle: player, bankIban: bankIban.trim() || null, bankAccountName: bankAccountName.trim() || null }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sectionTitle = (t: string) => (
    <div style={{ fontFamily: F, fontWeight: 700, fontSize: "15px", color: "#0A0A0A", letterSpacing: "-0.01em", marginBottom: "14px" }}>{t}</div>
  );

  if (loading) return <StudioLayout><div style={{ padding: "32px", color: "#888", fontFamily: F }}>Loading…</div></StudioLayout>;

  return (
    <StudioLayout>
      <div style={{ padding: "32px", maxWidth: "700px" }}>
        <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "8px" }}>Store Settings</h1>
        <p style={{ fontFamily: F, fontSize: "14px", color: "#888888", marginBottom: "32px" }}>Customise how your beat store looks to visitors.</p>

        {/* Layout */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          {sectionTitle("Shop Layout")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {LAYOUTS.map((l) => (
              <button key={l.id} onClick={() => setLayout(l.id)} style={{
                background: layout === l.id ? "#F0F0FF" : "#FAFAFA",
                border: `2px solid ${layout === l.id ? "#0A0A0A" : "#E5E5E5"}`,
                borderRadius: "12px", padding: "14px 10px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                transition: "all 0.15s ease",
              }}>
                <div style={{ width: "100%", height: "60px", background: l.preview[0], border: "1px solid #E5E5E5", borderRadius: "8px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ height: "14px", background: l.preview[1], borderBottom: `1px solid ${l.preview[2]}` }} />
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", padding: "4px" }}>
                    <div style={{ background: l.preview[1], borderRadius: "3px" }} />
                    <div style={{ background: l.preview[1], borderRadius: "3px" }} />
                  </div>
                </div>
                <span style={{ fontFamily: F, fontWeight: 600, fontSize: "13px", color: layout === l.id ? "#0A0A0A" : "#888888" }}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Player */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          {sectionTitle("Beat Player Style")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {PLAYERS.map((p) => (
              <button key={p.id} onClick={() => setPlayer(p.id)} style={{
                background: player === p.id ? "#F0F0FF" : "#FAFAFA",
                border: `2px solid ${player === p.id ? "#0A0A0A" : "#E5E5E5"}`,
                borderRadius: "12px", padding: "12px", cursor: "pointer",
                display: "flex", flexDirection: "column", gap: "10px",
                transition: "all 0.15s ease", textAlign: "left",
              }}>
                <div style={{ width: "100%", pointerEvents: "none" }}>{p.preview}</div>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: "13px", color: player === p.id ? "#0A0A0A" : "#444444" }}>{p.label}</div>
                  <div style={{ fontFamily: F, fontSize: "11px", color: "#888888", marginTop: "2px" }}>{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bank account */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          {sectionTitle("Bank Account for Payments")}
          <p style={{ fontFamily: F, fontSize: "13px", color: "#888888", marginBottom: "16px", lineHeight: 1.6 }}>
            Buyers pay you directly via Czech QR bank transfer. Add your IBAN so a scannable QR code is automatically generated on every order.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 500, color: "#444", marginBottom: "5px" }}>IBAN</label>
              <SInput value={bankIban} onChange={setBankIban} placeholder="CZ65 0800 0000 1920 0014 5399" mono />
              <span style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA", marginTop: "4px", display: "block" }}>Czech IBAN — found in your banking app under "Account details"</span>
            </div>
            <div>
              <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 500, color: "#444", marginBottom: "5px" }}>Account holder name</label>
              <SInput value={bankAccountName} onChange={setBankAccountName} placeholder="Jan Novák" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          height: "44px", padding: "0 32px", borderRadius: "9999px",
          background: saved ? "#22C55E" : "#0A0A0A", color: "#FFFFFF", border: "none",
          fontFamily: F, fontWeight: 600, fontSize: "14px", cursor: saving ? "not-allowed" : "pointer",
          transition: "background 0.3s ease", opacity: saving ? 0.7 : 1,
        }}>
          {saved ? "✓ Saved!" : saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </StudioLayout>
  );
}
