#!/bin/bash
# Setup SSL for gos-mart.cowdlly.com on shared VPS
set -e

DOMAIN="gos-mart.cowdlly.com"
APP_DIR="/opt/gos-mart"
EMAIL="admin@gosmart.com"

echo "==> Ensure app on port 3010"
cd "$APP_DIR"
docker compose -f docker-compose.prod.yml up -d

mkdir -p /var/www/certbot

echo "==> Step 1: HTTP config (for Let's Encrypt challenge)"
cp "$APP_DIR/deploy/vps/nginx-gos-mart.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t && systemctl reload nginx

echo "==> Step 2: Get SSL certificate"
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  certbot certonly --webroot \
    -w /var/www/certbot \
    -d "$DOMAIN" \
    --non-interactive \
    --agree-tos \
    -m "$EMAIL" \
    || certbot certonly --nginx \
    -d "$DOMAIN" \
    --non-interactive \
    --agree-tos \
    -m "$EMAIL"
else
  echo "Certificate already exists."
fi

if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  echo "❌ Certificate failed. Check:"
  echo "   dig +short $DOMAIN   (must be this VPS IP)"
  echo "   curl -I http://$DOMAIN"
  exit 1
fi

echo "==> Step 3: Enable HTTPS nginx config"
cp "$APP_DIR/deploy/vps/nginx-gos-mart-ssl.conf" "/etc/nginx/sites-available/$DOMAIN"
nginx -t && systemctl reload nginx

echo "==> Step 4: Test"
curl -sI "https://$DOMAIN" | head -10

echo ""
echo "✅ SSL ready: https://$DOMAIN"
