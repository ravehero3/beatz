import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { beatsTable, artistsTable, profilesTable } from "@workspace/db";
import { requireAuth, requireRole, optionalAuth } from "../lib/auth";
import { CreateBeatBody, ListBeatsQueryParams } from "@workspace/api-zod";
import { eq, and, gte, lte, ilike, or, sql } from "drizzle-orm";

const router: IRouter = Router();

function beatWithArtist(beat: typeof beatsTable.$inferSelect & { artistName?: string | null; artistSlug?: string | null }) {
  return {
    id: beat.id,
    artistId: beat.artistId,
    title: beat.title,
    slug: beat.slug,
    bpm: beat.bpm,
    key: beat.key,
    genre: beat.genre,
    mood: beat.mood,
    tags: beat.tags,
    coverUrl: beat.coverUrl,
    audioPreviewUrl: beat.audioPreviewUrl,
    priceBasic: beat.priceBasic !== null ? Number(beat.priceBasic) : null,
    pricePremium: beat.pricePremium !== null ? Number(beat.pricePremium) : null,
    priceExclusive: beat.priceExclusive !== null ? Number(beat.priceExclusive) : null,
    isExclusiveSold: beat.isExclusiveSold,
    plays: beat.plays,
    status: beat.status,
    createdAt: beat.createdAt.toISOString(),
    artistName: beat.artistName ?? null,
    artistSlug: beat.artistSlug ?? null,
  };
}

router.get("/beats/featured", async (_req, res) => {
  const rows = await db
    .select({
      beat: beatsTable,
      displayName: artistsTable.displayName,
      slug: artistsTable.slug,
    })
    .from(beatsTable)
    .leftJoin(artistsTable, eq(beatsTable.artistId, artistsTable.id))
    .where(eq(beatsTable.status, "active"))
    .orderBy(sql`${beatsTable.plays} DESC`)
    .limit(12);

  res.json(rows.map((r) => beatWithArtist({ ...r.beat, artistName: r.displayName, artistSlug: r.slug })));
});

router.get("/beats/genres", async (_req, res) => {
  const rows = await db
    .select({ genre: beatsTable.genre, count: sql<number>`count(*)` })
    .from(beatsTable)
    .where(and(eq(beatsTable.status, "active"), sql`${beatsTable.genre} is not null`))
    .groupBy(beatsTable.genre)
    .orderBy(sql`count(*) desc`);

  res.json(rows.filter((r) => r.genre).map((r) => ({ genre: r.genre as string, count: Number(r.count) })));
});

router.get("/beats/:id", async (req, res) => {
  const row = await db
    .select({
      beat: beatsTable,
      artist: artistsTable,
    })
    .from(beatsTable)
    .leftJoin(artistsTable, eq(beatsTable.artistId, artistsTable.id))
    .where(eq(beatsTable.id, req.params["id"] as string))
    .limit(1)
    .then((rows) => rows[0]);

  if (!row) {
    res.status(404).json({ error: "Beat not found" });
    return;
  }

  res.json({
    ...beatWithArtist({ ...row.beat, artistName: row.artist?.displayName, artistSlug: row.artist?.slug }),
    description: row.beat.description,
    audioFullUrl: row.beat.audioFullUrl,
    audioWavUrl: row.beat.audioWavUrl,
    artist: row.artist ? {
      id: row.artist.id,
      displayName: row.artist.displayName,
      slug: row.artist.slug,
      bio: row.artist.bio,
      profilePictureUrl: row.artist.profilePictureUrl,
      socialInstagram: row.artist.socialInstagram,
      socialYoutube: row.artist.socialYoutube,
      socialSoundcloud: row.artist.socialSoundcloud,
    } : null,
  });
});

router.post("/beats/:id/plays", async (req, res) => {
  await db.update(beatsTable)
    .set({ plays: sql`${beatsTable.plays} + 1` })
    .where(eq(beatsTable.id, req.params["id"] as string));
  res.json({ message: "Play recorded" });
});

