# Husie Independent — Historical Phase 3 build check

> Historical notes from the earlier Mirror Gram phase. For current deployment and verification status, see `PROJECT_STATUS.md` and `deploy/PRODUCTION_DEPLOYMENT.md`.

## Install

From the repository root:

```bash
npm install
```

The web and API packages are workspaces. No Supabase package or Supabase environment variable is required by the active runtime.

## Development

```bash
# Terminal 1
npm run dev:api

# Terminal 2
npm run dev:web
```

Set `DATABASE_URL` for PostgreSQL and `MIRROR_GRAM_API_URL=http://127.0.0.1:4000` for the web client.

## Database

Apply `db/001_independent_foundation.sql` to the PostgreSQL database. Docker Compose can initialize it automatically.

## Docker

```bash
docker compose up --build
```

The API listens on port 4000 and the web client on port 3000.

## Validation note

The Phase 3 source was statically inspected. A full `npm install` in the build sandbox timed out, so a complete production build was not falsely marked as successful in this environment.
