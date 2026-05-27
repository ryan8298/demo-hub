# Product Backlog

Prioritized future features for the Echelix Demo Hub. Organized into a
**Next up** queue (what to ship next) followed by themed tiers.

Estimates are rough: **S** = under a day, **M** = 1-3 days, **L** = a week+.

---

## Recently shipped

For context, the last few weeks of work delivered:

- Full auth model (Supabase OTP + HMAC cookies + admin password gate)
- Three demo-bypass logins for live demos
- Customer + Microsoft hubs as Server Components with ISR
- Public `/demo/[slug]` one-pager (problem / audience / architecture / ROI)
- Admin index with stats, edit, delete + click/view analytics
- Image + PDF upload to Supabase Storage
- Tags & industry filters on the hubs
- Recently-viewed personalization (localStorage)
- EchelixAtmosphere global background matching the card art
- Comprehensive security headers + RLS + rate limiting
- Vercel Analytics + Speed Insights

---

## Next up

The top 5 things I'd ship next, in order:

### 1. Featured demo hero on the hubs **(M)**
The `featured` boolean exists and the API sorts by it, but featured demos
only get a small star badge in the tile grid. Replace with a large
hero-style featured tile at the top of each hub — image left, copy right,
"Open Demo" + "View Details" CTAs. Drops below the "Continue exploring"
row.

### 2. Sales-rep tracked share links **(M)**
Generate per-rep, per-demo short URLs like `/r/[rep]/[demo-slug]` that:
- Tag the visit with the rep's identity (cookie or query param)
- Are pre-shared from any rep dashboard
- Track which prospect viewed what, attributable to the sharing rep
- Don't bypass auth — visitor still needs to sign in, but the rep gets credit

Massive for sales attribution. The DB already has visitor_sessions
with email; just need a `source_rep` field and a redirect handler.

### 3. AI-powered demo search **(M-L)**
Replace the keyword filter with a natural-language search:
> "Show me demos that help retail banks reduce manual compliance work."

Powered by Echelix's own agentic search (eat-your-own-dogfood). Embed
demo titles + descriptions + tags + problem statements into a vector
store; query at search time. Even a simple OpenAI Embeddings + cosine
sim would be a step change in UX.

### 4. Microsoft Entra SSO for the partner hub **(L)**
Replace the `@microsoft.com` email-suffix heuristic with real Microsoft
Entra SSO. Real Microsoft sellers click "Sign in with Microsoft," land
on `/microsoft/hub` with verified identity. Removes the bypass-email
risk for the partner hub specifically. The customer hub keeps OTP.

### 5. Calendly / Book-a-call CTA on demo detail pages **(S)**
Below the ROI section, add a "Schedule a deep-dive" block with an
embedded Calendly widget (or HubSpot meetings, whatever the sales team
uses). Single most common ask on demo pages — they want to talk to
someone.

---

## Tier A — Sales enablement

The hub exists to drive pipeline. These features make that explicit.

| Item | Value | Effort |
| --- | --- | --- |
| Per-rep tracked share links (`/r/[rep]/[slug]`) | Attribution | M |
| Calendly / "Schedule a deep-dive" CTA on `/demo/[slug]` | Conversion | S |
| Lead capture form for ROI/architecture access | Gated content = better data | M |
| Sales-rep accounts (lower than admin) — see own demos, share links, dashboard | Self-service | M |
| Demo "playlist" — pre-curated tour for a specific prospect | "Watch these 4 demos in order" | M |
| Per-prospect microsites — branded landing with curated demos | Enterprise sales touch | L |
| Slack notification when a tracked link is opened | Real-time signal | S |
| HubSpot / Salesforce CRM sync (visitor_sessions → contacts) | Single source of truth | L |
| Email digest of new demos to opted-in visitors | Re-engagement | S |
| "Most viewed this week" badge on tiles | Social proof | S |
| Export catalog to PDF (sales leave-behind) | Offline value | M |

---

## Tier B — Visitor experience

Make the hub more useful for the people who actually browse it.

