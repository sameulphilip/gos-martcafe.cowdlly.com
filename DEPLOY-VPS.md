# نشر GO'S MART على VPS

الدومين: **https://gos-mart.cowdlly.com**

---

## المتطلبات

| | |
|---|---|
| **VPS** | Ubuntu 22/24 — 1GB RAM على الأقل |
| **DNS** | A record: `gos-mart` → **IP الـ VPS** |
| **SSH** | root أو sudo user |

---

## الخطوة 1 — DNS

في إعدادات **cowdlly.com**:

| Type | Name | Value |
|------|------|--------|
| **A** | `gos-mart` | `IP_VPS` (مثلاً `147.93.40.224`) |

انتظر 5–30 دقيقة.

---

## الخطوة 2 — SSH للـ VPS

```bash
ssh root@YOUR_VPS_IP
```

---

## الخطوة 3 — تثبيت (مرة واحدة)

```bash
cd /opt
git clone https://github.com/sameulphilip/gos-martcafe.cowdlly.com.git gos-mart
cd gos-mart
cp deploy/vps/env.example .env
nano .env
```

عدّل `.env`:

```env
DB_PASSWORD=باسورد-قوي-لل-db
NEXTAUTH_SECRET=سلسلة-عشوائية-32-حرف
NEXTAUTH_URL=https://gos-mart.cowdlly.com
NEXT_PUBLIC_SITE_URL=https://gos-mart.cowdlly.com
RUN_DB_SETUP=true
```

ثم:

```bash
bash deploy/vps/install.sh
```

أو يدوياً:

```bash
# Docker
curl -fsSL https://get.docker.com | sh

# Nginx
apt install -y nginx certbot python3-certbot-nginx
cp deploy/vps/nginx-gos-mart.conf /etc/nginx/sites-available/gos-mart.cowdlly.com
ln -s /etc/nginx/sites-available/gos-mart.cowdlly.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# App
docker compose -f docker-compose.prod.yml up -d --build

# SSL
certbot --nginx -d gos-mart.cowdlly.com
```

---

## الخطوة 4 — بعد أول تشغيل ناجح

```bash
nano /opt/gos-mart/.env
# غيّر: RUN_DB_SETUP=false
docker compose -f docker-compose.prod.yml up -d
```

---

## تحديث الموقع (بعد push GitHub)

```bash
cd /opt/gos-mart
bash deploy/vps/update.sh
```

---

## الروابط

| | |
|---|---|
| المنيو | https://gos-mart.cowdlly.com |
| Admin | https://gos-mart.cowdlly.com/admin/login |
| Login | admin@gosmart.com / admin123 |

---

## أوامر مفيدة

```bash
cd /opt/gos-mart
docker compose -f docker-compose.prod.yml logs -f app
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml restart app
```

---

## مقارنة VPS vs Hostinger

| | VPS | Hostinger Shared |
|---|-----|------------------|
| Node.js | ✅ Docker | ⚠️ محدود |
| PostgreSQL | ✅ مع التطبيق | ❌ MySQL فقط |
| SSL | ✅ Certbot | ✅ |
| التحكم | كامل | محدود |
