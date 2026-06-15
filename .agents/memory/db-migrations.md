---
name: DB migrations without TTY
description: drizzle-kit push hangs in non-interactive shells; use direct SQL instead. Seed script tsx path and UUID slug issue documented here.
---

`pnpm --filter @workspace/db run push` requires an interactive TTY and will hang silently in Replit's shell or any non-TTY context.

**Rule:** Always apply schema changes via direct SQL (`ALTER TABLE … ADD COLUMN …`) in the non-interactive shell, and keep the Drizzle schema file (`lib/db/src/schema/`) in sync manually.

**Why:** drizzle-kit push prompts for confirmation interactively and cannot be bypassed with flags in this version.

**How to apply:** After editing a schema file, run `pnpm run typecheck:libs` to rebuild the lib, then apply the SQL column addition directly via `executeSql` or psql.

## Seed script invocation

Use this exact command (tsx version is 4.21.0, not 4.20.3):

```
node --import /home/runner/workspace/node_modules/.pnpm/tsx@4.21.0/node_modules/tsx/dist/esm/index.mjs artifacts/api-server/src/seed.ts
```

## Artist slug: UUID type cast bug

The `/artists/:slug` route had `OR id = $1` where $1 was a text slug like "marek-novak". PostgreSQL rejects a non-UUID string cast to UUID type, causing a 500.

**Fix:** Validate the param with a UUID regex before including the `id = $1` branch:

```ts
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = UUID_RE.test(param);
where: isUuid ? or(eq(table.slug, param), eq(table.id, param)) : eq(table.slug, param)
```

**Why:** Drizzle passes the value as a bound parameter typed to match the column — UUID columns reject non-UUID strings at the driver level before any SQL LIKE/CAST logic.

## Artist slugs in seed data

- marek@beatpack.cz → slug `marek-novak`
- lucie@beatpack.cz → slug `lucie-kovar`
- jan@beatpack.cz → slug `jan-prochazka`
