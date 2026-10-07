# Backend conventions

## Routes, controllers, and middleware

- Organize `src/` into `routes`, `controllers`, `services`, `middleware`, `config`, `types`, and `prisma`. Use `.js` extensions for relative TypeScript imports.
- Follow dependency-injected factories: `createApp(db, google)`, route factories, and controllers returning typed `RequestHandler`s. Reuse the shared Prisma client.
- Routes choose methods and compose middleware; controllers validate/normalize input, coordinate services/Prisma, and return responses. Reusable domain/provider logic belongs in services. Whitelist writable fields, preserve omitted PATCH fields, and use transactions for related writes.
- Protect private endpoints with `requireAuth(db)` and use `res.locals.user.id` for ownership. JSON routes use route-local `json({ limit: '8kb' })` after auth. Return only explicit public projections.
- Cookie-authenticated mutations must check `req.headers.origin === env.frontendUrl` before writing (currently in controllers). Logout intentionally works without auth middleware so expired cookies can be cleared.
- Preserve no-store/nosniff headers, disabled x-powered-by, route registration before the 404 handler, and `errorHandler` last. Express 5 forwards rejected async handlers to it.
- Google authentication only: preserve state, PKCE, nonce/token validation, hashed database sessions, and HttpOnly/SameSite cookies (Secure in production). Never add login bypasses or store raw session/provider tokens. Re-login preserves edited name/theme; account deletion revokes all sessions.
- Same-origin `/api` proxying needs no CORS middleware. Add middleware/infrastructure only for a concrete need.

## API responses

- Keep `src/types/api.ts` aligned with frontend types: `{ status: 'success' | 'failure', message: string, data?: T, error?: string }`.
- Use `ApiStatus` and `satisfies ApiResponse<T>`. Require a useful `message`; return payloads under `data`. OAuth navigation uses redirects.
- Use appropriate HTTP codes: 200/201 success, 400 validation, 401 unauthorized, 403 invalid origin, 404 missing route, 500 unexpected failure. Keep unexpected failures generic; never expose database/internal details.

## Adding a database field

1. Edit `prisma/schema.prisma`; choose types/defaults/nullability that account for existing rows.
2. From `backend/`, create the migration and regenerate Prisma:

   ```sh
   npm run migrate:dev -- --name add_user_example_field
   npm run generate
   ```

   For custom backfills, add `--create-only`, edit the new migration SQL, then run `npm run migrate:dev` and `npm run generate`.
3. Review and commit schema plus migration SQL. Do not rewrite applied migrations, replace history with `db push`, or reset existing data for routine changes.
4. Update controller validation/writes and public projections, including `session.service.ts/currentUser` and profile selects. Update frontend types, response validators, service/store actions, UI, and relevant tests. `User.theme` is the existing end-to-end example.

Other commands (PostgreSQL must be running with a valid `DATABASE_URL`):

```sh
npm run migrate:deploy  # apply committed migrations
npm run generate       # regenerate client
npm run db:setup       # generate + migrate:deploy
npm run studio
```

## Setup and tests

- Local PostgreSQL 17; no Docker required. See `README.md` for database startup/connection commands. From this folder: `npm install`, `npm run setup`, `npm run dev`. Setup preserves existing `.env` and data.
- Keep environment validation in `src/config/env.ts` and document variables in `.env.example`. Defaults: backend 3001, frontend `http://localhost:5173`, Google callback `/api/auth/google/callback` under the frontend origin.
- Follow root Biome/typecheck guidance. Run backend tests with `TEST_DATABASE_URL="postgresql://johnhashim@localhost:5432/redaction_studio" npm test` (adjust credentials if needed).
- Tests use Supertest, injected Google providers, and a random PostgreSQL schema removed afterward. Preserve isolation; never clear application tables. Cover meaningful validation, auth/origin, persistence, and response behavior.
