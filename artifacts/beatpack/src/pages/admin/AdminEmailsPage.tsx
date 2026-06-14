import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Mail, Eye } from "lucide-react";

const APP_URL = window.location.origin;
const LOGO_URL = `${APP_URL}/assets/beatpack_logo_1_1781012889607-Boq4MnU-.png`;

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F9F9F9;font-family:'Figtree',Arial,sans-serif">
  <div style="padding:40px 0">
    <div style="max-width:480px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E5E5;border-radius:16px;overflow:hidden">
      <div style="padding:28px 32px;border-bottom:1px solid #F2F2F2;background:#FFFFFF">
        <img src="${LOGO_URL}" alt="beatpack" style="height:20px" />
      </div>
      <div style="padding:32px">
        ${content}
      </div>
      <div style="padding:20px 32px;border-top:1px solid #F2F2F2;background:#F9F9F9">
        <p style="font-size:12px;color:#AAAAAA;margin:0">© ${new Date().getFullYear()} Beatpack · <a href="${APP_URL}" style="color:#AAAAAA">beatpack.cz</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const TEMPLATES = [
  {
    id: "password-reset",
    label: "Password Reset",
    description: "Sent when a user requests a password reset link.",
    html: emailWrapper(`
      <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin:0 0 8px;color:#0A0A0A">Reset your password</h1>
      <p style="font-size:14px;color:#666;margin:0 0 32px;line-height:1.65">
        We received a request to reset the password for your Beatpack account.
        Click the button below to choose a new password. This link expires in 1 hour.
      </p>
      <a href="#" style="display:inline-block;background:#0A0A0A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9999px;font-size:14px;font-weight:600">
        Reset password
      </a>
      <p style="font-size:12px;color:#999;margin:32px 0 0">
        If you didn't request this, you can safely ignore this email. Your password won't change until you click the link above.
      </p>
    `),
  },
  {
    id: "order-confirmation",
    label: "Payment Confirmed",
    description: "Sent to the buyer when an artist or admin confirms payment receipt.",
    html: emailWrapper(`
      <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin:0 0 8px;color:#0A0A0A">Payment confirmed! 🎉</h1>
      <p style="font-size:14px;color:#666;margin:0 0 28px;line-height:1.65">
        Hi Jana, your payment for <strong style="color:#0A0A0A">Dark Trap Vol.3</strong> has been confirmed.
        Your beat is now ready to download.
      </p>
      <div style="background:#F9F9F9;border:1px solid #E5E5E5;border-radius:12px;padding:20px;margin-bottom:28px">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="font-size:13px;color:#888">Beat</span>
          <span style="font-size:13px;font-weight:600;color:#0A0A0A">Dark Trap Vol.3</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;border-top:1px solid #E5E5E5;padding-top:12px">
          <span style="font-size:13px;color:#888">License</span>
          <span style="font-size:13px;font-weight:600;color:#0A0A0A">Premium</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid #E5E5E5;padding-top:12px">
          <span style="font-size:13px;color:#888">Amount paid</span>
          <span style="font-size:14px;font-weight:700;color:#0A0A0A">899 Kč</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid #E5E5E5;padding-top:12px;margin-top:12px">
          <span style="font-size:13px;color:#888">Order ref.</span>
          <span style="font-size:13px;color:#0A0A0A;font-family:monospace">48291037</span>
        </div>
      </div>
      <a href="#" style="display:inline-block;background:#0A0A0A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9999px;font-size:14px;font-weight:600">
        Download your beat →
      </a>
      <p style="font-size:12px;color:#999;margin:24px 0 0">
        You can always find your purchases in your account at <a href="${APP_URL}/account/purchases" style="color:#666">${APP_URL}/account/purchases</a>.
      </p>
    `),
  },
  {
    id: "beat-delivery",
    label: "Beat Delivery",
    description: "Sent to the buyer alongside payment confirmation, containing direct download links.",
    html: emailWrapper(`
      <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin:0 0 8px;color:#0A0A0A">Your beat is ready! 🎵</h1>
      <p style="font-size:14px;color:#666;margin:0 0 28px;line-height:1.65">
        Hi Jana, here are your download links for <strong style="color:#0A0A0A">Dark Trap Vol.3</strong> (Premium License).
      </p>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px">
        <a href="#" style="display:flex;align-items:center;justify-content:space-between;background:#0A0A0A;color:#fff;text-decoration:none;padding:14px 20px;border-radius:12px">
          <div>
            <div style="font-size:14px;font-weight:600">Download MP3</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:2px">Dark Trap Vol.3</div>
          </div>
          <span style="font-size:18px">↓</span>
        </a>
        <a href="#" style="display:flex;align-items:center;justify-content:space-between;background:#FFFFFF;color:#0A0A0A;text-decoration:none;padding:14px 20px;border-radius:12px;border:1px solid #E5E5E5">
          <div>
            <div style="font-size:14px;font-weight:600">Download WAV</div>
            <div style="font-size:12px;color:#888;margin-top:2px">High quality · Dark Trap Vol.3</div>
          </div>
          <span style="font-size:18px">↓</span>
        </a>
      </div>
      <p style="font-size:12px;color:#999;margin:0">
        Links expire after a while. You can always re-download from your <a href="${APP_URL}/account/purchases" style="color:#666">purchases page</a>.
      </p>
    `),
  },
];

export default function AdminEmailsPage() {
  const [active, setActive] = useState(TEMPLATES[0].id);
  const template = TEMPLATES.find((t) => t.id === active) ?? TEMPLATES[0];

  return (
    <AdminLayout>
      <div style={{ padding: "32px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700, fontSize: "22px", color: "#0A0A0A", letterSpacing: "-0.02em", marginBottom: "4px" }}>Email Previews</h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "14px", color: "#888888" }}>Preview the automated emails sent to customers.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", alignItems: "start" }}>
          {/* Sidebar — template list */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" }}>
            {TEMPLATES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  width: "100%",
                  padding: "16px 18px",
                  background: active === t.id ? "#F9F9F9" : "#FFFFFF",
                  border: "none",
                  borderBottom: i < TEMPLATES.length - 1 ? "1px solid #F2F2F2" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                }}
              >
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                  background: active === t.id ? "#0A0A0A" : "#F2F2F2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: active === t.id ? "#FFFFFF" : "#666666",
                  transition: "all 0.15s ease",
                }}>
                  <Mail size={15} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600, fontSize: "13px", color: "#0A0A0A", marginBottom: "3px" }}>{t.label}</div>
                  <div style={{ fontFamily: "'Figtree', sans-serif", fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>{t.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Preview pane */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Eye size={14} color="#888888" />
              <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "13px", color: "#888888" }}>
                Preview — <strong style={{ color: "#0A0A0A" }}>{template.label}</strong>
              </span>
            </div>
            <div style={{ border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF" }}>
              <iframe
                key={template.id}
                srcDoc={template.html}
                title={template.label}
                style={{ width: "100%", border: "none", display: "block" }}
                height={600}
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
