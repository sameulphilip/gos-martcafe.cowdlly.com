#!/bin/bash
# Update app on VPS: bash deploy/vps/update.sh
set -e
cd /opt/gos-mart

git pull origin main
export RUN_DB_SETUP=false
docker compose -f docker-compose.prod.yml up -d --build

echo "✅ Updated → https://gos-mart.cowdlly.com"
