import nodemailer from "nodemailer";

const SMTP_HOST = process.env["SMTP_HOST"];
const SMTP_PORT = Number(process.env["SMTP_PORT"] ?? "587");
const SMTP_USER = process.env["SMTP_USER"];
const SMTP_PASS = process.env["SMTP_PASS"];
const SMTP_FROM = process.env["SMTP_FROM"] ?? "noreply@beatpack.cz";
const APP_URL = (process.env["APP_URL"] ?? "http://localhost:5000").replace(/\/$/, "");

export function getAppUrl(): string {
  return APP_URL;
}

export function isConfigured(): boolean {
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

const logoUrl = `${APP_URL}/assets/beatpack_logo_1_1781012889607-Boq4MnU-.png`;

function emailWrapper(content: string): string {
  return `
    <div style="background:#F9F9F9;padding:40px 0;font-family:'Figtree',Arial,sans-serif">
      <div style="max-width:480px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E5E5;border-radius:16px;overflow:hidden">
        <div style="padding:28px 32px;border-bottom:1px solid #F2F2F2;background:#FFFFFF">
          <img src="${logoUrl}" alt="beatpack" style="height:20px" />
        </div>
        <div style="padding:32px">
          ${content}
        </div>
        <div style="padding:20px 32px;border-top:1px solid #F2F2F2;background:#F9F9F9">
          <p style="font-size:12px;color:#AAAAAA;margin:0">
            © ${new Date().getFullYear()} Beatpack · <a href="${APP_URL}" style="color:#AAAAAA">beatpack.cz</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function buildPasswordResetHtml(resetUrl: string): string {
  return emailWrapper(`
    <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin:0 0 8px">Reset your password</h1>
    <p style="font-size:14px;color:#666;margin:0 0 32px;line-height:1.65">
      We received a request to reset the password for your Beatpack account.
      Click the button below to choose a new password. This link expires in 1 hour.
    </p>
    <a href="${resetUrl}" style="display:inline-block;background:#0A0A0A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9999px;font-size:14px;font-weight:600">
      Reset password
    </a>
    <p style="font-size:12px;color:#999;margin:32px 0 0">
      If you didn't request this, you can safely ignore this email.
      Your password won't change until you click the link above.
    </p>
  `);
}

export function buildOrderConfirmationHtml(params: {
  buyerName: string;
  beatTitle: string;
  licenseType: string;
  amountCzk: number;
  variableSymbol: string | null;
  orderId: string;
  licensePdfUrl?: string;
}): string {
  const { buyerName, beatTitle, licenseType, amountCzk, variableSymbol, orderId, licensePdfUrl } = params;
  const purchasesUrl = `${APP_URL}/account/purchases`;
  const licenseLabel = licenseType.charAt(0).toUpperCase() + licenseType.slice(1);

  return emailWrapper(`
    <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin:0 0 8px">Payment confirmed! 🎉</h1>
    <p style="font-size:14px;color:#666;margin:0 0 28px;line-height:1.65">
      Hi ${buyerName}, your payment for <strong style="color:#0A0A0A">${beatTitle}</strong> has been confirmed.
      Your beat is now ready to download.
    </p>

    <div style="background:#F9F9F9;border:1px solid #E5E5E5;border-radius:12px;padding:20px;margin-bottom:28px">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:13px;color:#888">Beat</span>
        <span style="font-size:13px;font-weight:600;color:#0A0A0A">${beatTitle}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;border-top:1px solid #E5E5E5;padding-top:12px">
        <span style="font-size:13px;color:#888">License</span>
        <span style="font-size:13px;font-weight:600;color:#0A0A0A">${licenseLabel}</span>
      </div>
      <div style="display:flex;justify-content:space-between;border-top:1px solid #E5E5E5;padding-top:12px">
        <span style="font-size:13px;color:#888">Amount paid</span>
        <span style="font-size:14px;font-weight:700;color:#0A0A0A">${amountCzk.toLocaleString("cs-CZ")} Kč</span>
      </div>
      ${variableSymbol ? `
      <div style="display:flex;justify-content:space-between;border-top:1px solid #E5E5E5;padding-top:12px;margin-top:12px">
        <span style="font-size:13px;color:#888">Order ref.</span>
        <span style="font-size:13px;color:#0A0A0A;font-family:monospace">${variableSymbol}</span>
      </div>` : ""}
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <a href="${purchasesUrl}" style="display:inline-block;background:#0A0A0A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9999px;font-size:14px;font-weight:600">
        Download your beat →
      </a>
      ${licensePdfUrl ? `<a href="${APP_URL}${licensePdfUrl}" style="display:inline-block;background:#F2F2F2;color:#0A0A0A;text-decoration:none;padding:12px 20px;border-radius:9999px;font-size:14px;font-weight:600">License PDF</a>` : ""}
    </div>
    <p style="font-size:12px;color:#999;margin:24px 0 0">
      You can always find your purchases in your account at
      <a href="${purchasesUrl}" style="color:#666">${purchasesUrl}</a>.
    </p>
  `);
}

export function buildBeatDeliveryHtml(params: {
  buyerName: string;
  beatTitle: string;
  licenseType: string;
  audioFullUrl: string | null;
  audioWavUrl: string | null;
}): string {
  const { buyerName, beatTitle, licenseType, audioFullUrl, audioWavUrl } = params;
  const purchasesUrl = `${APP_URL}/account/purchases`;
  const licenseLabel = licenseType.charAt(0).toUpperCase() + licenseType.slice(1);
  const hasWav = audioWavUrl && (licenseType === "premium" || licenseType === "exclusive");

  return emailWrapper(`
    <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin:0 0 8px">Your beat is ready! 🎵</h1>
    <p style="font-size:14px;color:#666;margin:0 0 28px;line-height:1.65">
      Hi ${buyerName}, here are your download links for <strong style="color:#0A0A0A">${beatTitle}</strong>
      (${licenseLabel} License).
    </p>

    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px">
      ${audioFullUrl ? `
      <a href="${audioFullUrl}" style="display:flex;align-items:center;justify-content:space-between;background:#0A0A0A;color:#fff;text-decoration:none;padding:14px 20px;border-radius:12px">
        <div>
          <div style="font-size:14px;font-weight:600">Download MP3</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:2px">${beatTitle}</div>
        </div>
        <span style="font-size:18px">↓</span>
      </a>` : ""}
      ${hasWav ? `
      <a href="${audioWavUrl}" style="display:flex;align-items:center;justify-content:space-between;background:#FFFFFF;color:#0A0A0A;text-decoration:none;padding:14px 20px;border-radius:12px;border:1px solid #E5E5E5">
        <div>
          <div style="font-size:14px;font-weight:600">Download WAV</div>
          <div style="font-size:12px;color:#888;margin-top:2px">High quality · ${beatTitle}</div>
        </div>
        <span style="font-size:18px">↓</span>
      </a>` : ""}
    </div>

    <p style="font-size:12px;color:#999;margin:0">
      Links expire after a while. You can always re-download from your
      <a href="${purchasesUrl}" style="color:#666">purchases page</a>.
    </p>
  `);
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
    html: buildPasswordResetHtml(resetUrl),
    text: `Reset your Beatpack password\n\nOpen this link to set a new password (expires in 1 hour):\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
  });
}

