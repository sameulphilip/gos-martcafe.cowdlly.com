# GO'S MART — Digital Menu System

A production-ready digital menu web application for **GO'S MART**, a student-focused cafe and gaming zone. Built with Next.js, TailwindCSS, PostgreSQL, and Prisma.

## Features

### Customer Menu
- Beautiful luxury restaurant-style UI (mobile-first)
- Hero section with GO'S MART branding and Arabic intro
- Scrollable category navigation pills
- Category cards with high-quality food images
- Menu item cards with badges (Popular, New, Chef Special, etc.)
- Item detail modal with smooth animations
- Search functionality
- Skeleton loading states
- Sticky category bar on scroll

### Admin Dashboard
- Secure login (NextAuth + credentials)
- Categories CRUD with image upload
- Items CRUD with tags, availability toggle, search & filter
- Live menu preview
- Analytics dashboard (total items, categories, daily views)

## Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS 4
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (JWT)
- **Uploads:** Local storage (`/public/uploads`)

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL) or a PostgreSQL instance

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 4. Set up database

```bash
npm run db:setup
```

This runs migrations and seeds sample menu data.

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the customer menu.

## Admin Access

- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email:** `admin@gosmart.com`
- **Password:** `admin123`

> Change the admin password in production!

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | No | List all categories |
| POST | `/api/categories` | Yes | Create category |
| PUT | `/api/categories/:id` | Yes | Update category |
| DELETE | `/api/categories/:id` | Yes | Delete category |
| GET | `/api/items` | No | List items (supports `?categoryId=` & `?search=`) |
| POST | `/api/items` | Yes | Create item |
| PUT | `/api/items/:id` | Yes | Update item |
| DELETE | `/api/items/:id` | Yes | Delete item |
| GET | `/api/menu` | No | Full menu + analytics |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Customer menu
│   ├── admin/                # Admin dashboard pages
│   └── api/                  # REST API routes
├── components/
│   ├── menu/                 # Customer UI components
│   └── admin/                # Admin UI components
├── lib/                      # Utilities, auth, prisma
└── types/                    # TypeScript types
prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Sample data
```

## Deployment

1. Set `DATABASE_URL` to your production PostgreSQL
2. Set a strong `NEXTAUTH_SECRET` (run `openssl rand -base64 32`)
3. Set `NEXTAUTH_URL` to your production domain
4. Run `npx prisma db push && npm run db:seed`
5. Deploy to Vercel, Railway, or any Node.js host

## License

Private — GO'S MART
