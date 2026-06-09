import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import { profilesTable } from "@workspace/db";
import { signToken, requireAuth } from "../lib/auth";
import { LoginUserBody, RegisterUserBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

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
