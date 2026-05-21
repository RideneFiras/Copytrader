# Copytrader — Premium Trading Signals SaaS

A production-ready mini SaaS for delivering daily copy-trading signals with subscription gating and affiliate monetization. Built with a premium dark theme (black / gold / glassmorphism), inspired by Stripe, Linear, and modern trading dashboards.

---

## ✨ Features

- **Auth**: Register / Login with JWT.
- **Daily signals**: XAUUSD and more — asset, direction, entry, TP, SL.
- **Subscription gating**: Free users see one signal per day; premium unlocks everything (no Stripe wired — flag in DB).
- **Performance dashboard**: Win rate, pies, bars, full trade history.
- **Affiliate section**: GoAI promo block with affiliate link.
- **Hidden admin panel**: Click the logo **5 times** → password prompt → admin dashboard.
- **Admin**: Create/edit/delete signals, view users, toggle premium, view stats.
- **Production extras**: Toast notifications, loading skeletons, error UI, pino logging, rate limiting, mongo-sanitize, helmet, HPP, validation with zod.

---

## 🧱 Architecture

```
Copytrader/
├── backend/                # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── app.js          # Express app factory
│   │   ├── server.js       # Bootstrap + graceful shutdown
│   │   ├── config/         # env + db
│   │   ├── controllers/    # auth, signals, admin
│   │   ├── middlewares/    # auth, validate, error, rate limit
│   │   ├── models/         # User, Signal (Mongoose)
│   │   ├── routes/         # /api/auth, /api/signals, /api/admin
│   │   ├── utils/          # logger, ApiError, asyncHandler, seed
│   │   └── validators/     # zod schemas
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React (Vite) + Tailwind + Framer Motion
│   ├── src/
│   │   ├── pages/          # Landing, Login, Register, Dashboard,
│   │   │                   #  Performance, Affiliate, Admin, NotFound
│   │   ├── components/     # Navbar, Logo, SignalCard, Skeleton, …
│   │   ├── context/        # AuthContext (JWT in localStorage)
│   │   ├── lib/            # axios client
│   │   └── App.jsx
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # mongo + backend + frontend
└── README.md
```

### API surface

| Method | Path                              | Auth        | Notes                        |
| ------ | --------------------------------- | ----------- | ---------------------------- |
| GET    | `/api/health`                     | —           | Health check                 |
| GET    | `/api/affiliate`                  | —           | Returns the GoAI URL         |
| POST   | `/api/auth/register`              | —           | Create account               |
| POST   | `/api/auth/login`                 | —           | Login → JWT                  |
| GET    | `/api/auth/me`                    | user        | Current user                 |
| GET    | `/api/signals`                    | user        | List signals (gated for free)|
| GET    | `/api/signals/stats`              | user        | Aggregate performance        |
| POST   | `/api/admin/auth`                 | —           | Admin password → JWT         |
| GET    | `/api/admin/stats`                | admin       | Admin dashboard stats        |
| GET    | `/api/admin/users`                | admin       | List/search users            |
| PATCH  | `/api/admin/users/:id/premium`    | admin       | Toggle premium (days)        |
| POST   | `/api/admin/signals`              | admin       | Create signal                |
| PATCH  | `/api/admin/signals/:id`          | admin       | Update / close / set result  |
| DELETE | `/api/admin/signals/:id`          | admin       | Delete signal                |

---

## 🚀 Local development

### Prereqs
- Node.js 18+
- MongoDB 6+ (or use docker-compose below)

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit JWT_SECRET, ADMIN_PASSWORD
npm install
npm run seed        # creates admin + demo user + sample signals
npm run dev
```

Backend runs on http://localhost:5000.

**Seeded credentials:**
- Demo user: `demo@copytrader.local` / `demopass123`
- Admin password (used in the hidden admin panel prompt): value of `ADMIN_PASSWORD` in `.env`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on http://localhost:5173 with `/api` proxied to `:5000`.

### 3. Hidden admin panel

1. Click the **logo** in the navbar **5 times** within ~1.5s.
2. Enter `ADMIN_PASSWORD`.
3. You're in.

---

## 🐳 Docker (one command)

```bash
JWT_SECRET=$(openssl rand -hex 32) \
ADMIN_PASSWORD=changeme \
docker compose up -d --build
```

- Frontend → http://localhost:8080
- Backend  → http://localhost:5000
- Mongo    → mongodb://localhost:27017/copytrader

Seed inside the running backend container:

```bash
docker compose exec backend node src/utils/seed.js
```

---

## ☁️ Deployment

### Backend (Render / Railway / Fly / VPS)

1. Push this repo to GitHub.
2. Create a new **Web Service** pointed at `/backend`.
3. Build command: `npm install`.
4. Start command: `node src/server.js`.
5. Set env vars:
   - `MONGODB_URI` (use MongoDB Atlas — free tier works fine)
   - `JWT_SECRET` (a long random string, e.g. `openssl rand -hex 32`)
   - `ADMIN_PASSWORD`
   - `CLIENT_ORIGIN` (your frontend URL)
   - `GOAI_AFFILIATE_URL`
6. After first deploy, run `node src/utils/seed.js` in the host's shell to bootstrap an admin and demo data (optional).

### Frontend (Vercel / Netlify)

1. New project from this repo → root `/frontend`.
2. Framework preset: **Vite**.
3. Build command: `npm run build`. Output: `dist`.
4. Env var: `VITE_API_URL=https://your-backend.example.com/api`.
5. Done.

### MongoDB

Easiest: **MongoDB Atlas** → create cluster → whitelist `0.0.0.0/0` (or your render egress IP) → grab the connection string → set as `MONGODB_URI`.

---

## 🛡 Security & scalability notes

- **Helmet** + **CORS allowlist** + **HPP** + **mongo-sanitize**.
- **express-rate-limit** with stricter limits on `/api/auth/*` and `/api/admin/auth`.
- Bcrypt with cost 12, JWT signed with `JWT_SECRET`.
- Mongoose `maxPoolSize: 50`, indexes on `email`, `publishedAt`, `status`, `result`, `isPremiumOnly` — comfortably handles 1k concurrent users on a single dyno; scale horizontally behind any load balancer (server is stateless).
- Frontend lazy-loads every route, splits vendor bundles (react / motion / charts), enables long-lived static asset cache and gzip via nginx.

---

## 🧪 Smoke test

```bash
# Backend up?
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"name":"T","email":"t@t.com","password":"password123"}'
```

---

## 📜 License

MIT. Trading involves risk; this software ships signals as-is with no warranty.
