# Multimedia Redaction Studio frontend

Independent React + Vite + TypeScript app with Google login, a protected dashboard, and account settings. UI controls use shadcn/ui (Radix) with Tailwind CSS v4. Use Node.js 22.12+.

From this folder:

```sh
npm install
npm run dev
```

Open `http://localhost:5173`. Start the backend separately from `../backend`; its README describes local PostgreSQL and Google OAuth setup. Vite proxies `/api` to `http://127.0.0.1:3001`. Update the proxy if you change the backend port.

```sh
npm run check
npm run check:fix
npm run lint
npm run typecheck
npm test
npm run build
```

Features live under `src/feature/`, API code under `src/api/`, and shared types under `src/types/`. This app owns its package.json, lockfile, Biome settings, and .gitignore. Shared editor settings remain in `../.zed`; install the Biome extension in Zed.

Shared UI components live under `src/components/ui/`. Add more with `npx shadcn@latest add <component>`; configuration is in `components.json` and theme tokens are in `src/styles/global.css`.

The design system matches fitness-companion: `src/styles/colors.css` owns the palette, `global.css` maps the same token names, and the shared buttons, inputs, avatars, popovers, tooltips, sheets, and alert dialogs use its component implementations. Use the existing button variants (`primary`, `secondary`, `secondary-filled`, `app-special`, `destructive`, `ghost`, `subtle`) instead of overriding their colors or sizes. The sidebar and account-menu styles also follow that app, with Google account data and this studio's branding.

For deployment later, serve SPA routes through `index.html` and proxy `/api` to the separately hosted backend under the frontend origin. The Vite proxy only runs in development. Direct cross-origin hosting will require API URL, CORS, and cookie configuration before deployment.

State management follows fitness-companion: `src/store/index.ts` composes Zustand slices with development DevTools and exposes `useShallow` selector hooks. `userSlice` owns session restoration and sign-out; `accountSlice` owns profile updates, deletion, request flags, and errors. Components call store actions; slices call `authService`; services use the shared Axios client and `ENDPOINTS`. Shared API error handling lives in `src/api/errors.ts`. Keep form drafts and dialog visibility in local component state.

Google authentication uses HttpOnly cookies, so the store restores the current user from `/api/auth/me` on startup instead of persisting tokens or authentication in localStorage. Axios sends credentials and uses a 10-second timeout. Account changes update the shared user; sign-out, deletion, and expired sessions reset both slices. Session revisions prevent late requests from restoring a cleared user. Store and API tests cover these flows.

Frontend behavior tests are organized by slice in `src/store/slices/tests/userSlice.test.ts` and `accountSlice.test.ts`, with shared fixtures in `helpers.ts`. The focused API test verifies the actual Axios service transport configuration that slice tests mock out. Components remain focused on rendering, input drafts, and UI interactions.
