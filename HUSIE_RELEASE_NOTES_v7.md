# Husie source handoff — v7 deployment preparation

## Included

- Husie public branding, metadata, logo/favicon, Reflection Stories and existing account-delete flow.
- Phase 6 Private Circles with membership-checked text posts.
- Independent PostgreSQL + Fastify API + Next.js web app + filesystem media worker.
- Production Docker Compose starter with PostgreSQL health checks, internal-only API/database, persistent media, and Caddy HTTPS reverse proxy.
- Environment template, deployment launcher, VPS deployment guide, backup and first-run test instructions.
- Updated app manifest and CI-facing display names to Husie where safe.

## Compatibility choices

The old `mirrorgram_session` cookie and `MIRROR_GRAM_API_URL` environment variable remain as internal compatibility names. They are not public branding. Changing these without a coordinated migration could invalidate sessions or break proxy configuration.

## Checks completed for this handoff

- ZIP archive integrity checked after packaging.
- Production/local Compose YAML parsed successfully.
- JSON app/package manifests parsed successfully.
- Deployment shell script passed `sh -n`.
- Static checks confirmed the production Compose file does not publish PostgreSQL or API host ports.

## Not yet verified

Docker is not installed in the current working environment, and the earlier npm dependency installation did not complete. Therefore Docker image builds, Next.js/API typechecks and builds, database integration, account deletion, Private Circles authorization, and Android device tests are not certified. Do not invite public users until those checks pass on the actual server.

## Important limits

- Private Circles currently support text posts; private photo/video delivery needs membership-aware media authorization.
- Upload limit remains 50 MB.
- The live page is a foundation, not a verified production multi-viewer streaming pipeline.
- A public HTTPS URL requires a VPS, domain DNS pointing to it, and ports 80/443 open.
