# activity-monitor.app

Dashboard for **Git Activity Monitor**, an internal tool that shows real GitHub commit activity across the company's organizations, repositories and developers, both company-wide and per person.

Backend: [`activity-monitor.api`](https://github.com/Bhavishya999/activity-monitor.api)

> Commit counts are an activity signal, not a measure of productivity. The UI says so wherever leaderboards appear.

## Status

| Area | State |
|---|---|
| App shell, light/dark theme, responsive layout | Done |
| Overview dashboard (totals, trend, hourly, leaderboard, repositories, calendar, recent commits) | Done |
| Developers list and per-developer pages | Done |
| Repositories list and per-repository pages | Done |
| Commit history search | Done |
| Teams (admins create teams and choose members) | Done |
| Analytics (regroup by organization, repository, developer or team) | Done |
| GitHub Accounts (activity per organization) | Done (connection management comes with admin routes) |
| Company sign-in (Zoho), invites, Administration | Planned |
| Reports, Synchronization, Settings pages | Planned (placeholders explain what will live there) |

Every number comes from the API and refreshes every minute and when you return to the tab. Filters live in the URL.

## Access

Employees sign in with their company Zoho account. Only people invited or approved by an admin can get in. Roles: **Developer** (own activity and team analytics), **Admin** (employees, GitHub connections, repositories, reports) and **Super Admin** (everything). The backend enforces every permission; the UI only hides what a role cannot use.

## Stack

Vite · React 19 · TypeScript (strict) · TanStack Router, Query and Table · Tailwind CSS 4 · shadcn/ui · Recharts · React Hook Form · Zod

## Design principles

- All numbers come from the API; the UI never invents statistics.
- Filters (date range, organization, repository, developer, branch) live in the URL so views can be shared.
- The active time zone and "last updated" are always visible; partially imported data is flagged.
- Light and dark themes, responsive layouts, accessible colour-blind-safe charts.
- Loading, empty and error states on every data view.

## Structure

```
src/
  main.tsx, router.tsx, routeTree.gen.ts (generated, never edit)
  routes/        file-based routes (no logic, render a page component)
  components/    overview, developers, repositories, commits, teams, analytics, github, auth,
                 charts/ (ChartCard, TrendChart, HourlyChart, RankedBars, ActivityCalendar),
                 core/ (shell, filters, states), ui/ (button, card, select, tooltip, ...)
  hooks/         TanStack Query hooks and URL filter state
  https/         fetch wrapper and API service functions
  lib/           query client, filters, formatting, constants, interfaces
  middleware/    route auth guard
```

## Run it locally

Requires Node 22+ and the [`activity-monitor.api`](https://github.com/Bhavishya999/activity-monitor.api) running on port 3000.

```bash
npm install
npm run dev          # http://localhost:5173, /api is proxied to the API (no CORS needed)
```

To see the UI with data before GitHub is connected, run the API against a database named `*sample*` and seed it (see the API README, `npm run seed:sample`). The app then shows a permanent **SAMPLE DATA** banner, and sample data can never be seeded into production.

In development the login page has a development login (the API must run with `DEV_AUTH_ENABLED=true`). It is not available in production builds.

## Configuration

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Only if the API is on another origin; normally empty (the server proxies `/api`) |
| `VITE_DEV_API_TARGET` | Dev proxy target, default `http://localhost:3000` |

No secrets belong in this app. In production, serve the app and the API from the same site (for example `app.example.com` and `api.example.com`) so the session cookie is sent.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run typecheck` | Strict TypeScript |
| `npm run lint` | ESLint (no `any`, no non-null assertions, hooks rules) |
| `npm test` | Vitest and Testing Library |
| `npm run build` | Type check and production build |

Typecheck, lint, tests and build must pass before every commit.

## Deployment

Railway service using `railway.json`: it builds the app, then `npm start` runs a small Node server (`server/`) that serves the app with security headers (CSP, HSTS) and forwards `/api/*` to the API (`API_ORIGIN`). The browser therefore talks to a single origin and the session cookie works without CORS or a shared domain. Full steps, including the API URL and GitHub webhook, are in the API repo: [docs/DEPLOYMENT.md](https://github.com/Bhavishya999/activity-monitor.api/blob/dev/docs/DEPLOYMENT.md).

| Variable | Purpose |
|---|---|
| `API_ORIGIN` | Required in production: the API's address (private Railway address or public URL) |
| `PORT` | Set by Railway |
