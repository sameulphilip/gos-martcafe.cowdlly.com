#!/bin/bash
# One-time: create tables + import 104 items from menu-data.json
set -e
cd /opt/gos-mart

grep -q '^RUN_DB_SETUP=true' .env || sed -i 's/^RUN_DB_SETUP=.*/RUN_DB_SETUP=true/' .env

echo "==> Rebuild app (fixes .next/cache permissions + db schema)"
docker compose -f docker-compose.prod.yml up -d --build

echo "==> Waiting for seed…"
sleep 15
docker compose -f docker-compose.prod.yml logs --tail 40 app

echo "==> Item count:"
docker compose -f docker-compose.prod.yml exec db \
  psql -U gosmart -d gosmart -c 'SELECT COUNT(*) AS items FROM "Item";'

sed -i 's/^RUN_DB_SETUP=.*/RUN_DB_SETUP=false/' .env
docker compose -f docker-compose.prod.yml up -d

echo "✅ Done — open https://gos-mart.cowdlly.com"
