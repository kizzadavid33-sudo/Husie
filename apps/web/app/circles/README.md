# Private Circles — Phase 6

This phase adds circle creation, member invitations/removal, member lists, and private text posts.

Before running the app against a database, apply `db/002_private_circles.sql` after `db/001_independent_foundation.sql`.

Security notes:
- Circle detail, member lists, and circle posts are returned only after the API verifies membership.
- Only owners/admins can invite or remove other members.
- Members can leave a circle; the owner must transfer ownership before leaving.
- Circle content in this phase is text-only. Private photo/video attachments require a separate authenticated media delivery layer; they must not reuse public `/media/*` URLs. Do not advertise private media sharing as implemented yet.
