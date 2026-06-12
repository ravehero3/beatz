import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { ordersTable, beatsTable, artistsTable, profilesTable, withdrawalsTable } from "@workspace/db";
import { requireRole } from "../lib/auth";
import { eq, and, gte, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/stats", requireRole("artist", "admin"), async (req, res) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [artist] = await db
    .select({ balanceCzk: artistsTable.balanceCzk, totalEarnedCzk: artistsTable.totalEarnedCzk })
    .from(artistsTable)
    .where(eq(artistsTable.id, req.user!.userId));

  const [monthlyStats] = await db
    .select({
      earnings: sql<number>`coalesce(sum(${ordersTable.amountCzk}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(ordersTable)
    .where(and(
      eq(ordersTable.artistId, req.user!.userId),
      eq(ordersTable.paymentStatus, "paid"),
      gte(ordersTable.createdAt, startOfMonth),
    ));

  const [beatStats] = await db
    .select({
      total: sql<number>`count(*)`,
      plays: sql<number>`coalesce(sum(${beatsTable.plays}), 0)`,
    })
    .from(beatsTable)
    .where(and(eq(beatsTable.artistId, req.user!.userId), eq(beatsTable.status, "active")));

  res.json({
    pendingBalance: Number(artist?.balanceCzk ?? 0),
    totalEarned: Number(artist?.totalEarnedCzk ?? 0),
    earningsThisMonth: Number(monthlyStats?.earnings ?? 0),
    ordersThisMonth: Number(monthlyStats?.count ?? 0),
    activeBeats: Number(beatStats?.total ?? 0),
    totalPlays: Number(beatStats?.plays ?? 0),
  });
});

router.get("/dashboard/earnings-chart", requireRole("artist", "admin"), async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const rows = await db
    .select({
      date: sql<string>`date(${ordersTable.createdAt})`,
      earnings: sql<number>`coalesce(sum(${ordersTable.amountCzk}), 0)`,
    })
    .from(ordersTable)
    .where(and(
      eq(ordersTable.artistId, req.user!.userId),
      eq(ordersTable.paymentStatus, "paid"),
      gte(ordersTable.createdAt, thirtyDaysAgo),
    ))
    .groupBy(sql`date(${ordersTable.createdAt})`)
    .orderBy(sql`date(${ordersTable.createdAt})`);

  const dateMap = new Map(rows.map((r) => [r.date, Number(r.earnings)]));
  const result = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, earnings: dateMap.get(key) ?? 0 });
  }

  res.json(result);
});

router.get("/admin/stats", requireRole("admin"), async (_req, res) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(profilesTable);
  const [artistCount] = await db.select({ count: sql<number>`count(*)` }).from(artistsTable);
  const [beatCount] = await db.select({ count: sql<number>`count(*)` }).from(beatsTable).where(eq(beatsTable.status, "active"));

  const [revenue] = await db
    .select({ total: sql<number>`coalesce(sum(${ordersTable.amountCzk}), 0)` })
    .from(ordersTable)
    .where(and(
      eq(ordersTable.paymentStatus, "paid"),
      gte(ordersTable.createdAt, startOfMonth),
    ));

  const [pendingPayouts] = await db
    .select({ count: sql<number>`count(*)` })
    .from(withdrawalsTable)
    .where(eq(withdrawalsTable.status, "pending"));

  res.json({
    totalUsers: Number(userCount?.count ?? 0),
    totalArtists: Number(artistCount?.count ?? 0),
    totalBeats: Number(beatCount?.count ?? 0),
    revenueThisMonth: Number(revenue?.total ?? 0),
    pendingPayouts: Number(pendingPayouts?.count ?? 0),
  });
});

router.get("/admin/users", requireRole("admin"), async (_req, res) => {
  const users = await db.select().from(profilesTable).orderBy(sql`${profilesTable.createdAt} desc`);
  res.json(users.map((u) => ({
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt.toISOString(),
  })));
});

router.patch("/admin/users/:id/role", requireRole("admin"), async (req, res) => {
  const id = req.params["id"] as string;
  const { role } = req.body as { role: string };

  if (!["buyer", "artist", "admin"].includes(role)) {
    res.status(400).json({ error: "Invalid role" });
    return;
  }

  const [updated] = await db
    .update(profilesTable)
    .set({ role })
    .where(eq(profilesTable.id, id))
    .returning({ id: profilesTable.id, role: profilesTable.role });

  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ id: updated.id, role: updated.role });
});

router.get("/admin/emails/export", requireRole("admin"), async (_req, res) => {
  const users = await db
    .select({
      email: profilesTable.email,
      firstName: profilesTable.firstName,
      lastName: profilesTable.lastName,
      role: profilesTable.role,
      createdAt: profilesTable.createdAt,
    })
    .from(profilesTable)
    .where(eq(profilesTable.marketingOptIn, true))
    .orderBy(profilesTable.createdAt);

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = "email,first_name,last_name,role,joined_at";
  const rows = users
    .filter((u) => u.email)
    .map((u) => [
      escape(u.email ?? ""),
      escape(u.firstName ?? ""),
      escape(u.lastName ?? ""),
      escape(u.role),
      escape(u.createdAt.toISOString()),
    ].join(","));

  const csv = [header, ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="beatpack-emails.csv"');
  res.send(csv);
});

export default router;
