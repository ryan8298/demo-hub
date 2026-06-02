# Demo UI/UX Redesign Brief — 10 Use Cases, 10 Distinct Visual Languages

The current state: every demo renders as the same dark-glass surface with a row of KPI cards, a center panel, and a sidebar of agent activity. That works as a *family resemblance* across the portfolio, but it kills the **"this was built for me"** moment that a frontline operator, an underwriter, a paralegal, and a regulatory director should each feel within 3 seconds of landing on their tile.

Each redesign below is anchored to **who is actually staring at this screen for 6+ hours a day** and what their world looks like — physical environment, dominant tool they're replacing, and the cognitive load they're under. Use these as the Lovable/Perplexity prompt scaffolding. Keep the Echelix shell (nav, footer, font stack, sea-foam accent) — change everything *inside* the canvas.

---

## Shared design rails (keep across all 10)

- **Top nav + footer**: unchanged Echelix chrome.
- **Brand accents**: sea-foam (`#A8DADC`-ish), sage, milk-white, deep charcoal. One demo can borrow a sector-appropriate accent (e.g., amber for O&G, indigo for finance) but the Echelix sea-foam must appear somewhere.
- **Typography**: Newsreader serif for major headers, Inter for everything else.
- **Width**: 1200px canvas, generous breathing room.
- **What to avoid everywhere**: identical "3 KPI tiles → big screenshot → agent feed sidebar" layout. Identical neon-on-black aesthetic. Identical card chrome. Identical "Activity feed" component.

---

## 1. Iron Scout RTI — Midstream Real-Time Intelligence

**Who's looking at this:** A midstream control-room operator on a 12-hour shift, surrounded by 6 wall monitors, eyes scanning for compressor anomalies across 47 assets. Their current tool is OSIsoft PI + a SCADA HMI from 2008.

**Dominant metaphor:** **Mission control / NOC wall.**

**Layout archetype:**
- **Asset map as the hero** — a stylized pipeline + compressor station schematic occupying the top 60% of the canvas. Geographic accuracy isn't the point; *legibility of asset health is*. Color-coded asset nodes (green/amber/red), live event ticker overlay.
- **Telemetry waveforms** running across the bottom edge — vibration, pressure, temperature — like an EKG. Always moving (subtle, not distracting).
- **Right rail**: a "watchlist" of the 3–5 assets the AI is currently watching most closely, with one-line anomaly summaries.
- **Top KPI strip is replaced** by a single bold "Events/sec" counter + "Anomalies in last 15 min" + uptime — rendered like a stock ticker, not cards.

**Color/mood:** Deep navy + cold cyan + sodium-amber for alerts. Industrial. Subtle CRT scanline texture (very light).

**Distinguishing motion:** Telemetry lines tick left→right continuously. Anomaly pulses (single-pixel ring expanding from the asset node). No bouncy hover animations — this is a workplace, not a marketing page.

**Reference vibe:** Bloomberg terminal × air traffic control × a really good SCADA HMI redesign.

---

## 2. ChainIQ — Agentic Supply Chain Intelligence

**Who's looking at this:** A demand planner at a $200M CPG brand. They live in Excel, Power BI, and a planning suite (Blue Yonder, o9, Anaplan). Their workday is *reconciling forecasts against retailer signals.*

**Dominant metaphor:** **Decision cockpit / planning whiteboard.**

**Layout archetype:**
- **Three vertical agent columns** running side-by-side: *Demand Sensing*, *Supplier Risk*, *Deduction Recovery*. Each column is a kanban-ish stream of "decisions the agent made today" — not a feed of log lines, but **cards that look like recommendations** (e.g., "Raise replenishment to Target DC-1142 by 18% — POS spike confirmed, lead time 7 days").
- **Top of canvas**: a unified forecast accuracy + service level + deduction-recovery-$ scoreboard styled like a sports box score, not metric cards.
- **Bottom**: a horizontal SKU/account heatmap. Rows = top SKUs, columns = top retailers, cells colored by current risk.

