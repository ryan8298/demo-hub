/**
 * One-off bulk insert for the 17 demos defined in
 * Echelix-Demo-Hub-Content-Guide.docx. Run with:
 *
 *   node scripts/seed-demos.mjs
 *
 * Uses the service-role key from .env.local — bypasses RLS.
 * Idempotent on slug: if a demo with the same slug already exists,
 * it is skipped (so re-runs don't duplicate).
 *
 * After insert, the admin still needs to per-demo:
 *   • paste the real demo_url
 *   • upload the architecture diagram (PDF)
 *   • optionally auto-fetch or upload a preview image
 *   • optionally toggle prefer_live_preview if the demo allows framing
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// ---- load .env.local manually so we don't need dotenv ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// =============================================================================
//  Manifest — 17 demos to insert.
//  Iron Scout RTI customer tile (slug=iron-scout-rti) is NOT in this list
//  because it already exists in the database.
//
//  Structure note: every Microsoft-Partner tile's kpi_metrics array LEADS
//  with the Azure ACR figure so sales reps see it first. Customer ROI
//  metrics follow in priority order.
// =============================================================================

const PLACEHOLDER_URL = 'https://placeholder.echelix.app';

/** Generic "Ingest → Process → Score → Act → Notify" architecture stub
    — adjust per-use-case where the doc gives us more specificity. */
const genericFlow = (steps) =>
  steps.map((s) =>
    typeof s === 'string' ? { step: s, description: '' } : s
  );

