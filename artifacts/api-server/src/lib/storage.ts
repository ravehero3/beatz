import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import path from "node:path";

const R2_ACCOUNT_ID = process.env["R2_ACCOUNT_ID"];
const R2_ACCESS_KEY_ID = process.env["R2_ACCESS_KEY_ID"];
const R2_SECRET_ACCESS_KEY = process.env["R2_SECRET_ACCESS_KEY"];
const R2_BUCKET_NAME = process.env["R2_BUCKET_NAME"];
const R2_PUBLIC_URL = (process.env["R2_PUBLIC_URL"] ?? "").replace(/\/$/, "");

export function isR2Configured(): boolean {
  return Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME && R2_PUBLIC_URL);
}

function createClient(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
}

function contentTypeFromExt(ext: string): string {
  const map: Record<string, string> = {
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".aiff": "audio/aiff",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return map[ext.toLowerCase()] ?? "application/octet-stream";
}

export async function uploadToR2(
  buffer: Buffer,
  originalName: string,
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  const client = createClient();
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentTypeFromExt(ext),
    }),
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

export async function deleteFromR2(publicUrl: string): Promise<void> {
  if (!isR2Configured()) return;
  const key = publicUrl.replace(`${R2_PUBLIC_URL}/`, "");
  if (!key || key === publicUrl) return;

  const client = createClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME!,
      Key: key,
    }),
  );
}
