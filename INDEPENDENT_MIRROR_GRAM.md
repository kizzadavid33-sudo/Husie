# Husie — Independent Foundation

This is the independent, self-hosted foundation for Husie, renamed from the earlier Mirror Gram project. The original master ZIP is preserved separately.

## Runtime goal

Run Husie with its own API, PostgreSQL database, authentication/session layer, media storage, media worker, and WebSocket realtime layer. Supabase, Vercel, and Railway are not required as runtime services. GitHub can remain a source repository, not a runtime dependency.

## Main services

- `apps/web` — Husie web interface
- `apps/api` — Fastify API and worker
- `apps/mobile` — Expo shell for the hosted Husie web client
- `db/` — database migrations

Legacy internal environment-variable, cookie, and source-folder identifiers are retained where changing them could invalidate existing setups or sessions. They are not user-facing branding.