| Item | Value | Effort |
| --- | --- | --- |
| Featured demo hero | Visual hierarchy | M |
| AI-powered natural-language search | Findability | M-L |
| Demo collections (named groupings: "Compliance Suite", "Customer 360") | Curation | M |
| "Save for later" / Favorites (in localStorage, optionally synced via cookie) | Return engagement | S |
| Personalized recommendations based on viewed demos | Stickiness | M |
| Demo of the day / week (rotating hero) | Freshness | S |
| Video walkthrough per demo (Loom / YouTube embed) | Async demo viewing | S |
| Multi-image gallery on demo detail | Richer storytelling | S |
| Comparison view (pick 2-3 demos, see side by side) | Decision support | M |
| Industry-specific landing pages (e.g. `/industry/healthcare`) | SEO + targeted entry | M |
| Per-demo testimonials / customer logos | Trust | S |
| Customer ratings (private, admin-only view) | Internal insight | M |
| Comments thread (internal — admin sees notes from sales) | Collaboration | M |
| Demo URL "smart preview" — server-side screenshot service | Replace failed iframe fallback | M (Browserless/ScreenshotOne) |

---

## Tier C — Microsoft co-sell

Microsoft is a primary partner channel — lean into it.

| Item | Value | Effort |
| --- | --- | --- |
| Microsoft Entra (Azure AD) SSO for the partner hub | Real identity, removes bypass risk | L |
| Microsoft Co-Sell deal-stage tracker per demo | Track Solution Assessment → CoSell Ready | M |
| Azure Marketplace listing link per demo | Bridge to transaction | S |
| Microsoft AppSource integration | Inbound from MS catalog | M |
| "Solution Area" tag (Modern Work / Data & AI / Security / Business Apps / Azure Infra) | Aligns with MS taxonomies | S |
| "Industry Cloud" tag (Healthcare / Financial Services / Retail / Manufacturing / Government) | MS Industry Cloud alignment | S |
| MACC (Microsoft Azure Consumption Commitment) eligibility flag | Procurement signal | S |
| Microsoft Teams app — surface demos inside Teams | Distribution | L |
| Power Platform demos category | Power Apps / Automate visibility | S |
| MS partner-only annotations (visible only on `/microsoft/hub`) | Channel-specific copy | M |

---

## Tier D — AI / agentic features

Echelix is an agentic AI company. The hub itself should be agentic.

| Item | Value | Effort |
| --- | --- | --- |
| AI-powered natural-language search (listed in Tier B too) | Findability | M-L |
| AI chatbot — "What demo should I look at if I'm a CIO at a bank trying to reduce compliance toil?" | Concierge for visitors | L |
| Auto-tagging of demos from URL content (scrape + embedding cluster) | Less admin grunt work | M |
| Auto-summarize new demos from URL content (problem statement, audience, etc.) | Lower friction for adding demos | M |
| Smart recommendations engine (collaborative + content filtering) | Personalization | L |
| Generated solution architecture diagrams from demo URL | Reduces admin upload step | XL — research project |
| Multi-language demo descriptions (auto-translate) | International reach | M |
| Voice query interface ("Hey Echelix, find me…") | Differentiation | L |
| Demo replay — narrated walkthrough generated from screen recording | Async at scale | XL |

---

## Tier E — Admin & operations

Polish for whoever runs the hub day-to-day.

| Item | Value | Effort |
| --- | --- | --- |
| Per-user admin accounts (RBAC: admin / editor / viewer) | Replace shared password | M |
| Audit log (who edited what, when) | Compliance + debug | M |
| Approval workflow (draft → review → publish) | Quality control | M |
| Demo expiration / auto-archive | Catalog hygiene | S |
| Bulk actions (multi-select demos, bulk feature/unfeature/delete) | Speed | S |
| Demo duplication ("Create from existing") | Faster onboarding | S |
| Drag-to-reorder featured demos | Manual curation | M |
| Admin index: filter by industry/audience/featured/tag | Findability for admins | S |
| Backup / restore | Data safety | M |
| Webhooks (new demo published → fire to Slack/Zapier/etc.) | Integration | M |
| Public API key system (third parties consume our catalog read-only) | Distribution | M |
| Settings page (branding, theme toggle, custom domains) | White-label readiness | L |
| Email template editor in-app (currently in Supabase dashboard) | Less context switching | M |

