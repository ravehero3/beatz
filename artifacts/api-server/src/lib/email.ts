import nodemailer from "nodemailer";

const SMTP_HOST = process.env["SMTP_HOST"];
const SMTP_PORT = Number(process.env["SMTP_PORT"] ?? "587");
const SMTP_USER = process.env["SMTP_USER"];
const SMTP_PASS = process.env["SMTP_PASS"];
const SMTP_FROM = process.env["SMTP_FROM"] ?? "noreply@beatpack.cz";
const APP_URL = (process.env["APP_URL"] ?? "http://localhost:5000").replace(/\/$/, "");

function isConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

function createTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  if (!isConfigured()) {
    console.warn(`[email] SMTP not configured — reset link for ${email}: ${resetUrl}`);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: `"Beatpack" <${SMTP_FROM}>`,
    to: email,
    subject: "Reset your Beatpack password",
    html: `
      <div style="font-family:'Figtree',Arial,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#0A0A0A">
        <img src="${APP_URL}/assets/beatpack_logo_1_1781012889607-Boq4MnU-.png" alt="beatpack" style="height:22px;margin-bottom:32px" />
        <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin-bottom:8px">Reset your password</h1>
        <p style="font-size:14px;color:#666;margin-bottom:32px">
          We received a request to reset the password for your Beatpack account.
          Click the button below to choose a new password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#0A0A0A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9999px;font-size:14px;font-weight:500">
          Reset password
        </a>
        <p style="font-size:12px;color:#999;margin-top:32px">
          If you didn't request this, you can safely ignore this email.
          Your password won't change until you click the link above.
        </p>
      </div>
    `,
    text: `Reset your Beatpack password\n\nOpen this link to set a new password (expires in 1 hour):\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
  });
}
