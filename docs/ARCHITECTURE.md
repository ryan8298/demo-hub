# Architecture

How the Echelix Demo Hub fits together. Aimed at engineers working on the
codebase — assumes Next.js + Supabase familiarity.

---

## High-level request flow

```
┌─────────────┐    ┌────────────────┐    ┌──────────────────┐
│   Browser   │──▶│ Vercel Edge    │──▶│ Next.js Function │
└─────────────┘    │ (proxy.ts)     │    │ (Server Comp /   │
                   │                │    │  Route Handler)  │
                   │ • cookie check │    └────────┬─────────┘
                   │ • redirect if  │             │
                   │   unauth       │             ▼
                   └────────────────┘    ┌──────────────────┐
                                         │   Supabase       │
                                         │ • Postgres (RLS) │
                                         │ • Storage        │
                                         │ • Auth OTP only  │
                                         └────────┬─────────┘
                                                  │
                                                  ▼ (for email)
                                         ┌──────────────────┐
                                         │     Resend       │
                                         └──────────────────┘
```

The Edge proxy runs on every request matching `/admin/:path*`,
`/customer/:path*`, or `/microsoft/:path*`. It reads cookies, verifies
the HMAC, and either lets the request through or returns a redirect.
No database calls happen at the edge — auth is purely cookie-based.

---

## Route map

| Route | Render | Public? | Gated by |
| --- | --- | --- | --- |
| `/` | Static | yes | — |
| `/customer/hub` | ISR (60s) | no | visitor cookie OR admin cookie |
| `/microsoft/hub` | ISR (60s) | no | visitor cookie (with `is_microsoft`) OR admin cookie |
| `/demo/[slug]` | ISR (60s) | yes | — |
| `/admin` | Dynamic | no | admin cookie |
| `/admin/demo/add` | Static (client form) | no | admin cookie |
| `/admin/demo/[id]/edit` | Dynamic | no | admin cookie |
| `/admin/login` | Static | yes | — |
| `/api/auth/send-otp` | Dynamic | yes | rate-limited |
| `/api/auth/verify-otp` | Dynamic | yes | rate-limited |
| `/api/auth/bypass-login` | Dynamic | yes | rate-limited (demo-only emails) |
| `/api/admin/*` | Dynamic | no | admin cookie + rate-limited |
| `/api/demos` GET | Edge-cached (60s) | yes | — |
| `/api/demos` POST | Dynamic | no | admin cookie |
| `/api/demos/[id]/track` | Dynamic | yes | rate-limited |
| `/api/demo/[id]` GET/PUT/DELETE | Dynamic | no (write) / yes (read) | admin cookie for writes |

ISR = Incremental Static Regeneration. Pages are statically rendered
and cached at the edge; Next.js refetches at most once every `revalidate`
seconds. Write endpoints call `revalidatePath` to bust the cache
immediately.

---

## Auth model

### Two cookie types

| Cookie | Role | TTL | Set by | Cleared by |
| --- | --- | --- | --- | --- |
| `echelix_admin` | admin | 8 hours | `/api/admin/login` | `/api/admin/logout` |
| `echelix_visitor` | visitor | 30 days | `/api/auth/verify-otp` or `/api/auth/bypass-login` | `/api/auth/logout` |

Both are httpOnly, secure (in prod), SameSite=lax. Signed with
`SESSION_SECRET` via HMAC-SHA256 using Web Crypto (so it works on
Edge runtime too — see [`lib/session.ts`](../lib/session.ts)).

Format: `<base64url(payload_json)>.<base64url(hmac)>` where payload is:

```ts
{
  sub: 'admin' | '<visitor email>',
  role: 'admin' | 'visitor',
  exp: <unix seconds>,
  data?: { is_microsoft, first_name, last_name, company_name }  // visitor only
}
```

### Visitor sign-in flow (standard OTP)