**Color/mood:** Warm off-white background (CPG brands love clean retail-ish surfaces), navy + a single signature brand color (suggest a muted persimmon or olive). Print-magazine restraint.

**Distinguishing motion:** Agent cards slide up from the bottom of each column as new recommendations land. Accept/Override buttons feel tactile.

**Reference vibe:** Linear × a really clean S&OP dashboard × a Bloomberg news terminal.

---

## 3. ClearPath AI — Autonomous Prior Authorization

**Who's looking at this:** A prior-auth specialist at a 120-physician orthopedic group. They are *drowning in fax-and-portal hell* across 900+ payer portals. They're the most over-worked, under-tooled person in healthcare admin.

**Dominant metaphor:** **Inbox zero / case worklist** — but radically calmer than their actual job.

**Layout archetype:**
- **Triple-pane layout (Outlook-style)**: list of in-flight auths (left), the focused case (center), payer policy + AI rationale (right). This *intentionally* mirrors the tool they already think in.
- Each case row has a status timeline chip: *Submitted → Awaiting → Denied → Appealed → Approved*, with the AI's next action surfaced inline.
- **Top strip**: not metrics — instead, a *queue load indicator* ("47 auths in-flight, 12 need human eyes, 35 fully agent-handled today") and a clinical-feeling pill showing avg turnaround time.
- Case detail panel includes a **structured clinical packet preview** — diagnosis, CPT, attached chart notes — rendered like a real prior-auth form, not a JSON blob.

**Color/mood:** Clinical white background, soft teal accents, generous whitespace. Anti-anxiety. Use a serif (Newsreader is perfect) for case headers — it reads "medical record," not "SaaS dashboard."

**Distinguishing motion:** Cases slide from "in-flight" to "approved" with a satisfying check animation. No flashing red alerts — denials slide in with a calm amber band.

**Reference vibe:** Superhuman × an Epic chart redesigned by Linear × a Mayo Clinic patient portal that doesn't suck.

---

## 4. Counsel IQ · Matter & Billing Intelligence

**Who's looking at this:** A partner or senior associate at a 50-attorney firm. Their world is **matters, time entries, and documents** — and their current tools are NetDocuments, iManage, and Aderant/Elite.

**Dominant metaphor:** **The matter workspace / a digital case folder.**

**Layout archetype:**
- **Matter-centric hero**: a single open matter front-and-center, styled like a *folio* — matter name, client, responsible attorney, key dates as a vertical "spine" on the left edge.
- **Tabs across the top of the matter**: Documents · Timeline · Billing · Contracts · Knowledge. Each tab reveals an AI-augmented view (e.g., Documents tab shows AI-summarized doc cards, not file names).
- **Time entry assistant** as a persistent bottom-right drawer — captures Outlook + Teams + doc activity, drafts narrative entries, attorney approves with one click. This is the **killer feature** — show it working live.
- **Sidebar**: list of other active matters with a "Copilot has X drafts waiting for you" badge per matter.

**Color/mood:** **Cream/parchment background, oxblood and ink-navy accents, serif-heavy.** Think *law review* and *leather-bound binder* — not SaaS dashboard. This is the single biggest visual differentiation lever in the whole portfolio.

**Distinguishing motion:** Pages turn (subtle), time-entry draft appears like a typewriter line. Very restrained.

**Reference vibe:** A Stripe-quality redesign of NetDocuments × the Economist app × a Moleskine cover.

---

## 5. DeliverIQ · AI Material Verification

**Who's looking at this:** A field receiving clerk at a pad site, on a ruggedized tablet, in gloves, in 40°F drizzle. Or a materials manager watching 12 sites from a portacabin desk.

**Dominant metaphor:** **Camera-first field app + receiving dock.**

