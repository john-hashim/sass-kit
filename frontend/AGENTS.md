# Frontend preferences

- Keep this app simple: React, Vite, and TypeScript. Keep UI limited to Google login and dashboard until requested.
- Put features under src/feature/<feature>/, shared types under src/types/, and API paths/services under src/api/.
- Prefer @/ imports across frontend areas. Feature styles and tests go in nearby styles/ and tests/ subdirectories.
- This folder is an independent npm app with its own lockfile, Biome configuration, and .gitignore. Do not add a root workspace package.
- Use Biome. Run targeted checks after routine changes; do not automatically run a full build.
- Keep credentials out of source control. Google client secrets belong only in the backend.
