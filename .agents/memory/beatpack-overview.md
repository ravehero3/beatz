---
name: Beatpack project overview
description: Key architectural decisions and gotchas for the Beatpack beat marketplace SaaS
---

## Rules

**Why:** These were discovered through type errors or runtime crashes during initial build.

**How to apply:** Follow these whenever editing the Beatpack codebase.

### Express 5 params cast
`req.params["id"]` is typed as `string | string[]` in Express 5. Always cast with `as string` before passing to Drizzle `eq()`.

### BeatCard musical key prop
The prop is named `musicalKey` (not `key`, which is reserved by React, and not `key_`).

### Radix Select empty string
`<SelectItem value="">` throws at runtime — Radix rejects empty strings. Use a sentinel like `"all"` and filter it out before API calls.

### Lib declarations must be built first
`@workspace/db` and other `lib/*` packages must be built with `pnpm run typecheck:libs` before `@workspace/api-server` typecheck can find their exports. If api-server says "has no exported member X", run typecheck:libs first.

### Seed script
Run from root: `node --import /home/runner/workspace/node_modules/.pnpm/tsx@4.21.0/node_modules/tsx/dist/esm/index.mjs artifacts/api-server/src/seed.ts`
Seed credentials: marek/lucie/jan@beatpack.cz + admin@beatpack.cz, all password `Demo1234!`

### Auth token wiring
`setAuthTokenGetter(() => useAuthStore.getState().token)` is called in `artifacts/beatpack/src/main.tsx` — this wires Zustand JWT into every API fetch via `custom-fetch.ts`.

### Currency
Prices stored as integer øre (49900 = 499 Kč). Use `formatCurrency` from `artifacts/beatpack/src/lib/format.ts`.
