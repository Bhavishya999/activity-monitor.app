# Git Activity Monitor — Frontend

Internal analytics dashboard for tracking GitHub commit activity across all company repositories, teams, and developers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) + [Vite 5](https://vitejs.dev/) |
| Routing | [TanStack Router v1](https://tanstack.com/router) (type-safe, `createRoute` API) |
| Data fetching | [TanStack Query v5](https://tanstack.com/query) (server state, stale-while-revalidate) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (CSS variables, `@theme`) |
| UI primitives | [Radix UI](https://www.radix-ui.com/) — Avatar, Select, Tabs, Switch, Tooltip, Dialog, DropdownMenu |
| Charts | [Recharts](https://recharts.org/) — AreaChart, BarChart |
| Icons | [Lucide React](https://lucide.dev/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| HTTP | Native `fetch` with HttpOnly session cookie + X-CSRF-Token header |
| Language | TypeScript 5 (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) |
| Deploy | [Railway](https://railway.app/) |

---

## Pages

| Route | Description |
|---|---|
| `/` | Overview dashboard — totals, commit trend, hourly activity, top repos, top contributors |
| `/developers` | Paginated developer list with commit counts and last-active dates |
| `/developers/:id` | Individual developer — commit trend, repo breakdown, hourly activity |
| `/repositories` | Repository list with status badges (private / archived / monitored) |
| `/repositories/:id` | Repository detail — commit trend, contributor ranking, hourly activity |
| `/commits` | Full commit log with SHA, message, author, diff stats, repo |
| `/github-accounts` | GitHub App installations — status, repo count, trigger sync |
| `/admin` | Administration — Users, Settings, Sync Runs, Audit Log |

---

## Project Structure

```
src/
├── components/
│   ├── charts/       # CommitTrendChart, HourlyActivityChart, TopListChart
│   ├── core/         # DashboardLayout, PageHeader, StatCard, FilterBar, Pagination, ErrorState, EmptyState
│   └── ui/           # Radix-based primitives (Button, Badge, Switch, Select, Tabs, Avatar …)
├── hooks/            # TanStack Query hooks (useAnalytics.ts, useAdmin.ts)
├── https/
│   └── services/     # Raw API calls — analytics.ts, admin.ts, github.ts, auth.ts
├── lib/
│   ├── interfaces/   # TypeScript types per domain
│   ├── authSession.ts
│   ├── queryClient.ts
│   └── utils.ts
├── pages/            # One file per page component
└── router.tsx        # TanStack Router route tree
```

---

## Local Development

### Prerequisites

- Node.js 20+
- The backend API running (see `activity-monitor.api`)

### Setup

```bash
npm install
```

Create `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Run

```bash
npm run dev
```

The app starts at `http://localhost:5173`.

### Type-check & Lint

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # production build
```

---

## Authentication

- Login is email + password (backend issues an HttpOnly session cookie)
- CSRF tokens are fetched on login and sent as `X-CSRF-Token` on every mutating request
- Forgot-password → OTP → reset-password flow for self-service credential recovery
- Role-based nav: GitHub Accounts and Administration are hidden for `DEVELOPER` and `MANAGER` roles (access is always enforced server-side)

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (no trailing slash) |

---

## Deployment

```bash
npm run build        # output: dist/
```

Serve `dist/` as a static SPA — set up `/*` → `index.html` fallback in your host (Railway static site, nginx, etc.).
