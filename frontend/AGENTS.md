# Frontend preferences

- Keep this app simple: React, Vite, and TypeScript. Keep UI limited to Google login and dashboard until requested.
- Put features under src/feature/<feature>/, shared types under src/types/, and API paths/services under src/api/.
- Prefer @/ imports across frontend areas. Feature styles and tests go in nearby styles/ and tests/ subdirectories.
- Use shadcn/ui components under src/components/ui/ for UI controls. Add components with the shadcn CLI and keep the configured Tailwind theme.
- Match fitness-companion's design system: src/styles/colors.css owns the palette, global.css maps its semantic tokens, and shared components use the copied button variants (primary, secondary, secondary-filled, app-special, destructive, ghost, subtle). Keep feature layout styles local; do not add global control overrides or replace the reference component styles with CLI defaults.
- This folder is an independent npm app with its own lockfile, Biome configuration, and .gitignore. Do not add a root workspace package.
- Use Biome. Run targeted checks after routine changes; do not automatically run a full build.
- Keep credentials out of source control. Google client secrets belong only in the backend.

- Follow fitness-companion’s state/API structure: compose Zustand slices under src/store/slices/, expose useShallow selector hooks from src/store/index.ts, and call Axios service objects through store actions. Keep request flags/errors in slices and form drafts/dialog visibility local. Preserve backend cookie authentication; do not persist credentials or authenticated state in localStorage.

- Prioritize frontend behavior tests at the Zustand slice layer. Keep one test file per slice in src/store/slices/tests/ and shared fixtures in helpers.ts. Add component tests only for meaningful UI behavior; retain focused API contract tests where mocked slice tests cannot verify transport behavior.
