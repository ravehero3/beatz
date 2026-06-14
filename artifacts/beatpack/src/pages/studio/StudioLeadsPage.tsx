import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import StudioLayout from "./StudioLayout";
import { Mail, Download } from "lucide-react";

const F = "'Figtree', sans-serif";

interface Lead {
  id: string;
  email: string;
  beatTitle: string;
  consentGiven: boolean;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function downloadCsv(leads: Lead[]) {
  const header = "Email,Beat,Consent,Date\n";
  const rows = leads.map((l) =>
    `"${l.email}","${l.beatTitle.replace(/"/g, '""')}","${l.consentGiven ? "Yes" : "No"}","${formatDate(l.createdAt)}"`
  ).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "beatpack-leads.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function StudioLeadsPage() {
  const { token } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/artists/me/leads", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data);
        else setError(data.error ?? "Failed to load leads");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <StudioLayout>
      <div style={{ padding: "32px", maxWidth: "860px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontFamily: F, fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "6px" }}>
              Leads
            </h1>
            <p style={{ fontFamily: F, fontSize: "14px", color: "#888888" }}>
              Emails collected when fans downloaded a free preview of your beats.
            </p>
          </div>
          {leads.length > 0 && (
            <button
              onClick={() => downloadCsv(leads)}
              style={{
                height: "38px", padding: "0 18px", borderRadius: "9999px",
                background: "#0A0A0A", color: "#FFFFFF", border: "none",
                fontFamily: F, fontWeight: 600, fontSize: "13px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "7px",
                flexShrink: 0,
              }}
            >
              <Download size={14} /> Export CSV
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontFamily: F, fontSize: "14px", color: "#888" }}>Loading…</div>
          </div>
        ) : error ? (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "16px", padding: "24px", fontFamily: F, fontSize: "14px", color: "#EF4444" }}>
            {error}
          </div>
        ) : leads.length === 0 ? (
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Mail size={22} color="#AAAAAA" />
            </div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "16px", color: "#0A0A0A", marginBottom: "8px" }}>No leads yet</div>
            <p style={{ fontFamily: F, fontSize: "14px", color: "#888888", maxWidth: "340px", margin: "0 auto", lineHeight: 1.6 }}>
              When fans download a free preview of your beats, their email will appear here.
              Make sure your beats have a preview audio file uploaded.
            </p>
          </div>
        ) : (
          <>
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: "0", borderBottom: "1px solid #F2F2F2", padding: "12px 20px" }}>
                <span style={{ fontFamily: F, fontSize: "11px", fontWeight: 700, color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</span>
                <span style={{ fontFamily: F, fontSize: "11px", fontWeight: 700, color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.06em" }}>Beat</span>
                <span style={{ fontFamily: F, fontSize: "11px", fontWeight: 700, color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "center" }}>Consent</span>
                <span style={{ fontFamily: F, fontSize: "11px", fontWeight: 700, color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "right" }}>Date</span>
              </div>
              {leads.map((lead, i) => (
                <div
                  key={lead.id}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: "0",
                    padding: "14px 20px", alignItems: "center",
                    borderBottom: i < leads.length - 1 ? "1px solid #F9F9F9" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontFamily: F, fontSize: "13px", color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "16px" }}>
                    {lead.email}
                  </span>
                  <span style={{ fontFamily: F, fontSize: "13px", color: "#444444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "16px" }}>
                    {lead.beatTitle}
                  </span>
                  <span style={{ display: "flex", justifyContent: "center", paddingRight: "20px" }}>
                    <span style={{
                      fontFamily: F, fontSize: "11px", fontWeight: 600,
                      color: lead.consentGiven ? "#16A34A" : "#EF4444",
                      background: lead.consentGiven ? "#F0FDF4" : "#FEF2F2",
                      padding: "2px 8px", borderRadius: "9999px",
                    }}>
                      {lead.consentGiven ? "Yes" : "No"}
                    </span>
                  </span>
                  <span style={{ fontFamily: F, fontSize: "12px", color: "#888888", textAlign: "right", whiteSpace: "nowrap" }}>
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ background: "#F9F9F9", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "14px 18px" }}>
              <p style={{ fontFamily: F, fontSize: "12px", color: "#888888", margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: "#444" }}>GDPR notice:</strong> All leads have given explicit consent to be contacted by you and Beatpack.
                You may use these emails for music-related marketing. Always include an unsubscribe option in your communications.
                Data is stored securely and never sold to third parties.
              </p>
            </div>
          </>
        )}
      </div>
    </StudioLayout>
  );
}
