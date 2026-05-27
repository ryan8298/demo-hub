# Echelix Demo Hub

> Interactive demonstration platform for Echelix agentic enterprise solutions.
> Live at **[echelix.app](https://echelix.app)**.

Customers, Microsoft co-sell partners, and internal admins each get their
own gated experience. Every solution opens to a one-pager covering the
problem it solves, who it's for, the Microsoft-grounded solution
architecture, and ROI.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, ISR) |
| Hosting | Vercel |
| Database & Storage | Supabase (Postgres + Storage buckets + Auth OTP) |
| Email delivery | Resend (via Supabase custom SMTP) |
| Styling | Tailwind v4 (CSS-first config), Inter + Newsreader fonts |
| Auth | HMAC-signed session cookies (no Supabase Auth session, just OTP verification) |
| Observability | Vercel Analytics + Speed Insights |

---

## Quick start

```bash
git clone git@github.com:ryan8298/demo-hub.git
cd demo-hub
npm install
cp .env.example .env.local       # fill in real values — see below
npm run dev
```

Open <http://localhost:3000>.

### Required environment variables

See [`.env.example`](./.env.example) for the canonical list. In short:

| Var | Where it comes from |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API (the `service_role` one, **not** `anon`) |
| `ADMIN_PASSWORD` | A strong shared password for `/admin` access |
| `SESSION_SECRET` | `openssl rand -base64 48` — used to HMAC-sign cookies |
| `MICROSOFT_TEST_EMAILS` | *(optional)* comma-separated emails/domains routed to the Microsoft hub during testing |

`lib/env.ts` validates these at startup. In production a missing var
crashes the build with a clear message; in dev it logs a warning and
continues with an empty fallback.

### Database setup (first time)

Apply migrations in `supabase/migrations/` in order via the Supabase
SQL Editor. See [`supabase/README.md`](./supabase/README.md) for the
list and smoke-test commands.

---

## Project layout

```
app/
  page.tsx                         Landing page (public, includes sign-in modal)
  layout.tsx                       Root layout — fonts, metadata, EchelixAtmosphere
  globals.css                      Tailwind + brand tokens + custom classes
  icon.tsx                         32×32 favicon (dynamic OG-style)
  apple-icon.tsx                   180×180 iOS home-screen icon
  loading.tsx / error.tsx / not-found.tsx   Global route states
  customer/hub/                    Customer hub (Server Component, ISR 60s)
  microsoft/hub/                   Microsoft Partner hub (Server Component, ISR 60s)
  demo/[slug]/                     Public one-pager per demo (Server Component, ISR 60s)
  admin/                           Admin index — list + edit/delete
    login/                         Password gate
    demo/add/                      New demo form
    demo/[id]/edit/                Edit form
  api/
    auth/send-otp/                 Step 1: send code via Supabase signInWithOtp
    auth/verify-otp/               Step 2: verify code, issue visitor cookie
    auth/bypass-login/             Demo bypass — client@/microsoft@/admin@echelix.com
    auth/logout/                   Clears visitor cookie
    admin/login/                   Validates ADMIN_PASSWORD, issues admin cookie
    admin/logout/                  Clears admin cookie
    admin/upload-image/            Multipart upload to Supabase Storage
    demos/                         GET (anon, edge-cached) + POST (admin)
    demos/[id]/track/              Anonymous view/click counter (sendBeacon)
    demo/[id]/                     GET/PUT/DELETE individual demo (admin for write)
    demo/preview/                  Server-side og:image scraper

components/
  EchelixAtmosphere.tsx            Global background (dotted-wave mesh + glows)
  DemoHubLayout.tsx                Shared customer + microsoft hub UI
  HubShared.tsx                    Logo, navs, footer, demo card, modal, skeletons
  PublicDemoView.tsx               Public demo detail interactive layer
  RecentlyViewedRow.tsx            "Continue exploring" row (localStorage)
  admin/
    AdminNav.tsx                   Admin top nav with preview links
    DemoFormCards.tsx              Reusable add/edit form sections
    DemoEditForm.tsx               Edit-mode form orchestrator
    DemoRow.tsx                    One row of the admin index table

lib/
  env.ts                           Env-var validation
  supabase.ts                      Anon + service-role clients
  session.ts                       HMAC cookie sign/verify (Web Crypto)
  require-admin.ts                 Server-side admin-cookie guard
  rate-limit.ts                    In-memory sliding-window per IP
  demos.ts                         Server-side demo queries
  admin-demos.ts                   Server-side admin queries
  microsoft-access.ts              isMicrosoftEmail() — proxy gate for /microsoft
  bypass-logins.ts                 Demo bypass map
  recently-viewed.ts               localStorage helpers
  track.ts                         sendBeacon dispatcher
  fetchMetaTags.ts                 og:image scraper (server-side fetch + cheerio)
  types.ts                         Demo + VisitorSession types

proxy.ts                           Edge middleware — gates /admin, /customer, /microsoft
next.config.ts                     Security headers (CSP, HSTS, etc.)

supabase/
  README.md                        Migration order + smoke tests
  migrations/                      Numbered SQL files, idempotent

docs/
  ARCHITECTURE.md                  System design
  RUNBOOK.md                       Operational procedures
  BACKLOG.md                       Prioritized future features
```