router.get("/beats", async (req, res) => {
  const query = ListBeatsQueryParams.safeParse(req.query);
  const p = query.success ? query.data : {};

  const conditions = [eq(beatsTable.status, "active")];
  if (p.genre) conditions.push(eq(beatsTable.genre, p.genre));
  if (p.mood) conditions.push(eq(beatsTable.mood, p.mood));
  if (p.artistId) conditions.push(eq(beatsTable.artistId, p.artistId));
  if (p.bpmMin) conditions.push(gte(beatsTable.bpm, p.bpmMin));
  if (p.bpmMax) conditions.push(lte(beatsTable.bpm, p.bpmMax));
  if (p.search) {
    conditions.push(
      or(
        ilike(beatsTable.title, `%${p.search}%`),
        ilike(beatsTable.genre, `%${p.search}%`),
      )!
    );
  }

  const rows = await db
    .select({ beat: beatsTable, displayName: artistsTable.displayName, slug: artistsTable.slug })
    .from(beatsTable)
    .leftJoin(artistsTable, eq(beatsTable.artistId, artistsTable.id))
    .where(and(...conditions))
    .orderBy(sql`${beatsTable.plays} DESC`)
    .limit(p.limit ?? 48)
    .offset(p.offset ?? 0);

  res.json(rows.map((r) => beatWithArtist({ ...r.beat, artistName: r.displayName, artistSlug: r.slug })));
});

router.post("/beats", requireRole("artist", "admin"), async (req, res) => {
  const parsed = CreateBeatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  const d = parsed.data;
  const [beat] = await db.insert(beatsTable).values({
    artistId: req.user!.userId,
    title: d.title,
    description: d.description ?? null,
    bpm: d.bpm ?? null,
    key: d.key ?? null,
    genre: d.genre ?? null,
    mood: d.mood ?? null,
    tags: d.tags ?? [],
    coverUrl: d.coverUrl ?? null,
    audioPreviewUrl: d.audioPreviewUrl ?? null,
    audioFullUrl: d.audioFullUrl ?? null,
    priceBasic: d.priceBasic ? String(d.priceBasic) : null,
    pricePremium: d.pricePremium ? String(d.pricePremium) : null,
    priceExclusive: d.priceExclusive ? String(d.priceExclusive) : null,
    status: "active",
  }).returning();

  if (!beat) {
    res.status(500).json({ error: "Failed to create beat" });
    return;
  }

  req.log.info({ beatId: beat.id }, "Beat created");
  res.status(201).json(beatWithArtist(beat));
});

router.patch("/beats/:id", requireRole("artist", "admin"), async (req, res) => {
  const beat = await db.query.beatsTable.findFirst({ where: eq(beatsTable.id, req.params["id"] as string) });
  if (!beat) {
    res.status(404).json({ error: "Beat not found" });
    return;
  }
  if (req.user!.role !== "admin" && beat.artistId !== req.user!.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { title, description, bpm, key: key_, genre, mood, tags, coverUrl, audioPreviewUrl, priceBasic, pricePremium, priceExclusive } = req.body;
  const [updated] = await db.update(beatsTable).set({
    ...(title && { title }),
    ...(description !== undefined && { description }),
    ...(bpm !== undefined && { bpm }),
    ...(key_ !== undefined && { key: key_ }),
    ...(genre !== undefined && { genre }),
    ...(mood !== undefined && { mood }),
    ...(tags !== undefined && { tags }),
    ...(coverUrl !== undefined && { coverUrl }),
    ...(audioPreviewUrl !== undefined && { audioPreviewUrl }),
    ...(priceBasic !== undefined && { priceBasic: priceBasic ? String(priceBasic) : null }),
    ...(pricePremium !== undefined && { pricePremium: pricePremium ? String(pricePremium) : null }),
    ...(priceExclusive !== undefined && { priceExclusive: priceExclusive ? String(priceExclusive) : null }),
  }).where(eq(beatsTable.id, req.params["id"] as string)).returning();

  res.json(beatWithArtist(updated));
});

router.delete("/beats/:id", requireRole("artist", "admin"), async (req, res) => {
  const beat = await db.query.beatsTable.findFirst({ where: eq(beatsTable.id, req.params["id"] as string) });
  if (!beat) {
    res.status(404).json({ error: "Beat not found" });
    return;
  }
  if (req.user!.role !== "admin" && beat.artistId !== req.user!.userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  await db.delete(beatsTable).where(eq(beatsTable.id, req.params["id"] as string));
  req.log.info({ beatId: req.params["id"] }, "Beat deleted");
  res.json({ message: "Beat deleted" });
});

router.patch("/beats/:id/flag", requireRole("admin"), async (req, res) => {
  await db.update(beatsTable).set({ status: "flagged" }).where(eq(beatsTable.id, req.params["id"] as string));
  res.json({ message: "Beat flagged" });
});

router.patch("/beats/:id/restore", requireRole("admin"), async (req, res) => {
  await db.update(beatsTable).set({ status: "active" }).where(eq(beatsTable.id, req.params["id"] as string));
  res.json({ message: "Beat restored" });
});

export default router;
