# Husie migration notes

This working copy was created from the saved Mirror Gram Independent Phases 1–5 master ZIP. The original archive is unchanged.

## Brand
- App name: Husie
- Short description: Capture your reflection, share your light.
- Full description: Husie is where your moments reflect back. Post photos and videos, find your people, and keep memories in your own mirror. No noise, no fakes. Built in Mukono for the world.

## Account deletion
- Settings includes a Delete account link.
- `/delete-account` requires the signed-in user and exact confirmation phrase `DELETE HUSIE`.
- The page calls authenticated `POST /api/account/delete`.
- API deletes the user record (the schema's user relationships use cascading foreign keys) and removes user media paths.
- Must be tested against a disposable test account and deployed database before production use.

## Verification status
Brand changes are source edits only. Run `npm install`, `npm run typecheck:web`, `npm run typecheck:api`, and `npm run build:web` in a Node environment. Account deletion requires an integration test with a real test account and configured database/storage.

## Preservation
No changes were made to the original master ZIP. Backend environment names and existing API paths were intentionally kept stable to avoid unnecessary breakage.


## Migration v4 — home and Reflection Stories polish
- Replaced stale Phase 3 sidebar copy on the signed-in home feed with the official Husie message and direct links to Husie videos and account settings.
- Updated the home headline and tagline to match the approved Husie brand.
- Added a visible, accessible “Reflection Stories” section heading and explanatory copy above the existing stories bar.
- Preserved the existing story upload, like, comment, and viewing API calls; no story backend or database schema was changed.
- Added responsive styles for the refreshed home and stories layout.

## Verification note for v4
These are source-level UI edits. They have not been verified by a production build or by running the app against a configured database/API. Private Circles are not yet implemented as a complete end-to-end feature; they require a database schema, membership/access-control APIs, and UI before they can be called complete.

## Migration v5 — Phase 6 Private Circles foundation

- Added `db/002_private_circles.sql` for circles, memberships, and private text posts.
- Added membership-gated API routes to create/list circles, open circle details, invite/remove members, and publish private text posts.
- Added the responsive `/circles` screen and navigation entry.
- Security scope: circle details, members, and text posts require membership; owner/admin privileges are checked server-side.
- Limit: this first implementation supports text posts only. Private photo/video sharing is intentionally not claimed because the current media route serves public files and must be redesigned with authorization before private attachments are safe.
- Verification: source archive integrity is checked. Dependencies were not installed successfully in this environment, so production build/typecheck and live database integration tests remain unverified.

## Migration v6 — final Husie brand pass

- Updated root/web/API/mobile package identities to Husie.
- Confirmed web metadata and favicon point to Husie assets; Expo display name, slug, and icon are Husie-branded.
- Updated the mobile shell to prefer `EXPO_PUBLIC_HUSIE_WEB_URL` while retaining the previous variable as a compatibility fallback.
- Updated API health/log labels and live-stream defaults to Husie.
- Rewrote top-level architecture/deployment/status docs to match the self-hosted direction and current feature limitations.
- Kept legacy session-cookie, internal source aliases, and API environment variable names stable to avoid breaking existing sessions or deployment scripts.
- Preserved the original Mirror Gram master ZIP unchanged.

## Final handoff limitation

The source archive has been checked for ZIP integrity, but a successful production build, API typecheck, database migration run, Android build, and live integration tests have not been established in this environment. This is therefore the final branding/source edit, not a claim that a production release has been certified.
