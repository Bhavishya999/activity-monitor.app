# activity-monitor.app

Dashboard for **Git Activity Monitor**, an internal tool that shows real GitHub commit activity across the company's organizations, repositories and developers, both company-wide and per person.

Backend: [`activity-monitor.api`](https://github.com/Bhavishya999/activity-monitor.api)

> Commit counts are an activity signal, not a measure of productivity. The UI says so wherever leaderboards appear.

## Status

Not scaffolded yet. The backend (GitHub ingestion, webhooks, database) is in place; the analytics API comes next, then this app starts with the login screen and the Overview dashboard.

## Planned pages

Overview · Developers (and detail) · Repositories (and detail) · GitHub Accounts · Commit History · Analytics · Reports · Synchronization · Administration · Settings

Overview and analytics views include commit trends, hourly activity, repository distribution, a contributor leaderboard, an activity calendar, recent commits and sync status. Each developer page has its own trend, repository breakdown, hourly pattern, calendar and commit history.

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

## Planned structure

```
src/
  main.tsx, router.tsx
  routes/        file-based routes (no logic, render a page component)
  components/    <domain>/, core/, ui/
  features/      isolated feature slices
  hooks/         data hooks (TanStack Query)
  https/         fetch wrapper and API service functions
  lib/           query client, auth session, permissions, constants, interfaces
  middleware/    route auth guard
```

## Configuration

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

No secrets belong in this app; everything sensitive lives in the backend.

## Scripts (once scaffolded)

`npm run dev` · `npm run build` · `npm run typecheck` · `npm run lint` · `npm test`

Typecheck, lint, tests and build must pass before every commit.

## Deployment

Static single-page app served on Railway.
