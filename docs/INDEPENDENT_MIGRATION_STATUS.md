# Independent migration status — Phase 3

The independent application now owns the active runtime path for the web application.

### Completed
- PostgreSQL schema and API
- Own authentication/session cookies
- Feed, likes, comments, saves and reactions
- Messaging and notifications API
- Stories and story interactions
- Profiles, profile editing and media uploads
- Discover/search and follows
- Create photo/video posts and music upload
- Husie
- Live session records and camera/filter UI
- Public event map
- Reports
- Creator Studio
- Settings/sign-out

### Deliberately not claimed as complete
- Production live video transport/relay
- Authenticated production WebSocket delivery for every realtime feature
- FFmpeg/adaptive media processing
- Production object-storage replication/backups
- Final native mobile integration

The former Supabase/Vercel project remains outside this independent codebase as the fallback/reference application.
