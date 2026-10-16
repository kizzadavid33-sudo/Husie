#!/usr/bin/env sh
set -eu

if [ ! -f .env ]; then
  echo "Missing .env. Copy .env.production.example to .env and configure it first." >&2
  exit 1
fi
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker Engine and the Docker Compose plugin first." >&2
  exit 1
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin is required (docker compose)." >&2
  exit 1
fi
if grep -q 'REPLACE_WITH_A_LONG_RANDOM_PASSWORD' .env; then
  echo "Replace the example database password in .env before deployment." >&2
  exit 1
fi
if grep -q '^HUSIE_DOMAIN=husie.example.com$' .env; then
  echo "Set HUSIE_DOMAIN to your real domain before deployment." >&2
  exit 1
fi
mkdir -p storage
chmod 700 storage
docker compose -f docker-compose.production.yml up -d --build
printf '\nHusie containers have been started.\n'
printf 'Check status: docker compose -f docker-compose.production.yml ps\n'
printf 'Check API readiness: docker compose -f docker-compose.production.yml exec api node -e "fetch(\047http://127.0.0.1:4000/ready\047).then(async r=>{console.log(r.status,await r.text());process.exit(r.ok?0:1)}).catch(e=>{console.error(e);process.exit(1)})"\n'
printf 'Open: https://%s (after DNS points here and ports 80/443 are reachable).\n' "$(sed -n 's/^HUSIE_DOMAIN=//p' .env | tail -n 1)"