/* eslint-disable max-len */
const DEMOS = [
  // ============================================================
  // 1. Iron Scout RTI — Partner only (customer already exists)
  // ============================================================
  {
    title: 'Iron Scout RTI — Partner View',
    slug: 'iron-scout-rti-partner',
    audience: ['microsoft'],
    industry: 'Oil & Gas',
    tags: ['AI-First', 'Azure', 'Automation', 'Data & Analytics'],
    description:
      'Mission-control anomaly detection across pipeline and compressor assets — from sensor spike to dispatched work order in under 2 minutes.',
    roi_summary:
      '$8.4M estimated annual value at 47 monitored assets. 4-minute agent detection vs. 6.2-hour manual average. $94K/day production loss prevented per offline compressor station. Azure AI Foundry co-sell motion (explicit ACR baseline not listed in one-pager — position on Fabric RTI + Azure AI Foundry consumption).',
    target_audience_description:
      'Operations Center Managers monitoring asset health across multiple stations in real time, Field Technicians receiving work orders and acknowledgment requests via Microsoft Teams on mobile, and VP of Operations / COO focused on reducing unplanned downtime costs and mean time to repair (MTTR).',
    problem_statement:
      'Operators are sitting on massive volumes of real-time SCADA and IoT sensor data that is almost entirely untapped. Anomaly detection is reactive — teams find out about equipment failures hours after thresholds are first breached. Work orders are created manually only after field staff report an issue, not when sensor data first shows a pattern. There is no physics-based failure mode context — alerts say a threshold was crossed but not what that means or what happens next. Maintenance history, telemetry, and work orders live in three separate systems with no connecting intelligence layer.',
    kpi_metrics: [
      { label: 'Azure AI Foundry', value: 'Co-Sell' },
      { label: 'Annual value', value: '$8.4M' },
      { label: 'Detection time', value: '4 min' },
      { label: 'MTTR reduction', value: '82%' },
    ],
    challenge_points: [
      'SCADA + IoT data largely untapped — anomaly detection runs reactive, hours after threshold breach',
      'Work orders created manually after field reports, not when telemetry first shows the pattern',
      'Alerts lack physics-based failure-mode context — no "what next" embedded',
      'Maintenance history, telemetry, and work orders live in three disconnected systems',
    ],
    business_outcomes: [
      { value: '$8.4M', label: 'Annual value protected', description: 'Across 47 monitored compressor + pipeline assets' },
      { value: '82%', label: 'MTTR reduction', description: '4-minute agent detection vs. 6.2-hour manual baseline' },
      { value: '$94K/day', label: 'Production losses prevented', description: 'Per offline compressor station' },
    ],
    ai_capabilities: [
      { label: 'Predictive failure detection', description: 'Vibration + temperature pattern matching across compressor units' },
      { label: 'Anomaly scoring', description: 'Azure AI Foundry models score 1,247 streams/sec' },
      { label: 'Auto-dispatch', description: 'D365 Field Service work-orders triggered without human routing' },
      { label: 'Teams alerting', description: 'Field-tech briefings via Microsoft Teams in <30 seconds' },
    ],
    tech_stack: ['Microsoft Fabric RTI', 'Azure IoT Hub', 'Azure AI Foundry', 'Copilot Studio', 'Dynamics 365 Field Service', 'Microsoft Teams'],
    architecture_flow: genericFlow([
      { step: 'Ingest', description: 'Sensors → Azure IoT Hub' },
      { step: 'Stream', description: 'Microsoft Fabric Real-Time Intelligence' },
      { step: 'Score', description: 'Azure AI Foundry anomaly models' },
      { step: 'Detect', description: 'Threshold + physics-based diagnosis' },
      { step: 'Dispatch', description: 'D365 Field Service work order' },
      { step: 'Notify', description: 'Microsoft Teams field-tech briefing' },
    ]),
    operational_stats: [
      { label: 'Monitored assets', value: '47' },
      { label: 'Streams / sec', value: '1,247' },
      { label: 'Active agents', value: '4' },
      { label: 'Model confidence', value: '99.2%' },
    ],
    agent_timeline: [],
    featured: false,
    prefer_live_preview: false,
  },

  // ============================================================
  // 2. ChainIQ — Customer + Partner
  // ============================================================
  ...buildPair({
    customer_title: 'ChainIQ',
    partner_title: 'ChainIQ — Partner View',
    base_slug: 'chainiq',
    industry: 'Retail & E-Commerce',
    tags: ['AI-First', 'Azure', 'Cost Reduction', 'Automation'],
    description:
      'Three AI agents turning supply chain blind spots into profit levers — demand sensing, supplier risk intelligence, and automated deduction recovery, built on Microsoft Azure.',
    customer_roi:
      'Recover $3.2M annually in retailer deduction disputes. Reduce stockouts by 20–40% and inventory carrying costs by 15–25%. Process full deduction batches in 8 minutes vs. 3 days manually. 35–55% of previously written-off deductions recovered through AI disputes. Typical ROI in 10–16 months.',
    partner_roi:
      'Azure ACR baseline: $175K–$220K per deployment. Recover $3.2M annually in deduction disputes. 35–55% of previously written-off deductions recovered. Microsoft co-sell eligible · ISV Partner. Stack: D365 Supply Chain, Azure Data Factory, Microsoft Fabric, Azure OpenAI, Azure Service Bus, Power Automate.',
    azure_acr: '$175K–$220K / yr',
    target_audience_description:
      'CFOs writing off recoverable deductions every quarter without knowing the exact recoverable amount, VP Supply Chain leaders running demand planning on 13-week lagging averages while major retailer algorithms react to yesterday\'s POS data, and AR / Trade Managers buried in deduction volume and missing dispute windows. Target: $50M–$500M CPG brands and distributors selling to Walmart, Kroger, Target, HEB, and Costco.',
    problem_statement:
      'CPG companies spend roughly 20% of revenue on trade promotions — and 72% of US trade promotions are money-losing because spend, deductions, and net revenue never reconcile until the quarter closes. 10–20% of retailer deductions are invalid retailer errors, but CPG suppliers write them off because AR teams miss the dispute window. The #1 cause of compliance chargebacks is an incorrect advance ship notice (EDI 856) with a single wrong field — triggering an automatic chargeback at the retailer\'s receiving dock. This is a data accuracy problem, not a delivery problem.',
    customer_kpis: [
      { label: 'Annual recovery', value: '$3.2M' },
      { label: 'Deduction batch time', value: '8 min' },
      { label: 'Recovery rate', value: '35–55%' },
      { label: 'Payback', value: '10–16 mo' },
    ],
    challenge_points: [
      '72% of US trade promotions are money-losing — spend, deductions, and net revenue never reconcile until the quarter closes',
      '10–20% of retailer deductions are invalid retailer errors but get written off because AR teams miss the dispute window',
      'A single wrong field in EDI 856 advance ship notice triggers an automatic chargeback at the retailer\'s dock',
      '$50M–$500M CPG brands run demand planning on 13-week lagging averages while retailers react to yesterday\'s POS data',
    ],
    business_outcomes: [
      { value: '$3.2M', label: 'Annual deduction recovery', description: 'From retailer dispute automation' },
      { value: '20–40%', label: 'Stockout reduction', description: 'AI-driven demand sensing replaces lagging averages' },
      { value: '8 min', label: 'Batch processing time', description: 'Versus 3 days manual' },
    ],
    ai_capabilities: [
      { label: 'Demand sensing agent', description: 'Real-time POS + supply signals replace 13-week lagging averages' },
      { label: 'Supplier risk intelligence', description: 'Continuous scoring of supplier reliability and lead-time variance' },
      { label: 'Automated deduction recovery', description: 'Dispute drafting + filing inside retailer windows' },
    ],
    tech_stack: ['D365 Supply Chain', 'Azure Data Factory', 'Microsoft Fabric', 'Azure OpenAI', 'Azure Service Bus', 'Power Automate'],
    architecture_flow: [
      { step: 'Ingest', description: 'Retailer POS + EDI feeds via Azure Data Factory' },
      { step: 'Unify', description: 'Microsoft Fabric — supplier + AR + promo data joined' },
      { step: 'Score', description: 'Azure OpenAI agents — demand, risk, deduction' },
      { step: 'Dispute', description: 'Auto-drafted dispute packets into retailer portals' },
      { step: 'Reconcile', description: 'D365 Supply Chain write-back + cash app' },
    ],
    operational_stats: [
      { label: 'Disputes / day', value: '420' },
      { label: 'Win rate', value: '47%' },
      { label: 'Retailers covered', value: '12' },
    ],
  }),

  // ============================================================
  // 3. ClearPath AI — Customer + Partner
  // ============================================================
  ...buildPair({
    customer_title: 'ClearPath AI',
    partner_title: 'ClearPath AI — Partner View',
    base_slug: 'clearpath-ai',
    industry: 'Healthcare',
    tags: ['AI-First', 'Azure', 'Compliance', 'Cost Reduction'],
    description:
      'Autonomous prior authorization and revenue recovery — an AI agent that fights payer denials so physicians don\'t have to, built on Microsoft Azure.',
    customer_roi:
      'Reduce auth submission time from 47 minutes to 4 minutes. Cut denial rates by 35–55%. Recover 1.5–3% of net revenue. $2.1M+ recovered at a 54-physician group in year one. Physicians reclaim 3–5 hours of admin time per week. Typical ROI in 6–12 months.',
    partner_roi:
      'Azure ACR baseline: $133K–$195K per deployment. $2.1M+ revenue recovered at a 54-physician group in year one. 3–5 hrs of physician admin time recovered per week. Microsoft co-sell eligible · ISV Partner. Stack: Azure Health Data Services (FHIR R4), Azure OpenAI, Azure API Management, Microsoft Fabric, Copilot Studio.',
    azure_acr: '$133K–$195K / yr',
    target_audience_description:
      'CFOs writing off 3–5% of gross revenue in preventable denials every year, CMOs with physicians completing 40+ prior auth requests per week (26% have watched a patient deteriorate waiting on payer bureaucracy), and RCM Directors managing teams manually working claim queues — a job description that shouldn\'t exist in 2026. Target: Multi-specialty medical groups (20–200 physicians), regional health systems, and hospital networks with complex payer mixes.',
    problem_statement:
      'Health insurers have deployed AI to generate denials at scale. Providers are fighting back with the same manual process they used in 1994 — and losing. Each of 900+ payers has a completely different portal, form, criteria set, and appeal window. 46% of prior auth denials are caused by missing or inaccurate administrative data — not clinical disagreement. 67% of physicians don\'t appeal denials because they believe it\'s futile — learned helplessness that costs the average 50-physician practice $1.4M per year in recoverable revenue left on the table.',
    customer_kpis: [
      { label: 'Auth submission time', value: '4 min' },
      { label: 'Denial rate cut', value: '35–55%' },
      { label: 'Net revenue recovered', value: '1.5–3%' },
      { label: 'Physician hrs/wk reclaimed', value: '3–5' },
    ],
    challenge_points: [
      '900+ payers each with a different portal, form, criteria set, and appeal window',
      '46% of prior-auth denials caused by missing or inaccurate admin data — not clinical disagreement',
      '67% of physicians don\'t appeal denials — learned helplessness costs a 50-physician practice $1.4M/year',
      'Insurers run AI to deny at scale; providers fight back with 1994-era manual workflows',
    ],
    business_outcomes: [
      { value: '$2.1M+', label: 'Revenue recovered', description: '54-physician group, year one' },
      { value: '35–55%', label: 'Denial rate reduction', description: 'Across multi-specialty groups' },
      { value: '4 min', label: 'Auth submission', description: 'From 47-minute baseline' },
    ],
    ai_capabilities: [
      { label: 'Payer policy parsing', description: 'Reads each payer\'s 900+ unique criteria sets continuously' },
      { label: 'Auth packet drafting', description: 'Builds clinical justification + admin data in 4 minutes' },
      { label: 'Denial appeal automation', description: 'Auto-files appeals inside the payer\'s narrow window' },
      { label: 'Revenue-at-risk scoring', description: 'Quantifies recoverable revenue per claim queue' },
    ],
    tech_stack: ['Azure Health Data Services (FHIR R4)', 'Azure OpenAI', 'Azure API Management', 'Microsoft Fabric', 'Copilot Studio'],
    architecture_flow: [
      { step: 'Ingest', description: 'EHR + payer policies via Azure Health Data Services (FHIR R4)' },
      { step: 'Normalize', description: 'Microsoft Fabric joins clinical + admin data' },
      { step: 'Reason', description: 'Azure OpenAI drafts auth packet against payer criteria' },
      { step: 'Submit', description: 'Azure API Management routes to payer portal' },
      { step: 'Appeal', description: 'Copilot Studio agent monitors + auto-appeals denials' },
    ],
    operational_stats: [
      { label: 'Payers covered', value: '900+' },
      { label: 'Auths / day', value: '180' },
      { label: 'Appeal win rate', value: '64%' },
    ],
  }),

  // ============================================================
  // 4. Counsel IQ — Customer + Partner   (★ RECOMMENDED)
  // ============================================================
  ...buildPair({
    customer_title: 'Counsel IQ',
    partner_title: 'Counsel IQ — Partner View',
    base_slug: 'counsel-iq',
    industry: 'Enterprise',
    tags: ['AI-First', 'Microsoft 365', 'Cost Reduction', 'Automation'],
    description:
      'The firm\'s institutional memory — connected, active, and billing. Matter intelligence, automated billing capture, and contract review built on Microsoft 365 and Azure.',
    customer_roi:
      'Recover $780K annually at a 50-attorney firm. Recapture 1–2 billable hours per attorney per week, every week. Reduce write-offs by 20–35%. Contract review 60–75% faster. 4:1 ROI on platform cost. Fastest ROI in the portfolio: 4–8 months.',
    partner_roi:
      'Azure ACR baseline: $148K–$187K per deployment — anchored by M365 E3→E5 + Copilot seat upsell. $780K revenue recovered per 50-attorney firm/yr. 4:1 ROI on platform cost at $300/hr blended rate. 89% of law firms run on M365; only 2.4% have meaningful AI integration — widest activation gap in the portfolio. Microsoft co-sell eligible · E3→E5 upsell motion. Stack: Microsoft 365 E5 + Copilot, Copilot Studio, Azure OpenAI, Azure AI Search, D365 Business Central, Power Automate.',
    azure_acr: '$148K–$187K / yr (E3→E5 upsell)',
    target_audience_description:
      'Managing Partners accountable for firm economics who know write-downs are a problem but lack the data to quantify the exact magnitude, Equity Partners with a direct financial stake in billing realization (every recovered hour translates directly to personal draw), and CFO/COO teams managing utilization rates, WIP aging, and realization from reports that are always a week stale. Target: Law firms, CPA firms, and consulting practices with 20–200 professionals already on Microsoft 365 E3.',
    problem_statement:
      'Attorneys reconstruct their day from memory at 6 PM — or worse, on Friday. Research shows waiting one day to log time loses 10% of billable hours; waiting a week loses 25%+. That 7-minute strategy call in the hallway, the email thread answering client questions, the quick document review during lunch — all gone. One in five internal assignments is dropped at firms without automated task tracking, costing the average 15-attorney firm $487K annually. Partners write down perfectly earned time because vague narratives don\'t survive client scrutiny — all problems that live inside M365 data the firm already owns.',
    customer_kpis: [
      { label: 'Annual recovery', value: '$780K' },
      { label: 'Billable hrs/attorney/wk', value: '+1–2' },
      { label: 'Write-off reduction', value: '20–35%' },
      { label: 'Contract review', value: '60–75% faster' },
    ],
    challenge_points: [
      'Waiting one day to log time loses 10% of billable hours; waiting a week loses 25%+',
      '1 in 5 internal assignments is dropped at firms without automated tracking — $487K/yr at a 15-attorney firm',
      'Partners write down earned time because vague narratives don\'t survive client scrutiny',
      '89% of law firms run on M365 — only 2.4% have meaningful AI integration. Widest activation gap in the portfolio.',
    ],
    business_outcomes: [
      { value: '$780K', label: 'Annual revenue recovered', description: '50-attorney firm baseline' },
      { value: '4:1', label: 'ROI on platform cost', description: 'At $300/hr blended billable rate' },
      { value: '4–8 mo', label: 'Payback period', description: 'Fastest ROI in the portfolio' },
    ],
    ai_capabilities: [
      { label: 'Passive time capture', description: 'Auto-reconstructs the billable day from M365 signals' },
      { label: 'Matter intelligence', description: 'Connects emails, docs, meetings, tasks per matter' },
      { label: 'Contract review acceleration', description: 'Azure OpenAI markup vs. firm playbook' },
      { label: 'Realization analytics', description: 'WIP aging + write-off forecasting per partner' },
    ],
    tech_stack: ['Microsoft 365 E5 + Copilot', 'Copilot Studio', 'Azure OpenAI', 'Azure AI Search', 'D365 Business Central', 'Power Automate'],
    architecture_flow: [
      { step: 'Capture', description: 'M365 graph — email, meetings, docs, Teams' },
      { step: 'Index', description: 'Azure AI Search over matter corpus' },
      { step: 'Reason', description: 'Azure OpenAI + Copilot Studio agents' },
      { step: 'Bill', description: 'Auto-drafted time entries + narratives' },
      { step: 'Reconcile', description: 'D365 Business Central write-back' },
    ],
    operational_stats: [
      { label: 'Attorneys onboarded', value: '50' },
      { label: 'Auto-captured hrs/wk', value: '+1.6' },
      { label: 'Matters tracked', value: '340' },
    ],
    featured: true, // ★ RECOMMENDED in the doc
  }),

  // ============================================================
  // 5. DeliverIQ — Customer + Partner
  // ============================================================
  ...buildPair({
    customer_title: 'DeliverIQ',
    partner_title: 'DeliverIQ — Partner View',
    base_slug: 'deliveriq',
    industry: 'Oil & Gas',
    tags: ['AI-First', 'Azure', 'Automation', 'Cost Reduction'],
    description:
      'AI-powered job site material verification — photograph a delivery, reconcile against the PO, and close the payment loop in under 3 minutes.',
    customer_roi:
      '$340K estimated annual shortage recovery per operator. AI verification completes in 2.1 minutes vs. 35-minute manual process. 94.2% Azure AI Vision object identification confidence. Eliminates paper delivery tickets and creates a full auditable chain of custody in D365.',
    partner_roi:
      'Azure AI Foundry co-sell motion (explicit ACR baseline not listed in one-pager — position on Azure AI Vision + Azure OpenAI + D365 Supply Chain consumption). $340K estimated annual shortage recovery per operator. 2.1-minute AI verification vs. 35-minute manual process. 94.2% Azure AI Vision confidence. Stack: Azure AI Vision, Azure OpenAI Service, Power Automate, Dynamics 365 Supply Chain, Power Apps, Microsoft Teams.',
    azure_acr: 'Co-Sell · Azure AI Foundry',
    target_audience_description:
      'Field Supervisors and Operators photographing and verifying deliveries at the laydown yard or pad site on mobile, Procurement and AP Teams receiving real-time shortage flags and payment hold triggers to eliminate manual invoice reconciliation cycles, and Project and Construction Managers who need verified material receipt tied to work order status to keep job schedules on track.',
    problem_statement:
      'Material receipt at job sites is entirely manual — a field hand counts pipe by eye and initials a paper ticket with no verification. Shortages go undetected at receipt, surfacing weeks later during invoice reconciliation when it\'s too late to dispute. There is no digital chain of custody between delivery, work order, and payment — AP teams operate blind until the invoice arrives. Field workers lack tools to verify complex material manifests on mobile without back-office support. Vendor payment disputes are slow, undocumented, and rarely recover full shortage value.',
    customer_kpis: [
      { label: 'Annual shortage recovery', value: '$340K' },
      { label: 'Verification time', value: '2.1 min' },
      { label: 'AI Vision confidence', value: '94.2%' },
      { label: 'Manual baseline', value: '35 min' },
    ],
    challenge_points: [
      'Material receipt is manual — field hands count pipe by eye and initial paper tickets with no verification',
      'Shortages surface weeks later at invoice reconciliation — too late to dispute',
      'No digital chain of custody between delivery, work order, and payment',
      'Field workers lack tools to verify complex manifests on mobile without back-office support',
    ],
    business_outcomes: [
      { value: '$340K', label: 'Annual shortage recovery', description: 'Per operator' },
      { value: '2.1 min', label: 'Verification time', description: 'From 35-minute manual process' },
      { value: '94.2%', label: 'Vision confidence', description: 'Azure AI Vision object identification' },
    ],
    ai_capabilities: [
      { label: 'Photo-based material count', description: 'Azure AI Vision identifies + counts items from a single photo' },
      { label: 'PO reconciliation', description: 'Auto-matches delivery against active PO in D365' },
      { label: 'Shortage flagging', description: 'Real-time payment hold + AP alerting' },
      { label: 'Mobile-first capture', description: 'Power Apps + Teams for field-tech workflows' },
    ],
    tech_stack: ['Azure AI Vision', 'Azure OpenAI Service', 'Power Automate', 'Dynamics 365 Supply Chain', 'Power Apps', 'Microsoft Teams'],
    architecture_flow: [
      { step: 'Capture', description: 'Field photo via Power Apps on mobile' },
      { step: 'Detect', description: 'Azure AI Vision identifies + counts material' },
      { step: 'Reconcile', description: 'Power Automate matches against open PO in D365' },
      { step: 'Flag', description: 'Shortages trigger payment hold + AP alert' },
      { step: 'Document', description: 'Chain of custody saved to D365 + Teams' },
    ],
    operational_stats: [
      { label: 'Deliveries / day', value: '94' },
      { label: 'Pad sites covered', value: '12' },
      { label: 'Shortages flagged', value: '6.1%' },
    ],
  }),

  // ============================================================
  // 6. FinShield AI — Customer + Partner
  // ============================================================
  ...buildPair({
    customer_title: 'FinShield AI',
    partner_title: 'FinShield AI — Partner View',
    base_slug: 'finshield-ai',
    industry: 'Finance & Banking',
    tags: ['AI-First', 'Azure', 'Compliance', 'Security'],
    description:
      'Autonomous financial crime detection and loan intelligence — three AI agents continuously monitoring transactions, refreshing KYC profiles, and generating complete SAR filings before a human analyst opens their laptop.',
    customer_roi:
      'Generate SAR narratives in 3 minutes vs. 3–5 days. Reduce AML case time by 60–70%. Accelerate loan origination by 40–55%. 83% digital resolution rate. 2–3× fraud detection improvement vs. rules-only systems. Typical ROI in 9–14 months.',
    partner_roi:
      'Azure ACR baseline: $126K–$172K per deployment. SAR narrative in 3 minutes (was 3–5 days). 60–70% AML case time reduction. 40–55% faster loan origination. 83% digital resolution rate. Microsoft co-sell eligible · ISV Partner. Stack: Azure OpenAI, Microsoft Fabric, Dynamics 365 Finance, Microsoft Purview, Copilot Studio, Power Automate.',
    azure_acr: '$126K–$172K / yr',
    target_audience_description:
      'Chief Compliance Officers drowning in AML case volume, facing regulatory pressure from Basel IV and DORA, and personally liable for filing failures; CFO / COO teams watching $61B/year in North American compliance costs with no reduction in actual crime detection rates; Heads of Lending losing deals to faster competitors while loan origination sits at 45+ day average cycle times. Target: Community banks and regional insurers with $500M–$5B AUM that already have Microsoft 365 deployed with Copilot licenses unused.',
    problem_statement:
      'AML investigators spend 70% of their time gathering data across 5–7 disconnected systems — not analyzing it. Rules-based monitoring generates 95–99% false positive rates, meaning analysts clear noise all day and miss real risk. TD Bank paid $3B in fines in 2024 — not because they lacked technology, but because their tools were never connected to 92% of transaction volume. Loan origination suffers the same integration failure: documents validated manually across siloed systems, adding weeks to every deal cycle.',
    customer_kpis: [
      { label: 'SAR narrative time', value: '3 min' },
      { label: 'AML case time cut', value: '60–70%' },
      { label: 'Loan origination', value: '40–55% faster' },
      { label: 'Fraud detection lift', value: '2–3×' },
    ],
    challenge_points: [
      'AML investigators spend 70% of time gathering data across 5–7 disconnected systems — not analyzing',
      'Rules-based monitoring generates 95–99% false positives — analysts clear noise all day and miss real risk',
      'TD Bank paid $3B in 2024 fines — not lack of tech, but tools never connected to 92% of transaction volume',
      'Loan origination averages 45+ days with documents validated manually across silos',
    ],
    business_outcomes: [
      { value: '60–70%', label: 'AML case time reduction', description: 'Across compliance teams' },
      { value: '83%', label: 'Digital resolution rate', description: 'Cases closed without analyst escalation' },
      { value: '40–55%', label: 'Loan origination speed-up', description: 'Versus baseline 45-day cycle' },
    ],
    ai_capabilities: [
      { label: 'Transaction monitoring agent', description: 'Continuous behavioral scoring across all rails' },
      { label: 'KYC refresh agent', description: 'Auto-updates risk profiles from public + internal signals' },
      { label: 'SAR narrative drafting', description: 'Azure OpenAI assembles regulator-ready filings in 3 min' },
      { label: 'Loan document intelligence', description: 'Copilot Studio orchestrates underwriting docs across systems' },
    ],
    tech_stack: ['Azure OpenAI', 'Microsoft Fabric', 'Dynamics 365 Finance', 'Microsoft Purview', 'Copilot Studio', 'Power Automate'],
    architecture_flow: [
      { step: 'Ingest', description: 'Transactions + KYC + docs via Microsoft Fabric' },
      { step: 'Govern', description: 'Microsoft Purview lineage + classification' },
      { step: 'Score', description: 'Azure OpenAI behavioral + document models' },
      { step: 'Draft', description: 'SAR narratives + loan underwriting packets' },
      { step: 'File', description: 'D365 Finance write-back + regulator portal submission' },
    ],
    operational_stats: [
      { label: 'False positive cut', value: '74%' },
      { label: 'Active cases / day', value: '210' },
      { label: 'Loan apps / day', value: '38' },
    ],
  }),

  // ============================================================
  // 7. Forge AI — Customer + Partner
  // ============================================================
  ...buildPair({
    customer_title: 'Forge AI',
    partner_title: 'Forge AI — Partner View',
    base_slug: 'forge-ai',
    industry: 'Manufacturing',
    tags: ['AI-First', 'Azure', 'Automation', 'Data & Analytics'],
    description:
      'Three AI agents running your plant floor 24/7 — predictive maintenance, quality intelligence, and frontline knowledge, built on Microsoft Azure.',
    customer_roi:
      '$4.1M cost avoidance per prevented failure event. Reduce unplanned downtime by 25–45%. Cut mean time to repair from 81 minutes to 49 minutes. 25–35% quality reject rate reduction. Typical ROI in 8–14 months.',
    partner_roi:
      'Azure ACR baseline: $157K–$218K per deployment. $4.1M cost avoidance per prevented failure event. 25–45% reduction in unplanned downtime. 81→49 minute MTTR improvement. 25–35% quality reject rate reduction. Microsoft co-sell eligible · ISV Partner. Stack: Azure IoT Hub, Azure AI Foundry, Dynamics 365 Field Service, Microsoft Teams, Azure OpenAI.',
    azure_acr: '$157K–$218K / yr',
    target_audience_description:
      'Plant Managers accountable for OEE and uptime who already have IoT sensors but nobody is reading the data in real time, VP Operations facing a skilled trades retirement wave and $253M/year in average plant losses from unplanned breakdowns, and Maintenance Directors running reactive maintenance because their CMMS is a calendar, not a prediction engine. Target: Mid-market discrete or process manufacturers with $50M–$500M revenue, 1–5 production lines, and Microsoft 365 deployed.',
    problem_statement:
      'The average US plant burns 800 hours of production per year to breakdowns it could have predicted. Sensors are deployed — but they\'re feeding data historians and data lakes that nobody monitors in real time. When a machine fails, technicians spend the first 20–30 minutes locating the right service manual and calling a more experienced colleague. None of that is repair work. As 40% of the skilled trades workforce retires this decade, that institutional knowledge disappears with them. Forge AI captures it before it walks out the door.',
    customer_kpis: [
      { label: 'Cost avoidance / event', value: '$4.1M' },
      { label: 'Downtime reduction', value: '25–45%' },
      { label: 'MTTR', value: '81 → 49 min' },
      { label: 'Quality reject cut', value: '25–35%' },
    ],
    challenge_points: [
      'Average US plant burns 800 hours of production per year to predictable breakdowns',
      'Sensors deployed but feeding data historians no one monitors in real time',
      'Techs spend 20–30 min locating service manuals + calling experienced colleagues before any repair work',
      '40% of skilled trades workforce retiring this decade — institutional knowledge walks out the door',
    ],
    business_outcomes: [
      { value: '$4.1M', label: 'Cost avoided per prevented event', description: 'Across mid-market manufacturers' },
      { value: '25–45%', label: 'Unplanned downtime reduction', description: 'Within first 6 months of deployment' },
      { value: '40%', label: 'MTTR improvement', description: 'From 81 minutes down to 49' },
    ],
    ai_capabilities: [
      { label: 'Predictive maintenance', description: 'Vibration + thermal + acoustic pattern matching per line' },
      { label: 'Quality intelligence', description: 'Vision + telemetry to catch reject conditions before scrap' },
      { label: 'Frontline knowledge agent', description: 'Captures retiring-tech expertise + serves it on demand in Teams' },
    ],
    tech_stack: ['Azure IoT Hub', 'Azure AI Foundry', 'Dynamics 365 Field Service', 'Microsoft Teams', 'Azure OpenAI'],
    architecture_flow: [
      { step: 'Ingest', description: 'Plant sensors → Azure IoT Hub' },
      { step: 'Score', description: 'Azure AI Foundry models per asset type' },
      { step: 'Predict', description: 'Failure mode + estimated time-to-failure' },
      { step: 'Dispatch', description: 'D365 Field Service work order routing' },
      { step: 'Knowledge', description: 'Teams agent surfaces SOPs + tribal knowledge to techs' },
    ],
    operational_stats: [
      { label: 'Lines monitored', value: '5' },
      { label: 'Sensors / line', value: '~80' },
      { label: 'Active models', value: '17' },
    ],
  }),

  // ============================================================
  // 8. NomAgent — Customer + Partner
  // ============================================================
  ...buildPair({
    customer_title: 'NomAgent',
    partner_title: 'NomAgent — Partner View',
    base_slug: 'nomagent',
    industry: 'Oil & Gas',
    tags: ['AI-First', 'Azure', 'Automation', 'Data & Analytics'],
    description:
      'Agentic pipeline nomination and scheduling — from variance detection to re-nomination in minutes, not hours.',
    customer_roi:
      '$1.8M estimated annual revenue protection per midstream operator. Agent response in 4.2 minutes vs. 47-minute manual baseline. 94% agent confidence on variance detection and re-nomination. $124,400 in revenue protected month-to-date (demo scenario).',
    partner_roi:
      'Azure AI Foundry co-sell motion (explicit ACR baseline not listed in one-pager — position on Fabric RTI + Azure OpenAI + D365 consumption). $1.8M estimated annual revenue protection per midstream operator. 4.2-minute agent response vs. 47-minute manual baseline. 94% confidence on variance detection. Stack: Microsoft Fabric RTI, Azure Event Hub, Azure OpenAI Service, Copilot Studio, Dynamics 365, Microsoft Teams.',
    azure_acr: 'Co-Sell · Azure AI Foundry',
    target_audience_description:
      'Pipeline Schedulers and Nom Operators managing nominations across shippers, cycles, and pipelines daily, VP of Supply and Trading focused on revenue at risk, variance trends, and counterparty exposure, and CFO / Commercial Finance who approves the business case and needs to see the dollar value of variance recovery and margin protection.',
    problem_statement:
      'Pipeline nomination and scheduling is entirely manual — spreadsheets, phone calls, and email chains across multiple counterparties. Variance detection happens hours after the fact, after revenue has already been lost. Schedulers have no unified view across shippers, pipelines, and cycles in a single screen. NAESB re-nomination windows are narrow — by the time a variance is flagged manually, the window has often already closed. There is no automated loop between scheduling, maintenance events, and contract management.',
    customer_kpis: [
      { label: 'Annual revenue protection', value: '$1.8M' },
      { label: 'Agent response time', value: '4.2 min' },
      { label: 'Manual baseline', value: '47 min' },
      { label: 'Agent confidence', value: '94%' },
    ],
    challenge_points: [
      'Nomination + scheduling is spreadsheets, phone calls, and email across counterparties',
      'Variance detection happens hours late — revenue already lost',
      'No unified view across shippers, pipelines, and cycles in one screen',
      'NAESB re-nom windows are narrow — manual flagging often misses the window',
    ],
    business_outcomes: [
      { value: '$1.8M', label: 'Annual revenue protected', description: 'Per midstream operator' },
      { value: '91%', label: 'Response time reduction', description: '47-min manual → 4.2-min agent' },
      { value: '$124K', label: 'Demo scenario protected MTD', description: 'Live demo telemetry' },
    ],
    ai_capabilities: [
      { label: 'Variance detection', description: 'Continuous monitoring across shippers + cycles' },
      { label: 'Auto re-nomination', description: 'Drafts NAESB-compliant re-noms inside the window' },
      { label: 'Counterparty messaging', description: 'Teams + email auto-coordination with shippers' },
    ],
    tech_stack: ['Microsoft Fabric RTI', 'Azure Event Hub', 'Azure OpenAI Service', 'Copilot Studio', 'Dynamics 365', 'Microsoft Teams'],
    architecture_flow: [
      { step: 'Ingest', description: 'Pipeline telemetry + nom feeds → Azure Event Hub' },
      { step: 'Stream', description: 'Microsoft Fabric RTI joins shipper + cycle data' },
      { step: 'Detect', description: 'Variance + NAESB-window scoring' },
      { step: 'Re-nominate', description: 'Azure OpenAI drafts compliant re-nom' },
      { step: 'Notify', description: 'D365 + Teams updates to schedulers + counterparties' },
    ],
    operational_stats: [
      { label: 'Cycles tracked', value: '4' },
      { label: 'Counterparties', value: '11' },
      { label: 'Re-noms / day', value: '7' },
    ],
  }),

  // ============================================================
  // 9. SafeSignal — Customer + Partner
  // ============================================================
  ...buildPair({
    customer_title: 'SafeSignal',
    partner_title: 'SafeSignal — Partner View',
    base_slug: 'safesignal',
    industry: 'Oil & Gas',
    tags: ['AI-First', 'Azure', 'Compliance', 'Automation'],
    description:
      'A conversational safety agent that captures near-misses and incidents in under 60 seconds — no forms, no friction, no missed reports.',
    customer_roi:
      'Average report time of 48 seconds vs. 12-minute paper-based process. $42K estimated annual insurance premium reduction per site. 4.6× more near-misses captured vs. industry average headcount. Supports OSHA PSM (29 CFR 1910.119), EPA RMP, and ISO 45001 compliance.',
    partner_roi:
      'Azure AI Foundry co-sell motion (explicit ACR baseline not listed in one-pager — position on Copilot Studio + Azure AI Language + Azure OpenAI consumption). 48-second report time vs. 12-minute paper process. $42K estimated annual insurance premium reduction per site. 4.6× more near-misses captured. Stack: Microsoft Copilot Studio, Azure AI Language, Azure OpenAI Service, Power Automate, Power BI, Dynamics 365, Microsoft Teams.',
    azure_acr: 'Co-Sell · Azure AI Foundry',
    target_audience_description:
      'Field Workers and Operators who talk to SafeSignal like a text message — no forms, no logins, works via voice with gloves on; Safety Managers and HSE Teams with a real-time feed of all reports, pattern alerts, OSHA classification, and corrective action tracking in one dashboard; and VP of HSE / COO focused on OSHA recordable rates, insurance premiums, PSM compliance, and safety culture scores.',
    problem_statement:
      'Near-miss reporting rates across O&G are a fraction of actual events — field workers won\'t fill out a 5-step form after a 12-hour shift. Companies know near-miss data is critical to preventing the next recordable incident, but reporting tool adoption consistently fails due to friction. OSHA classification, PSM applicability, and corrective action assignment all happen manually — creating compliance gaps. Safety managers have no real-time visibility into hazard patterns until weekly reports, by which time a recurring risk may have resulted in an incident. Corrective actions are assigned but rarely tracked to closure — the accountability loop is broken.',
    customer_kpis: [
      { label: 'Report time', value: '48 sec' },
      { label: 'Insurance premium cut', value: '$42K/yr' },
      { label: 'Near-misses captured', value: '4.6×' },
      { label: 'Manual baseline', value: '12 min' },
    ],
    challenge_points: [
      'Field workers won\'t fill out a 5-step form after a 12-hour shift — reporting adoption fails on friction',
      'OSHA classification + PSM applicability + corrective action assignment all happen manually',
      'No real-time visibility into hazard patterns until weekly reports — by then a recurring risk may have caused an incident',
      'Corrective actions assigned but rarely tracked to closure — accountability loop is broken',
    ],
    business_outcomes: [
      { value: '4.6×', label: 'Near-miss capture rate', description: 'Versus industry average per headcount' },
      { value: '$42K', label: 'Annual insurance premium reduction', description: 'Per site' },
      { value: '60 sec', label: 'Sub-minute reporting', description: 'Versus 12-minute paper baseline' },
    ],
    ai_capabilities: [
      { label: 'Conversational capture', description: 'Voice or text — works with gloves on, no logins' },
      { label: 'OSHA auto-classification', description: 'Azure AI Language tags PSM applicability + recordable status' },
      { label: 'Pattern surfacing', description: 'Real-time hazard clustering before incidents recur' },
      { label: 'Corrective-action loop', description: 'Auto-assigned + tracked to closure in D365' },
    ],
    tech_stack: ['Microsoft Copilot Studio', 'Azure AI Language', 'Azure OpenAI Service', 'Power Automate', 'Power BI', 'Dynamics 365', 'Microsoft Teams'],
    architecture_flow: [
      { step: 'Capture', description: 'Voice or text into Copilot Studio agent' },
      { step: 'Classify', description: 'Azure AI Language — OSHA + PSM tagging' },
      { step: 'Assign', description: 'Auto-routed corrective actions in D365' },
      { step: 'Track', description: 'Power Automate loop to closure' },
      { step: 'Visualize', description: 'Power BI hazard pattern + compliance dashboards' },
    ],
    operational_stats: [
      { label: 'Reports / week', value: '184' },
      { label: 'OSHA recordable rate', value: '↓ 38%' },
      { label: 'Open actions', value: '23' },
    ],
  }),
];

