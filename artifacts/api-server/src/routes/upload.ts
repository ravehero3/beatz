import { Router, type IRouter } from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { requireAuth } from "../lib/auth";
import { isR2Configured, uploadToR2 } from "../lib/storage";

const router: IRouter = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_EXTS = [".mp3", ".wav", ".aiff", ".jpg", ".jpeg", ".png", ".webp", ".gif"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTS.includes(ext)) cb(null, true);
    else cb(new Error(`File type ${ext} not allowed`));
  },
});

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  if (isR2Configured()) {
    const url = await uploadToR2(req.file.buffer, req.file.originalname);
    res.json({ url, size: req.file.size });
    return;
  }

  // Local fallback for development (no R2 configured)
  const ext = path.extname(req.file.originalname).toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), req.file.buffer);
  const host = (process.env["APP_URL"] ?? `http://localhost:${process.env["PORT"] ?? 8080}`).replace(/\/$/, "");
  res.json({ url: `${host}/uploads/${filename}`, size: req.file.size });
});

export default router;
