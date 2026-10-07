# Multimedia Redaction Studio

- Read `frontend/AGENTS.md` and `backend/AGENTS.md` for the area being changed; cross-stack changes follow both.
- Frontend: React/Vite/TypeScript, Zustand, Axios, shadcn/Radix, Tailwind v4, and Sonner. Backend: Express 5/TypeScript, Prisma 6, and local PostgreSQL. Use Node.js 22.12+.
- Both folders are independent npm apps with their own lockfiles, Biome configs, and .gitignore. Run commands inside the relevant app; do not add a root npm workspace.
- No Docker or additional infrastructure is required. Keep the local setup simple unless requested otherwise.
- Implemented: Google login/cookie sessions, protected dashboard, responsive studio layout, account editing/deletion, persisted themes, shared controls, notifications, and tests. Files and Activity Log are placeholders.
- Preserve existing work. Keep secrets, `.env`, local database data, and generated output out of source control. Google client secrets belong only in the backend.

## Tooling

- Use each app's `biome.json` as the source of truth; do not introduce ESLint/Prettier. Format: two spaces, LF, 100 columns, single JS/TS quotes, double JSX quotes, semicolons as needed, ES5 trailing commas.
- Preserve lint exceptions, import organization, ignored paths, and frontend Tailwind/CSS parser settings. `.zed/` uses the nearest app's Biome for formatting.
- Run targeted `npx biome check <files>`, `npm run typecheck`, and relevant behavior tests. Do not automatically run full builds for routine edits.
- See each app's README for setup and deployment details.
