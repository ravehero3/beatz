import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { savedBeatsTable, beatsTable, artistsTable } from "@workspace/db";
import { requireAuth } from "../lib/auth";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/saved", requireAuth, async (req, res) => {
  const rows = await db
    .select({
      beat: beatsTable,
      displayName: artistsTable.displayName,
      slug: artistsTable.slug,
    })
    .from(savedBeatsTable)
    .innerJoin(beatsTable, eq(savedBeatsTable.beatId, beatsTable.id))
    .leftJoin(artistsTable, eq(beatsTable.artistId, artistsTable.id))
    .where(eq(savedBeatsTable.buyerId, req.user!.userId));

  res.json(rows.map((r) => ({
    id: r.beat.id,
    artistId: r.beat.artistId,
    title: r.beat.title,
    bpm: r.beat.bpm,
    key: r.beat.key,
    genre: r.beat.genre,
    coverUrl: r.beat.coverUrl,
    priceBasic: r.beat.priceBasic !== null ? Number(r.beat.priceBasic) : null,
    isExclusiveSold: r.beat.isExclusiveSold,
    plays: r.beat.plays,
    status: r.beat.status,
    createdAt: r.beat.createdAt.toISOString(),
    artistName: r.displayName ?? null,
    artistSlug: r.slug ?? null,
  })));
});

router.post("/saved", requireAuth, async (req, res) => {
  const { beatId } = req.body;
  if (!beatId) {
    res.status(400).json({ error: "beatId is required" });
    return;
  }

  const existing = await db.query.savedBeatsTable.findFirst({
    where: and(eq(savedBeatsTable.buyerId, req.user!.userId), eq(savedBeatsTable.beatId, beatId)),
  });
  if (existing) {
    res.status(409).json({ error: "Already saved" });
    return;
  }

  await db.insert(savedBeatsTable).values({ buyerId: req.user!.userId, beatId });
  res.status(201).json({ message: "Beat saved" });
});

router.delete("/saved/:beatId", requireAuth, async (req, res) => {
  await db.delete(savedBeatsTable).where(
    and(
      eq(savedBeatsTable.buyerId, req.user!.userId),
      eq(savedBeatsTable.beatId, req.params["beatId"] as string)
    )
  );
  res.json({ message: "Beat unsaved" });
});

export default router;
