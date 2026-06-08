#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && [ "$RUN_DB_SETUP" = "true" ]; then
  echo "Running database setup…"
  npx prisma db push
  npx tsx prisma/seed.ts
fi

exec "$@"