/* eslint-enable max-len */

/**
 * Helper that builds the customer + Microsoft-partner pair from a single
 * use-case definition. Cuts the manifest size roughly in half and
 * guarantees the customer/partner data stays in sync.
 */
function buildPair(uc) {
  const featured = !!uc.featured;
  const common = {
    industry: uc.industry,
    tags: uc.tags,
    description: uc.description,
    target_audience_description: uc.target_audience_description,
    problem_statement: uc.problem_statement,
    challenge_points: uc.challenge_points,
    business_outcomes: uc.business_outcomes,
    ai_capabilities: uc.ai_capabilities,
    tech_stack: uc.tech_stack,
    architecture_flow: uc.architecture_flow,
    operational_stats: uc.operational_stats,
    agent_timeline: [],
    prefer_live_preview: false,
    featured,
  };

  const customer = {
    ...common,
    title: uc.customer_title,
    slug: uc.base_slug,
    audience: ['customer'],
    roi_summary: uc.customer_roi,
    kpi_metrics: uc.customer_kpis,
  };

  // Partner KPI ordering: ACR first (most prominent for sales reps),
  // followed by the customer KPIs.
  const partner = {
    ...common,
    title: uc.partner_title,
    slug: `${uc.base_slug}-partner`,
    audience: ['microsoft'],
    roi_summary: uc.partner_roi,
    kpi_metrics: [
      { label: 'Azure ACR', value: uc.azure_acr },
      ...uc.customer_kpis,
    ].slice(0, 4), // cap at 4 so the strip stays readable
  };

  return [customer, partner];
}

