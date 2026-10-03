# Backend preferences

- Keep this app simple: Express, TypeScript, Prisma, and local PostgreSQL. Do not introduce Docker or additional infrastructure unless requested.
- Authentication is Google only. Never add production login bypasses.
- Organize code under src/routes, controllers, services, middleware, types, and prisma.
- This folder is an independent npm app with its own lockfile, Biome configuration, and .gitignore. Do not add a root workspace package.
- Use Biome. Run targeted checks after routine changes; do not automatically run a full build.
- Keep credentials and local database data out of source control.
