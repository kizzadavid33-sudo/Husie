# Mirror Gram Independent — Phase 3

Phase 3 continues directly from Independent Phase 2 and keeps the previous Supabase/Vercel application outside this project as the fallback/reference.

## Migrated to the independent backend
- Authentication and sessions
- Feed, post likes, comments and saves
- Post reactions API
- Post edit/delete API foundation
- Stories: upload, expiry, story profile identity, likes and comments
- Profile pages and profile editing, including avatar/cover uploads
- Discover/search and follow controls
- Create photo/video posts and optional music upload
- Husie video feed and interactions
- Live session records and camera/filter interface
- Public event map API
- Reports submission
- Creator Studio metrics
- Settings/sign-out
- Notifications and messaging continue on the independent API
- Own filesystem media storage under `storage/`
- Own PostgreSQL schema under `db/`
- Own Fastify API and WebSocket foundation

## Runtime independence
The active web/API source no longer imports or calls Supabase. Vercel is not required by the runtime. Next.js remains the web framework, PostgreSQL is the database, and the Fastify service owns API/auth/media operations.

## Remaining Phase 4 candidates
- Production-grade WebSocket authentication and notification delivery
- Full live video transport/relay infrastructure
- FFmpeg video processing, thumbnails, adaptive delivery and media optimization
- Advanced feed ranking/recommendations
- Story viewers/read receipts and richer privacy controls
- Full post replacement/edit media workflow and moderation tooling
- Production deployment hardening, backups, object storage replication and mobile app integration
