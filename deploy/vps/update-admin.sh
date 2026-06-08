#!/bin/bash
# Update admin login without re-seeding the menu.
# Usage: ADMIN_EMAIL="you@email.com" ADMIN_PASSWORD="your-password" ./deploy/vps/update-admin.sh

set -e
cd "$(dirname "$0")/../.."

if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
  echo "Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... ./deploy/vps/update-admin.sh"
  exit 1
fi

COMPOSE="docker compose -f docker-compose.prod.yml"

# Script is on the host after git pull; the running image may not include it yet.
$COMPOSE cp prisma/update-admin.ts app:/app/prisma/update-admin.ts

$COMPOSE exec \
  -e ADMIN_EMAIL \
  -e ADMIN_PASSWORD \
  app npx tsx prisma/update-admin.ts

echo "Done. Log in at /admin with the new credentials."
