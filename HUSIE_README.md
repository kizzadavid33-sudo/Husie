# Husie — Independent Social App

**Tagline:** Capture your reflection, share your light.

**Description:** Husie is where your moments reflect back. Post photos and videos, find your people, and keep memories in your own mirror. No noise, no fakes. Built in Mukono for the world.

This project is a careful rebrand of the existing Mirror Gram Independent Phases 1–5 master project. Existing API routes, session cookie names, backend structure, and database identifiers are intentionally preserved for compatibility.

## Current migration phase

- Web-facing app name, page copy, metadata, and brand mark updated to Husie.
- Expo display name, slug, Android package metadata, and icon path updated.
- Settings now links to the Delete Account page.
- Delete Account requires the exact confirmation phrase `DELETE HUSIE` and calls the authenticated `/api/account/delete` endpoint.
- The API deletes the signed-in user's database row, relying on the schema's foreign-key cascades, and attempts to remove owned media files.

## Important verification notes

This package has passed ZIP/config JSON/source-wiring checks only. It has **not** been built or tested against a live PostgreSQL database in this environment. Before production, test with a disposable account and a backed-up test database, verify all cascade relationships and media cleanup, and run both web and API typechecks/builds. The native icon has been generated as a Husie blue-and-white mark, but store screenshots and final icon review are still required.

Private Circles are a planned feature and are not represented as fully implemented in this migration phase.
