# Backlog & Roadmap

_Last reviewed: June 2026. Organized as: ✅ recently shipped · 🔧 known/near-term ·
🚀 innovation roadmap. Effort/impact are rough (S/M/L)._

---

## ✅ Recently shipped (the last several days)

- **Offerings page** (`/offerings`) — Embedded Agent Pilot + Lattice + Cortex,
  with the five industry one-pagers as gated PDF downloads.
- **Use-case pilot intake** (`/pilot`) → `use_case_submissions` + admin inbox
  + best-effort Resend alert to sales.
- **PDF lead capture** — email gate on public pages (every download), silent
  background attribution for signed-in hub visitors; `/admin/downloads`
  popularity + follow-up view.
- **Sign-in lead capture at request time** — `visitor_sessions` now mirrors
  Resend (captured when the code is requested, not only on completion).
- **Book-a-discovery-call** modal (embedded Outlook Bookings) across the funnel.
- **Legal suite** — Privacy / Terms / Accessibility / Cookie pages + cookie
  banner, using the official policy text (Echelix, LLC).
- **Marketing nav coherence** — auth-aware nav everywhere (Demo Hub / Sign out
  when signed in); `no-store` on gated routes to kill stale back-button views.
- **Industry verticals expanded** to 30 tiles (15 customer + 15 co-sell),
  Manufacturing line added, with Lattice + Azure architecture diagrams.
- **Code health pass** — 0 ESLint problems, 0 TS errors, full security headers
  (CSP/HSTS/etc.), verified RLS, dead-code removal.

---

## 🔧 Known / near-term

| Item | Effort | Notes |
| --- | --- | --- |
| **Rotate the Supabase `service_role` key** | S | Used in plaintext during dev sessions; roll it and update Vercel + `.env.local`. |
| **Lovable → Vercel for the original 10 demos** | M | Strip Lovable branding from the embedded demo apps (5 newer demos already on Vercel). |
| **Refresh ARCHITECTURE.md / RUNBOOK.md** | S | They predate the offerings/pilot/legal/lead-capture work. |
| **Admin-manage offerings + one-pagers** | M | Currently code-defined in `lib/offerings.ts` / `lib/one-pagers.ts`; move to DB so non-devs can edit. |
| **`verified` flag on `visitor_sessions`** | S | Distinguish "requested a code" vs "completed sign-in." |
| **Sales email alert on PDF download** | S | Optional, off by default to avoid noise; reuse the notify path. |
| **Distributed rate limiting** | M | In-memory limiter is per-instance; swap to Upstash Redis if traffic grows. |
| **Base-schema migration** | S | The original `demos`/`visitor_sessions` tables predate `migrations/`; add a create-from-scratch migration. |

---

## 🚀 Innovation roadmap

Ideas to make the hub a differentiator — not just a demo gallery, but an
intelligent, personalized sales-enablement engine that itself showcases what
agentic software feels like.

### Theme 1 — Make it intelligent (and self-demonstrating)

- **AI concierge / "describe your problem" search** _(L, high impact)_ — a
  natural-language box ("we're drowning in warranty claims") that maps the
  prospect to the best-fit demo(s), the matching one-pager, and a suggested
  pilot. The hub becomes a live demo of Echelix's own agentic recommender.
- **Embedded Echelix agent** _(L)_ — a chat assistant that answers "which
  solution fits us," drafts the pilot use-case from the conversation, books the
  call, and hands a warm summary to sales. The ultimate "eat your own dog food."
- **Company auto-enrichment on sign-in** _(M)_ — from the work-email domain,
  detect the company + industry and auto-surface the most relevant demos and
  one-pager: "Welcome, Acme (Manufacturing) — start with these six."

### Theme 2 — Arm the seller

- **Per-prospect deal rooms / shareable links** _(M, high impact)_ — a rep (or
  Microsoft co-seller) generates `echelix.app/r/acme`: prospect logo, a
  personalized intro, industry-filtered demos, and engagement tracking.
- **Engagement scoring + alerts** _(M)_ — extend the capture we already have
  (sign-ins, demo opens, downloads) into a lightweight "hot lead" score with a
  Teams/Slack/email ping when a tracked prospect re-engages.
- **Interactive ROI calculator** _(M)_ — prospect enters their volumes/costs →
  live ROI per solution, saved to their lead record so sales has a number to
  anchor the conversation.
- **Auto-generated leave-behind** _(M)_ — after a call, produce a personalized
  recap (demos discussed, their ROI inputs, next steps) as a branded
  PDF/microsite.

### Theme 3 — Microsoft co-sell leverage

- **One-click co-sell packet** _(M)_ — bundle the ACR estimate, Azure services
  list, architecture diagram, and partner one-pager into a Microsoft-ready
  artifact for co-sell submission.
- **Live Azure consumption (ACR) estimator** _(M)_ — turn the existing
  `acr_breakdown` text into an interactive estimator the rep tunes by customer
  scale.
- **Azure Marketplace alignment** _(S)_ — link each solution to its Marketplace
  / transactable-offer listing.

### Theme 4 — Deepen the demos

- **Guided tours** _(M)_ — step-by-step highlight + tooltip overlays on each
  live demo so prospects (or reps) self-navigate the key agentic moments with
  no presenter.
- **Narrated video fallback** _(S)_ — short recorded walkthroughs for demos that
  don't iframe cleanly or load slowly.
- **"Try it with your data" sandbox** _(L, highest proof)_ — let a prospect drop
  a sample (spec sheet, PO, ticket) and watch an agent process it live.

### Theme 5 — Trust, reach, and operations

- **Demo health/status monitor** _(S, high value)_ — the embedded demos are
  external apps; auto-check them and flag/hide a dead one before it embarrasses
  a live pitch. A small status page builds buyer trust.
- **Conversion funnel analytics** _(S)_ — sign-in → demo open → one-pager →
  book-call → pilot-submit, so you can see and optimize where prospects drop.
- **Accessibility (WCAG 2.1 AA) audit + fixes** _(M)_ — back the accessibility
  statement with a real pass; matters for enterprise + government buyers.
- **Internationalization** _(L)_ — multi-language for global enterprise / MSFT
  field teams.

---

### Suggested next 3 (best value-to-effort for a sales-led product)

1. **Per-prospect deal rooms + engagement alerts** — directly makes selling easier.
2. **AI concierge search** — high "wow," and it demonstrates the product itself.
3. **Demo health monitor** — cheap insurance against a dead embedded demo during a pitch.
