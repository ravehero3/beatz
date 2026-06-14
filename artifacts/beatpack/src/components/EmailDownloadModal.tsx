import { useState } from "react";
import { Download, X } from "lucide-react";

const F = "'Figtree', sans-serif";

interface Props {
  beatId: string;
  beatTitle: string;
  artistName?: string | null;
  open: boolean;
  onClose: () => void;
}

export default function EmailDownloadModal({ beatId, beatTitle, artistName, open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/beats/${beatId}/request-download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consentGiven: consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
      const a = document.createElement("a");
      a.href = data.downloadUrl;
      a.download = `${beatTitle}.mp3`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setEmail("");
    setConsent(false);
    setError(null);
    setDone(false);
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "#FFFFFF", borderRadius: "20px",
          padding: "32px", maxWidth: "420px", width: "100%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: "20px", right: "20px",
            background: "#F5F5F5", border: "none", cursor: "pointer",
            width: "28px", height: "28px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#666",
          }}
        >
          <X size={14} />
        </button>

        {done ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: "44px", marginBottom: "16px" }}>🎵</div>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: "20px", color: "#0A0A0A", marginBottom: "8px", letterSpacing: "-0.02em" }}>
              Download starting!
            </div>
            <p style={{ fontFamily: F, fontSize: "14px", color: "#888", marginBottom: "28px", lineHeight: 1.65 }}>
              Enjoy <strong style={{ color: "#0A0A0A" }}>{beatTitle}</strong>. This is a tagged preview — purchase a license for the full, untagged file.
            </p>
            <button
              onClick={handleClose}
              style={{
                height: "44px", padding: "0 32px", borderRadius: "9999px",
                background: "#0A0A0A", color: "#FFFFFF", border: "none",
                fontFamily: F, fontWeight: 600, fontSize: "14px", cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px",
                  background: "#F2F2F2", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Download size={18} color="#0A0A0A" />
                </div>
                <div>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: "18px", color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                    Free preview download
                  </div>
                  <div style={{ fontFamily: F, fontSize: "13px", color: "#888888" }}>
                    {beatTitle}{artistName ? ` · ${artistName}` : ""}
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: F, fontSize: "13px", color: "#666", lineHeight: 1.65, margin: 0 }}>
                Enter your email to get the tagged preview MP3. No account needed.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontFamily: F, fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "6px" }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: "100%", height: "44px", padding: "0 14px",
                    border: "1.5px solid #E5E5E5", borderRadius: "12px",
                    fontFamily: F, fontSize: "14px", outline: "none",
                    boxSizing: "border-box", transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0A0A0A")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
                />
              </div>

              {error && (
                <div style={{ fontFamily: F, fontSize: "13px", color: "#EF4444", marginBottom: "12px", padding: "10px 12px", background: "#FEF2F2", borderRadius: "8px" }}>
                  {error}
                </div>
              )}

              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "20px" }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  style={{ marginTop: "3px", flexShrink: 0, accentColor: "#0A0A0A", width: "15px", height: "15px" }}
                />
                <span style={{ fontFamily: F, fontSize: "12px", color: "#555", lineHeight: 1.6 }}>
                  I agree that <strong>Beatpack</strong>{artistName ? <> and <strong>{artistName}</strong></> : ""} may contact
                  me with music and promotional content. I can unsubscribe at any time. By downloading I acknowledge this is
                  a tagged preview for evaluation only, and full commercial use requires a purchased license.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !consent || !email}
                style={{
                  width: "100%", height: "46px", borderRadius: "9999px",
                  background: loading || !consent || !email ? "#F0F0F0" : "#0A0A0A",
                  color: loading || !consent || !email ? "#AAAAAA" : "#FFFFFF",
                  border: "none", fontFamily: F, fontWeight: 600, fontSize: "14px",
                  cursor: loading || !consent || !email ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {loading ? (
                  "Getting your download…"
                ) : (
                  <><Download size={15} /> Download free preview</>
                )}
              </button>

              <p style={{ fontFamily: F, fontSize: "11px", color: "#AAAAAA", textAlign: "center", marginTop: "14px", marginBottom: 0, lineHeight: 1.5 }}>
                Your data is stored securely and never sold to third parties.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
