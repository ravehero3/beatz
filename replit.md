# Beatpack

A full-stack Czech beat marketplace SaaS for independent music producers. Producers list their beats, buyers browse and purchase, and producers withdraw their earnings.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `node --import /path/to/tsx/dist/esm/index.mjs artifacts/api-server/src/seed.ts` — seed sample data
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind + wouter (SPA at `/`)
- API: Express 5 (at `/api`)
- DB: PostgreSQL + Drizzle ORM
- Auth: custom JWT via jsonwebtoken + bcryptjs
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → React Query hooks + Zod schemas)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — Drizzle schema (source of truth for DB)
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/api-zod/src/generated/` — generated Zod schemas
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/beatpack/src/pages/` — all React pages
- `artifacts/beatpack/src/components/` — shared UI components
- `artifacts/beatpack/src/store/authStore.ts` — Zustand JWT auth state

## Architecture decisions

- **Contract-first API**: OpenAPI spec defines all endpoints; Zod schemas and React Query hooks are generated from it via Orval. Never edit generated files manually.
- **Custom JWT auth**: bcrypt passwords, JWT tokens stored in Zustand + localStorage. `setAuthTokenGetter` in main.tsx wires the token into every API call via `custom-fetch.ts`.
- **Czech currency**: All prices stored as integer øre (e.g. 49900 = 499 Kč). `formatCurrency` in `lib/format.ts` renders with Czech locale.
- **Express 5 params**: `req.params["id"]` is typed as `string | string[]` — always cast with `as string`.
- **Lib declarations**: Run `pnpm run typecheck:libs` after changing any `lib/*` package before checking api-server types.

## Product

- **Browse & buy beats**: filter by genre, BPM, key; buy with Basic/Premium/Exclusive licenses in CZK
- **Artist store**: each producer has a public page at `/artists/:slug`
- **Studio**: artist dashboard with earnings chart, beat management (upload/edit/delete), order history, withdrawal requests
- **Admin panel**: user management, beat moderation, payout approvals
- **Auth**: register/login with JWT, role-based access (buyer / artist / admin)

## Seed credentials (dev)

- `marek@beatpack.cz` / `Demo1234!` — artist
- `lucie@beatpack.cz` / `Demo1234!` — artist
- `jan@beatpack.cz` / `Demo1234!` — artist
- `admin@beatpack.cz` / `Demo1234!` — admin

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT use `console.log` in server routes — use `req.log` (pino). The build will succeed but logging breaks.
- The `@workspace/db` lib must be rebuilt (`pnpm run typecheck:libs`) before the api-server typecheck will find new exports.
- `BeatCard` prop for musical key is `musicalKey` (not `key` — reserved by React).
- BrowseBeatsPage genre Select uses `"all"` as the sentinel for "no filter" (Radix rejects empty strings as SelectItem values).
- Express 5: `req.params["x"]` is `string | string[]`, always cast `as string`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
