# Mini CRM — Initial Project Setup

Set up the complete project skeleton for a Mini CRM application with React frontend, Express backend, and Prisma/PostgreSQL database. **No business modules** — only infrastructure, layout, and routing.

## Proposed Changes

### Frontend (`frontend/`)

Scaffold a **React + Vite + TypeScript** project with Tailwind CSS v4, React Router v7, React Hook Form, Zod, and TanStack Query.

#### [NEW] Project Config Files
| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | TypeScript configuration |
| `vite.config.ts` | Vite config with React plugin & proxy to backend |
| `tailwind.config.js` | Tailwind theme (blue primary, slate secondary) |
| `postcss.config.js` | PostCSS with Tailwind & autoprefixer |
| `index.html` | HTML entry point |
| `.env.example` | Environment variable template |

#### [NEW] Source Structure (`frontend/src/`)
```
src/
├── main.tsx                    # App entry
├── App.tsx                     # Router setup
├── index.css                   # Tailwind directives + global styles
├── vite-env.d.ts               # Vite type declarations
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx       # Main layout (sidebar + header + content)
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── Header.tsx          # Top header bar
│   └── ui/                     # (empty — for future reusable components)
│
├── pages/
│   ├── LoginPage.tsx           # Login form page
│   └── DashboardPage.tsx       # Dashboard placeholder
│
├── routes/
│   ├── AppRoutes.tsx           # Route definitions
│   └── ProtectedRoute.tsx      # Auth guard (placeholder)
│
├── hooks/                      # (empty — for future custom hooks)
├── services/                   # (empty — for future API services)
├── types/                      # (empty — for future shared types)
├── utils/                      # (empty — for future utilities)
└── lib/
    └── queryClient.ts          # TanStack Query client
```

**Key design decisions:**
- **Tailwind CSS v3** — stable, well-documented, compatible with `tailwind.config.js` approach.
- **Vite proxy** — `/api` proxied to `http://localhost:5000` for dev.
- **ProtectedRoute** — placeholder that currently always renders children (no real auth yet).
- **AppLayout** — wraps authenticated pages with Sidebar + Header.
- **UI Theme** — Professional, modern, clean. Blue primary (#2563eb / blue-600), Slate secondary. Dark sidebar, light content area.

---

### Backend (`backend/`)

Scaffold an **Express + TypeScript** server with Prisma ORM.

#### [NEW] Project Config Files
| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript config |
| `.env.example` | Environment variable template |

#### [NEW] Source Structure (`backend/src/`)
```
src/
├── index.ts                    # Server entry point
├── app.ts                      # Express app setup (CORS, JSON, routes)
│
├── config/
│   └── env.ts                  # Environment variable validation
│
├── routes/
│   ├── index.ts                # Route aggregator
│   └── health.routes.ts        # GET /api/health
│
├── controllers/                # (empty — for future controllers)
├── middlewares/                 # (empty — for future middlewares)
├── services/                   # (empty — for future services)
├── types/                      # (empty — for future types)
└── utils/                      # (empty — for future utilities)
```

**Key design decisions:**
- **Port 5000** — matches the Vite proxy target.
- **CORS** — configured to allow `http://localhost:5173` (Vite dev server).
- **Health check** — `GET /api/health` returns `{ status: "ok", timestamp }`.
- **ts-node-dev** — for hot-reloading during development.

---

### Database (`database/`)

#### [NEW] Prisma Configuration
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Prisma schema with User model only |
| `.env.example` | DATABASE_URL template |
| `package.json` | Prisma CLI dependency |

#### User Model
```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(SALES_EXECUTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  SALES_MANAGER
  SALES_EXECUTIVE
}
```

Per the PRD, target users are Admin, Sales Manager, and Sales Executive — mapped to an enum.

---

## Verification Plan

### Automated Tests
```bash
# Frontend — should start without errors
cd frontend && npm install && npm run dev

# Backend — should start without errors
cd backend && npm install && npm run dev

# Database — Prisma should validate schema
cd database && npx prisma validate
```

### Manual Verification
- Frontend loads on `http://localhost:5173`
- Login page renders at `/login`
- Dashboard renders at `/` with sidebar & header
- Backend responds to `GET http://localhost:5000/api/health`
- Prisma schema validates without errors
