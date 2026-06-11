import { Pool } from "pg";

const migrations = [
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_id text`,
  `CREATE UNIQUE INDEX IF NOT EXISTS profiles_google_id_unique ON profiles (google_id)`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS store_template text DEFAULT 'light'`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS store_primary_color text DEFAULT '#0A0A0A'`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS player_style text DEFAULT 'classic'`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS social_instagram text`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS social_soundcloud text`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS social_youtube text`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS bank_iban text`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS bank_account_name text`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS fio_api_token text`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free'`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS subscription_status text`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS balance_czk numeric(10,2) DEFAULT 0`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS total_earned_czk numeric(10,2) DEFAULT 0`,
  `ALTER TABLE beats ADD COLUMN IF NOT EXISTS slug text`,
  `ALTER TABLE beats ADD COLUMN IF NOT EXISTS mood text`,
  `ALTER TABLE beats ADD COLUMN IF NOT EXISTS audio_wav_url text`,
];

export async function runMigrations(): Promise<void> {
  const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });
  try {
    for (const sql of migrations) {
      await pool.query(sql);
    }
  } finally {
    await pool.end();
  }
}
