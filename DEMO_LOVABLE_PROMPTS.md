# Lovable / Perplexity Prompts — 10 Demos, Full Context + Build Brief

**How to use this file:** For each of the 10 demos below, copy **everything inside the fenced code block** (from the opening ` ``` ` to the closing ` ``` `) and paste it as a single message into a fresh Lovable or Perplexity project. Each block is self-contained — it includes the persona, the strategic context, the layout, the sample data, the visual specs, and the explicit "avoid" list. No assembly required.

**Tech stack assumption (Lovable defaults):** React + Vite + Tailwind + shadcn/ui. Don't override unless you have a specific reason.

**Recommended sequence** (biggest visual contrast first, so the hub starts looking distinct fast):
1. Counsel IQ — 2. RateCase Navigator — 3. DeliverIQ — 4. NomAgent — 5. FinShield AI — 6. Forge AI — 7. ChainIQ — 8. SafeSignal — 9. Iron Scout RTI — 10. ClearPath AI

---

## 1. Iron Scout RTI — Midstream Real-Time Intelligence

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: Iron Scout RTI
TAGLINE: Real-time midstream operations intelligence

WHO USES THIS: A midstream oil & gas control-room operator on a 12-hour shift. They sit in front of a wall of monitors, eyes scanning for compressor anomalies across 47 compressor and pipeline assets in the Permian Basin (West Texas). Their day is unbroken vigilance — they're watching for vibration harmonics, pressure drops, and temperature anomalies that signal an asset is about to fail. The legacy tool they're replacing is an OSIsoft PI historian fronted by a 2008-era SCADA HMI: hostile color palettes, tiny fonts, no anomaly intelligence, no recommendations — just raw data. Iron Scout RTI is the modern AI-augmented replacement: the same situational awareness, but with a Foundry-trained model surfacing anomalies and recommending actions before failures happen.

WHY THIS DEMO MATTERS: Midstream operators spend $30–80M per unplanned compressor failure (lost throughput + emergency mobilization). Selling this product depends on the prospect feeling, within 3 seconds of opening the demo, that this was designed by someone who has actually stood in a midstream control room. It cannot look like a generic SaaS dashboard.

VISUAL ARCHETYPE: Mission control wall / Network Operations Center. The closest reference points are: Bloomberg terminal, air traffic control, and a really high-end SCADA HMI redesign. Industrial, dense, dark, monospace-heavy. This is a workplace, not a marketing page.

LAYOUT (single full-bleed page, no left sidebar nav):

