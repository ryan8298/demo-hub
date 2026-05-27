# Changelog

Material changes to the Echelix Demo Hub. Newest first. Grouped by
shipped batch rather than every commit; for full granularity see
`git log`.

This is not strictly semver — it's a delivery log.

---

## 2026-05-29 — Sales-demo bypass + admin preview

- **Bypass logins** for live demos: `client@echelix.com`,
  `microsoft@echelix.com`, `admin@echelix.com` skip OTP entirely. The
  landing modal detects them as you type and collapses to just the
  email field.
- **Admin preview** — admin cookie now grants access to both hubs
  without logging out. AdminNav has "↗ Customer" and "↗ Microsoft"
  links that open the hubs in new tabs.
- `MICROSOFT_TEST_EMAILS` env var still works as a test allowlist;
  defaults to the production rule when unset.

## 2026-05-28 — Echelix card visual treatment

- **EchelixAtmosphere** global background — black gradient + radial
  glows + diagonal light streaks + noise overlay + two-layer
  perspective dotted-wave mesh. CSS-only. Lives in `app/layout.tsx`
  so it shows on every page.
- Logo size tripled across all nav variants (h-24 md:h-28).
- Body bg set to transparent (html bg = #020505 as fallback) so the
  fixed atmosphere shows through.
- Hub `pt-32` → `pt-44` and sticky filter `md:top-[76px]` →
  `md:top-[120px]` after subsequent nav-padding reduction.

## 2026-05-27 — Service-role table policies, hub revalidation

- Migration `20260528000004_service_role_table_policies.sql` adds
  explicit `FOR ALL` policies to `service_role` on `public.demos`
  and `public.visitor_sessions`. Fixes "Cannot coerce to single JSON
  object" on edit + various silent insert failures.
- `revalidatePath` calls in create/update/delete endpoints — newly
  published demos appear on hubs immediately.
- Storage RLS policies migration (`20260528000003`) added explicit
  service_role INSERT/UPDATE/DELETE for the `demo-assets` bucket.
- `lib/supabase.ts` admin client now uses Supabase-recommended
  server-side auth config (`persistSession: false`, etc.).

## 2026-05-27 — Image + PDF uploads, public demo subpages

- `/api/admin/upload-image` accepts multipart form data, pushes to
  Supabase Storage `demo-assets` bucket, returns CDN URL. 10MB limit,
  image MIME types + `application/pdf`.
- Admin form gains preview image upload AND a separate "Detail Page
  Content" card (problem statement, target audience description,
  architecture diagram upload).
- New columns: `problem_statement`, `target_audience_description`,
  `architecture_diagram_url`.
- `/demo/[slug]` renders the new sections including PDF iframe embed
  for architecture diagrams.
- DemoCard click navigates to `/demo/[slug]` via Next router instead
  of the old inline-expand UI.
- OTP modal focus bug fixed (was re-running effect on every keystroke
  and yanking focus to the close button).

## 2026-05-26 — Click tracking, tags, recently viewed

- `view_count` + `click_count` columns + `increment_demo_metric`
  Postgres function. Tracked via `navigator.sendBeacon` to
  `/api/demos/[id]/track`.
- `tags TEXT[]` column with GIN index. Admin form `TagsCard` with
  chip input + suggestions. Hub filter pills (AND'd with industry).
- "Continue exploring" row on hubs, backed by localStorage.

## 2026-05-26 — Public demo pages, recently shipped Tier B follow-ups

- Public `/demo/[slug]` pages — ISR-cached, OG metadata for sharing.
- Switched from inline-expand demo cards to in-app navigation.
- next/image for logo, wave, demo previews (AVIF/WebP via Vercel).
- Dropped axios from `lib/fetchMetaTags.ts` in favor of native fetch.
- Route-level loading.tsx + error.tsx + not-found.tsx.
- Admin form split into reusable card components.
- `/admin` index with stats strip + edit/delete (`DemoRow` client
  component).

## 2026-05-26 — Echelix brand redesign + scaling essentials

- Replaced Fraunces with Newsreader (closer to PP Editorial New).
- Tailwind theme tokens replace ~120 inline hex codes.
- Hubs converted from client-fetched to async Server Components with
  ISR `revalidate = 60`.
- DemoHubLayout extracted — kills ~270 lines of duplication.
- Rate limiting on send-otp / verify-otp / admin-login.
- Edge cache headers on `/api/demos`.
- Vercel Analytics + Speed Insights wired in.
- Security headers via `next.config.ts` — HSTS, CSP, X-Frame-Options,
  etc.

## 2026-05-26 — Auth model (security pass)

- HMAC-signed session cookies via Web Crypto (Edge-compatible).
- `/api/admin/login` + admin cookie. Removed
  `NEXT_PUBLIC_ADMIN_API_KEY` (was in every client bundle).
- `/api/auth/send-otp` + `/api/auth/verify-otp` via Supabase OTP
  (tries `email`, `signup`, `magiclink` types).
- Edge proxy gates `/admin`, `/customer`, `/microsoft`.
- RLS enabled on `demos` (public read) and `visitor_sessions`
  (service-role only).
- `lib/env.ts` validates required env vars; throws in prod, warns
  in dev.

## 2026-05-26 — UI polish + code health pass

- Skeleton loading state replacing spinner flash.
- Fully clickable demo tiles.
- Featured demos row at top of hubs.
- Modal a11y — ESC to close, focus trap, body scroll lock.
- Mobile filter row no longer overlaps nav.

---

## Versioning policy

Not formal semver — this is a single-deployment internal app, not a
library. Date-stamped batches are sufficient. If a paid customer
ever depends on a versioned API, switch to semver at that point.