export async function sendOrderConfirmationEmail(params: {
  email: string;
  buyerName: string;
  beatTitle: string;
  licenseType: string;
  amountCzk: number;
  variableSymbol: string | null;
  orderId: string;
  licensePdfUrl?: string;
}): Promise<void> {
  if (!isConfigured()) {
    console.warn(`[email] SMTP not configured — order confirmation for ${params.email}, order ${params.orderId}`);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: `"Beatpack" <${SMTP_FROM}>`,
    to: params.email,
    subject: `Payment confirmed — ${params.beatTitle}`,
    html: buildOrderConfirmationHtml(params),
    text: `Payment confirmed!\n\nYour payment for "${params.beatTitle}" (${params.licenseType} license) of ${params.amountCzk} Kč has been confirmed.\n\nDownload your beat at: ${APP_URL}/account/purchases${params.licensePdfUrl ? `\nLicense PDF: ${APP_URL}${params.licensePdfUrl}` : ""}`,
  });
}

export async function sendBeatDeliveryEmail(params: {
  email: string;
  buyerName: string;
  beatTitle: string;
  licenseType: string;
  audioFullUrl: string | null;
  audioWavUrl: string | null;
}): Promise<void> {
  if (!isConfigured()) {
    console.warn(`[email] SMTP not configured — beat delivery for ${params.email}, beat "${params.beatTitle}"`);
    return;
  }

  const transport = createTransport();
  await transport.sendMail({
    from: `"Beatpack" <${SMTP_FROM}>`,
    to: params.email,
    subject: `Your beat is ready — ${params.beatTitle}`,
    html: buildBeatDeliveryHtml(params),
    text: `Your beat is ready!\n\nDownload "${params.beatTitle}" from your purchases page:\n${APP_URL}/account/purchases`,
  });
}
