import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { withdrawalsTable, artistsTable, profilesTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

function formatWithdrawal(w: typeof withdrawalsTable.$inferSelect & { artistName?: string | null }) {
  return {
    id: w.id,
    artistId: w.artistId,
    amountCzk: Number(w.amountCzk),
    status: w.status,
    qrCodeData: w.qrCodeData,
    requestedAt: w.requestedAt.toISOString(),
    paidAt: w.paidAt?.toISOString() ?? null,
    artistName: w.artistName ?? null,
  };
}

router.get("/withdrawals", requireAuth, async (req, res) => {
  if (req.user!.role === "admin") {
    const rows = await db
      .select({ w: withdrawalsTable, displayName: artistsTable.displayName })
      .from(withdrawalsTable)
      .leftJoin(artistsTable, eq(withdrawalsTable.artistId, artistsTable.id))
      .orderBy(sql`${withdrawalsTable.requestedAt} desc`);
    res.json(rows.map((r) => formatWithdrawal({ ...r.w, artistName: r.displayName })));
    return;
  }

  const rows = await db
    .select({ w: withdrawalsTable })
    .from(withdrawalsTable)
    .where(eq(withdrawalsTable.artistId, req.user!.userId))
    .orderBy(sql`${withdrawalsTable.requestedAt} desc`);
  res.json(rows.map((r) => formatWithdrawal(r.w)));
});

router.post("/withdrawals", requireRole("artist", "admin"), async (req, res) => {
  const { amountCzk } = req.body;
  if (!amountCzk || isNaN(Number(amountCzk)) || Number(amountCzk) <= 0) {
    res.status(400).json({ error: "Invalid amount" });
    return;
  }

  const artist = await db.query.artistsTable.findFirst({ where: eq(artistsTable.id, req.user!.userId) });
  if (!artist) {
    res.status(404).json({ error: "Artist profile not found" });
    return;
  }
  if (Number(artist.balanceCzk) < Number(amountCzk)) {
    res.status(400).json({ error: "Insufficient balance" });
    return;
  }

  await db.update(artistsTable)
    .set({ balanceCzk: sql`${artistsTable.balanceCzk} - ${amountCzk}` })
    .where(eq(artistsTable.id, req.user!.userId));

  const [w] = await db.insert(withdrawalsTable).values({
    artistId: req.user!.userId,
    amountCzk: String(amountCzk),
    status: "pending",
  }).returning();

  req.log.info({ withdrawalId: w.id }, "Withdrawal requested");
  res.status(201).json(formatWithdrawal(w));
});

router.patch("/withdrawals/:id/paid", requireRole("admin"), async (req, res) => {
  const [updated] = await db.update(withdrawalsTable).set({
    status: "paid",
    paidAt: new Date(),
  }).where(eq(withdrawalsTable.id, req.params["id"] as string)).returning();

  if (!updated) {
    res.status(404).json({ error: "Withdrawal not found" });
    return;
  }

  req.log.info({ withdrawalId: updated.id }, "Withdrawal marked paid");
  res.json(formatWithdrawal(updated));
});

export default router;