**Layout archetype:**
- **The camera frame IS the UI.** Hero is a large image-capture surface with detected items boxed and labeled in real time (overlay rectangles + counts). This must feel like a phone camera, not a desktop app.
- **Left rail**: the PO line items, ticking off as the AI identifies + counts each one. Strikethrough on matched lines, red badge on shortages.
- **Bottom action bar**: Approve · Flag Discrepancy · Add Photo · Sign Chain-of-Custody. Buttons are *big and gloved-thumb friendly*.
- **Above the camera**: a thin map strip showing the 12 pad sites with today's delivery counts.

**Color/mood:** Higher contrast for outdoor visibility. Hi-vis amber + asphalt grey + bright white. Larger font sizes than other demos. Subtle drop-shadows so overlay labels stay legible against any background image.

**Distinguishing motion:** Detection boxes "snap in" as the AI sees an item. Count badges increment with a tiny tick.

**Reference vibe:** Apple's Vision Pro hand-tracking UI × a Toast handheld × a really polished QuickBooks receipt-scan flow.

---

## 6. FinShield AI · AML & Loan Intelligence

**Who's looking at this:** A BSA/AML analyst at a $2B community bank. Their day is reviewing alerts, building cases, and drafting SARs. They live in Verafin or a homegrown case manager.

**Dominant metaphor:** **Investigative case file / evidence board.**

**Layout archetype:**
- **Hero is a case investigation surface** — entity graph in the upper half showing relationships between accounts, transactions, counterparties (think Palantir Gotham but *legible*). Nodes are sized by risk score, edges are colored by transaction recency.
- **Lower half**: the SAR draft narrative the agent has assembled, with **citations linking each sentence back to specific transactions** in the graph. Hovering a citation highlights the corresponding edge.
- **Left rail**: alert queue, color-banded by risk tier (red/amber/green), each with an AI confidence score.
- **Top**: not metric tiles — instead a *regulatory exam readiness* indicator (open SARs, days-to-file remaining, audit-trail completeness).

**Color/mood:** **Forensic. Dark slate background, brass/gold accents, restrained data-viz palette.** Think *banking compliance* meets *intelligence analyst*. Use a monospace font for transaction IDs and amounts — it signals precision.

**Distinguishing motion:** Graph nodes settle into place when a new alert is opened. Citation pulses when hovered.

**Reference vibe:** Palantir Gotham × Bloomberg compliance module × a really good Maltego redesign.

---

## 7. Forge AI · Plant Floor Intelligence

**Who's looking at this:** A plant manager standing at a wall-mounted screen on the production floor, glancing at it between rounds. And a maintenance tech on a tablet next to a CNC machine.

**Dominant metaphor:** **Andon board / OEE wall display.**

**Layout archetype:**
- **Production line diagram as hero** — a horizontal flow showing stations 1→N with live OEE %, current part, and operator. Stations turn amber/red when the predictive maintenance agent forecasts a failure. This is the dominant visual element.
- **Below the line**: three agent cards laid out horizontally — *Predictive Maintenance · Quality · Frontline Knowledge*. Each card shows the agent's current focus + last action.
- **Right rail**: a "Today on the floor" log — work orders dispatched, quality alerts, knowledge queries answered. Reads like a shift-handoff log.
- **Frontline Knowledge** gets a unique sub-surface: a chat-style interface where the retiring-tech's captured expertise is being served via Teams — show a real Q&A exchange.

**Color/mood:** **High-contrast andon palette: forest green / amber / red on a dark steel background.** Bold sans-serif numbers (think factory wall clock). Industrial — but cleaner than Iron Scout (manufacturing is more orderly than midstream).

**Distinguishing motion:** Station blocks flip color when state changes. OEE numbers count up/down smoothly. Conveyor-belt-style line animation under each station.

**Reference vibe:** A Tesla factory wall display × a Tulip Frontline Operations app × Apple Watch activity rings (for OEE).

---

## 8. NomAgent · Agentic Pipeline Scheduling

**Who's looking at this:** A scheduler at a midstream operator running 4 cycles across 11 counterparties. Their world is **nominations, confirmations, and re-noms**, currently lived in a spreadsheet + email + a NAESB EDI tool from 2003.