---

## Tier F — Analytics & reporting

Currently we have `view_count` + `click_count` per demo, surfaced on
the admin index. Next levels:

| Item | Value | Effort |
| --- | --- | --- |
| Per-demo dashboard with time-series (views/clicks over time) | Trend visibility | M |
| Per-visitor profile page (admin) — what demos they viewed, when | Sales context | M |
| Funnel: landing → sign-in → hub view → demo open → external click | Conversion analysis | M |
| Cohort analysis (return visitors by sign-up week) | Engagement health | M |
| Heatmaps on hub pages | UX insight | M (Hotjar / PostHog) |
| A/B testing framework (alt copy, alt hero treatments) | Optimization | M |
| Real-time visitor feed for admins ("3 people browsing /microsoft/hub right now") | Operational awareness | S |
| Weekly digest email to admins ("12 new visitors, top demo: X") | Push insight | S |
| Export to Power BI / Looker | Enterprise BI integration | M |

---

## Tier G — Quality, accessibility, compliance

Boring but necessary. Especially before going wider.

| Item | Value | Effort |
| --- | --- | --- |
| WCAG 2.1 AA audit + fixes | Accessibility & enterprise procurement | M |
| Cookie consent banner (GDPR / ePrivacy) | Compliance for EU traffic | S |
| Terms of Service + Privacy Policy pages | Required for production | S |
| Data export — visitor can download their own data | GDPR Article 20 | M |
| Right to be forgotten — admin can delete a visitor's data | GDPR Article 17 | S |
| SOC 2 evidence collection harness | Enterprise sales unlock | L |
| Pen test report | Trust signal | L (external) |
| Sentry / error tracking integration | Reactive observability | S |
| Lighthouse CI in GitHub Actions | Perf regression guard | S |
| Storybook for shared components | Visual regression | M |
| End-to-end test suite (Playwright) — sign-in, hub browse, demo detail, admin publish | Confidence | M |
| Status page (status.echelix.app) | Trust signal during incidents | S |

---

## Tier H — Infra & performance

Most of these aren't urgent at current scale but worth planning.

| Item | Value | Effort |
| --- | --- | --- |
| Upstash Redis for distributed rate limiting | Survives multi-instance attacks | S |
| Background job runner (e.g., Inngest, Trigger.dev) for screenshot generation, email digests | Async pipelines | M |
| Database read replicas (Supabase Pro feature) | Read scale | S (mostly $$) |
| Custom CDN for `demo-assets` bucket (e.g., Cloudflare in front of Supabase) | Better global cache | M |
| Service worker for offline support | PWA-ish | M |
| Static export of top-N demos to plain HTML | Blazing landing for marketing | M |
| `/api/demos` paginated when catalog grows past ~100 entries | Avoid payload bloat | S |
| Image optimization pipeline — auto-strip EXIF, downscale uploads to 1920px max | Storage + bandwidth | S |

---

## Considered but not pursued

Things that came up in design discussion and were intentionally
deferred or rejected:

| Idea | Why deferred |
| --- | --- |
| Real-time co-browsing | Niche; complex; better served by Loom |
| Crypto / NFT integration | Off-brand |
| AI-generated marketing copy for demos | Quality concerns at this stage |
| Embeddable widget for partner sites | Wait until demand is real |
| Mobile native app | Web is mobile-friendly enough; not worth maintaining two codebases |
| User-generated content (visitors submit demos) | Curation cost not worth it |
| Open source the hub | Strategic; revisit if it becomes a market position |

---

## How to update this backlog

- Add items at the bottom of the relevant tier
- Move "Next up" candidates from any tier when they jump priority
- When an item ships, delete it (or move to "Recently shipped" at the top)
- Keep estimates honest — if something balloons past its tier, note why
