---
name: DB migrations without TTY
description: drizzle-kit push hangs in non-interactive shells; use direct SQL instead
---

`pnpm --filter @workspace/db run push` requires an interactive TTY and will hang silently in Replit's shell or any non-TTY context.

**Rule:** Always apply schema changes via direct SQL (`ALTER TABLE … ADD COLUMN …`) in the non-interactive shell, and keep the Drizzle schema file (`lib/db/src/schema/`) in sync manually.

**Why:** drizzle-kit push prompts for confirmation interactively and cannot be bypassed with flags in this version.

**How to apply:** After editing a schema file, run `pnpm run typecheck:libs` to rebuild the lib, then apply the SQL column addition directly via `executeSql` or psql.
