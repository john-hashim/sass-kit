# Multimedia Redaction Studio backend

Independent Express + TypeScript app using Prisma and local PostgreSQL. No Docker is required. Use Node.js 22.12+.

## Local database setup

PostgreSQL 17 is already installed on this Mac. Start its existing local cluster:

```sh
/opt/homebrew/opt/postgresql@17/bin/pg_ctl -D /opt/homebrew/var/postgresql@17 -l /opt/homebrew/var/postgresql@17/server.log start
/opt/homebrew/opt/postgresql@17/bin/createdb -h localhost -p 5432 -U johnhashim redaction_studio
/opt/homebrew/opt/postgresql@17/bin/psql -h localhost -p 5432 -U johnhashim -d redaction_studio
```

Exit psql with `\q`. If the server is already running or the database already exists, skip the corresponding command. The default local connection is:

```dotenv
DATABASE_URL="postgresql://johnhashim@localhost:5432/redaction_studio?schema=public"
```

This assumes your existing PostgreSQL cluster has the local role `johnhashim`. If it requests a password, use that role's password and URL-encode it in the connection URL. No authentication settings are changed by this app.

In TablePlus create a **PostgreSQL** connection with host `localhost`, port `5432`, user `johnhashim`, and database `redaction_studio`. Use your existing role password if required, then click Connect.

To stop the server later:

```sh
/opt/homebrew/opt/postgresql@17/bin/pg_ctl -D /opt/homebrew/var/postgresql@17 stop
```

Prisma uses the [PostgreSQL connector](https://www.prisma.io/docs/orm/v6/overview/databases/postgresql); `psql` is PostgreSQL's command-line client.

## Start the backend

From this folder:

```sh
npm install
npm run setup
npm run dev
```

Setup preserves existing `.env` and database data, generates the Prisma client, and applies committed migrations. PostgreSQL listens on port 5432; the app uses database `redaction_studio`. The backend listens at `http://localhost:3001`; `/health` verifies the database connection. Start the frontend separately from `../frontend`.

## Google sign-in setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select or create a project.
2. Configure the Google Auth Platform branding, audience, and OAuth consent screen. If the app is in testing, add your Google account as a test user.
3. Create an OAuth client with application type **Web application**.
4. Set the authorized JavaScript origin to `http://localhost:5173` and the authorized redirect URI to **`http://localhost:5173/api/auth/google/callback`**. The URI must match exactly; use `localhost` consistently.
5. Add the client ID and secret to `.env`:

```dotenv
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

Restart the backend with `npm run dev`, open the login page, and choose **Sign in with Google**. The client secret stays on the backend. Only `openid`, `email`, and `profile` are requested; Google access and refresh tokens are not stored.

The backend validates OAuth state, PKCE, the ID token, and nonce before creating a session. Users are identified by Google's stable subject ID. Sessions are stored as hashes in PostgreSQL and sent as HttpOnly cookies; sign-out revokes the database session. See [Google's OpenID Connect documentation](https://developers.google.com/identity/openid-connect/openid-connect).

## Commands

```sh
npm run check
npm run check:fix
npm run lint
npm run typecheck
TEST_DATABASE_URL="postgresql://johnhashim@localhost:5432/redaction_studio" npm test
npm run db:setup
npm run studio
```

Auth integration tests require `TEST_DATABASE_URL` and use a random isolated schema that is removed afterward; application tables are untouched. After schema changes, run `npm run migrate:dev -- --name describe_change` and commit the migration. Prisma 6 matches the reference app's schema configuration; the dependency override updates `deepmerge-ts` to its patched version.

Code is organized under `src/routes`, `controllers`, `services`, `middleware`, `config`, `prisma`, `types`, and `tests`. This app owns its package.json, lockfile, Biome settings, and .gitignore. Shared editor settings remain in `../.zed`.

For deployment later, configure HTTPS and a PostgreSQL database. Current authentication expects the frontend and `/api` under one browser origin; separate hosting services can use a proxy. Direct cross-origin hosting will require API URL, CORS, and cookie configuration before deployment. Set the registered Google callback and frontend URLs to match your deployment.

The old ignored SQLite file is preserved locally, but the app no longer uses it. This setup starts a new PostgreSQL database; it does not transfer any existing SQLite rows.
