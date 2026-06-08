#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "Syncing database schema…"
  npx prisma db push --accept-data-loss

  if [ "$RUN_DB_SETUP" = "true" ]; then
    echo "Seeding menu from menu-data.json…"
    npx tsx prisma/seed.ts
    echo "Seed complete."
  fi
fi

exec "$@"
