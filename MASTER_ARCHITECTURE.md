# Husie — Independent Architecture, Phases 1–6

This package consolidates the independent Mirror Gram foundation under the approved Husie brand. The original source archive remains unchanged.

## Runtime components

- Next.js web application in `apps/web`
- Fastify/Node API in `apps/api`
- PostgreSQL database with ordered SQL migrations in `db/`
- Persistent filesystem media storage and background media worker
- HTTP-only session cookies and PostgreSQL-backed sessions
- WebSocket realtime foundation
- Expo mobile shell that opens the independently hosted Husie web client
- Docker Compose orchestration for self-hosting

## Product scope present in source

- Accounts, profiles, public feed, post interactions, follows, discovery, stories, messaging, notifications, reports/safety screens, live-stream foundation, language settings, and account deletion flow
- Husie branding, Reflection Stories presentation, and responsive navigation
- Phase 6 Private Circles: circle creation/listing, membership operations, and membership-gated private text posts

## Known limits / verification

- Private Circles do not yet support private photo/video attachments; media delivery must enforce membership before those are added.
- The delete-account path must be integration-tested against a disposable account and configured database/storage.
- Production build/typecheck and live API/database tests are not certified by this source handoff.
- Keep all passwords and private environment values out of source control. Configure HTTPS, persistent storage, backups, and server-specific origins before launch.
