import { db, pool } from "@workspace/db";
import { profilesTable, artistsTable, beatsTable } from "@workspace/db";
import bcryptjs from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const password = await bcryptjs.hash("Demo1234!", 10);

  // Create artist profiles
  const artistUsers = [
    { email: "marek@beatpack.cz", firstName: "Marek", lastName: "Novák", slug: "marek-novak", displayName: "Marek Novák", genre: "Hip-Hop" },
    { email: "lucie@beatpack.cz", firstName: "Lucie", lastName: "Kovář", slug: "lucie-kovar", displayName: "Lucie Kovář", genre: "Trap" },
    { email: "jan@beatpack.cz", firstName: "Jan", lastName: "Procházka", slug: "jan-prochazka", displayName: "Jan Procházka", genre: "R&B" },
  ];

  const createdArtists: Array<{ profileId: string; artistId: string; displayName: string; slug: string }> = [];

  for (const u of artistUsers) {
    const [profile] = await db.insert(profilesTable).values({
      email: u.email,
      passwordHash: password,
      firstName: u.firstName,
      lastName: u.lastName,
      role: "artist",
    }).onConflictDoNothing().returning();

    if (!profile) {
      console.log(`Profile ${u.email} already exists, skipping`);
      continue;
    }

    const [artist] = await db.insert(artistsTable).values({
      id: profile.id,
      slug: u.slug,
      displayName: u.displayName,
      bio: `Czech ${u.genre} producer from Prague. Making beats since 2018.`,
    }).onConflictDoNothing().returning();

    if (artist) {
      createdArtists.push({ profileId: profile.id, artistId: artist.id, displayName: u.displayName, slug: u.slug });
    }
  }

  if (createdArtists.length === 0) {
    console.log("Artists already exist, skipping beat seeding");
    await pool.end();
    return;
  }

  // Seed beats for each artist
  const genres = ["Hip-Hop", "Trap", "R&B", "Drill", "Afrobeats", "Lo-fi"];
  const keys = ["C", "D", "E", "F", "G", "A", "B", "C#", "Eb", "F#"];
  const beatTitles = [
    "Dark Nights", "Summer Vibes", "Street Legend", "Neon Dreams",
    "Cold World", "Golden Hour", "Midnight Run", "Prague Sky",
    "Hustle Hard", "Velvet Touch", "Storm Front", "Crystal Clear",
  ];

  let beatIndex = 0;
  for (const artist of createdArtists) {
    for (let i = 0; i < 4; i++) {
      const title = beatTitles[beatIndex % beatTitles.length]!;
      const genre = genres[beatIndex % genres.length]!;
      const bpm = 80 + (beatIndex * 7 % 60);
      const key = keys[beatIndex % keys.length]!;

      await db.insert(beatsTable).values({
        artistId: artist.artistId,
        title,
        slug: `${title.toLowerCase().replace(/\s+/g, "-")}-${artist.slug}`,
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

  console.log(`Seeded ${createdArtists.length} artists and ${beatIndex} beats.`);
  console.log("\nArtist login credentials:");
  for (const u of artistUsers) {
    console.log(`  ${u.email} / Demo1234!`);
  }

  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
