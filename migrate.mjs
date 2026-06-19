import pg from "pg";

const { Client } = pg;

const DATABASE_URL = process.env["DATABASE_URL"];
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set");
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL });

const createTableStatements = [
  `CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text,
    first_name text,
    last_name text,
    role text NOT NULL DEFAULT 'buyer',
    avatar_url text,
    password_hash text,
    google_id text UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS artists (
    id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    slug text UNIQUE,
    display_name text,
    bio text,
    banner_url text,
    profile_picture_url text,
    store_template text DEFAULT 'light',
    store_primary_color text DEFAULT '#0A0A0A',
    player_style text DEFAULT 'classic',
    social_instagram text,
    social_soundcloud text,
    social_youtube text,
    bank_iban text,
    bank_account_name text,
    fio_api_token text,
    subscription_tier text DEFAULT 'free',
    subscription_status text,
    subscription_ends_at timestamptz,
    balance_czk numeric(10,2) DEFAULT 0,
    total_earned_czk numeric(10,2) DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS beats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    title text NOT NULL,
    slug text,
    description text,
    bpm integer,
    key text,
    genre text,
    mood text,
    tags text[],
    cover_url text,
    audio_preview_url text,
    audio_full_url text,
    audio_wav_url text,
    price_basic numeric(10,2),
    price_premium numeric(10,2),
    price_exclusive numeric(10,2),
    is_exclusive_sold boolean NOT NULL DEFAULT false,
    plays integer NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id uuid NOT NULL REFERENCES profiles(id),
    artist_id uuid NOT NULL REFERENCES artists(id),
    beat_id uuid NOT NULL REFERENCES beats(id),
    license_type text NOT NULL,
    amount_czk numeric(10,2) NOT NULL,
    payment_method text,
    payment_status text NOT NULL DEFAULT 'pending',
    variable_symbol text,
    qr_code_data text,
    license_pdf_url text,
    confirmed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS withdrawals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id uuid NOT NULL REFERENCES artists(id),
    amount_czk numeric(10,2) NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    qr_code_data text,
    requested_at timestamptz NOT NULL DEFAULT now(),
    paid_at timestamptz
  )`,

  `CREATE TABLE IF NOT EXISTS saved_beats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    beat_id uuid NOT NULL REFERENCES beats(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,

  `CREATE TABLE IF NOT EXISTS beat_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    beat_id uuid NOT NULL REFERENCES beats(id) ON DELETE CASCADE,
    artist_id uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    email text NOT NULL,
    consent_given boolean NOT NULL DEFAULT false,
    ip_address text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
];

const alterTableStatements = [
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
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS logo_url text`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS hero_logo_url text`,
  `ALTER TABLE artists ADD COLUMN IF NOT EXISTS page_sections text`,
  `ALTER TABLE beats ADD COLUMN IF NOT EXISTS slug text`,
  `ALTER TABLE beats ADD COLUMN IF NOT EXISTS mood text`,
  `ALTER TABLE beats ADD COLUMN IF NOT EXISTS audio_wav_url text`,
  `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marketing_opt_in boolean NOT NULL DEFAULT true`,
  `CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    token text NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS password_reset_tokens_token_idx ON password_reset_tokens (token)`,
];

async function migrate() {
  await client.connect();
  console.log("Connected to database, running migrations...");
  for (const sql of createTableStatements) {
    await client.query(sql);
    console.log("OK (create):", sql.trim().split("\n")[0].slice(0, 60));
  }
  for (const sql of alterTableStatements) {
    await client.query(sql);
    console.log("OK (alter):", sql.slice(0, 60));
  }
  await client.end();
  console.log("All migrations applied successfully.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
