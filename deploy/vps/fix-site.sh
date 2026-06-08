#!/bin/bash
# Fix gos-mart.cowdlly.com showing wrong site on shared VPS
set -e

DOMAIN="gos-mart.cowdlly.com"
APP_DIR="/opt/gos-mart"
PORT=3010

echo "==> Pull latest + start app on port $PORT"
cd "$APP_DIR"
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build

echo "==> Wait for app…"
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:$PORT" >/dev/null 2>&1; then
    echo "✓ App responding on $PORT"
    break
  fi
  sleep 2
  if [ "$i" -eq 30 ]; then
    echo "✗ App NOT on $PORT — logs:"
    docker compose -f docker-compose.prod.yml logs --tail 50 app
    exit 1
  fi
done

echo "==> Install nginx config for $DOMAIN only"
cp "$APP_DIR/deploy/vps/nginx-gos-mart.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"

echo "==> Other configs that mention this domain:"
grep -rl "$DOMAIN" /etc/nginx/sites-available/ 2>/dev/null | grep -v "$DOMAIN" || echo "(none)"

echo "==> Default SSL/HTTP servers (may steal HTTPS traffic):"
grep -rn "default_server" /etc/nginx/sites-enabled/ 2>/dev/null || echo "(none marked default_server)"

nginx -t
systemctl reload nginx

echo "==> HTTP test (must be GO'S MART / Next.js):"
curl -sI -H "Host: $DOMAIN" http://127.0.0.1 | head -5

echo "==> SSL certificate for $DOMAIN"
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "Getting certificate…"
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@gosmart.com || true
else
  echo "Certificate exists, renewing nginx binding…"
  certbot --nginx -d "$DOMAIN" --non-interactive || true
fi

nginx -t && systemctl reload nginx

echo ""
echo "==> HTTPS test:"
curl -sI "https://$DOMAIN" | head -8 || echo "HTTPS not ready yet — try http://$DOMAIN"

echo ""
echo "✅ If wrong site still shows in browser:"
echo "   1) Hard refresh Ctrl+Shift+R"
echo "   2) Try incognito"
echo "   3) Confirm URL is exactly https://gos-mart.cowdlly.com"