1. TOP BAR (60px tall, dark navy #0A1628): Left side — "IRON SCOUT RTI · WEST TEXAS BASIN" in small caps tracking-wide. Right side — three live counters in monospace styled like a stock ticker, NOT card chrome: "1,247 events/sec" / "3 active anomalies" / "uptime 99.97%".

2. HERO MAP (top 60% of canvas): A stylized schematic of a pipeline network — horizontal trunk line running left to right with branches feeding 8 compressor stations and 4 metering stations. Each station is a labeled node. Color nodes: 42 green, 3 amber (anomaly), 2 grey (offline). The 3 amber nodes should pulse continuously (a single-pixel ring expanding outward, repeating every 2 seconds). Connecting lines between stations are thin cyan #4FC3F7. Below each node show the station ID and current pressure reading.

3. TELEMETRY STRIP (200px tall, immediately below the map): Three side-by-side waveform charts — Vibration / Pressure / Temperature. The lines tick left-to-right continuously, showing 60 seconds of rolling history. When a value crosses threshold, the line spikes amber and the chart background tints faintly red.

4. RIGHT RAIL (320px wide, floating panel docked to the right edge): Header "WATCHLIST · 4 ASSETS". Below: 4 cards stacked vertically. Each card shows: asset ID, anomaly type, AI confidence score, recommended action, and an "Acknowledge" button.

SAMPLE ASSETS (use these exact names — Permian Basin counties): CS-101 Pecos, CS-102 Loving, CS-103 Reeves, CS-104 Ward, CS-105 Winkler, CS-106 Andrews, CS-107 Ector, CS-108 Midland. Metering stations: MS-201 Waha, MS-202 Pyote, MS-203 Mentone, MS-204 Orla.

SAMPLE WATCHLIST ENTRIES:
- CS-103 Reeves · "Bearing harmonic detected on 2nd-stage compressor" · 87% confidence · "Schedule inspection within 48h"
- CS-107 Ector · "Discharge pressure trending high — fouled cooler suspected" · 92% confidence · "Dispatch cleaning crew this shift"
- MS-202 Pyote · "Meter drift exceeds 1.5% — calibration overdue" · 81% confidence · "Generate calibration work order"
- CS-105 Winkler · "Vibration signature consistent with misalignment" · 76% confidence · "Add to next planned outage"

COLORS:
- Background: deep navy #0A1628
- Primary accent: cyan #4FC3F7
- Alert amber: #FFA726
- Healthy green: #66BB6A
- Text primary: milk-white #F5F5F0
- Text secondary: grey #9AA5B1

TYPOGRAPHY: Inter for everything. JetBrains Mono for all numbers, asset IDs, and the top-bar counters.

MOTION: Continuous pulsing rings on the amber nodes. Telemetry waveforms scroll continuously. No bouncy hover states, no animated cards, no glow effects on idle elements.

EXPLICITLY AVOID: A 3-KPI-tile header row across the top. Generic dark-glass card grids. An "Activity Feed" sidebar. Neon glows. Card-lift hover effects. Any marketing-y polish — this should look like serious industrial software a 25-year veteran would respect.
```

---

## 2. ChainIQ — Agentic Supply Chain Intelligence

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: ChainIQ
TAGLINE: Agentic supply chain intelligence for CPG brands

WHO USES THIS: A demand planner at a $200M consumer packaged goods brand — think a mid-sized snack, beverage, or personal care company. They live in Microsoft Excel, Power BI, and a planning suite like Blue Yonder or o9. Their workday is reconciliation: matching their internal forecast against retailer point-of-sale signals, EDI 856 shipment data, and supplier risk feeds. It's tedious, manual, and they're always 2 days behind reality. ChainIQ runs three agents overnight (Demand Sensing, Supplier Risk, Deduction Recovery), and this UI is their morning routine: review what the agents did, accept or override.

WHY THIS DEMO MATTERS: CPG planners are mid-career analytical professionals — not impressed by flashy chrome. They want clarity, calmness, and the feeling that they're seeing what an experienced colleague would have flagged. The UI must feel premium-retail (think a high-end CPG brand's internal tool), not SaaS-startup.

VISUAL ARCHETYPE: Decision cockpit / planning whiteboard. Three vertical agent columns, magazine-restraint typography, warm off-white surfaces. Print-publication aesthetics applied to enterprise software. Not a dashboard.

LAYOUT (single page, no left sidebar nav):

1. TOP BAR (80px tall, warm off-white #FAF7F2): Left — "CHAINIQ · WEEK 22 · MAY 2026" in small serif caps. Right side — a "scoreboard" styled like a sports box score in print: four stats with large bold serif numerals on top and small all-caps labels underneath. Stats: "Forecast Accuracy 94.2% (▲ 2.1)" / "Service Level 98.7%" / "Deductions Recovered MTD $487K" / "Working Capital Released $1.2M". No card borders — just the numbers and labels as flowing typography.

2. THREE COLUMNS (equal width, fills middle 60% of vertical space):

   LEFT COLUMN — "DEMAND SENSING": A vertical stack of 5 recommendation cards. Each card shows: retailer name + DC, recommended action in one short sentence, supporting signal, AI confidence percent, and three buttons (Accept · Override · Snooze). Sample entries:
   - "Target DC-1142 (Lake City FL) · Raise replenishment +18% · POS spike confirmed 3-day, lead time 7d · 92% confidence"
   - "Walmart RDC-6021 (Bentonville) · Hold current allocation · Inventory healthy, no signal · 88% confidence"
   - "Kroger DC-4408 (Compton CA) · Reduce replenishment -12% · POS softening, on-shelf surplus · 84% confidence"
   - "Albertsons DC-2210 (Ponca City) · Expedite 2-day push · Promo lift starting Mon · 91% confidence"
   - "HEB DC-1145 (San Antonio) · Add safety stock +8% · Hurricane forecast 5d · 79% confidence"

   MIDDLE COLUMN — "SUPPLIER RISK": A vertical stack of 5 cards. Sample entries:
   - "Tier-2 sweetener supplier (Brazil, São Paulo) · Weather disruption forecast 14d · Re-route via Tier-3 backup · 79% confidence"
   - "Glass bottle supplier (Mexico, Monterrey) · Port congestion easing · Normal operations · 95% confidence"
   - "Aluminum can supplier (Ohio) · Labor contract negotiations · Watch closely · 71% confidence"
   - "Corrugated packaging (Georgia) · Single-source risk flagged · Initiate qualification of backup · 88% confidence"
   - "Citric acid (China) · Tariff change effective Jul 1 · Re-cost SKU 0044711 · 96% confidence"

   RIGHT COLUMN — "DEDUCTION RECOVERY": A vertical stack of 5 cards. Sample entries:
   - "Kroger chargeback $47,200 · Invalid OS&D claim · Auto-dispute drafted · 96% confidence"
   - "Albertsons $12,800 · Valid trade promo deduction · Approve & close · N/A"
   - "Publix $8,400 · Pricing dispute, agent has documentation · Auto-dispute drafted · 89% confidence"
   - "Walmart $34,100 · MABD compliance fine — partially recoverable · Drafted partial dispute · 72% confidence"
   - "HEB $5,200 · Logistics deduction, valid · Approve & close · N/A"

   New cards should slide up into each column from the bottom every few seconds (subtle).

3. BOTTOM STRIP (200px tall): Horizontal heatmap. Rows = top 10 SKUs with realistic CPG names. Columns = top 8 retailers (Walmart, Target, Kroger, Albertsons, Publix, HEB, Costco, Sams Club). Cells colored by current week risk: sage green (healthy), warm amber (watch), persimmon (action needed). Hover any cell to show current units sold vs forecasted units.

SAMPLE SKU NAMES: "12oz Original Sparkling Water · 6-pack", "16oz Family Pack Chips · Sea Salt", "20oz Cold Brew Coffee · Black Unsweet", "8oz Greek Yogurt · Vanilla Bean", "32oz Sports Drink · Citrus Burst", "10oz Premium Granola · Honey Almond", "6ct Protein Bars · Chocolate Peanut", "24ct Sparkling Water Variety", "14oz Trail Mix · Cranberry Cashew", "18oz Premium Cereal · Cinnamon Crunch".

COLORS:
- Background: warm off-white #FAF7F2 (NOT pure white — premium retail feel)
- Primary text: navy #1A2B4A
- Accent persimmon: #D4622E (used ONLY on Accept buttons and "action needed" heatmap cells — sparingly)
- Sage green: #87A878 (healthy state)
- Warm amber: #E5A23D (watch state)
- Borders / dividers: faint #E8E2D5

TYPOGRAPHY: Newsreader serif for the scoreboard numerals, column headers, and SKU names. Inter for all body text, card labels, and button text. Use generous whitespace — line-height 1.6, comfortable padding. Print-magazine restraint, never dashboard density.

MOTION: New recommendation cards slide up from the bottom of their column with a 400ms ease. Accept button has a tactile press (slight scale-down on click). Heatmap cells transition color smoothly when state changes. Nothing else moves on idle.

EXPLICITLY AVOID: Dark mode. Neon anything. Sea-foam cyan as a primary accent. A "Recent Activity" feed sidebar. Generic KPI tiles across the top. Cluttered chart grids. Anything that signals SaaS-startup instead of premium-CPG-internal-tool.
```

---

## 3. ClearPath AI — Autonomous Prior Authorization

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: ClearPath AI
TAGLINE: Autonomous prior authorization

WHO USES THIS: A prior-authorization specialist at a 120-physician multi-specialty group (orthopedics, cardiology, oncology). They process 60,000+ prior-auths per year across 900+ payer portals. Their current daily reality is fax-and-portal hell: log into Aetna's portal, copy chart notes, paste into a form, fax to a UM nurse, wait 3 days, get denied for an obscure reason, appeal, wait again. They are the most over-worked, under-tooled, burned-out role in healthcare administration. ClearPath AI is an agentic system that drafts the auth packet, submits it across the right payer-specific portal, monitors status, and drafts the appeal if denied — without the specialist touching a fax machine.

WHY THIS DEMO MATTERS: The user's existing tool is hostile to them. The single most important design principle here is to *not add anxiety*. Calm typography, clinical whitespace, no flashing red, no aggressive alert badges. This UI should feel like a relief.

VISUAL ARCHETYPE: Triple-pane inbox in the Outlook / Superhuman tradition. Clinical white. Generous whitespace. Anti-anxiety. Reads like a thoughtfully redesigned EHR.

LAYOUT (three vertical panes, no top KPI strip):

1. LEFT PANE (320px wide, white background): Auth queue. At top: search bar ("Search patient, CPT, payer..."). Below that: sort tabs — "All · Needs Human · Auto-handled · Approved Today". Below that: a vertical list of 12 in-flight auth rows. Each row shows: patient initials (HIPAA-safe, e.g., "JM"), CPT code, payer name, status timeline pill, and an AI action chip.

   Status timeline pill: a tiny horizontal segmented bar showing "Submitted → Awaiting → Approved" with the current step highlighted in teal.

   AI action chip examples: "Auto-submitted 2h ago" / "Needs your review" / "Appeal drafted, ready to file" / "Approved 14m ago".

2. CENTER PANE (flexible width, approximately 600px, white background): The focused case detail.

   TOP — patient summary card: "JM · DOB 1962 · MRN ****4421 · Aetna PPO Plan 887-X · Member since 2019". Subtle card with no heavy chrome.

   MIDDLE — structured clinical packet preview styled like an actual prior-auth form (not JSON, not raw text):
   - Diagnosis: M17.11 — Unilateral primary osteoarthritis, right knee
   - CPT Requested: 27447 — Total knee arthroplasty
   - Attending Physician: Dr. S. Patel, MD (Orthopedic Surgery, NPI 1234567890)
   - Service Date Requested: June 18, 2026
   - Site of Service: Outpatient ASC — Riverside Surgery Center
   - Clinical Justification Summary (AI-drafted, 4 lines): Patient reports persistent right knee pain unresponsive to 6+ months of conservative management including PT, NSAIDs, and intra-articular corticosteroid injections (Mar 12, 2026 and May 8, 2026). MRI dated May 14, 2026 confirms severe medial compartment osteoarthritis with bone-on-bone changes. KSS score 38/100. Patient meets Aetna medical policy criteria for primary TKA.

   BOTTOM — three action buttons: [Submit to Payer] (teal, primary) · [Request Edit] (white outline) · [Escalate to Human] (white outline).

3. RIGHT PANE (360px wide, very light grey #F9FAFB background): Payer policy reference.

   TOP — Aetna's medical policy for CPT 27447. Show 6 coverage-criteria checklist items, all marked checked-green by the AI with small citation links back to the chart notes in the center pane:
   - ✓ Documented OA with imaging confirmation (MRI 5/14/26)
   - ✓ 6+ months conservative therapy attempted (PT records, injection log)
   - ✓ Functional decline documented (KSS 38/100, mobility log)
   - ✓ BMI within surgical guidelines (BMI 28.4)
   - ✓ No active infection or contraindications (pre-op labs 5/22/26)
   - ✓ Patient counseled on risks and alternatives (consent on file)

   BOTTOM — similar approved cases summary: "3 similar cases approved in last 30 days · Average turnaround 1.4 days · 0 denials".

4. TOP STRIP (above the three panes, 60px tall, white): NOT metric cards. Instead a single horizontal "queue load" sentence-style indicator: "47 auths in-flight · 12 need human eyes · 35 fully agent-handled today". Then on the right: a calm turnaround pill "Avg turnaround 1.8 days · ▼ 4.2 from baseline".

COLORS:
- Background: pure white #FFFFFF (main) and very light grey #F9FAFB (right pane)
- Primary text: near-black #1A1F2C
- Accent teal: #14B8A6 (used on status pills, submit button, AI elements)
- Soft amber: #F59E0B (used for denials — NOT red, never red)
- Borders: #E5E7EB
- Citation links: muted teal #0F766E

TYPOGRAPHY: Newsreader serif for patient names, case headers, and clinical packet headings — this small detail makes it read as "medical record" rather than "SaaS dashboard". Inter for everything else. Generous line-height 1.7, comfortable reading density, generous padding.

MOTION: Auth rows in the left pane slide smoothly from "in-flight" to "approved" with a calm green check animation. No flashing. Denials slide in with a soft amber band — no shake, no alarm. Hover states are subtle background tint changes only.

EXPLICITLY AVOID: Red alert badges (denials use amber, not red). Dark mode. Dense data-table aesthetics. Anything that adds visual stress to an already stressful job. Marketing-y chrome. Animated charts. Sidebar nav with a dozen icons.
```

---

## 4. Counsel IQ — Matter & Billing Intelligence

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: Counsel IQ
TAGLINE: Matter, billing, and contract intelligence for mid-size law firms

WHO USES THIS: A partner or senior associate at a 50-attorney commercial litigation firm. Their world is matters (cases), time entries (billable hours), and documents (pleadings, contracts, correspondence). They live in NetDocuments or iManage for documents, Aderant Elite or Centerbase for billing, and Outlook for everything else. The firm's institutional knowledge — who knows what, which precedent applies, what was promised in last year's negotiation — lives in retiring partners' heads and email archives. Counsel IQ is the AI-augmented matter workspace: a single canvas per matter that surfaces relevant documents, drafts time entries from captured activity, summarizes opposing counsel's filings, and turns the firm's archive into searchable institutional memory.

WHY THIS DEMO MATTERS: This is the single biggest visual-differentiation lever in the entire portfolio. Lawyers respond viscerally to print-publication aesthetics — they spend their careers reading bound volumes of case law, serif-set briefs, and leather-bound deal books. A SaaS-looking app reads as "consumer software, not for me". A digital case folio reads as "this was made by someone who understands law practice". Lean hard into print aesthetics — this should look like a leather-bound binder rendered as software.

VISUAL ARCHETYPE: Digital case folio / law review / leather-bound deal book. Cream and parchment backgrounds. Heavy serif typography. Restrained. The opposite of a modern SaaS dashboard.

LAYOUT:

1. TOP BAR (ink-navy #1A2B4A, 70px tall): "COUNSEL IQ" in small caps tracking-wide on the left in milk-white. Right side: a search field with placeholder "Search matters, documents, clients...", a notification bell, and an attorney avatar (initials in a small circle).

2. MATTER SPINE (left edge, 280px wide, cream #F5F1E8 background, full-height): Styled like the spine of a leather case binder. Content stacked vertically:
   - Matter name in large serif (Newsreader, 22px): "Henderson Industries v. Apex Manufacturing"
   - Client name below: "Henderson Industries, Inc."
   - Matter number: "M-2026-0142"
   - Responsible attorney: "S. Whitmore (Partner)"
   - Key dates list:
     · Filed: January 4, 2026
     · Discovery cutoff: July 18, 2026
     · Trial: September 15, 2026
     · Next deadline: Discovery responses · June 12, 2026
   - Then a divider, and a list of 8 other active matters with their matter numbers and a small badge per matter where applicable: "3 drafts waiting", "Time entry pending", "New filing received".

   Sample other matters: "Riverside Logistics — Contract dispute", "Atherton Acquisition (Deal #DA-1188)", "Cole Trust Estate Planning", "Petrolux Energy v. Houston DA — White collar defense", "Marin Pharmaceuticals — IP licensing", "Stillwater Holdings — M&A diligence", "Coastal Realty Partners — Lease renegotiation", "DataVault Inc. — Privacy compliance".

3. MAIN CANVAS (flexible width, parchment #FAF7ED background): Tabs across the top, set in small caps with letter-spacing — "DOCUMENTS · TIMELINE · BILLING · CONTRACTS · KNOWLEDGE". Default to the DOCUMENTS tab.

   DOCUMENTS tab content: A vertical list of AI-summarized document cards (not raw file names). Each card has:
   - Document title (set in serif): e.g., "Defendant's Motion to Dismiss"
   - Two-sentence AI summary in body serif: "Apex argues for dismissal under Rule 12(b)(6), contending Henderson's tortious interference claim fails to allege actual damages. Cites Texas Supreme Court precedent in Wal-Mart v. Sturges (2001) and three appellate cases from 2018–2022."
   - Doc type chip: "Pleading" / "Discovery" / "Correspondence" / "Order" / "Contract"
   - Date and source: "Filed March 12, 2026 · Loaded from NetDocuments"
   - [Open] button (oxblood outline)

   Show 6 cards with these titles:
   - "Defendant's Motion to Dismiss · 47 pages · filed March 12, 2026"
   - "Plaintiff's Initial Disclosures · 23 pages · filed February 28, 2026"
   - "Email thread: Settlement discussions (Henderson ↔ Apex counsel) · 14 messages · February 14–March 4"
   - "Master Supply Agreement (2019, Henderson–Apex) · 87 pages · contract under dispute"
   - "Expert witness report: Dr. M. Chen on damages calculation · 42 pages · DRAFT, not yet served"
   - "Court Order: Scheduling and Pre-Trial Order · 11 pages · entered January 20, 2026"

4. TIME ENTRY ASSISTANT (persistent docked drawer, bottom-right, 380px wide, parchment background with an oxblood top border): Header in small caps "TIME ENTRY DRAFTS · 6 READY FOR REVIEW". Below: a list of 6 draft time entries. Each entry shows:
   - Captured activity in small caps grey: "Drafted reply brief sections II–IV · 2.3h · Word + Teams call w/ S. Patel 0.4h"
   - AI-generated billable narrative in serif: "Drafted argument sections regarding 12(b)(6) standard and tortious interference pleading sufficiency; conferred with co-counsel S. Patel regarding response strategy."
   - [Approve] (oxblood) and [Edit] (outline) buttons

   One of the entries should be mid-edit — show the narrative being typed character-by-character in a typewriter animation (cursor visible, one character every 40ms). This is the signature flourish of the entire UI.

COLORS:
- Spine background: cream #F5F1E8
- Main canvas background: parchment #FAF7ED
- Top bar background: ink-navy #1A2B4A
- Primary text: near-black #1C1C1C
- Heading text: ink-navy #1A2B4A
- Accent: oxblood #6B2C2C (buttons, dividers, time-entry drawer border)
- Secondary text: warm grey #6B5D4F
- NO sea-foam, NO modern bright accents on the main surfaces

TYPOGRAPHY: Newsreader serif (or IBM Plex Serif, or Source Serif Pro — whatever serif Lovable can load cleanly) for ALL headings, matter names, document titles, AI summaries, case captions, and time-entry narratives. Inter for UI labels, button text, tab labels, and small caps. Body text at 15px with 1.65 line-height — book-like, not app-like. Heading sizes generous (matter name at 22–24px, document titles at 18px).

MOTION: Very restrained. Page transitions are a 200ms fade only. Tabs switch instantly. The typewriter animation on the in-progress time entry draft is the one signature flourish — let it loop, finishing one narrative and starting another every 20 seconds. No card-lift on hover, no glow effects, no shimmer.

EXPLICITLY AVOID: Dark mode. Neon. Modern SaaS chrome. Generic dashboards. Bright accent colors. Sea-foam anywhere on the main canvas. Any visual element that signals "consumer app" instead of "professional legal practice tool". Card grids. Animated charts. KPI tiles. Anything that would look out of place in a partner's office.
```

---

## 5. DeliverIQ — AI Material Verification

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: DeliverIQ
TAGLINE: AI material verification for upstream oil & gas

WHO USES THIS: Two users — (1) a field receiving clerk at an oil & gas pad site in the Permian Basin or Bakken, wearing gloves, standing in 40°F drizzle next to a Halliburton truck that just pulled up; and (2) a materials manager watching 12 pad sites simultaneously from a portacabin desk. The clerk's job is to verify that the delivered materials match the purchase order before signing the bill of lading. Today they do this by hand with a clipboard, often miscounting or missing wrong-spec items, which causes downstream problems (wrong frac plugs at the wellhead = rig downtime at $50K/day). DeliverIQ uses computer vision: the clerk holds up a tablet, points the camera at the truck bed, and the AI identifies and counts every line item in real time, reconciling against the PO.

WHY THIS DEMO MATTERS: This is a field tool. It will be used outdoors, with gloves, in poor lighting, by someone who is NOT a knowledge worker. The UI must be physically usable in those conditions. High contrast, large fonts, glove-friendly buttons, no small icons. This is the most physically-constrained demo in the portfolio.

VISUAL ARCHETYPE: Mobile camera-first field app. Hi-vis safety palette. Glove-friendly button targets. Outdoor-readable contrast. The closest reference is a Toast or Square handheld point-of-sale device, or a ruggedized inspection app like Procore Field.

LAYOUT (render this as a portrait tablet mock-up — show the UI inside a tablet frame, like a Galaxy Tab Active or iPad in a rugged case):

1. TOP MAP STRIP (80px tall, dark): A thin horizontal strip showing 12 pad sites as labeled dots along a simplified basin map. Today's active site is highlighted with a brighter ring. Above each dot: today's delivery count progress ("3/5" complete). Sample site names: "Pad B-12 (Active)", "Pad B-14", "Pad C-08", "Pad C-11", "Pad D-04", "Pad D-09", "Pad E-02", "Pad E-07", "Pad F-15", "Pad F-22", "Pad G-03", "Pad G-18".

2. CAMERA HERO (60% of vertical space): A simulated live camera view of a pickup truck bed loaded with oilfield supplies. Render this as a realistic 3D scene or stylized illustration with detected items boxed using cyan rectangles. Each detection box has a label badge with item type + count. Boxes should snap in one-by-one with a 200ms scale-in animation as if the AI is detecting them in real time.

   Sample detected items (these labels should appear as the cyan box overlays):
   - "2⅞" Tubing × 24" (lower left of frame)
   - "Christmas Tree Valve, 5K psi × 1" (center)
   - "Mud Sack 50lb × 12" (right side)
   - "Wellhead Spool, 11" × 2" (upper left)
   - "Pipe Dope, 1qt × 6" (lower right)

   In the upper-right corner of the camera view: a small floating pill showing "Chain of custody · Driver: T. Garcia · BOL #B-88421".

3. PO LINE ITEMS RAIL (right side, 320px wide, dark surface): Header: "PO #PO-2026-4471 · Permian Supply Co." Below: a checklist of PO line items with their match status. Use large 18–20px text so it reads at arm's length:
   - ✓ 2⅞" Tubing — 24 pcs (MATCHED, green check)
   - ✓ Christmas Tree Valve, 5K psi — 1 unit (MATCHED, green check)
   - ⚠ Mud Sack, 50lb — 12 of 15 (SHORT 3, red badge with "−3")
   - ✓ Wellhead Spool, 11" — 2 units (MATCHED, green check)
   - ✗ Frac Plug, Composite — 0 of 4 (MISSING, red badge with "MISSING")
   - ✓ Pipe Dope, 1qt — 6 units (MATCHED, green check)

   At the bottom of the rail, a summary: "4 of 6 line items matched · 1 short · 1 missing".

4. BOTTOM ACTION BAR (120px tall, three giant glove-friendly buttons spanning the full width):
   - [APPROVE & SIGN] — green #00C853, takes 60% of the bar width, text 28px bold white
   - [FLAG DISCREPANCY] — amber #FFB300, takes 25% width, text 24px bold black
   - [ADD PHOTO] — white outline on dark, takes 15% width, text 22px

COLORS:
- Background: asphalt grey #2C2C2C (deeper than typical dark mode — readable in bright sunlight via inverse)
- Hi-vis amber: #FFB300 (action accents, shortage badges)
- Detection cyan: #00E5FF (AI overlays on the camera view)
- Match green: #00C853 (matched line items, approve button)
- Error red: #FF3D3D (missing items)
- Text primary: white #FFFFFF
- Text secondary: light grey #B0B0B0

TYPOGRAPHY: Inter at LARGER sizes than other demos — 16px base, 20px line items, 28px CTA buttons. Bold weights on counts and quantities. JetBrains Mono for all PO numbers, BOL numbers, and quantity counts.

MOTION: Detection boxes snap in with a 200ms scale-in animation as the AI identifies each item. Count badges increment with a small tick animation. Matched line items get a green strike-through that draws across the text in 300ms. No hover states (this is a touch-first device). No card-lift effects.

EXPLICITLY AVOID: Desktop-density layouts. Small fonts (under 16px is unusable). Subtle hover effects. Sidebar nav. Dark-glass marketing aesthetic. Anything that requires a mouse or fine motor control. Generic SaaS chrome. Card grids.
```

---

## 6. FinShield AI — AML & Loan Intelligence

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: FinShield AI
TAGLINE: AML and loan intelligence for community banks

WHO USES THIS: A BSA/AML analyst (Bank Secrecy Act / Anti-Money Laundering) at a community bank with $2B in assets under management. Their day is reviewing suspicious activity alerts, investigating transaction networks across accounts, building cases against potentially-laundering entities, and drafting SAR (Suspicious Activity Report) narratives for filing with FinCEN. Their current tool is Verafin or a homegrown case manager built on top of the core banking system. FinShield AI uses graph analytics + LLM narrative generation to surface the entities behind suspicious patterns, build the case file automatically, and draft a regulator-ready SAR narrative with full audit citations.

WHY THIS DEMO MATTERS: BSA/AML analysts are essentially internal investigators. They think like detectives. Their work product (the SAR) is reviewed by federal regulators. The UI must feel forensic and authoritative — never marketing-y, never bright, never consumer-friendly. This is the most "intelligence analyst" of all the demos.

VISUAL ARCHETYPE: Investigative case file / evidence board. Network entity graph + cited narrative. Closest reference is Palantir Gotham but more legible, or a high-end Maltego redesign.

LAYOUT:

1. TOP BAR (slate #1E293B, 64px tall): Left — "FINSHIELD AI · CASE #C-2026-0847" in small caps. Right side — a regulatory exam readiness gauge styled as a horizontal segmented bar in brass: "12 open SARs · 4.2 avg days to file · Audit trail 100%". Below the bar: "Next FinCEN deadline: 12 days".

2. LEFT QUEUE (300px wide, slate background): Alert queue. 8 alerts banded by risk tier. Each alert row has:
   - Tier chip (small colored pill): Tier 1 red #DC2626 / Tier 2 amber #F59E0B / Tier 3 yellow #EAB308
   - Entity name (in serif): e.g., "Coastal Holdings LLC"
   - Trigger description (one line): e.g., "Structuring pattern · 7 deposits"
   - AI confidence: e.g., "94%"
   - Age: e.g., "2h ago"
   The current case being investigated is highlighted with a left-edge brass stripe (4px wide).

   Sample queue entries:
   - Tier 1 — Coastal Holdings LLC — "Structuring pattern · 7 deposits" — 94% — 2h ago (ACTIVE)
   - Tier 1 — Meridian Trading Group — "Wire to OFAC-watched jurisdiction" — 91% — 4h ago
   - Tier 2 — Sunbelt Logistics — "Velocity anomaly · 14× baseline" — 87% — 6h ago
   - Tier 2 — Eastland Imports — "Round-dollar transactions, no business purpose" — 82% — 8h ago
   - Tier 2 — Pacific Rim Trade Co. — "Shell company indicators" — 79% — 11h ago
   - Tier 3 — Riverbend Restaurants LLC — "PEP relationship flagged" — 71% — 1d ago
   - Tier 3 — Atlantic Container Services — "Transaction pattern mismatch w/ stated business" — 68% — 1d ago
   - Tier 3 — Goldcrest Realty — "High-cash deposit anomaly" — 64% — 2d ago

3. ENTITY GRAPH (upper main canvas, 50% of vertical space): Network graph rendered with a physics-based force layout. Center node: subject entity "Coastal Holdings LLC" (largest node, brass-outlined). Connected nodes:
   - 4 personal accounts: J. Rodriguez, M. Chen, S. Patel, D. Williams (each labeled with last-4 account number "*4421", "*7782", etc.)
   - 3 counterparty businesses: "Sunshine Imports", "Pacific Trading Co.", "Atlantic Logistics"
   - 2 offshore wire destinations: "BVI Account *3392", "Panama Account *0044"

   Edges between nodes colored by transaction recency: brass #B8860B for last 7 days, fading to grey for older. Edge thickness proportional to dollar volume. Three of the edges should pulse softly with a citation-cyan ring (these are the transactions flagged in the SAR narrative below).

4. SAR NARRATIVE PANE (lower main canvas, 50% of vertical space): A contrasting off-white parchment #F5F5DC insert against the dark surround — looks like a printed document inset into the workspace.
   Header (small caps): "DRAFT SAR · GENERATED 14 MIN AGO · 487 WORDS"
   Body: 5 paragraphs of professional SAR narrative text in formal regulatory tone. Every numeric claim has a small superscript citation number (¹, ², ³, etc.). Hovering a citation should pulse the corresponding edge in the entity graph above.

   Sample paragraph (write 4 more in similar tone):
   "Between February 14 and April 28, 2026, Coastal Holdings LLC (Account ****-4421) received seven cash deposits totaling $66,400, each transaction structured below the $10,000 CTR threshold¹. Subject account holder is the registered Member-Manager of the LLC, with no documented business activity consistent with the deposit volume². Within 24–72 hours of each deposit, funds were transferred via outgoing wires to Sunshine Imports³ and Pacific Trading Co.⁴, both counterparties registered at addresses associated with shell company indicators per FinCEN advisory FIN-2014-A005."

   Bottom of pane: three brass buttons — [Approve & File with FinCEN] · [Request Edits] · [Escalate to MLRO].

5. RIGHT METADATA RAIL (280px wide, slate background): Subject snapshot:
   - Entity DBA: Coastal Holdings LLC
   - EIN: ****-5521
   - Account opened: September 14, 2023
   - KYC tier: Enhanced (re-certified 2026-01)
   - Typical monthly deposit volume: $45,000
   - Current month volume: $2,400,000 (▲ 5,233%)
   - Beneficial owners: M. Rodriguez (51%), undisclosed (49%)
   - Below in brass: "FinCEN deadline: 12 days remaining"

COLORS:
- Background: slate #1E293B (forensic dark)
- Accent: brass #B8860B (NOT bright gold — duller, institutional)
- Citation pulse: cyan #06B6D4
- SAR pane background: parchment off-white #F5F5DC (creates a "printed document inset" feel)
- Tier 1 red: #DC2626
- Tier 2 amber: #F59E0B
- Tier 3 yellow: #EAB308
- Text primary: milk-white #F5F5F0
- Text secondary: cool grey #94A3B8

TYPOGRAPHY: Inter for UI chrome and labels. JetBrains Mono for ALL transaction IDs, account numbers, dollar amounts, and EIN/SSN fields (precision signals). Newsreader serif for the SAR narrative body and case title — signals "this is a regulatory document".

MOTION: Graph nodes settle into place using a physics simulation when a case is opened (1.5s). Citation hover pulses the corresponding graph edge for 600ms with a cyan ring. No idle animations beyond the soft pulse on the 3 flagged edges.

EXPLICITLY AVOID: Bright marketing colors. Generic dashboards. Neon. Sea-foam as primary accent. Anything that feels consumer-facing — this UI gets reviewed by federal examiners.
```

---

## 7. Forge AI — Plant Floor Intelligence

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: Forge AI
TAGLINE: Plant floor intelligence for mid-market manufacturers

WHO USES THIS: A plant manager at a mid-market discrete manufacturer (1–5 production lines, around 400 sensors total). The Forge AI screen is wall-mounted on the production floor as a 50" display visible to the entire shift, AND viewed on tablets by maintenance technicians standing next to the actual machines. The product runs three agents: Predictive Maintenance (catches failures 4–24 hours before they happen), Quality (catches dimensional drift before scrap accumulates), and Frontline Knowledge (captures retiring senior technicians' expertise and serves it via Teams to younger operators).

WHY THIS DEMO MATTERS: This UI is glanced at across a factory floor from 30 feet away. Numbers must be giant. Status colors must be unambiguous. This is the andon-board lineage — every manufacturer has known what an andon light means since the 1960s. Lean into that.

VISUAL ARCHETYPE: Andon board / OEE wall display / Tesla factory monitor. High-contrast industrial palette (green/amber/red on steel). Numbers in industrial-clock-style giant sans. Not a desktop SaaS UI.

LAYOUT:

1. TOP BAR (industrial steel grey #37474F, 70px tall): Left — "FORGE AI · LINE 2 · SHIFT B · TUE 14:23 CST" in bold sans caps. Right side — shift OEE big number "78.4%" in 48px bold white with a small "▲ 2.1 vs yesterday" indicator.

2. PRODUCTION LINE DIAGRAM (top 40% of canvas): Horizontal flow showing 6 stations left-to-right with conveyor segments animating continuously between them. Each station is a chunky 3D-looking block (subtle shadow, slight bevel) showing:
   - Station name (top, bold sans caps)
   - Current part ID (monospace)
   - Operator initials
   - OEE % (big bold number, 36px)
   - Status light circle (top-right of each block): green, amber, or red

   The 6 stations:
   - STA-1: RAW MATERIAL LOAD · PT-44721 · Op: J.R. · 92% · GREEN
   - STA-2: CNC MILLING (Haas VF-4) · PT-44721 · Op: M.G. · 85% · GREEN
   - STA-3: DRILLING (Makino A51) · PT-44721 · Op: T.G. · 73% · AMBER, with a small "PREDICTED FAILURE in 4.2h" badge in amber underneath
   - STA-4: INSPECTION (Zeiss CMM) · PT-44712 · Op: K.L. · 88% · GREEN
   - STA-5: ASSEMBLY · PT-44712 · Op: D.W. · 91% · GREEN
   - STA-6: PACKAGING · PT-44712 · Op: R.P. · 89% · GREEN

   Conveyor segments between stations animate left-to-right continuously (subtle striped pattern moving).

3. THREE AGENT CARDS (middle band, equal width, horizontal row, each card with steel-grey background and a colored top border):

   CARD A — "PREDICTIVE MAINTENANCE" (green top border #2E7D32):
   - Latest action: "Drill spindle bearing on STA-3 — vibration harmonic detected at 247 Hz. Pattern matches bearing fatigue signature from training data. Work Order WO-44891 dispatched to T. Garcia. ETA 16:30."
   - Status pill: "Active · 1 open WO"

   CARD B — "QUALITY" (amber top border #F57C00):
   - Latest action: "Inspection at STA-4 caught dimensional drift on PT-44712 (0.003" over tolerance on bore diameter). Adjustment recommended: CNC offset Z+0.002 at STA-2. 4 parts flagged for rework, isolation tag applied."
   - Status pill: "Action required · 4 parts on hold"

   CARD C — "FRONTLINE KNOWLEDGE" (sea-foam top border #A8DADC — the only place sea-foam appears in this UI):
   - Show a Teams-style chat preview:
     · T. Garcia (operator avatar): "how do I reset the Haas controller after E-stop?"
     · Forge AI bot (sea-foam avatar): "Step 1: Turn key switch to ON. Step 2: Press RESET. Step 3: Re-home all axes (G28). Step 4: Re-load program. Captured from M. Reynolds' Sep 2019 training session."
   - Status pill: "14 queries answered today"

4. RIGHT RAIL (300px wide, "TODAY ON THE FLOOR" log): Vertical list of timestamped events from this shift — work orders dispatched, quality alerts, knowledge queries answered. Reads like a shift handoff log. 12 entries visible.

   Sample entries:
   - 14:23 · QA alert · STA-4 · 4 parts flagged
   - 14:18 · WO-44891 dispatched · STA-3 drill spindle
   - 14:12 · Knowledge query answered · T.G. · Haas reset procedure
   - 14:05 · STA-2 OEE recovered to 85% · target met
   - 13:58 · Knowledge query answered · D.W. · Torque spec for PT-44712
   - 13:47 · WO-44890 closed · STA-1 conveyor belt tension adjusted
   - ...continue with 6 more entries...

5. BOTTOM STRIP (160px tall, dark steel background): Four big-number tiles in industrial-clock style (NOT card chrome — just giant numbers with small caps labels below):
   - Parts produced today: 1,247
   - First-pass yield: 96.8%
   - Unplanned downtime today: 14 min
   - Active work orders: 3

COLORS:
- Background: industrial steel grey #37474F
- Andon green: #2E7D32
- Andon amber: #F57C00
- Andon red: #C62828
- Number text: white #FFFFFF
- Label text: cool grey #90A4AE
- Sea-foam #A8DADC ONLY on Frontline Knowledge bot avatar and that card's top border

TYPOGRAPHY: Inter Bold for OEE percentages and big numbers — use 40–60px sizes for floor visibility from across the shop. Inter Regular for body text and log entries. JetBrains Mono for all part IDs and work order numbers.

MOTION: Conveyor segments between stations animate left-to-right continuously (subtle moving stripe). Station status lights flip color with a 200ms transition when state changes. OEE percentages count up/down smoothly when they change. No marketing animations, no card-lift hover.

EXPLICITLY AVOID: Tiny fonts (this is read across a factory floor from 30 feet away). SaaS card chrome. Generic line charts. Left sidebar nav. Sea-foam everywhere — keep it strictly on the knowledge bot.
```

---

## 8. NomAgent — Agentic Pipeline Scheduling

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: NomAgent
TAGLINE: Agentic pipeline nomination and scheduling

WHO USES THIS: A scheduler at a midstream natural gas operator running 4 NAESB-standard nomination cycles per day (Timely, Evening, Intraday 1, Intraday 2) across 11 shipper counterparties. They process about 7 re-nominations per day when actual flows deviate from confirmed quantities. Their current world: a sprawling spreadsheet, an Outlook inbox of EDI confirmations, and a 2003-era NAESB EDI portal. The work is deadline-driven — miss a cycle deadline and there's no recovery until the next cycle. NomAgent automates variance detection, drafts NAESB-compliant re-nomination narratives, and submits them to the EBB endpoint with scheduler approval.

WHY THIS DEMO MATTERS: Schedulers are essentially traders. They obsess over the cycle countdown clock. The visual centerpiece of the entire UI should be that clock — not a row of KPI cards. This UI should feel like a trading desk, not a CRUD app.

VISUAL ARCHETYPE: Trading desk / scheduling board. Pure black background, electric green for live indicators, monospace numerals for everything. Bloomberg-energy-module aesthetics.

LAYOUT:

1. CYCLE COUNTDOWN HERO (top center, 140px tall, pure black background): A single huge countdown clock dominating the visual hierarchy: "INTRADAY 1 · 02:47:13" with the time in 80px JetBrains Mono. Below in smaller text: "Submission window closes 17:30 CT today". To the LEFT of the clock: four small cycle pills lined up horizontally — [Timely ✓] [Evening ✓] [ID-1 LIVE] [ID-2 pending]. The LIVE pill pulses electric green softly. The completed pills are dimmed.

2. CYCLE TIMELINE BAR (just below the clock, 60px tall): A horizontal 24-hour bar showing today's 4 cycles as colored segments with their submission windows. A red vertical line representing the current time moves smoothly through the bar.

3. COUNTERPARTY GRID (main content, takes 60% of remaining canvas, spreadsheet-style table): Rows = 11 shippers. Columns = the 4 cycles. Cells show nominated quantity in MMBtu in monospace (e.g., "47,250"). Cells with variance against confirmed quantities are tinted: green for within tolerance (under 2%), amber for 2–5% variance, red for >5% variance. Three cells should be red.

   The 11 shippers (use these exact names — real Permian Basin operators):
   - Pioneer Natural Resources
   - Devon Energy
   - EOG Resources
   - Apache Corporation
   - Diamondback Energy
   - Coterra Energy
   - Matador Resources
   - Permian Resources
   - Vital Energy
   - ConocoPhillips
   - Occidental Petroleum

   Sample nomination quantities (realistic ranges, 10,000–80,000 MMBtu per cell). Three red cells: Pioneer ID-1 cell ("+8.2% over confirmed at Waha hub"), Devon Timely cell, EOG ID-1 cell.

4. RIGHT PANEL (340px wide, "AI RE-NOM PROPOSALS"): Four cards stacked vertically. Each card shows:
   - Shipper name in bold
   - Variance detected: e.g., "Pioneer · +8.2% over confirmed at Waha hub"
   - Proposed re-nomination action: e.g., "Reduce ID-1 nomination by 3,850 MMBtu"
   - NAESB-compliant rationale (3 lines of formal regulatory-tone text)
   - AI confidence percentage
   - Two buttons: [Submit Re-Nom] (electric green when ready) and [Edit] (outline)

   Sample card content for one card:
   - "Pioneer Natural Resources · ID-1 cycle"
   - "Variance: +8.2% over confirmed (47,250 nominated vs 43,650 confirmed at Waha hub)"
   - "Proposed: Reduce nomination by 3,850 MMBtu to align with confirmed schedule"
   - "Per NAESB WGQ 5.3.50 standard, shipper is reducing intraday nomination quantity to match physical flow signal received from upstream meter MS-202 Pyote at 14:12 CT. No alternative receipt point requested."
   - "94% confidence"
   - [Submit Re-Nom] [Edit]

5. BOTTOM STATUS BAR (60px tall): Left side — "Auto-confirmed today: 47 noms · Manual review: 4 · Re-noms submitted: 6". Right side — NAESB interconnect status indicator: a small green dot with "EBB endpoint · 23ms · OK · last sync 14:22:47".

COLORS:
- Background: pure black #000000
- Live indicator: electric green #00FF87
- Submit-ready buttons: electric green #00FF87
- Warning amber: #FFB300
- High variance red: #FF3D3D
- Text primary: white #FFFFFF
- Text secondary: cool grey #6B7280
- NO Echelix sea-foam anywhere — this is a trading floor

TYPOGRAPHY: JetBrains Mono for ALL numbers, MMBtu quantities, prices, cycle codes, the countdown clock, and shipper IDs. Inter for labels and UI chrome only. Tight density — traders are comfortable with information density. No generous whitespace here.

MOTION: Countdown clock ticks every second (smooth, no jitter). Current-time marker on the cycle bar moves smoothly. Grid cells flash briefly (200ms) when variance crosses a threshold. Re-nom cards slide in from the right when new proposals arrive.

EXPLICITLY AVOID: Generic dashboard layouts. Soft pastel colors. Large whitespace. Card-grid aesthetics. Friendly-looking anything. Sidebar nav. KPI tiles. This is a desk where missing a deadline costs serious money.
```

---

## 9. SafeSignal — Conversational Safety Intelligence

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: SafeSignal
TAGLINE: Conversational safety intelligence

WHO USES THIS: Two very different users, in a single SaaS product:
(1) A field worker at an oil & gas pad site — could be a roughneck, a frac hand, a wireline tech. They've just had a near-miss (almost slipped on a leaking hose, almost got hit by swinging pipe). Their current options for reporting are: a paper form back at the office, or skipping the report entirely. The barrier is friction. SafeSignal is a conversational interface — they can speak or text into Teams in 60 seconds and the agent captures everything.
(2) An HSE (Health, Safety, Environment) manager at a desk reviewing trends across 10,000+ near-miss reports per year. They need analytics: top causes, site heatmaps, corrective action loop status.

This UI shows BOTH views side-by-side because the demo audience needs to see both halves of the product.

WHY THIS DEMO MATTERS: Safety culture work depends on psychological safety. If reporting a near-miss feels punitive, workers stop reporting and the company loses early-warning signal. The UI must feel friendly, never alarming. The manager dashboard uses sage green and safety yellow — NEVER red, which triggers defensiveness and suppresses reporting.

VISUAL ARCHETYPE: Split-screen — conversational mobile UI on one side, analytical dashboard on the other. Friendly, not alarming. Closest references: WhatsApp + Linear inbox + a really humane OSHA reporting tool.

LAYOUT (split-screen, vertical divider running down the middle):

LEFT HALF — FIELD WORKER VIEW (render as a phone mock in a tablet/phone frame, takes 40% of width):

1. Top of phone (Teams-style header, sea-foam #A8DADC): "SafeSignal · Pad B-12 · Tue 14:23". Below: HSE worker avatar (initials "T.G.") and small online indicator.

2. Chat thread filling the phone screen — chat bubbles in WhatsApp/Teams style. Agent bubbles on the left in soft sea-foam #A8DADC with a small bot icon. Worker bubbles on the right in light grey #F0F0F0.

   Conversation (render exactly this):
   - Worker: "near miss, almost tripped over a hose"
   - Agent: "Got it — thanks for reporting, that takes courage. A few quick questions so we can fix the underlying issue. Where exactly on the pad?"
   - Worker: "north side of pad b-12, near the frac stack"
   - Agent: "Was it daylight or night shift? And was visibility normal?"
   - Worker: "daylight, full visibility, just didn't see it"
   - Agent: "Anyone injured or close to being injured beyond yourself?"
   - Worker: "no, no injuries, no one else around"
   - Agent: "Last question: was the hose actively in use or staged for later?"
   - Worker: "staged, looks like it was left after the morning shift"
   - Agent: "Got it. I've classified this as a Slip/Trip/Fall hazard under OSHA 29 CFR 1910.22 (housekeeping). Severity: Low (no injury, but high recurrence risk). I'm filing it now and dispatching the housekeeping crew to clear the route. You'll get a confirmation in a few minutes. Thanks for taking the 60 seconds — these reports are what keeps the pad safe."

3. Beside the chat (to the right edge of the phone frame, small chips flying out from the conversation as the agent extracts entities): "Location: Pad B-12 N", "Hazard: tripping hazard", "OSHA classification: 29 CFR 1910.22", "Severity: Low", "Action: Housekeeping dispatch", "Witnesses: None".

4. Bottom of phone (small footer): A green check icon and the text "Report filed · Corrective action triggered · Total time: 47 seconds".

VERTICAL DIVIDER (1px, subtle).

RIGHT HALF — HSE MANAGER DASHBOARD (takes 60% of width, warm white background):

1. Top bar (warm white #FAFAF8, 80px tall): "HSE OPERATIONS · ALL SITES · MAY 2026" small caps. Below: inline stats (NO card chrome — just flowing typography): "247 near-misses MTD · ▼ 18% vs prior month · 96% closed within 48h · 4 open Tier-1 actions".

2. SITE HEATMAP (40% of vertical space): A stylized map of 8 pad sites laid out across a basin. Each pad is a circle sized by report volume (number of reports this month) and colored by trend (sage green = improving, warm amber = flat, soft burgundy = worsening — NOT red). Hover any circle shows site name, report count, and 30-day trend arrow.

   Sample sites: Pad B-12 (24 reports, sage), Pad B-14 (18, sage), Pad C-08 (31, amber), Pad C-11 (12, sage), Pad D-04 (41, burgundy — worsening), Pad D-09 (22, sage), Pad E-02 (15, sage), Pad F-15 (28, amber).

3. TOP CAUSES bar chart (30% of remaining): Horizontal bars showing month-to-date causes, longest first:
   - Slip / Trip / Fall: 47 (sage)
   - Pinch point: 38 (sage)
   - Chemical exposure: 22 (amber)
   - Hot work: 18 (sage)
   - Confined space: 12 (amber)
   - Lifting / ergonomic: 24 (sage)
   - Other: 18 (sage)

4. CORRECTIVE ACTION LOOP (30% of remaining): A vertical Sankey-style flow showing reports moving through the corrective action lifecycle. Bands stacked vertically with drop-off shown:
   - Reported: 247
   - Triaged: 247
   - Action assigned: 243 (small "4 awaiting triage" callout)
   - Action completed: 231 (small "12 in progress" callout)
   - Verified: 228 (small "3 awaiting verification" callout)

5. RECENT REPORTS feed (bottom strip, 5 entries): Each entry shows site, hazard type, severity, status. e.g., "14:23 · Pad B-12 · Slip/Trip/Fall · Low · Filed by T.G. · Action assigned".

COLORS:
- Field side (phone): warm white #FAFAF8 background, agent bubbles soft sea-foam #A8DADC, worker bubbles light grey #F0F0F0
- Manager side: warm white #FAFAF8 background
- Sage green (primary, healthy): #87A878
- Warm amber (watch): #E5A23D
- Soft burgundy (worsening — NOT red): #A8584D
- Safety yellow (accents only): #F9D71C
- Text primary: near-black #1C1C1C
- Text secondary: warm grey #6B5D4F

TYPOGRAPHY: Inter throughout. Chat bubbles use friendly larger text (16px, comfortable line-height 1.5). Manager dashboard slightly denser at 14px. NOT serif — this is modern, friendly, and accessible.

MOTION: Typing indicator dots (3 bouncing dots) appear before each agent message in the chat. After the agent's message is fully typed, the next worker message appears 2 seconds later (auto-playing conversation, loop after the last message). Entity chips fly out of the conversation toward the structured report preview with a 300ms ease. Manager-side charts animate in on first load only — no idle motion.

EXPLICITLY AVOID: Red anywhere on the manager side (use soft burgundy for worst cases, NEVER red — this is core to the design thesis). Stern compliance-y typography. Stock-photo HSE imagery. Alarming alert badges. Anything that signals "you'll be punished for reporting" to a field worker.
```

---

## 10. RateCase Navigator — Regulatory Affairs Intelligence

```
I'm building a product demo and I need a self-contained, polished web UI. Here's the full context and the build brief — please follow it as written.

PRODUCT NAME: RateCase Navigator
TAGLINE: Regulatory affairs intelligence for utilities

WHO USES THIS: A regulatory affairs director at an investor-owned utility (think a regional electric or gas utility serving 1–3 million customers). Their team is in the middle of a general rate case — a formal proceeding before a state Public Utility Commission, lasting 12–18 months, in which the utility asks regulators for permission to raise rates. The team manages 12,400+ documents, 247 commitments made on the record, discovery requests from intervenor parties, written testimony from 6+ witnesses, and a 600-page final brief. The director has 20+ years in regulatory work. Their current toolkit is SharePoint folders, Excel commitment trackers, and Outlook threads — RateCase Navigator unifies all of it into a single docket workspace with AI-drafted discovery responses and a real-time commitment register.

WHY THIS DEMO MATTERS: Regulatory affairs is a deeply traditional field. The deliverables are filed with state and federal agencies and become part of the public record. The aesthetic must feel like a brief filed with the commission — text-dense, serif-heavy, navy-and-burgundy government-restraint palette. The user has been in this field longer than the SaaS industry has existed; they're comfortable with text density and suspicious of glossy chrome.

VISUAL ARCHETYPE: Docket / regulatory proceeding workspace. Government-restraint aesthetic. Text-dense (this is a feature, not a bug — regulatory professionals are comfortable with it). Reads like a brief filed with the commission, NOT a SaaS app.

LAYOUT:

1. PROCEEDING HEADER (top, 100px tall, cream #F5F1E8 background with a 1px ink-navy bottom border): 
   - Top line in small caps tracking-wide: "PUC DOCKET NO. 25-1142"
   - Below in large Newsreader serif (28px): "General Rate Case · Test Year 2025"
   - Right side: jurisdiction badge "TEXAS PUBLIC UTILITY COMMISSION" in burgundy small caps
   - Below the title, full-width: a horizontal procedural schedule strip showing the 8 phases of the proceeding as connected pills:
     · Filing → Discovery → Direct Testimony → Intervenor Testimony → Rebuttal → Hearings → Briefs → Final Order
     The current phase "Intervenor Testimony" is filled with burgundy; completed phases are filled with ink-navy; future phases are outline-only.

2. METRIC STRIP (60px below the header, no card chrome, flowing inline typography): "Days to Final Order: 187 · Open Discovery: 18 · At-Risk Commitments: 4 · Draft Testimony Sections: 12 of 23 complete · Active Witnesses: 6"

3. THREE-TAB INTERFACE (rest of canvas): Tabs styled as small caps with letter-spacing — "DISCOVERY · COMMITMENTS · FILINGS · TESTIMONY · WITNESSES". Default the demo to the COMMITMENTS tab (this is the killer feature — utilities lose millions when commitments slip).

   COMMITMENTS TAB content — a formal register table styled like a court filing index. Columns: ID, Commitment Text (1–2 line excerpt), Source (witness + transcript page), Date Made, Responsible Witness, Status, Due Date.

   Sample rows (these need to feel like real rate case commitments — use this exact content):
   - RC-0042 · "The Company will file a quarterly update on its grid modernization spend within 30 days of each quarter end." · J. Patterson direct testimony, Tr. 247:14–19 · March 12, 2026 · J. Patterson (VP Distribution) · OPEN · April 30, 2026
   - RC-0043 · "The Company will provide a workpaper reconciliation of the $14.2M depreciation reserve adjustment by May 15, 2026." · M. Reyes rebuttal, Tr. 401:08–22 · April 4, 2026 · M. Reyes (Director Regulatory Accounting) · AT-RISK · May 15, 2026
   - RC-0044 · "The Company will report customer count data segmented by rate class in Schedule G-2 of future quarterly filings." · K. Lin direct, Tr. 188:03–11 · February 28, 2026 · K. Lin (Manager Rates & Tariffs) · CLOSED · February 28, 2026
   - RC-0045 · "The Company will conduct an independent third-party assessment of cybersecurity controls referenced in Schedule SEC-3 and file the results with the Commission." · S. Whitmore direct, Tr. 312:21–28 · March 18, 2026 · S. Whitmore (Chief Information Security Officer) · OPEN · September 1, 2026
   - RC-0046 · "The Company will provide a sensitivity analysis of capital structure assumptions across three additional scenarios." · D. Patel rebuttal, Tr. 489:14–20 · April 22, 2026 · D. Patel (VP Treasury) · AT-RISK · May 30, 2026
   - RC-0047 · "The Company will reconcile actual 2025 storm hardening expenditures against the budgeted $87M referenced in Schedule O-4." · R. Cole direct, Tr. 156:09–18 · February 14, 2026 · R. Cole (Director Resilience Planning) · OPEN · June 30, 2026
   - RC-0048 · "The Company will provide bench memo response within 14 days of Commission request on rate design alternatives for residential customers." · K. Lin direct, Tr. 192:07–14 · February 28, 2026 · K. Lin (Manager Rates & Tariffs) · CLOSED · March 14, 2026
   - RC-0049 · "The Company will file an updated load forecast incorporating revised assumptions discussed at the May 8 technical conference." · J. Patterson rebuttal, Tr. 433:11–25 · May 8, 2026 · J. Patterson (VP Distribution) · AT-RISK · June 1, 2026

   At-risk rows have a faint burgundy left border (3px). Status pills: OPEN (ink-navy), AT-RISK (burgundy), CLOSED (sage). Row hover: subtle cream tint, no card-lift.

4. RIGHT RAIL (320px wide, "WITNESSES & SMEs", cream background): A list of 6 witnesses. Each entry shows: name in serif, title (e.g., "J. Patterson · VP Distribution Engineering"), open items count badge, last activity timestamp. Click any witness to expand and show their open commitments + open discovery items.

   The 6 witnesses:
   - J. Patterson · VP Distribution Engineering · 4 open items
   - M. Reyes · Director Regulatory Accounting · 2 open items
   - K. Lin · Manager Rates & Tariffs · 1 open item
   - S. Whitmore · Chief Information Security Officer · 3 open items
   - D. Patel · VP Treasury · 2 open items
   - R. Cole · Director Resilience Planning · 5 open items

COLORS:
- Background: off-white #FAF7F2 (main) and cream #F5F1E8 (header, right rail)
- Primary text: ink-navy #1A2B4A
- Accent: burgundy #6B2C2C (current phase indicator, at-risk commitments, primary buttons)
- Sage green: #87A878 (closed/completed status only)
- Secondary text: warm grey #6B5D4F
- Subtle borders: #E8E2D5
- NO sea-foam on the main surfaces — Echelix branding only appears in the persistent top nav
- NO modern accent colors

TYPOGRAPHY: Newsreader serif for ALL headers, the docket number, witness names, commitment text, tab labels, and the proceeding title. Inter for UI chrome (buttons, status pills, metric labels, table column headers). Body text at 15px with 1.65 line-height — book-like density. Comfortable text-heavy layout.

MOTION: None to speak of. This is a serious workspace for serious work — restraint signals professionalism. Subtle hover state on table rows (a faint cream tint). No card-lift, no glow, no shimmer. Tab transitions are instant.

EXPLICITLY AVOID: Modern SaaS dashboards. Card grids. Bright colors. Sea-foam everywhere. Generic data-visualization charts. Animated counters. KPI tiles. Anything that signals "consumer software" — this UI gets screenshotted and may be submitted into the regulatory record itself.
```

---

## After Lovable generates the first version

For each demo, do this quick QA pass and paste a follow-up if needed:

**If it still looks like a generic SaaS dashboard** (the most common failure mode):
> *"Re-read the VISUAL ARCHETYPE section of my prompt. The dominant element of this UI should be [X — name the hero element from the prompt], not a row of KPI cards. Remove the metric tiles from the top and rebuild around the archetype."*

**If sample data is generic** ("Sample Customer 1, 2, 3"):
> *"Replace all placeholder data with the specific sample data from my prompt. Use the exact names, IDs, and values I specified."*

**If colors are approximations**:
> *"Apply these exact hex values, not approximations: [paste color list again]."*

**If typography is wrong**:
> *"Load Newsreader serif (or IBM Plex Serif as fallback) and use it for [list the elements that should be serif]. Use JetBrains Mono for [list the monospace elements]."*

**If motion is excessive**:
> *"Remove all hover lift effects, glow effects, and idle animations except the specific motion described in my prompt."*

If after 2 rounds of iteration the result is less than 70% there, start a fresh Lovable project — sometimes the first generation anchors badly and follow-ups can't escape it.