**Dominant metaphor:** **Trading desk / scheduling board.**

**Layout archetype:**
- **Cycle timeline as hero** — a horizontal Gantt-style view of today's 4 cycles (Timely, Evening, Intraday 1, Intraday 2), with the current cycle highlighted and countdown to deadline ticking.
- **Counterparty grid below**: 11 shipper rows × cycle columns, cells showing nominated quantity + variance vs. confirmed. Color cells when variance exceeds threshold.
- **Right panel**: AI-drafted re-nominations awaiting scheduler approval — each one shows the variance detected + the proposed re-nom + the NAESB-compliant narrative.
- **Top**: a single bold *cycle countdown clock* (HH:MM:SS to next deadline) — this is what schedulers obsess over. Not a KPI card. A *clock.*

**Color/mood:** **Trading-floor energy.** Black background, electric green for positive variance, amber for warnings, white for the live cycle clock. Monospace numerals everywhere.

**Distinguishing motion:** Cycle clock ticks. Variance cells flash when they cross threshold. Re-nom proposals slide in from the right.

**Reference vibe:** A modernized natural gas trading desk × a clean Bloomberg energy module × a Stripe Treasury dashboard.

---

## 9. SafeSignal · Conversational Safety Intelligence

**Who's looking at this:** Two very different people — (1) a roughneck on a tablet or phone, dirty hands, capturing a near-miss in 60 seconds; and (2) an HSE manager at a desk reviewing trends.

**Dominant metaphor:** **Chat first. Dashboard second.**

**Layout archetype (split-personality demo — show both halves):**
- **Left half — the field capture experience**: a phone-shaped mock-up showing a Teams-like chat where the safety agent asks "What happened?" and the worker types or speaks. Show the conversation building up with the agent extracting OSHA codes, location, severity in real time, displayed as little chips appearing beside the conversation.
- **Right half — the HSE manager view**: a clean dashboard with a near-miss heatmap (site map + time-of-day), a top-causes bar chart, and a corrective-action loop status. Calm, analytical.

**Color/mood:** Field side — bright, friendly, conversational (think WhatsApp meets Duolingo). Manager side — calm sage greens + safety yellow accents, NOT alarming red. Safety culture work depends on *psychological safety*; the UI should reflect that.

**Distinguishing motion:** Chat bubbles appear with a typing indicator. Extracted entity chips fly out of the conversation into a structured report preview.

**Reference vibe:** WhatsApp × Linear inbox × a really humane OSHA reporting tool.

---

## 10. RateCase Navigator · Regulatory Affairs Intelligence

**Who's looking at this:** A regulatory affairs director at an investor-owned utility, mid-rate-case, juggling 12,400 documents, 247 commitments, and a 600-page testimony. They've been in regulatory work for 20+ years. Their world is **filings, dockets, discovery, and commitments.**

**Dominant metaphor:** **Docket / proceeding workspace.**

**Layout archetype:**
- **Proceeding header**: docket number, jurisdiction (e.g., "PUC Docket No. 25-1142 · Texas PUC · General Rate Case"), procedural schedule strip showing where we are in the 18-month timeline.
- **Three primary work surfaces as tabs** (not cards): *Discovery* · *Commitments* · *Filings*.
  - **Discovery tab**: incoming data requests as a queue, AI-drafted responses with citations to the document corpus, response deadline countdowns.
  - **Commitments tab**: a register of every commitment made on the record — table view, status (open/closed/at-risk), responsible witness, due date. This is the differentiator — utilities lose millions on undocumented commitments.
  - **Filings tab**: filing calendar + draft assembly workspace.
- **Right rail**: a "Witnesses & SMEs" panel — each witness with their open items count. This mirrors how rate case teams actually organize labor.
- **Top metric strip** is replaced by: days-to-final-order, open discovery count, at-risk commitments, draft testimony status.

