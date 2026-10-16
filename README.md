# Husie — Independent Social App

**Capture your reflection, share your light.**

Husie is a social app for photos, videos, stories, creator discovery, following, messaging, notifications, live-stream foundations, profiles, safety tools, and account controls. Its public story is: *No noise, no fakes — built in Mukono for the world.*

## Independent architecture

This project runs with its own PostgreSQL database, Fastify/Node API, authentication/session system, filesystem-backed media storage, media worker, WebSocket realtime layer, and Next.js web app. It is designed for self-hosting and does not require Supabase, Vercel, or Railway at runtime. GitHub may still be used as a source-code repository, but is not an application runtime dependency.

## Main folders

- `apps/web` — Husie web experience (Next.js)
- `apps/api` — API, authentication, media endpoints, realtime, and worker
- `apps/mobile` — Expo Android/iOS shell that opens the hosted Husie web client
- `db` — ordered PostgreSQL schema migrations
- `storage` — persistent media storage mount (created/configured for deployment)
- `docker-compose.yml` — local/self-hosted services

## Local development

Requirements: a supported Node.js LTS release, npm, and Docker with Compose.

1. Copy `.env.example` to `.env` and change every example password before exposing any service.
2. Start the stack with `docker compose up --build`.
3. Open `http://localhost:3000` for the web app. The API health check is `http://localhost:4000/health`.

For a non-Docker setup, install dependencies with `npm install`, configure PostgreSQL and the documented environment variables, then use `npm run dev:api` and `npm run dev:web` in separate terminals.

## Self-hosted VPS deployment

For a public HTTPS deployment without Vercel or Railway, see `deploy/PRODUCTION_DEPLOYMENT.md`. The production starter uses `docker-compose.production.yml` and Caddy for HTTPS. It requires your own Ubuntu VPS and domain; it is not an automatic cloud hosting service. Do not expose the API or database directly to the internet.

## Database setup

The SQL files in `db/` are intended to run in filename order. The base independent foundation is `001_independent_foundation.sql`; the Private Circles addition is `002_private_circles.sql`. Back up the database before applying schema changes to an existing installation.

## Build and checks

- `npm run typecheck:web`
- `npm run typecheck:api`
- `npm run build:web`
- `npm run build:api`

Build/typecheck and live integration testing are **not marked complete** in this handoff because dependencies and a configured deployment database were not available for a successful verification here.

## Important deployment notes

- Set a strong, unique database password and protect `DATABASE_URL`.
- Configure `MIRROR_GRAM_API_URL` for the web app and `CORS_ORIGIN` for the real public web origin. The legacy variable name is retained for compatibility; it does not change the Husie brand.
- Set `EXPO_PUBLIC_HUSIE_WEB_URL` when building the mobile shell so it opens your actual hosted Husie site.
- Use HTTPS and persistent storage in production. Test account deletion and media cleanup with a disposable account before launch.
- Private Circles currently support private text posts. Private image/video attachments need authorization-aware media delivery before they can safely be enabled.

See `HUSIE_MIGRATION_NOTES.md` and `MASTER_ARCHITECTURE.md` for scope and verification notes.
