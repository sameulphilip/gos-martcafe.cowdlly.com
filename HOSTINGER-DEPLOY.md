# نشر GO'S MART على Hostinger

## ⚠️ مهم جداً (أمان)

1. **غيّر كلمة مرور FTP فوراً** — تم مشاركتها في المحادثة.
2. **لا ترفع ملف `.env`** على السيرفر — استخدم Environment Variables من hPanel.
3. المشروع **Next.js + PostgreSQL** — **لا يعمل** برفع HTML فقط على `public_html`. تحتاج **Node.js** على Hostinger.

---

## المتطلبات

| المكوّن | الحل |
|---------|------|
| التطبيق | Hostinger → **Websites → Node.js Web App** |
| قاعدة البيانات | [Neon](https://neon.tech) (PostgreSQL مجاني) — Hostinger المشترك عادة MySQL فقط |
| الدومين | `gos-martcafe.cowdlly.com` |

---

## الخطوة 1 — قاعدة بيانات Neon (مجاني)

1. سجّل على [neon.tech](https://neon.tech) → Create project.
2. انسخ **Connection string** (PostgreSQL).
3. على جهازك، أنشئ `.env.production.local` (لا ترفعه):

```env
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=ضع-سلسلة-عشوائية-طويلة
NEXTAUTH_URL=https://gos-martcafe.cowdlly.com
NEXT_PUBLIC_SITE_URL=https://gos-martcafe.cowdlly.com
```

4. من مجلد المشروع:

```powershell
Set-Location -LiteralPath "C:\Users\samoi\Desktop\GO'S MART"
$env:DATABASE_URL="postgresql://..."
npm run db:setup
```

---

## الخطوة 2 — بناء حزمة الرفع

```powershell
Set-Location -LiteralPath "C:\Users\samoi\Desktop\GO'S MART"
node scripts/prepare-hostinger-deploy.js
```

سيُنشأ مجلد **`hostinger-deploy/`** جاهز للرفع.

---

## الخطوة 3 — Hostinger hPanel

### أ) Node.js Web App

1. **hPanel** → **Websites** → موقعك → **Node.js**.
2. **Create application**:
   - **Node.js version**: 18 أو 20
   - **Application root**: مجلد التطبيق (مثلاً `nodejs/gos-mart` أو حسب Hostinger)
   - **Application startup file**: `server.js`
   - **Run command**: `npm start`
3. **Environment variables** (نفس `.env.production.example`):
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` = `https://gos-martcafe.cowdlly.com`
   - `NEXT_PUBLIC_SITE_URL` = `https://gos-martcafe.cowdlly.com`
   - `NODE_ENV` = `production`

### ب) رفع الملفات (FTP)

- **Host**: `147.93.88.96` (أو hostname من hPanel)
- **User**: من hPanel → FTP Accounts
- **المجلد**: **جذر تطبيق Node.js** (ليس `public_html` لو كان للموقع الثابت فقط)

ارفع **محتويات** `hostinger-deploy/` (server.js, package.json, .next, public).

**FileZilla**: Protocol FTP أو SFTP حسب ما يظهر في hPanel.

### ج) تشغيل

1. hPanel → Node.js → **Run npm install** (إن وُجد).
2. **Restart** التطبيق.
3. افتح الرابط من hPanel وتأكد أن المنيو يعمل.

---

## الخطوة 4 — ربط Subdomain

### إذا `cowdlly.com` DNS عند Hostinger

hPanel → **Domains** → **Subdomains** → أضف `gos-martcafe.cowdlly.com` واربطه بتطبيق Node.js.

### إذا DNS عند مزود آخر

في إعدادات DNS لـ `cowdlly.com`:

| Type | Name | Value |
|------|------|--------|
| **CNAME** | `gos-martcafe` | `u736599894.peru-wren-914347.hostingersite.com` |

أو **A record** → `147.93.88.96` (إن طلب Hostinger ذلك).

انتظر 5–30 دقيقة ثم جرّب: `https://gos-martcafe.cowdlly.com`

---

## بعد النشر

- **المنيو**: `https://gos-martcafe.cowdlly.com`
- **Admin**: `https://gos-martcafe.cowdlly.com/admin/login`
- **Login**: `admin@gosmart.com` / `admin123` — **غيّر كلمة المرور بعد أول دخول**

---

## مشاكل شائعة

| المشكلة | الحل |
|---------|------|
| 503 / التطبيق لا يعمل | تأكد Node.js مفعّل و `npm start` و `server.js` في المجلد الصحيح |
| Admin login fails | `NEXTAUTH_URL` و `NEXTAUTH_SECRET` صحيحين + DB فيها admin من seed |
| لا بيانات | شغّل `db:setup` على Neon من جهازك |
| الصور المرفوعة تختفي | مجلد `public/uploads` يجب أن يبقى على السيرفر؛ لا تحذفه عند إعادة الرفع |

---

## بديل أسهل (إن Node.js غير متاح على خطتك)

- **Vercel** (مجاني لـ Next.js) + Neon + CNAME من `gos-martcafe.cowdlly.com` → Vercel.

إذا أردت، يمكن إعداد Vercel خطوة بخطوة في رسالة لاحقة.
