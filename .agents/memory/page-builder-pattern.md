---
name: Page Builder pattern
description: How the canvas-based page builder works end-to-end — DB storage, API, builder UI, and public rendering
---

The page builder stores a `PageConfig` JSON string in `artists.page_sections` (TEXT column).

**DB:** `ALTER TABLE artists ADD COLUMN IF NOT EXISTS page_sections text` — already applied.
Drizzle schema: `pageSections: text("page_sections")` in `lib/db/src/schema/artists.ts`.

**API:** `PATCH /api/artists/me` accepts `pageSections` (string or object, serialised to string server-side).
Both `GET /api/artists/me` and `GET /api/artists/:slug` return `pageSections: string | null`.

**PageConfig shape:**
```ts
{ sections: Section[]; footerEmail: string }
```
Section types: `hero | playlist | youtube | pricing | soundkit` — each has an `id` and `type` discriminant.

**Builder:** `artifacts/beatpack/src/pages/studio/StudioPageBuilder.tsx`
- Full-screen two-panel (260px left admin panel + right canvas)
- Left panel: admin nav links, section list with drag handles, footer email editor, Save + View Live buttons
- Right panel: canvas with browser chrome mockup, live section previews, hover edit/delete/move controls
- Modals: SectionTypePicker + per-type edit modals (Hero, Playlist, YouTube, Pricing, SoundKit)
- Saves on every section mutation; also has manual Save button
- Route: `/studio/store` → `StudioPageBuilder` (requires artist/admin role)

**Public rendering:** `ArtistStorePage.tsx` checks `(artist as any).pageSections` after data loads.
If set → renders `SectionsStorePage` (sections-based layout with full-width sections + store header + footer).
If not set → falls back to the original beat-list layout (unchanged).

**Why:** Keeps backwards compatibility for artists who haven't built a page yet.
**How to apply:** Always check for pageSections before touching the default layout in ArtistStorePage.