// =============================================================================
//  Insert loop
// =============================================================================

async function main() {
  console.log(`Seeding ${DEMOS.length} demos…`);

  // Pre-check: list existing slugs so we can skip duplicates idempotently
  const { data: existing, error: lookupErr } = await supabase
    .from('demos')
    .select('slug');
  if (lookupErr) {
    console.error('Could not list existing demos:', lookupErr.message);
    process.exit(1);
  }
  const existingSlugs = new Set((existing || []).map((d) => d.slug));

  const results = [];
  for (const demo of DEMOS) {
    if (existingSlugs.has(demo.slug)) {
      console.log(`  ⏭  skipping ${demo.slug} — already exists`);
      results.push({ slug: demo.slug, status: 'skipped' });
      continue;
    }

    const row = {
      ...demo,
      // Placeholder URL so the row inserts. Admin replaces per-demo.
      demo_url: `${PLACEHOLDER_URL}/${demo.slug}`,
      preview_image_url: null,
      architecture_diagram_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('demos')
      .insert([row])
      .select('id, slug, title')
      .single();

    if (error) {
      console.error(`  ✗ ${demo.slug} — ${error.message}`);
      results.push({ slug: demo.slug, status: 'error', error: error.message });
      continue;
    }
    console.log(`  ✓ ${data.slug} (${data.id})`);
    results.push({ slug: data.slug, id: data.id, status: 'inserted' });
  }

  console.log('\n=== Summary ===');
  const inserted = results.filter((r) => r.status === 'inserted');
  const skipped = results.filter((r) => r.status === 'skipped');
  const errored = results.filter((r) => r.status === 'error');
  console.log(`  ✓ ${inserted.length} inserted`);
  console.log(`  ⏭  ${skipped.length} skipped (already exist)`);
  console.log(`  ✗ ${errored.length} errored`);

  if (inserted.length > 0) {
    console.log('\n=== Admin edit URLs (paste demo_url + upload diagram) ===');
    for (const r of inserted) {
      console.log(`  https://echelix.app/admin/demo/${r.id}/edit   ${r.slug}`);
    }
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
