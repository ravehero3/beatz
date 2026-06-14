import { Router, type IRouter } from "express";
import { db } from "../lib/db";
import { ordersTable, beatsTable, artistsTable, profilesTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { CreateOrderBody } from "@workspace/api-zod";
import { eq, or } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { sendOrderConfirmationEmail, sendBeatDeliveryEmail } from "../lib/email";
import { generateLicensePdf } from "../lib/pdf";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router: IRouter = Router();

function formatOrder(order: typeof ordersTable.$inferSelect & {
  beatTitle?: string | null;
  beatCoverUrl?: string | null;
  audioPreviewUrl?: string | null;
  audioFullUrl?: string | null;
  audioWavUrl?: string | null;
  beatId?: string;
}) {
  return {
    id: order.id,
    buyerId: order.buyerId,
    artistId: order.artistId,
    beatId: order.beatId,
    licenseType: order.licenseType,
    amountCzk: Number(order.amountCzk),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    variableSymbol: order.variableSymbol,
    qrCodeData: order.qrCodeData,
    licensePdfUrl: order.licensePdfUrl,
    confirmedAt: order.confirmedAt?.toISOString() ?? null,
    createdAt: order.createdAt.toISOString(),
    beat: {
      title: order.beatTitle ?? null,
      coverUrl: order.beatCoverUrl ?? null,
      audioPreviewUrl: order.audioPreviewUrl ?? null,
      audioFullUrl: order.audioFullUrl ?? null,
      audioWavUrl: order.audioWavUrl ?? null,
    },
  };
}

/** Build a Czech QR Platba (SPD) string for bank transfer */
function buildCzechQrString(params: {
  iban: string;
  amountCzk: number;
  variableSymbol: string;
  message: string;
}): string {
  const amount = (params.amountCzk / 100).toFixed(2); // øre → Kč
  const msg = params.message.replace(/[*]/g, "").substring(0, 60);
  const parts = [
    "SPD*1.0",
    `ACC:${params.iban.replace(/\s/g, "")}`,
    `AM:${amount}`,
    "CC:CZK",
    `MSG:${msg}`,
    `X-VS:${params.variableSymbol}`,
  ];
  return parts.join("*");
}

router.post("/orders", requireAuth, async (req, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  const { beatId, licenseType, paymentMethod } = parsed.data;

  const beat = await db.query.beatsTable.findFirst({ where: eq(beatsTable.id, beatId) });
  if (!beat) {
    res.status(404).json({ error: "Beat not found" });
    return;
  }
  if (beat.status !== "active") {
    res.status(400).json({ error: "Beat is not available" });
    return;
  }
  if (licenseType === "exclusive" && beat.isExclusiveSold) {
    res.status(400).json({ error: "Exclusive license already sold" });
    return;
  }

  const priceMap: Record<string, string | null> = {
    basic: beat.priceBasic,
    premium: beat.pricePremium,
    exclusive: beat.priceExclusive,
  };
  const price = priceMap[licenseType];
  if (!price) {
    res.status(400).json({ error: "License type not available for this beat" });
    return;
  }

  const variableSymbol = Date.now().toString().slice(-8);

  // Look up artist IBAN and generate QR string
  const artist = await db.query.artistsTable.findFirst({ where: eq(artistsTable.id, beat.artistId) });
  let qrCodeData: string | null = null;
  if (artist?.bankIban) {
    qrCodeData = buildCzechQrString({
      iban: artist.bankIban,
      amountCzk: Number(price),
      variableSymbol,
      message: `Beatpack ${beat.title ?? "beat"}`,
    });
  }

  const [order] = await db.insert(ordersTable).values({
    buyerId: req.user!.userId,
    artistId: beat.artistId,
    beatId,
    licenseType,
    amountCzk: price,
    paymentMethod: paymentMethod ?? "qr_bank",
    paymentStatus: "pending",
    variableSymbol,
    qrCodeData,
  }).returning();

  req.log.info({ orderId: order.id }, "Order created");
  res.status(201).json(formatOrder({
    ...order,
    beatTitle: beat.title,
    beatCoverUrl: beat.coverUrl,
    audioPreviewUrl: beat.audioPreviewUrl,
    audioFullUrl: beat.audioFullUrl,
    audioWavUrl: beat.audioWavUrl,
  }));
});

router.get("/orders/:id", requireAuth, async (req, res) => {
  const row = await db
    .select({
      order: ordersTable,
      title: beatsTable.title,
      coverUrl: beatsTable.coverUrl,
      audioPreviewUrl: beatsTable.audioPreviewUrl,
      audioFullUrl: beatsTable.audioFullUrl,
      audioWavUrl: beatsTable.audioWavUrl,
    })
    .from(ordersTable)
    .leftJoin(beatsTable, eq(ordersTable.beatId, beatsTable.id))
    .where(eq(ordersTable.id, req.params["id"] as string))
    .limit(1)
    .then((rows) => rows[0]);

  if (!row) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  if (row.order.buyerId !== req.user!.userId && row.order.artistId !== req.user!.userId && req.user!.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json(formatOrder({
    ...row.order,
    beatTitle: row.title,
    beatCoverUrl: row.coverUrl,
    audioPreviewUrl: row.audioPreviewUrl,
    audioFullUrl: row.audioFullUrl,
    audioWavUrl: row.audioWavUrl,
  }));
});

router.get("/orders", requireAuth, async (req, res) => {
  const rows = await db
    .select({
      order: ordersTable,
      title: beatsTable.title,
      coverUrl: beatsTable.coverUrl,
      audioPreviewUrl: beatsTable.audioPreviewUrl,
      audioFullUrl: beatsTable.audioFullUrl,
      audioWavUrl: beatsTable.audioWavUrl,
    })
    .from(ordersTable)
    .leftJoin(beatsTable, eq(ordersTable.beatId, beatsTable.id))
    .where(
      or(
        eq(ordersTable.buyerId, req.user!.userId),
        eq(ordersTable.artistId, req.user!.userId)
      )!
    )
    .orderBy(sql`${ordersTable.createdAt} desc`);

  res.json(rows.map((r) => formatOrder({
    ...r.order,
    beatTitle: r.title,
    beatCoverUrl: r.coverUrl,
    audioPreviewUrl: r.audioPreviewUrl,
    audioFullUrl: r.audioFullUrl,
    audioWavUrl: r.audioWavUrl,
  })));
});

router.patch("/orders/:id/confirm", requireAuth, async (req, res) => {
  const order = await db.query.ordersTable.findFirst({ where: eq(ordersTable.id, req.params["id"] as string) });
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  if (order.artistId !== req.user!.userId && req.user!.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  // Generate license PDF
  let licensePdfUrl: string | null = order.licensePdfUrl;
  try {
    const [buyerProfile, beatRow, artistRow] = await Promise.all([
      db.query.profilesTable.findFirst({ where: eq(profilesTable.id, order.buyerId) }),
      db.query.beatsTable.findFirst({ where: eq(beatsTable.id, order.beatId) }),
      db.query.artistsTable.findFirst({ where: eq(artistsTable.id, order.artistId) }),
    ]);

    if (buyerProfile && beatRow) {
      const pdfBuffer = await generateLicensePdf({
        orderId: order.id,
        variableSymbol: order.variableSymbol,
        beatTitle: beatRow.title ?? "Beat",
        artistName: artistRow?.displayName ?? "Artist",
        buyerName: (`${buyerProfile.firstName ?? ""} ${buyerProfile.lastName ?? ""}`.trim()) || (buyerProfile.email ?? "Buyer"),
        buyerEmail: buyerProfile.email ?? "",
        licenseType: order.licenseType,
        amountCzk: Number(order.amountCzk),
        purchaseDate: new Date().toISOString(),
      });

      const uploadsDir = path.resolve(__dirname, "../../../../uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const pdfFilename = `license-${order.id}.pdf`;
      fs.writeFileSync(path.join(uploadsDir, pdfFilename), pdfBuffer);
      licensePdfUrl = `/uploads/${pdfFilename}`;
    }
  } catch (pdfErr) {
    req.log.warn({ err: pdfErr }, "Failed to generate license PDF");
  }

  const [updated] = await db.update(ordersTable).set({
    paymentStatus: "paid",
    confirmedAt: new Date(),
    ...(licensePdfUrl ? { licensePdfUrl } : {}),
  }).where(eq(ordersTable.id, req.params["id"] as string)).returning();

  await db.update(artistsTable)
    .set({
      balanceCzk: sql`${artistsTable.balanceCzk} + ${order.amountCzk}`,
      totalEarnedCzk: sql`${artistsTable.totalEarnedCzk} + ${order.amountCzk}`,
    })
    .where(eq(artistsTable.id, order.artistId));

  if (order.licenseType === "exclusive") {
    await db.update(beatsTable).set({ isExclusiveSold: true }).where(eq(beatsTable.id, order.beatId));
  }

  req.log.info({ orderId: updated.id }, "Order confirmed");

  // Send email notifications asynchronously
  try {
    const [buyerRow, beatRow] = await Promise.all([
      db.query.profilesTable.findFirst({ where: eq(profilesTable.id, order.buyerId) }),
      db.query.beatsTable.findFirst({ where: eq(beatsTable.id, order.beatId) }),
    ]);

    if (buyerRow?.email && beatRow) {
      const buyerName = buyerRow.firstName ?? buyerRow.email.split("@")[0];
      await Promise.all([
        sendOrderConfirmationEmail({
          email: buyerRow.email,
          buyerName,
          beatTitle: beatRow.title,
          licenseType: order.licenseType,
          amountCzk: Number(order.amountCzk),
          variableSymbol: order.variableSymbol,
          orderId: order.id,
          licensePdfUrl: licensePdfUrl ?? undefined,
        }),
        sendBeatDeliveryEmail({
          email: buyerRow.email,
          buyerName,
          beatTitle: beatRow.title,
          licenseType: order.licenseType,
          audioFullUrl: beatRow.audioFullUrl,
          audioWavUrl: beatRow.audioWavUrl,
        }),
      ]);
    }
  } catch (emailErr) {
    req.log.warn({ err: emailErr }, "Failed to send confirmation emails");
  }

  res.json(formatOrder({ ...updated, beatTitle: null, beatCoverUrl: null }));
});

export default router;
