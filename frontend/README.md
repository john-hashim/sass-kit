# Multimedia Redaction Studio frontend

Independent React + Vite + TypeScript app. Minimal Google login, protected dashboard, and sign-out. Use Node.js 22.12+.

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
npm run build
```

Features live under `src/feature/`, API code under `src/api/`, and shared types under `src/types/`. This app owns its package.json, lockfile, Biome settings, and .gitignore. Shared editor settings remain in `../.zed`; install the Biome extension in Zed.

For deployment later, serve SPA routes through `index.html` and proxy `/api` to the separately hosted backend under the frontend origin. The Vite proxy only runs in development. Direct cross-origin hosting will require API URL, CORS, and cookie configuration before deployment.