```
1. User opens landing modal, types first/last name, email, company
2. POST /api/auth/send-otp { email }
     → Supabase signInWithOtp({ email })
     → Supabase emails a 6/8-digit code via Resend SMTP
3. User types the code in step 2 of the modal
4. POST /api/auth/verify-otp { email, code, first_name, last_name, company_name }
     → Supabase verifyOtp() — tries types 'email', 'signup', 'magiclink' in order
     → On success: upsert visitor_sessions row + sign + set echelix_visitor cookie
     → Return { redirect: '/customer/hub' | '/microsoft/hub' }
5. Client router.push() to the redirect
```

### Visitor sign-in flow (bypass — demo only)

```
1. User types one of: client@/microsoft@/admin@echelix.com
2. Modal detects the bypass email, hides name + company fields
3. POST /api/auth/bypass-login { email }
     → Reads lib/bypass-logins.ts map
     → Sets echelix_admin OR echelix_visitor cookie based on role
     → Returns { redirect: <destination> }
```

### Admin sign-in flow

```
1. User opens /admin/login (or is redirected there by the proxy)
2. POST /api/admin/login { password }
     → Constant-time compare against ADMIN_PASSWORD env var
     → On success: sign + set echelix_admin cookie
3. Redirect to `?next=` param (default /admin)
```

### Microsoft hub eligibility

Defined in [`lib/microsoft-access.ts`](../lib/microsoft-access.ts).
A visitor email qualifies if:

1. It's in the hardcoded bypass map (`microsoft@echelix.com`), or
2. It ends with `@microsoft.com`, or
3. It matches an entry in the `MICROSOFT_TEST_EMAILS` env var
   (comma-separated; supports exact emails and whole domains like
   `@echelix.app`)

The proxy enforces this on `/microsoft/*`. **Admins bypass this check**
so they can preview the partner hub from `/admin`.

---

## Data model

### `demos` table

```sql
id                            UUID PRIMARY KEY
title                         TEXT
description                   TEXT
demo_url                      TEXT       -- external link, opens in new tab
slug                          TEXT       -- URL slug for /demo/[slug]
audience                      TEXT[]     -- ['customer'] | ['microsoft'] | ['customer','microsoft']
roi_summary                   TEXT
roi_metrics                   JSONB      -- legacy, not currently surfaced in UI
deployment_timeline           JSONB      -- [{phase, duration, details}]
preview_image_url             TEXT       -- og:image scrape OR direct upload
featured                      BOOLEAN
industry                      TEXT
tags                          TEXT[]     -- free-form labels for hub filter
view_count                    INTEGER    -- /demo/[slug] views
click_count                   INTEGER    -- "Open Demo" clicks
problem_statement             TEXT       -- one-pager: what it solves
target_audience_description   TEXT       -- one-pager: who it's for
architecture_diagram_url      TEXT       -- image or PDF
created_at                    TIMESTAMPTZ
updated_at                    TIMESTAMPTZ
```

Indexes: `(industry)`, GIN on `(audience)`, GIN on `(tags)`.

### `visitor_sessions` table

```sql
id              UUID PRIMARY KEY
email           TEXT UNIQUE
first_name      TEXT
last_name       TEXT
company_name    TEXT
is_microsoft    BOOLEAN
session_token   TEXT
created_at      TIMESTAMPTZ
```

This is **profile data**, not the actual session. The real session
lives in the `echelix_visitor` cookie. `visitor_sessions` exists so
sales has a CRM-shaped record of who's been into the hub.

### Storage bucket: `demo-assets`

Single public bucket, 10MB file limit, MIME-restricted to images +
PDF. Two folders by convention:

- `previews/` — demo card preview images
- `architecture/` — solution architecture diagrams (often PDF)

Uploads go through `/api/admin/upload-image` which is admin-gated.
Reads are public via CDN URL.

---

## Row Level Security (RLS)

RLS is **on** for both `demos` and `visitor_sessions`, plus on
`storage.objects` for the demo-assets bucket. Policies:

| Resource | Role | Operation | Allowed? |
| --- | --- | --- | --- |
| `demos` | anon, authenticated | SELECT | ✓ (all rows) |
| `demos` | service_role | ALL | ✓ (explicit policy as backstop) |
| `visitor_sessions` | anon, authenticated | * | ✗ |
| `visitor_sessions` | service_role | ALL | ✓ |
| `storage.objects[demo-assets]` | anon, authenticated | SELECT | ✓ |
| `storage.objects[demo-assets]` | service_role | INSERT/UPDATE/DELETE | ✓ |

The "service_role bypasses RLS" claim is generally true but
unreliable for `storage.objects`. We add explicit policies for
service_role on every protected resource so admin writes always
work, even if a Supabase config nuance breaks the implicit bypass.

The `increment_demo_metric(p_id, p_metric)` SQL function is
`SECURITY DEFINER` — runs with elevated privs but is hardcoded to
only mutate `view_count` or `click_count`. Granted EXECUTE to
`anon` and `authenticated` so the anonymous `/api/demos/[id]/track`
endpoint can call it via the anon-key client.

---

## Background & visual system

`<EchelixAtmosphere />` mounts once in the root layout
([`app/layout.tsx`](../app/layout.tsx)). It's a fixed-position
`z-index: -10` div containing five layered CSS effects:

1. **Base gradient** — `#020505 → #000` with three large radial glows
2. **Diagonal light streaks** — two layered linear gradients, slow drift
3. **Noise overlay** — inline SVG turbulence, overlay blend at 5% opacity
4. **Back wave** — sparse 30px dot pattern, deeper perspective tilt (58°)
5. **Front wave** — dense 14px+22px dot mesh, glow filter, lighter tilt (52°)

All CSS, no canvas, no images. Animations respect
`prefers-reduced-motion`. Body bg is transparent so the fixed
atmosphere shows through every page.

---

## Performance choices worth knowing

| Decision | Why |
| --- | --- |
| Hubs are Server Components | Initial HTML ships with data — no client-side fetch flash |
| ISR `revalidate = 60` on hubs + `/demo/[slug]` | Cached at the edge, ~80ms TTFB. Admin writes call `revalidatePath` to bust. |
| `/api/demos` GET has `s-maxage=60, stale-while-revalidate=300` | At 50 concurrent users, Supabase sees ~1 query/min instead of 50 |
| `next/image` for logo + wave + demo previews | Auto AVIF/WebP, responsive srcSet |
| `next/font` for Inter + Newsreader | Self-hosted, preloaded, zero CLS |
| In-memory rate limiter (`lib/rate-limit.ts`) | No infra dependency. For multi-instance distributed attacks at higher scale, swap storage layer for Upstash Redis. |
| HMAC cookies via Web Crypto | Works in both Node and Edge runtimes |

---

## Known limitations

These are real but deliberately deferred — see [BACKLOG.md](./BACKLOG.md)
for the full prioritized list.

- **Rate limiter is per-instance** (in-memory `Map`). Vercel runs
  multiple serverless instances; a determined attacker could spread
  requests across them. Acceptable for current scale; swap to
  Upstash when traffic warrants.
- **iframe demo previews silently fail** for sites with `X-Frame-Options: DENY`
  (most production apps). Admin upload of a preview image is the
  reliable fallback.
- **Microsoft hub auth is heuristic** (email-suffix check), not real
  Microsoft Entra SSO. Anyone with a `@microsoft.com` mailbox passes,
  including non-employees who happen to own such an address.
- **Bypass logins are shared "passwords"** — anyone who learns them
  gets the corresponding access. Mitigation: rate limit + rotate by
  editing `lib/bypass-logins.ts`.
- **No audit log** of admin actions. Editing/deleting demos leaves
  no trail beyond `updated_at`.
- **Single admin password** (not per-user accounts). Fine for one
  or two operators; needs RBAC for any real team.
