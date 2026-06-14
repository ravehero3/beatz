import PDFDocument from "pdfkit";

const LICENSE_RIGHTS: Record<string, { title: string; rights: string[] }> = {
  basic: {
    title: "Basic License",
    rights: [
      "Non-exclusive rights to use the beat",
      "Streaming & free distribution (up to 10,000 streams)",
      "MP3 delivery format",
      "Must credit producer in all releases",
      "Not for sale or commercial monetization",
    ],
  },
  premium: {
    title: "Premium License",
    rights: [
      "Non-exclusive rights to use the beat",
      "Unlimited streaming & commercial distribution",
      "MP3 + WAV delivery formats",
      "Must credit producer in all releases",
      "Permitted for monetized platforms (Spotify, YouTube, etc.)",
    ],
  },
  exclusive: {
    title: "Exclusive License",
    rights: [
      "Full exclusive rights — beat removed from store",
      "Unlimited streaming & commercial distribution",
      "MP3 + WAV + tracked-out stems delivery",
      "No producer credit required",
      "Full ownership of master recording",
    ],
  },
};

export async function generateLicensePdf(params: {
  orderId: string;
  variableSymbol: string | null;
  beatTitle: string;
  artistName: string;
  buyerName: string;
  buyerEmail: string;
  licenseType: string;
  amountCzk: number;
  purchaseDate: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ size: "A4", margin: 60, info: { Title: `Beatpack License — ${params.beatTitle}`, Author: "Beatpack" } });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const licenseInfo = LICENSE_RIGHTS[params.licenseType] ?? LICENSE_RIGHTS.basic;
    const purchaseDate = new Date(params.purchaseDate).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
    const amountFormatted = (params.amountCzk / 100).toLocaleString("cs-CZ") + " Kč";

    // Header band
    doc.rect(0, 0, doc.page.width, 90).fill("#0A0A0A");
    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(22).text("beatpack", 60, 32);
    doc.fillColor("rgba(255,255,255,0.5)").font("Helvetica").fontSize(10).text("Music License Agreement", 60, 58);

    // License type badge
    const badgeX = doc.page.width - 180;
    doc.roundedRect(badgeX, 24, 120, 42, 8).fill("#1A1A1A");
    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(11).text(licenseInfo.title.toUpperCase(), badgeX, 32, { width: 120, align: "center" });
    doc.fillColor("rgba(255,255,255,0.5)").font("Helvetica").fontSize(8).text("LICENSE TYPE", badgeX, 48, { width: 120, align: "center" });

    // Main content
    let y = 120;
    const leftCol = 60;
    const rightCol = 310;
    const colWidth = 220;

    doc.fillColor("#0A0A0A").font("Helvetica-Bold").fontSize(18).text(params.beatTitle, leftCol, y);
    y += 28;
    doc.fillColor("#888888").font("Helvetica").fontSize(11).text(`by ${params.artistName}`, leftCol, y);
    y += 40;

    // Divider
    doc.moveTo(leftCol, y).lineTo(doc.page.width - leftCol, y).strokeColor("#E5E5E5").lineWidth(1).stroke();
    y += 24;

    // Two-column details
    const details = [
      { label: "Licensee (Buyer)", value: params.buyerName },
      { label: "Email", value: params.buyerEmail },
      { label: "Purchase Date", value: purchaseDate },
      { label: "License Type", value: licenseInfo.title },
      { label: "Amount Paid", value: amountFormatted },
      { label: "Order Reference", value: params.variableSymbol ?? params.orderId.slice(0, 8).toUpperCase() },
    ];

    const detailStart = y;
    details.forEach((d, i) => {
      const col = i % 2 === 0 ? leftCol : rightCol;
      const row = Math.floor(i / 2);
      const rowY = detailStart + row * 52;

      doc.fillColor("#888888").font("Helvetica").fontSize(9).text(d.label.toUpperCase(), col, rowY, { characterSpacing: 0.5 });
      doc.fillColor("#0A0A0A").font("Helvetica-Bold").fontSize(12).text(d.value, col, rowY + 14, { width: colWidth });
    });

    y = detailStart + Math.ceil(details.length / 2) * 52 + 16;

    // Divider
    doc.moveTo(leftCol, y).lineTo(doc.page.width - leftCol, y).strokeColor("#E5E5E5").lineWidth(1).stroke();
    y += 24;

    // Rights section
    doc.fillColor("#0A0A0A").font("Helvetica-Bold").fontSize(13).text("Rights Included", leftCol, y);
    y += 20;

    licenseInfo.rights.forEach((right) => {
      doc.fillColor("#22C55E").font("Helvetica-Bold").fontSize(11).text("✓", leftCol, y);
      doc.fillColor("#333333").font("Helvetica").fontSize(11).text(right, leftCol + 18, y, { width: doc.page.width - leftCol * 2 - 18 });
      y += 22;
    });

    y += 16;

    // Divider
    doc.moveTo(leftCol, y).lineTo(doc.page.width - leftCol, y).strokeColor("#E5E5E5").lineWidth(1).stroke();
    y += 20;

    // Legal note
    doc.fillColor("#888888").font("Helvetica").fontSize(9).text(
      "This license agreement is issued by Beatpack on behalf of the producer. By purchasing this license, you agree to use the beat within the scope of rights listed above. Beatpack reserves the right to enforce the terms of this agreement on behalf of the licensor. This document serves as legal proof of purchase and licensing.",
      leftCol, y, { width: doc.page.width - leftCol * 2, lineGap: 3 }
    );

    // Footer
    const footerY = doc.page.height - 56;
    doc.rect(0, footerY, doc.page.width, 56).fill("#F9F9F9");
    doc.fillColor("#AAAAAA").font("Helvetica").fontSize(9)
      .text(`beatpack.cz  ·  Order ID: ${params.orderId}  ·  Generated ${new Date().toLocaleDateString("cs-CZ")}`, leftCol, footerY + 20, {
        width: doc.page.width - leftCol * 2,
        align: "center",
      });

    doc.end();
  });
}
