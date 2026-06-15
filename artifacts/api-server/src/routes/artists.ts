import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { artistsTable, beatsTable, profilesTable, beatLeadsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { eq, ilike, or, sql, and, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/artists/featured", async (_req, res) => {
  const rows = await db
    .select({
      artist: artistsTable,
      beatCount: sql<number>`count(${beatsTable.id})`,
    })
    .from(artistsTable)
    .leftJoin(beatsTable, and(eq(beatsTable.artistId, artistsTable.id), eq(beatsTable.status, "active")))
    .groupBy(artistsTable.id)
    .orderBy(sql`count(${beatsTable.id}) desc`)
    .limit(12);

  res.json(rows.map((r) => ({
    id: r.artist.id,
    slug: r.artist.slug,
    displayName: r.artist.displayName,
    profilePictureUrl: r.artist.profilePictureUrl,
    beatCount: Number(r.beatCount),
  })));
});

router.get("/artists", async (req, res) => {
  const { search, limit = "48" } = req.query as Record<string, string>;

  const conditions = [];
  if (search) {
    conditions.push(ilike(artistsTable.displayName, `%${search}%`));
  }

  const rows = await db
    .select({
      artist: artistsTable,
      beatCount: sql<number>`count(${beatsTable.id})`,
    })
    .from(artistsTable)
    .leftJoin(beatsTable, and(eq(beatsTable.artistId, artistsTable.id), eq(beatsTable.status, "active")))
    .where(conditions.length ? conditions[0] : undefined)
    .groupBy(artistsTable.id)
    .limit(Number(limit));

  res.json(rows.map((r) => ({
    id: r.artist.id,
    slug: r.artist.slug,
    displayName: r.artist.displayName,
    profilePictureUrl: r.artist.profilePictureUrl,
    bannerUrl: r.artist.bannerUrl,
    bio: r.artist.bio,
    beatCount: Number(r.beatCount),
  })));
});

router.get("/artists/me", requireAuth, async (req, res) => {
  const artist = await db.query.artistsTable.findFirst({
    where: eq(artistsTable.id, req.user!.userId),
  });
  if (!artist) {
    res.status(404).json({ error: "Artist profile not found" });
    return;
  }
  res.json({
    id: artist.id,
    slug: artist.slug,
    displayName: artist.displayName,
    bio: artist.bio,
    bannerUrl: artist.bannerUrl,
    profilePictureUrl: artist.profilePictureUrl,
    logoUrl: artist.logoUrl,
    heroLogoUrl: artist.heroLogoUrl,
    storeTemplate: artist.storeTemplate,
    storePrimaryColor: artist.storePrimaryColor,
    playerStyle: artist.playerStyle ?? "classic",
    socialInstagram: artist.socialInstagram,
    socialSoundcloud: artist.socialSoundcloud,
    socialYoutube: artist.socialYoutube,
    bankIban: artist.bankIban ?? null,
    bankAccountName: artist.bankAccountName ?? null,
    subscriptionTier: artist.subscriptionTier,
    subscriptionStatus: artist.subscriptionStatus,
    balanceCzk: Number(artist.balanceCzk),
    totalEarnedCzk: Number(artist.totalEarnedCzk),
    createdAt: artist.createdAt.toISOString(),
  });
});

router.patch("/artists/me", requireAuth, async (req, res) => {
  const { displayName, bio, bannerUrl, profilePictureUrl, logoUrl, heroLogoUrl, storeTemplate, storePrimaryColor, playerStyle, socialInstagram, socialYoutube, socialSoundcloud, bankIban, bankAccountName } = req.body;

  const [updated] = await db.update(artistsTable).set({
    ...(displayName !== undefined && { displayName }),
    ...(bio !== undefined && { bio }),
    ...(bannerUrl !== undefined && { bannerUrl }),
    ...(profilePictureUrl !== undefined && { profilePictureUrl }),
    ...(logoUrl !== undefined && { logoUrl }),
    ...(heroLogoUrl !== undefined && { heroLogoUrl }),
    ...(storeTemplate !== undefined && { storeTemplate }),
    ...(storePrimaryColor !== undefined && { storePrimaryColor }),
    ...(playerStyle !== undefined && { playerStyle }),
    ...(socialInstagram !== undefined && { socialInstagram }),
    ...(socialYoutube !== undefined && { socialYoutube }),
    ...(socialSoundcloud !== undefined && { socialSoundcloud }),
    ...(bankIban !== undefined && { bankIban }),
    ...(bankAccountName !== undefined && { bankAccountName }),
  }).where(eq(artistsTable.id, req.user!.userId)).returning();

  if (!updated) {
    res.status(404).json({ error: "Artist profile not found" });
    return;
  }
  res.json({ id: updated.id, displayName: updated.displayName });
});

router.get("/artists/me/leads", requireRole("artist", "admin"), async (req, res) => {
  const leads = await db
    .select({
      id: beatLeadsTable.id,
      email: beatLeadsTable.email,
      consentGiven: beatLeadsTable.consentGiven,
      createdAt: beatLeadsTable.createdAt,
      beatTitle: beatsTable.title,
    })
    .from(beatLeadsTable)
    .innerJoin(beatsTable, eq(beatLeadsTable.beatId, beatsTable.id))
    .where(eq(beatLeadsTable.artistId, req.user!.userId))
    .orderBy(desc(beatLeadsTable.createdAt))
    .limit(1000);

  res.json(leads.map((l) => ({
    id: l.id,
    email: l.email,
    consentGiven: l.consentGiven,
    beatTitle: l.beatTitle,
    createdAt: l.createdAt.toISOString(),
  })));
});

router.get("/artists/:slug", async (req, res) => {
  const artist = await db.query.artistsTable.findFirst({
    where: or(
      eq(artistsTable.slug, req.params["slug"] as string),
      eq(artistsTable.id, req.params["slug"] as string)
    ),
  });

  if (!artist) {
    res.status(404).json({ error: "Artist not found" });
    return;
  }

  const beats = await db.query.beatsTable.findMany({
    where: and(eq(beatsTable.artistId, artist.id), eq(beatsTable.status, "active")),
    orderBy: (b, { desc }) => [desc(b.plays)],
  });

  res.json({
    id: artist.id,
    slug: artist.slug,
    displayName: artist.displayName,
    bio: artist.bio,
    bannerUrl: artist.bannerUrl,
    profilePictureUrl: artist.profilePictureUrl,
    logoUrl: artist.logoUrl,
    heroLogoUrl: artist.heroLogoUrl,
    storeTemplate: artist.storeTemplate ?? "light",
    playerStyle: artist.playerStyle ?? "classic",
    socialInstagram: artist.socialInstagram,
    socialYoutube: artist.socialYoutube,
    socialSoundcloud: artist.socialSoundcloud,
    createdAt: artist.createdAt.toISOString(),
    beats: beats.map((b) => ({
      id: b.id,
      title: b.title,
      bpm: b.bpm,
      key: b.key,
      genre: b.genre,
      mood: b.mood,
      coverUrl: b.coverUrl,
      audioPreviewUrl: b.audioPreviewUrl,
      priceBasic: b.priceBasic !== null ? Number(b.priceBasic) : null,
      pricePremium: b.pricePremium !== null ? Number(b.pricePremium) : null,
      priceExclusive: b.priceExclusive !== null ? Number(b.priceExclusive) : null,
      isExclusiveSold: b.isExclusiveSold,
      tags: b.tags ?? [],
      plays: b.plays,
      createdAt: b.createdAt.toISOString(),
    })),
  });
});

export default router;