**Color/mood:** **Government / regulatory restraint.** Off-white background, navy and burgundy accents, serif headings. Reads like a *brief filed with the commission*, not a SaaS app. Document-density is a feature, not a bug — regulatory folks are comfortable with text-heavy interfaces.

**Distinguishing motion:** None to speak of. This is a serious workspace for serious work. Subtle hover states, no flourishes. Page transitions are crisp.

**Reference vibe:** A FERC eLibrary redesigned by Stripe × the Economist app × a high-end legal CMS (CaseText pre-acquisition).

---

## Quick differentiation matrix (paste this into your Lovable prompts)

| # | Demo | Layout archetype | Color mood | Dominant element | What it must NOT feel like |
|---|------|------------------|-----------|------------------|---------------------------|
| 1 | Iron Scout RTI | Mission control wall | Navy + cyan + sodium amber | Asset map + telemetry waveforms | Marketing dashboard |
| 2 | ChainIQ | 3-column decision cockpit | Warm off-white + navy + persimmon | Vertical agent decision streams | Generic SaaS analytics |
| 3 | ClearPath AI | Triple-pane inbox | Clinical white + teal | Case worklist | Anything alarming or red |
| 4 | Counsel IQ | Matter folio | Cream + oxblood + ink navy (serif-heavy) | Open matter + time-entry assistant | A modern SaaS dashboard |
| 5 | DeliverIQ | Camera-first field app | Hi-vis amber + asphalt grey | Live camera frame with detections | Desktop-density layout |
| 6 | FinShield AI | Investigative case file | Dark slate + brass + monospace | Entity graph + cited SAR narrative | Bright/marketing colors |
| 7 | Forge AI | Andon board | Forest/amber/red on steel | Production line flow | Spreadsheet vibes |
| 8 | NomAgent | Trading desk | Black + electric green + amber | Cycle countdown clock + grid | A standard CRUD UI |
| 9 | SafeSignal | Split: chat + dashboard | Field=friendly bright / Manager=sage safety-yellow | Conversational capture | Alarming compliance UI |
| 10 | RateCase Navigator | Docket workspace | Off-white + navy + burgundy (serif) | Proceeding tabs + commitments register | A marketing-y SaaS layout |

---

## How to prompt Lovable / Perplexity per demo

For each tile, use this template (filling in from the section above):

> Build a demo product UI for **[demo name]**. The user is **[persona — be specific about environment]**. Their current tool is **[legacy system being replaced]**.
>
> The visual archetype is **[layout archetype]** — *not* a generic SaaS dashboard. The hero element is **[dominant element]**. Color mood: **[palette + mood notes]**. Typography: **[serif vs sans + density notes]**.
>
> Include these specific surfaces: **[3–5 named panels with one-line descriptions from the section above]**.
>
> Distinguishing motion: **[only the motion notes from the section]**. No bouncy hover states, no neon glows, no generic "Activity Feed" sidebar.
>
> Reference vibe: **[the 3-reference line]**. Avoid: **[the "must not feel like" cell from the matrix]**.

Keep prompts ≤ 250 words and lead with the persona — Lovable's output quality is dominated by *who the user is*, not by feature lists.

---

## Order of operations (recommendation)

Don't redesign all 10 at once — sequence by **visual distance from the current state**, biggest leap first, so the contrast lands hardest on hub visitors:

1. **Counsel IQ** (cream + serif + folio — most opposite of current)
2. **RateCase Navigator** (docket workspace, also serif-heavy)
3. **DeliverIQ** (camera-first, completely different layout DNA)
4. **NomAgent** (trading-desk countdown clock)
5. **FinShield AI** (entity graph + brass)
6. **Forge AI** (andon board)
7. **ChainIQ** (3-column decision streams)
8. **SafeSignal** (split chat/dashboard)
9. **Iron Scout RTI** (mission control)
10. **ClearPath AI** (triple-pane inbox)

After the first 3 land, the hub will already feel like 10 distinct products instead of 10 reskins of the same template.
