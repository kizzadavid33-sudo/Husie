# Husie — Independent Web

The Husie web client uses the independent Husie API. It does not require Supabase, Vercel, or Railway at runtime.

## Local run

From the repository root:

1. `npm install`
2. Start PostgreSQL and apply `db/001_independent_foundation.sql`, followed by `db/002_private_circles.sql` for Phase 6.
3. Set `DATABASE_URL` for the API and `MIRROR_GRAM_API_URL=http://127.0.0.1:4000` for the web app. The legacy variable name is retained for compatibility.
4. `npm run dev:api`
5. `npm run dev:web`

The Next.js app proxies `/api/*` and `/media/*` to the independent API. For a public HTTPS deployment, follow `deploy/PRODUCTION_DEPLOYMENT.md`.
