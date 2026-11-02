# CLAUDE.md — activity-monitor.app (frontend)

Read this first. Backend repo: `activity-monitor.api` (REST `/api/v1`, its CLAUDE.md has the product rules).

## What we are building
The dashboard for **Git Activity Monitor**: an internal analytics product showing real GitHub commit activity across many organizations, repositories and developers, **company-wide and per individual**. It must look like a polished commercial SaaS (Linear / Vercel / GitHub Insights), not plain tables. All numbers come from the API; the UI never computes or invents statistics. Sample data is allowed only when the API flags `sample: true`, and then a permanent "SAMPLE DATA" banner shows.

## Access (confirmed)
Internal tool for one company. Login is via the company Zoho account (OAuth/OIDC) through the backend; the frontend only starts the login redirect and holds an HttpOnly session cookie (no tokens in JS). Roles: DEVELOPER (own + team analytics), ADMIN (employees, GitHub connections, repos, reports), SUPER_ADMIN (all). Only invited/approved employees can sign in; show a clear "ask an admin for access" screen otherwise. Hide admin nav for non-admins, but the API is the authority.

## Pages (main nav)
Overview · Developers (+ developer detail) · Repositories (+ detail) · GitHub Accounts · Commit History · Analytics · Reports · Synchronization · Administration · Settings.
Show: totals, commit trend, hourly activity, repository distribution, contributor leaderboard, activity calendar, recent commits, sync status; per developer: trend, repo breakdown, hourly pattern, calendar, commit history. Leaderboards carry a "commit count ≠ productivity" note.

## Stack
Vite · React 19 · TypeScript (strict) · TanStack Router (file-based) + TanStack Query + TanStack Table · Tailwind 4 · shadcn/ui + Radix · Lucide · Recharts · React Hook Form + Zod. SPA (no SSR). Deploy on Railway.

## Layout (mirror the team's reference app)
`src/main.tsx` (mounts router only) · `router.tsx` · `routeTree.gen.ts` (generated, never edit) · `routes/` (`__root.tsx`, `_mainLayout.tsx` auth shell, one folder per module; route files hold NO logic and render one page component) · `components/<domain>/` + `components/core/` + `components/ui/` (shadcn, don't modify internals) · `features/` (isolated slices) · `hooks/` (cross-domain query hooks) · `https/fetch.ts` + `https/services/` (raw API calls, no business logic) · `lib/` (queryClient, authSession, routePermissions, usePermission, `constants/` per domain, `interfaces/` per domain) · `middleware/routeAuthMiddleware.ts`.

## Rules
- One component per file; props type `[Component]Props` above it; default export for pages, named for shared components. One concern per hook. Hooks return objects.
- Server data lives in TanStack Query — never copy it into `useState`. Gate lazy queries (dropdowns/popovers) with `enabled`. Context only for real deep-tree sharing.
- States: loading → spinner/skeleton for charts, `--` for unloaded single values; error → `ErrorState` with request id and retry; empty → helpful empty state. Handle 401 → login, 403 → no-access page.
- Filters (range, org, repo, developer, branch, include bots/merges/forks) live in URL search params so views are shareable and survive refresh.
- Always show the active timezone (default Asia/Kolkata) and "last updated". Show coverage/"still importing" banners so partial data is never mistaken for final.
- Accessibility: WCAG AA, colour-blind-safe chart palette, direct labels, light + dark themes, responsive (tables → cards on mobile).
- Permissions in the UI are cosmetic; the API is the authority.
- TypeScript: strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`; no `any`, no `!`, no unnarrowed `as`, no enums, explicit return types on exports, `type` over `interface`. No magic strings in components (constants per domain). Names: components PascalCase, hooks `useX.ts`, services/constants kebab-case, schemas prefixed `v`, handlers `onX`, booleans `isX/hasX/canX`.
- **Commit identity:** commits are authored only by the user (Bhavishya999). Never add `Co-Authored-By` lines, Claude/session links, or "Generated with" footers to commit messages, PR descriptions or files. Keep messages short and descriptive.
- `tsc --noEmit`, lint, tests and `npm run build` must pass before every commit. One deployable change per commit. Commit/push only when asked.

## Status
Not started yet (repo is empty). First: scaffold Vite + router + shared UI kit + theme, then the Overview dashboard against the analytics API once it exists.
Waiting on user: create private GitHub repos and connect them.
