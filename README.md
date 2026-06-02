# Echelix Demo Hub

> Interactive demonstration + sales-enablement platform for Echelix agentic
> enterprise solutions. Live at **[echelix.app](https://echelix.app)**.

Prospects, Microsoft co-sell partners, and internal admins each get their own
experience. Public marketing pages explain the offerings and capture leads;
gated hubs let signed-in visitors explore live, interactive demos. Every
solution opens to a one-pager covering the problem it solves, who it's for, the
Microsoft-grounded solution architecture, and ROI.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, per-request + ISR) |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Database & Storage | Supabase (Postgres + RLS, Storage buckets, Auth OTP) |
| Email delivery | Resend — OTP via Supabase SMTP; lead alerts via Resend API |
| Scheduling | Microsoft Outlook Bookings (embedded) |
| Styling | Tailwind v4 (CSS-first config), Inter + Newsreader fonts |
| Auth | HMAC-signed session cookies (Web Crypto; OTP is verification-only) |
| Observability | Vercel Analytics + Speed Insights |

---

## Quick start (local development)

```bash
git clone git@github.com:ryan8298/demo-hub.git
cd demo-hub
npm install
cp .env.example .env.local       # fill in real values — see below
npm run dev
```

Then open **<http://localhost:3000>** in your browser.

> **What is `localhost:3000`?** It's *your own computer* — the address where the
> app runs while you develop on your laptop (`localhost` = this machine, `3000`
> = the default port for `npm run dev`). It has nothing to do with the live
> site; the public URL is **echelix.app**. You only ever see `localhost:3000`
> when running the project locally.

### Environment variables

See [`.env.example`](./.env.example) for the canonical, commented list.

**Required:**

| Var | Where it comes from |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API (`service_role`, **not** `anon`) |
| `ADMIN_PASSWORD` | A strong shared password for `/admin` |
| `SESSION_SECRET` | `openssl rand -base64 48` — HMAC-signs cookies |

**Optional:**

| Var | Purpose |
| --- | --- |
| `MICROSOFT_TEST_EMAILS` | Emails/domains routed to the Microsoft hub during testing |
| `NEXT_PUBLIC_BOOKINGS_URL` | Outlook Bookings page embedded in the "Book a call" modal (falls back to mailto if unset) |
| `RESEND_API_KEY` | Enables email alerts on pilot submissions (no-ops if unset) |
| `RESEND_FROM` | Verified sender for those alerts |
| `SALES_NOTIFICATION_EMAIL` | Where pilot-submission alerts go (default `sales@echelix.com`) |

`lib/env.ts` validates the required vars at startup: in production a missing
var fails the build with a clear message; in dev it warns and continues.

### Database setup

Apply the migrations in `supabase/migrations/` **in order** via the Supabase
SQL Editor — they are not applied automatically on deploy. See
[`supabase/README.md`](./supabase/README.md) for the list and smoke tests.

---

## Surfaces

### Public (no sign-in)
- **`/`** — landing page with sign-in modal + auth-aware nav.
- **`/offerings`** — engagements (Embedded Agent Pilot, Lattice, Cortex) +
  the five downloadable industry one-pagers.
- **`/pilot`** — "submit a use case" form feeding the Embedded Agent Pilot.
- **`/legal/{privacy,terms,accessibility,cookies}`** — policy pages.

### Gated (signed-in visitors)
- **`/customer/hub`** & **`/microsoft/hub`** — demo grids with search,
  industry + tag filters, recently-viewed row, and an industry-one-pager strip.
- **`/demo/[slug]`** — the per-solution one-pager (KPIs, challenge,
  architecture diagram, agent timeline, ROI, related demos, conversion CTA).

### Admin (password-gated)
- **`/admin`** — list / edit / delete demos.
- **`/admin/demo/add`** & **`/admin/demo/[id]/edit`** — demo editor.
- **`/admin/submissions`** — use-case pilot inbox (triage + notes).
- **`/admin/downloads`** — PDF download log (most-popular + follow-up list).

### Lead capture
- **Email/OTP sign-in** → `visitor_sessions` (captured at code-request time so
  it mirrors Resend).
- **Use-case submissions** → `use_case_submissions` (+ optional Resend alert).
- **PDF downloads** → `pdf_downloads` — public pages prompt for email every
  time; signed-in hub visitors are attributed automatically in the background.

---

## Auth model in one paragraph

Two HMAC-signed cookies (`SESSION_SECRET`): **`echelix_admin`** (set by
`/api/admin/login` after a password check; 8-hour TTL) and **`echelix_visitor`**
(set by `/api/auth/verify-otp`, or by `/api/auth/bypass-login` for the demo
bypass emails; 30-day TTL). The Edge proxy ([`proxy.ts`](./proxy.ts)) gates
every protected route and sends `Cache-Control: no-store` on them so the
browser's back/forward cache can't show an authed page after sign-out.
`/microsoft/*` additionally requires the visitor email to match
[`lib/microsoft-access.ts`](./lib/microsoft-access.ts). Client components read
auth state via **`/api/me`**.

Bypass emails for live demos: `client@echelix.com`, `microsoft@echelix.com`,
`admin@echelix.com` (see [`lib/bypass-logins.ts`](./lib/bypass-logins.ts)).
**These are shared "passwords" — rotate by editing that file if they leak.**

---

## Editable content (no code changes needed for some, code for others)

| Content | Where |
| --- | --- |
| Demos (cards + one-pagers) | Admin UI → Supabase `demos` table |
| Offerings (Pilot / Lattice / Cortex) | `lib/offerings.ts` (code) |
| Industry one-pagers (PDF links + blurbs) | `lib/one-pagers.ts` (code); PDFs in Supabase Storage `one-pagers/` |
| Architecture diagrams | `scripts/gen-arch-diagrams.mjs` → Supabase Storage |
| Company/legal identity | `lib/site.ts` |

---

## Deployment

Vercel auto-deploys on push to `main`. **Migrations are manual** — apply them
in the Supabase SQL editor before pushing code that depends on them. Pre-deploy
checklist for schema changes:

1. Migration in `supabase/migrations/` is idempotent (`IF NOT EXISTS`, `DROP POLICY IF EXISTS`)
2. Apply it in the Supabase SQL editor
3. Smoke-test with the snippet in the migration header
4. Push to `main`

---

## Internal docs

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — system design *(predates the
  offerings/pilot/legal/lead-capture work; refresh pending)*
- **[RUNBOOK.md](./docs/RUNBOOK.md)** — operational procedures
- **[BACKLOG.md](./docs/BACKLOG.md)** — shipped work + the innovation roadmap
- **[CHANGELOG.md](./CHANGELOG.md)** — major changes by batch
- **[supabase/README.md](./supabase/README.md)** — migration guide

---

## License

Proprietary © Echelix, LLC.
