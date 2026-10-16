# Husie self-hosted deployment (production starter)

This guide prepares the independent Husie stack for a Linux VPS. It does not require Vercel or Railway. A real public URL requires a server and a domain name; this package does not provision or pay for either.

## Server prerequisites

- Ubuntu 24.04 LTS (recommended)
- 4 vCPU, 8 GB RAM, and at least 160 GB SSD for a small initial community; more storage is needed as videos grow
- Public IPv4, a domain you control, and inbound TCP ports 80 and 443 available
- Docker Engine with the Docker Compose plugin

## First deployment

1. Upload and extract the Husie source ZIP on the server.
2. Point the domain's DNS `A` record to the VPS public IPv4. Wait for DNS to resolve.
3. Copy `.env.production.example` to `.env`.
4. Set `HUSIE_DOMAIN` to the actual hostname and set `POSTGRES_PASSWORD` to a long random secret. For example, generate one with `openssl rand -hex 32`; never paste the resulting secret into chat or commit `.env` to Git.
5. Run `./deploy/launch-production.sh` from the project root.
6. Wait for the containers to build and for Caddy to obtain HTTPS certificates, then open `https://YOUR_DOMAIN`.
7. Check `docker compose -f docker-compose.production.yml ps` and `docker compose -f docker-compose.production.yml logs --tail=100 api web caddy` if the site does not load.

The API and database are not published directly to the public host ports in this production compose file. Caddy exposes only HTTP/HTTPS and proxies the web app; the web app forwards API/media paths to the internal API service.

## Database migrations and backups

On a fresh PostgreSQL volume, PostgreSQL runs SQL files in `db/` in filename order during first initialization. If a database volume already exists, adding a new SQL file does **not** automatically run it. Back up first, then apply the new migration explicitly, for example:

```sh
docker compose -f docker-compose.production.yml exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < db/002_private_circles.sql
```

Before a production migration, make a database backup. A simple manual backup command is:

```sh
mkdir -p backups
docker compose -f docker-compose.production.yml exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > "backups/husie-$(date +%Y%m%d-%H%M%S).sql"
```

Back up the `storage/` directory separately; it contains uploaded media. Keep backups off the VPS as well.

## First-run acceptance checks

Use a disposable test account first. Confirm:

- sign-up, log-in, log-out, and session persistence
- profile edit, public feed, create post, upload and play back media
- stories, likes, comments, follows, discovery, and messaging
- Private Circles: outsider requests must fail; only invited members can read circle details/posts
- account deletion removes the account and associated media as intended
- HTTPS, browser refreshes, mobile layout, and playback on a real Android phone
- database and media backups can be restored

## Important limits

- This is deployment scaffolding, not proof that the app is production-ready. The full production build, API/database integration tests, and Android device checks must pass on the server before inviting users.
- Private Circles currently support text posts. Private photo/video attachments need separate authorization-aware media delivery.
- The media upload cap is currently 50 MB in the API. Increasing it safely requires matching multipart, proxy, and storage limits and testing large uploads.
- Live pages are a foundation and do not yet prove a production multi-viewer streaming pipeline.
- Keep `.env` private. Change example secrets, configure server firewall/updates, and establish tested backups before public launch.
