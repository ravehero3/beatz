import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { profilesTable, artistsTable, beatsTable } from "@workspace/db";
import * as schema from "@workspace/db";
import bcryptjs from "bcryptjs";

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });
const db = drizzle(pool, { schema });

const GENRES = ["Hip-Hop", "Trap", "R&B", "Drill", "Afrobeats", "Lo-fi"];
const KEYS = ["C", "D", "E", "F", "G", "A", "B", "C#", "Eb", "F#"];
const BEAT_TITLES = [
  "Dark Nights", "Summer Vibes", "Street Legend", "Neon Dreams",
  "Cold World", "Golden Hour", "Midnight Run", "Prague Sky",
  "Hustle Hard", "Velvet Touch", "Storm Front", "Crystal Clear",
];

async function seed() {
  console.log("Seeding database...");

  const password = await bcryptjs.hash("Demo1234!", 10);

  const artistUsers = [
    { email: "marek@beatpack.cz", firstName: "Marek", lastName: "Novak", slug: "marek-novak", displayName: "Marek Novák", genre: "Hip-Hop", role: "artist" as const },
    { email: "lucie@beatpack.cz", firstName: "Lucie", lastName: "Kovar", slug: "lucie-kovar", displayName: "Lucie Kovář", genre: "Trap", role: "artist" as const },
    { email: "jan@beatpack.cz", firstName: "Jan", lastName: "Prochazka", slug: "jan-prochazka", displayName: "Jan Procházka", genre: "R&B", role: "artist" as const },
    { email: "admin@beatpack.cz", firstName: "Admin", lastName: "User", slug: null, displayName: null, genre: null, role: "admin" as const },
  ];

  const createdArtists: Array<{ id: string; slug: string }> = [];

  for (const u of artistUsers) {
    const [profile] = await db.insert(profilesTable).values({
      email: u.email,
      passwordHash: password,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
    }).onConflictDoNothing().returning();

    if (!profile) {
      console.log(`  skip ${u.email} (exists)`);
      continue;
    }

    if (u.slug && u.displayName) {
      const [artist] = await db.insert(artistsTable).values({
        id: profile.id,
        slug: u.slug,
        displayName: u.displayName,
        bio: `Czech ${u.genre} producer from Prague. Making beats since 2018.`,
      }).onConflictDoNothing().returning();
      if (artist) {
        createdArtists.push({ id: artist.id, slug: u.slug });
        console.log(`  created artist: ${u.displayName}`);
      }
    } else {
      console.log(`  created admin: ${u.email}`);
    }
  }

  let beatIndex = 0;
  if (createdArtists.length > 0) {
    for (const artist of createdArtists) {
      for (let i = 0; i < 4; i++) {
        const title = BEAT_TITLES[beatIndex % BEAT_TITLES.length]!;
        const genre = GENRES[beatIndex % GENRES.length]!;
        const bpm = 80 + (beatIndex * 7 % 60);
        const key = KEYS[beatIndex % KEYS.length]!;
        const slugBase = title.toLowerCase().replace(/\s+/g, "-");

        await db.insert(beatsTable).values({
          artistId: artist.id,
          title,
          slug: `${slugBase}-${artist.slug}`,
          genre,
          bpm,
          key,
          priceBasic: "49900",
          pricePremium: "99900",
          priceExclusive: "299900",
          status: "active",
          tags: [genre, `${bpm} BPM`],
        }).onConflictDoNothing();
        beatIndex++;
      }
    }
    console.log(`  created ${beatIndex} beats`);
  }

  console.log("\nDone! Login credentials:");
  console.log("  marek@beatpack.cz / Demo1234! (artist)");
  console.log("  lucie@beatpack.cz / Demo1234! (artist)");
  console.log("  jan@beatpack.cz   / Demo1234! (artist)");
  console.log("  admin@beatpack.cz / Demo1234! (admin)");

  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