---

## Auth model in one paragraph

Two cookie types, both HMAC-signed with `SESSION_SECRET`: **`echelix_admin`**
(set by `/api/admin/login` after password check; 8-hour TTL) and
**`echelix_visitor`** (set by `/api/auth/verify-otp` after Supabase OTP
verification, or by `/api/auth/bypass-login` for the three demo bypass
emails; 30-day TTL). The Edge proxy in [`proxy.ts`](./proxy.ts) gates
every protected route: `/admin/*` requires the admin cookie, `/customer/*`
and `/microsoft/*` require the visitor cookie (or admin for preview),
and `/microsoft/*` additionally requires the visitor email to match the
rule in [`lib/microsoft-access.ts`](./lib/microsoft-access.ts).

Bypass emails for live demos: `client@echelix.com`, `microsoft@echelix.com`,
`admin@echelix.com` — see [`lib/bypass-logins.ts`](./lib/bypass-logins.ts).
**These are shared "passwords" — rotate by editing that file if they leak.**

---

## Deployment

Vercel auto-deploys on push to `main`. Database migrations are **not**
automatic — apply them manually in the Supabase SQL editor before
shipping code that depends on them (the deploy will succeed but the
runtime will error).

Recommended pre-deploy checklist for schema-touching changes:

1. Migration file in `supabase/migrations/` is idempotent (`IF NOT EXISTS`, `DROP POLICY IF EXISTS`)
2. Apply it in Supabase SQL editor first
3. Smoke-test with the snippet in the migration's header comment
4. Then push to `main`

---

## Where to look when something breaks

| Symptom | Most likely cause | Where to look |
| --- | --- | --- |
| Upload returns "violates RLS" | service_role key wrong, or storage policies missing | [`docs/RUNBOOK.md`](./docs/RUNBOOK.md#storage-rls) |
| Hub doesn't show new demo | ISR cache (1 min) hasn't refreshed | wait, or check `revalidatePath` calls in `/api/demos/*` |
| "Cannot coerce to single JSON object" on edit | service_role table policy missing | apply `20260528000004_service_role_table_policies.sql` |
| OTP code says expired immediately | Email security scanner pre-clicked the magic link | template should be code-only — see RUNBOOK |
| Logo not rendering | File extension mismatch | `public/echelix-logo.png` (PNG, not SVG) |

For everything else, [`docs/RUNBOOK.md`](./docs/RUNBOOK.md) is the
operational reference.

---

## Internal docs

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — how the system fits together
- **[RUNBOOK.md](./docs/RUNBOOK.md)** — operational procedures
- **[BACKLOG.md](./docs/BACKLOG.md)** — prioritized future work
- **[CHANGELOG.md](./CHANGELOG.md)** — major changes by commit batch
- **[supabase/README.md](./supabase/README.md)** — database migration guide

---

## License

Proprietary © Echelix.
