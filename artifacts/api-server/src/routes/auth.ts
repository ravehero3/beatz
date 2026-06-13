import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { db } from "../lib/db";
import { profilesTable, artistsTable } from "@workspace/db";
import { signToken, requireAuth } from "../lib/auth";
import { LoginUserBody, RegisterUserBody } from "@workspace/api-zod";
import { eq, or } from "drizzle-orm";
import { sendPasswordResetEmail } from "../lib/email";
import { Pool } from "pg";

const router: IRouter = Router();

const JWT_SECRET = process.env["SESSION_SECRET"] ?? "beatpack-dev-secret-change-in-prod";
const APP_URL = (process.env["APP_URL"] ?? "http://localhost:18143").replace(/\/$/, "");
const GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"] ?? "";
const GOOGLE_CLIENT_SECRET = process.env["GOOGLE_CLIENT_SECRET"] ?? "";
const GOOGLE_REDIRECT_URI = `${APP_URL}/api/auth/google/callback`;

function makeOAuthState(): string {
  return jwt.sign({ nonce: crypto.randomUUID() }, JWT_SECRET, { expiresIn: "10m" });
}

function verifyOAuthState(state: string): boolean {
  try {
    jwt.verify(state, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

router.get("/auth/config", (_req, res) => {
  res.json({ googleEnabled: Boolean(GOOGLE_CLIENT_ID) });
});

router.get("/auth/google", (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    res.status(503).json({ error: "Google Sign-In is not configured" });
    return;
  }
  const state = makeOAuthState();
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get("/auth/google/callback", async (req, res) => {
  const { code, state, error } = req.query as Record<string, string>;

  if (error || !code || !state || !verifyOAuthState(state)) {
    res.redirect(`${APP_URL}/login?error=google_failed`);
    return;
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json() as Record<string, unknown>;

    if (!tokenRes.ok || !tokenData["access_token"]) {
      req.log.error({ tokenData }, "Google token exchange failed");
      res.redirect(`${APP_URL}/login?error=google_failed`);
      return;
    }

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData["access_token"]}` },
    });
    const googleUser = await userInfoRes.json() as {
      id: string;
      email: string;
      given_name?: string;
      family_name?: string;
      picture?: string;
    };

    if (!googleUser.id || !googleUser.email) {
      res.redirect(`${APP_URL}/login?error=google_failed`);
      return;
    }

    let user = await db.query.profilesTable.findFirst({
      where: or(
        eq(profilesTable.googleId, googleUser.id),
        eq(profilesTable.email, googleUser.email),
      ),
    });

    let isNewUser = false;

    if (user) {
      if (!user.googleId) {
        await db.update(profilesTable)
          .set({
            googleId: googleUser.id,
            ...(googleUser.picture && !user.avatarUrl ? { avatarUrl: googleUser.picture } : {}),
          })
          .where(eq(profilesTable.id, user.id));
      }
    } else {
      const [created] = await db.insert(profilesTable).values({
        email: googleUser.email,
        firstName: googleUser.given_name ?? null,
        lastName: googleUser.family_name ?? null,
        avatarUrl: googleUser.picture ?? null,
        googleId: googleUser.id,
        role: "buyer",
      }).returning();
      user = created;
      isNewUser = true;
    }

    if (!user) {
      res.redirect(`${APP_URL}/login?error=google_failed`);
      return;
    }

    const token = signToken({ userId: user.id, role: user.role });
    req.log.info({ userId: user.id, isNewUser }, "User signed in with Google");

    const params = new URLSearchParams({ token, ...(isNewUser ? { new: "1" } : {}) });
    res.redirect(`${APP_URL}/auth/google/callback?${params}`);
  } catch (err) {
    req.log.error({ err }, "Google OAuth error");
    res.redirect(`${APP_URL}/login?error=google_failed`);
  }
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "artist";
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let n = 2;
  while (true) {
    const existing = await db.query.artistsTable.findFirst({ where: eq(artistsTable.slug, candidate) });
    if (!existing) return candidate;
    candidate = `${base}-${n++}`;
  }
}

router.post("/auth/become-artist", requireAuth, async (req, res) => {
  const userId = req.user!.userId;

  const profile = await db.query.profilesTable.findFirst({ where: eq(profilesTable.id, userId) });
  if (!profile) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (profile.role === "artist" || profile.role === "admin") {
    res.status(409).json({ error: "Already an artist" });
    return;
  }

  const { displayName } = req.body;
  if (!displayName || typeof displayName !== "string" || !displayName.trim()) {
    res.status(400).json({ error: "Artist name is required" });
    return;
  }

  const slug = await uniqueSlug(slugify(displayName.trim()));

  await db.insert(artistsTable).values({ id: userId, displayName: displayName.trim(), slug });
  const [updated] = await db.update(profilesTable)
    .set({ role: "artist" })
    .where(eq(profilesTable.id, userId))
    .returning();

  const token = signToken({ userId, role: "artist" });
  req.log.info({ userId }, "User became artist");
  res.json({
    token,
    user: {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      role: updated.role,
      avatarUrl: updated.avatarUrl,
      createdAt: updated.createdAt,
    },
  });
});

router.post("/auth/register", async (req, res) => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  const { email, password, firstName, lastName } = parsed.data;

  const existing = await db.query.profilesTable.findFirst({ where: eq(profilesTable.email, email) });
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(profilesTable).values({
    email,
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    role: "buyer",
    passwordHash,
  }).returning();

  if (!user) {
    res.status(500).json({ error: "Failed to create user" });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role });
  req.log.info({ userId: user.id }, "User registered");
  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
  });
});

router.post("/auth/login", async (req, res) => {
  const parsed = LoginUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password } = parsed.data;

  const user = await db.query.profilesTable.findFirst({ where: eq(profilesTable.email, email) });
  if (!user || !user.passwordHash) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role });
  req.log.info({ userId: user.id }, "User logged in");
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
  });
});

router.post("/auth/logout", (_req, res) => {
  res.json({ message: "Logged out" });
});

router.get("/users/me", requireAuth, async (req, res) => {
  const user = await db.query.profilesTable.findFirst({
    where: eq(profilesTable.id, req.user!.userId),
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  });
});

router.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email required" });
    return;
  }
  const normalised = email.toLowerCase().trim();
  const user = await db.query.profilesTable.findFirst({ where: eq(profilesTable.email, normalised) });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const DATABASE_URL = process.env["DATABASE_URL"];
    if (DATABASE_URL) {
      const pool = new Pool({ connectionString: DATABASE_URL });
      try {
        await pool.query(
          `INSERT INTO password_reset_tokens (profile_id, token, expires_at) VALUES ($1, $2, $3)`,
          [user.id, token, expiresAt],
        );
      } finally {
        await pool.end();
      }
    }
    try {
      await sendPasswordResetEmail(normalised, token);
    } catch (err) {
      req.log.error({ err }, "Failed to send password reset email");
    }
  }

  req.log.info({ email: normalised, found: !!user }, "Forgot password request");
  res.json({ message: "If an account exists for this email, a reset link has been sent." });
});

router.post("/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || typeof token !== "string" || !password || typeof password !== "string") {
    res.status(400).json({ error: "Token and password are required." });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }

  const DATABASE_URL = process.env["DATABASE_URL"];
  if (!DATABASE_URL) {
    res.status(503).json({ error: "Database not configured." });
    return;
  }

  const pool = new Pool({ connectionString: DATABASE_URL });
  try {
    const result = await pool.query(
      `SELECT id, profile_id, expires_at, used_at FROM password_reset_tokens WHERE token = $1 LIMIT 1`,
      [token],
    );
    if (result.rows.length === 0) {
      res.status(400).json({ error: "Invalid or expired reset link." });
      return;
    }
    const row = result.rows[0];
    if (row.used_at) {
      res.status(400).json({ error: "This reset link has already been used." });
      return;
    }
    if (new Date(row.expires_at) < new Date()) {
      res.status(400).json({ error: "This reset link has expired. Please request a new one." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await pool.query(`UPDATE profiles SET password_hash = $1 WHERE id = $2`, [passwordHash, row.profile_id]);
    await pool.query(`UPDATE password_reset_tokens SET used_at = now() WHERE id = $1`, [row.id]);

    res.json({ message: "Password updated successfully." });
  } finally {
    await pool.end();
  }
});

router.patch("/users/me", requireAuth, async (req, res) => {
  const { firstName, lastName, avatarUrl } = req.body;
  const [updated] = await db.update(profilesTable)
    .set({ firstName, lastName, avatarUrl })
    .where(eq(profilesTable.id, req.user!.userId))
    .returning();
  res.json({
    id: updated.id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    role: updated.role,
    avatarUrl: updated.avatarUrl,
    createdAt: updated.createdAt,
  });
});

export default router;
