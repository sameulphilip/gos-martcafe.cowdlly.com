#!/bin/bash
# One-time VPS setup (Ubuntu 22/24). Run as root:
#   curl -fsSL ... | bash   OR   bash install.sh
set -e

APP_DIR="/opt/gos-mart"
DOMAIN="gos-mart.cowdlly.com"
REPO="https://github.com/sameulphilip/gos-martcafe.cowdlly.com.git"

echo "==> Installing Docker…"
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

echo "==> Installing Nginx + Certbot…"
apt-get update -qq
apt-get install -y nginx certbot python3-certbot-nginx git

echo "==> Cloning app…"
mkdir -p "$APP_DIR"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO" "$APP_DIR"
else
  cd "$APP_DIR" && git pull
fi

cd "$APP_DIR"

if [ ! -f .env ]; then
  cp deploy/vps/env.example .env
  echo ""
  echo "⚠️  Edit $APP_DIR/.env (DB_PASSWORD, NEXTAUTH_SECRET) then run:"
  echo "    cd $APP_DIR && docker compose -f docker-compose.prod.yml up -d --build"
  exit 0
fi

echo "==> Nginx config…"
cp deploy/vps/nginx-gos-mart.conf "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> Building & starting containers…"
docker compose -f docker-compose.prod.yml up -d --build

echo "==> SSL (Let's Encrypt)…"
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@gosmart.com || true

echo ""
echo "✅ Done: https://$DOMAIN"
echo "   Admin: https://$DOMAIN/admin/login"
echo "   After first successful start, set RUN_DB_SETUP=false in .env"
