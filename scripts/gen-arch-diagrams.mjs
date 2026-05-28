// =============================================================================
//  Architecture diagram pipeline — 10 demos, customer + partner pairs.
//
//  What it does:
//   1. Builds an SVG architecture diagram from a per-demo config (template
//      identical to the approved Iron Scout RTI design — neutral, no ACR/
//      compliance claims, just tech stack + data flow).
//   2. Renders each SVG to a 3200×2000 PNG using sharp.
//   3. Uploads each PNG to Supabase Storage (demo-assets/architecture/…).
//   4. PATCHes both customer + partner demo rows in Supabase to point at
//      the new diagram URL.
//
//  Run:  node scripts/gen-arch-diagrams.mjs
//  Idempotent: re-running uploads new timestamped files; old ones stay in
//  storage but are no longer referenced by any demo row.
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// --- tiny .env.local loader ---
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
  }
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// --- per-demo configs ---
// Every config follows the same shape so the template is deterministic.
// Forced shape: 4 UI cards · 3 agents · 2 AI services · 3 data services ·
// 1 business app · 2 event sources · 1 governance card.

const DEMOS = [
  {
    slug: 'iron-scout-rti',
    pairSlugs: ['iron-scout-rti', 'iron-scout-rti-partner'],
    title: 'Iron Scout RTI',
    subtitle: 'REAL-TIME MIDSTREAM OPERATIONS INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Permian Basin · 47 monitored assets',
    userLayer: [
      { title: 'Operator Control Room', desc: 'mission-control wall display', kicker: 'WEB · DESKTOP' },
      { title: 'Field Tech Mobile', desc: 'ruggedized tablet · in-field', kicker: 'iOS · ANDROID' },
      { title: 'Microsoft Teams', desc: 'work-order alerts · acknowledgment', kicker: 'M365' },
      { title: 'Shift Handoff Digest', desc: 'Outlook · email summary', kicker: 'M365' },
    ],
    agents: [
      { title: 'ANOMALY DETECTION AGENT', lines: ['monitors 47 assets · 1,247 events/sec', 'detects bearing harmonics, pressure', 'drift, flow variance · 4-min latency'] },
      { title: 'WORK ORDER DISPATCH AGENT', lines: ['drafts WO with AI rationale, parts', 'list, cost estimate · routes to crew', 'via D365 Field Service + Teams'] },
      { title: 'CREW COORDINATION AGENT', lines: ['routes crew assignments, captures', 'acknowledgment + sign-off, closes', 'loop on MTTR + cost actuals'] },
    ],
    aiServices: [
      { title: 'Azure AI Foundry', lines: ['anomaly detection · model', 'inference at the edge'] },
      { title: 'Azure OpenAI', lines: ['rationale generation · WO', 'drafting · gpt-4o + 4o-mini'] },
    ],
    dataServices: [
      { title: 'Azure IoT Hub S2', lines: ['sensor ingest · 1,247', 'events/sec capacity'] },
      { title: 'Microsoft Fabric RTI', lines: ['F32–F64 capacity', 'stream processing · KQL'] },
      { title: 'ADLS Gen2', lines: ['telemetry archive', 'long-retention storage'] },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Field Service', desc: 'work order lifecycle' },
    eventSources: [
      { title: '47 Compressor + Pipeline Assets · Permian Basin', desc: 'vibration · discharge pressure · temperature · flow · gas composition' },
      { title: 'OSIsoft PI Historian (legacy SCADA integration)', desc: 'backfill · historical replay · cross-system audit trail' },
    ],
    governance: { title: 'Microsoft Purview', lines: ['data lineage', 'audit trail'] },
    footerLeft: 'Iron Scout RTI · System Architecture',
  },

  {
    slug: 'chainiq',
    pairSlugs: ['chainiq', 'chainiq-partner'],
    title: 'ChainIQ',
    subtitle: 'AGENTIC SUPPLY CHAIN INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'CPG · multi-retailer scope',
    userLayer: [
      { title: 'Planner Cockpit', desc: 'overnight decision review', kicker: 'WEB' },
      { title: 'Microsoft Teams', desc: 'decision alerts · approvals', kicker: 'M365' },
      { title: 'Outlook', desc: 'overnight summary digest', kicker: 'M365' },
      { title: 'Power BI', desc: 'executive supply chain views', kicker: 'M365' },
    ],
    agents: [
      { title: 'DEMAND SENSING AGENT', lines: ['monitors POS + EDI 856 across', 'top retailers · reconciles forecasts', 'against actuals in real time'] },
      { title: 'SUPPLIER RISK AGENT', lines: ['continuous monitoring of tier-1', 'through tier-3 suppliers · weather,', 'logistics, commodity signals'] },
      { title: 'DEDUCTION RECOVERY AGENT', lines: ['adjudicates retailer chargebacks', 'against contract terms, OS&D', 'records, trade-promo schedules'] },
    ],
    aiServices: [
      { title: 'Azure OpenAI', lines: ['decision rationale · dispute', 'drafting · risk narratives'] },
      { title: 'Azure AI Search', lines: ['retailer + supplier', 'knowledge retrieval'] },
    ],
    dataServices: [
      { title: 'Microsoft Fabric', lines: ['POS + EDI 856 unification', 'across retailer feeds'] },
      { title: 'Azure Data Factory', lines: ['EDI 856 + POS pipelines', 'orchestration'] },
      { title: 'Azure Service Bus', lines: ['event streaming · agent', 'coordination'] },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Supply Chain', desc: 'order · replenishment · AR' },
    eventSources: [
      { title: 'Retailer POS + EDI 856 Feeds', desc: 'Walmart Retail Link · Target Vendor Portal · Kroger · Albertsons · HEB · Publix · Costco · Sams Club' },
      { title: 'Supplier Risk Intelligence', desc: 'weather forecasts · port congestion · commodity prices · supplier financial signals' },
    ],
    governance: { title: 'Microsoft Purview', lines: ['data lineage', 'audit trail'] },
    footerLeft: 'ChainIQ · System Architecture',
  },

  {
    slug: 'clearpath-ai',
    pairSlugs: ['clearpath-ai', 'clearpath-ai-partner'],
    title: 'ClearPath AI',
    subtitle: 'AUTONOMOUS PRIOR AUTHORIZATION  ·  SYSTEM ARCHITECTURE',
    topRight: 'Multi-specialty · 60K+ auths/yr',
    userLayer: [
      { title: 'Specialist Inbox', desc: 'triple-pane case workspace', kicker: 'WEB' },
      { title: 'Microsoft Teams', desc: 'escalation channel · MD review', kicker: 'M365' },
      { title: 'Outlook', desc: 'denial summary · daily digest', kicker: 'M365' },
      { title: 'Power BI', desc: 'RCM + denial trend dashboards', kicker: 'M365' },
    ],
    agents: [
      { title: 'PRIOR AUTH DRAFTING AGENT', lines: ['extracts clinical evidence from', 'chart notes · assembles auth packet', 'per payer-specific medical policy'] },
      { title: 'SUBMISSION ROUTING AGENT', lines: ['routes auth to correct payer', 'across 900+ commercial, Medicare,', 'and Medicaid portals'] },
      { title: 'APPEAL DRAFTING AGENT', lines: ['drafts denial appeals citing', 'payer medical policy + clinical', 'precedent · tracks decisions'] },
    ],
    aiServices: [
      { title: 'Azure OpenAI', lines: ['auth packet drafting · appeal', 'narrative · entity extraction'] },
      { title: 'Azure AI Search', lines: ['payer medical policy corpus', 'semantic retrieval'] },
    ],
    dataServices: [
      { title: 'Azure Health Data Services', lines: ['FHIR R4 ingest · EHR', 'systems · clinical context'] },
      { title: 'Azure API Management', lines: ['900+ payer portal routing', 'submission + status polling'] },
      { title: 'Microsoft Fabric', lines: ['clinical + admin data joins', 'denial pattern analytics'] },
    ],
    businessApp: { title: 'Copilot Studio', titleLine2: '+ Power Automate', desc: 'orchestration + workflow' },
    eventSources: [
      { title: 'EHR Systems (FHIR R4 ingest)', desc: 'Epic · Cerner · Athenahealth · eClinicalWorks · NextGen — clinical chart notes, diagnoses, CPT codes' },
      { title: 'Payer Portals (900+ supported)', desc: 'commercial · Medicare · Medicaid · auth submission, status polling, denial retrieval' },
    ],
    governance: { title: 'Microsoft Purview', lines: ['PHI lineage', 'audit trail'] },
    footerLeft: 'ClearPath AI · System Architecture',
  },

  {
    slug: 'counsel-iq',
    pairSlugs: ['counsel-iq', 'counsel-iq-partner'],
    title: 'Counsel IQ',
    subtitle: 'MATTER & BILLING INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Law firm · M365 native',
    userLayer: [
      { title: 'Matter Workspace', desc: 'matter folio · firm-wide', kicker: 'WEB' },
      { title: 'Word + Copilot', desc: 'drafting · clause comparison', kicker: 'M365' },
      { title: 'Outlook', desc: 'matter inbox · time entry capture', kicker: 'M365' },
      { title: 'Microsoft Teams', desc: 'matter coordination · co-counsel', kicker: 'M365' },
    ],
    agents: [
      { title: 'MATTER INTELLIGENCE AGENT', lines: ['surfaces relevant documents,', 'summarizes filings, drafts research', 'memos against firm corpus'] },
      { title: 'TIME ENTRY CAPTURE AGENT', lines: ['captures billable activity from', 'Outlook, Teams, Word, Excel ·', 'drafts narratives for review'] },
      { title: 'CONTRACT REVIEW AGENT', lines: ['flags risk clauses · suggests', 'redlines · compares against firm', 'precedent + market standards'] },
    ],
    aiServices: [
      { title: 'Azure OpenAI', lines: ['drafting · summarization', 'narrative generation'] },
      { title: 'Azure AI Search', lines: ['firm corpus · institutional', 'memory retrieval'] },
    ],
    dataServices: [
      { title: 'Microsoft Graph', lines: ['M365 activity ingestion ·', 'Outlook, Teams, Word, Excel'] },
      { title: 'SharePoint Online', lines: ['firm document library ·', 'matter file repository'] },
      { title: 'Microsoft Fabric', lines: ['matter analytics · WIP,', 'realization, utilization'] },
    ],
    businessApp: { title: 'Microsoft 365', titleLine2: '+ Copilot', desc: 'firm-wide productivity' },
    eventSources: [
      { title: 'M365 Activity Stream', desc: 'Outlook email, Teams calls + chat, Word + Excel docs, calendar — captures billable activity automatically' },
      { title: 'Document Repositories', desc: 'NetDocuments · iManage · DMS connectors — matter files, prior work product, firm precedent library' },
    ],
    governance: { title: 'Microsoft Purview', lines: ['privilege lineage', 'audit trail'] },
    footerLeft: 'Counsel IQ · System Architecture',
  },

  {
    slug: 'deliveriq',
    pairSlugs: ['deliveriq', 'deliveriq-partner'],
    title: 'DeliverIQ',
    subtitle: 'AI MATERIAL VERIFICATION  ·  SYSTEM ARCHITECTURE',
    topRight: 'O&G · field receiving',
    userLayer: [
      { title: 'Field Capture', desc: 'mobile tablet · camera capture', kicker: 'iOS · ANDROID' },
      { title: 'Materials Manager Console', desc: 'review queue · drilldowns', kicker: 'WEB' },
      { title: 'Microsoft Teams', desc: 'driver notifications · alerts', kicker: 'M365' },
      { title: 'Power BI', desc: 'procurement + AP dashboards', kicker: 'M365' },
    ],
    agents: [
      { title: 'ITEM DETECTION AGENT', lines: ['computer-vision identification', 'and counting of delivered items', 'from captured tablet frames'] },
      { title: 'PO RECONCILIATION AGENT', lines: ['matches detected items to PO', 'line items · flags shortages,', 'missing items, wrong-spec parts'] },
      { title: 'DISCREPANCY RESOLUTION AGENT', lines: ['opens vendor tickets · drafts', 'communications · tracks resolution', 'and credits / re-deliveries'] },
    ],
    aiServices: [
      { title: 'Azure AI Vision', lines: ['object detection + counting', 'per-image transactions'] },
      { title: 'Azure OpenAI', lines: ['multi-modal PO reconciliation', 'vendor communication drafting'] },
    ],
    dataServices: [
      { title: 'Azure Blob Storage', lines: ['image archive · chain-of-', 'custody evidence retention'] },
      { title: 'Microsoft Fabric', lines: ['delivery + PO + vendor', 'unification'] },
      { title: 'Power Automate', lines: ['discrepancy workflow', 'corrective action loop'] },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Supply Chain', desc: 'PO + AP reconciliation' },
    eventSources: [
      { title: 'Field Tablet Captures (ruggedized)', desc: 'iOS / Android camera frames · driver BOL · chain-of-custody signature · pad-site GPS' },
      { title: 'Purchase Order System + Vendor Data', desc: 'PO line items · expected delivery windows · vendor BOL feeds · driver manifests' },
    ],
    governance: { title: 'Microsoft Purview', lines: ['chain-of-custody', 'audit trail'] },
    footerLeft: 'DeliverIQ · System Architecture',
  },

  {
    slug: 'finshield-ai',
    pairSlugs: ['finshield-ai', 'finshield-ai-partner'],
    title: 'FinShield AI',
    subtitle: 'AML & LOAN INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Community bank · BSA / AML',
    userLayer: [
      { title: 'Investigator Workstation', desc: 'case workspace · entity graph', kicker: 'WEB' },
      { title: 'MLRO Review Portal', desc: 'SAR approval · escalation', kicker: 'WEB' },
      { title: 'Microsoft Teams', desc: 'escalation channel · co-review', kicker: 'M365' },
      { title: 'Outlook', desc: 'FinCEN deadline alerts', kicker: 'M365' },
    ],
    agents: [
      { title: 'AML DETECTION AGENT', lines: ['monitors transactions for', 'structuring, velocity anomalies,', 'sanctions hits, shell indicators'] },
      { title: 'KYC REFRESH AGENT', lines: ['continuous beneficial-owner', 'scan · PEP screening · watch-', 'list + sanctions list checks'] },
      { title: 'LOAN UNDERWRITING AGENT', lines: ['extracts financials · runs OFAC', '+ credit screens · generates', 'decision rationale + packet'] },
    ],
    aiServices: [
      { title: 'Azure OpenAI', lines: ['SAR narrative · loan doc', 'underwriting · review summaries'] },
      { title: 'Azure AI Search', lines: ['regulatory corpus · entity', 'graph semantic retrieval'] },
    ],
    dataServices: [
      { title: 'Microsoft Fabric', lines: ['transaction + KYC join across', '5–7 source systems'] },
      { title: 'Microsoft Purview', lines: ['lineage + classification', 'examiner-ready audit'] },
      { title: 'Azure Service Bus', lines: ['event coordination ·', 'cross-agent messaging'] },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Finance', desc: 'case + loan workflow' },
    eventSources: [
      { title: 'Core Banking Systems', desc: 'transactions · accounts · KYC documents · beneficial ownership records · loan application data' },
      { title: 'External Watchlists + Regulatory Feeds', desc: 'OFAC SDN · PEP databases · FinCEN advisories · sanctions lists · adverse media' },
    ],
    governance: { title: 'Copilot Studio', lines: ['case orchestration', 'reviewer routing'] },
    footerLeft: 'FinShield AI · System Architecture',
  },

  {
    slug: 'forge-ai',
    pairSlugs: ['forge-ai', 'forge-ai-partner'],
    title: 'Forge AI',
    subtitle: 'PLANT FLOOR INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Mid-market mfg · 400 sensors',
    userLayer: [
      { title: 'Andon Wall Display', desc: '50" wall-mounted · shift view', kicker: 'WEB' },
      { title: 'Maintenance Tech Mobile', desc: 'tablet · in-shop · machine-side', kicker: 'iOS · ANDROID' },
      { title: 'Microsoft Teams', desc: 'WO alerts · knowledge chat', kicker: 'M365' },
      { title: 'Power BI', desc: 'plant manager dashboards', kicker: 'M365' },
    ],
    agents: [
      { title: 'PREDICTIVE MAINTENANCE AGENT', lines: ['vibration, temperature, current', 'draw anomaly detection · predicts', 'failures 4–24h ahead of event'] },
      { title: 'QUALITY AGENT', lines: ['dimensional drift detection from', 'CMM data · flags parts · suggests', 'CNC offset adjustments inline'] },
      { title: 'FRONTLINE KNOWLEDGE AGENT', lines: ['captured tribal knowledge served', 'via Teams · multi-turn machine-', 'specific Q&A · captures new fixes'] },
    ],
    aiServices: [
      { title: 'Azure AI Foundry', lines: ['predictive models per', 'asset type · edge inference'] },
      { title: 'Azure OpenAI', lines: ['knowledge agent · WO narrative', 'capture-from-conversation'] },
    ],
    dataServices: [
      { title: 'Azure IoT Hub', lines: ['sensor ingest · 400', 'sensors per line'] },
      { title: 'Microsoft Fabric', lines: ['historian + maintenance', 'data joins · OEE analytics'] },
      { title: 'ADLS Gen2', lines: ['telemetry archive · long-', 'retention training data'] },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Field Service', desc: 'technician dispatch' },
    eventSources: [
      { title: 'Production Line Sensors (~400 per line)', desc: 'vibration · temperature · current draw · spindle speed · cycle time across CNC, milling, drilling stations' },
      { title: 'Inspection Equipment + Historian', desc: 'Zeiss CMM · in-line gauges · part barcode scans · OSIsoft PI / Wonderware historian feeds' },
    ],
    governance: { title: 'Microsoft Purview', lines: ['data lineage', 'audit trail'] },
    footerLeft: 'Forge AI · System Architecture',
  },

  {
    slug: 'nomagent',
    pairSlugs: ['nomagent', 'nomagent-partner'],
    title: 'NomAgent',
    subtitle: 'AGENTIC PIPELINE SCHEDULING  ·  SYSTEM ARCHITECTURE',
    topRight: 'Midstream · 11 shippers · 4 cycles',
    userLayer: [
      { title: 'Scheduling Board', desc: 'cycle clock · variance grid', kicker: 'WEB' },
      { title: 'Commercial Dashboard', desc: 'counterparty exposure · margin', kicker: 'WEB' },
      { title: 'Microsoft Teams', desc: 'shipper coordination · co-noms', kicker: 'M365' },
      { title: 'Outlook', desc: 'cycle confirmations · NAESB digest', kicker: 'M365' },
    ],
    agents: [
      { title: 'VARIANCE DETECTION AGENT', lines: ['monitors actual vs. confirmed', 'nominations across 4 NAESB cycles', '· surfaces drift within window'] },
      { title: 'RE-NOMINATION DRAFTING AGENT', lines: ['drafts NAESB-compliant re-noms', 'with regulatory-tone rationale ·', '94% confidence average'] },
      { title: 'SHIPPER COORDINATION AGENT', lines: ['auto-responds to shipper queries', 'drafts confirmations · tracks', 'counterparty exposure + margin'] },
    ],
    aiServices: [
      { title: 'Azure OpenAI', lines: ['variance analysis · NAESB-', 'compliant re-nom drafting'] },
      { title: 'Copilot Studio', lines: ['shipper coordination', 'workflow orchestration'] },
    ],
    dataServices: [
      { title: 'Microsoft Fabric RTI', lines: ['nominations + flow data ·', 'real-time stream processing'] },
      { title: 'Azure Event Hub', lines: ['shipper feeds · EDI', 'exchange ingestion'] },
      { title: 'Azure Service Bus', lines: ['NAESB endpoint comm', 'agent orchestration'] },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Customer Service', desc: 'shipper desk coordination' },
    eventSources: [
      { title: 'NAESB EDI Exchanges (11 shipper counterparties)', desc: 'nominations · confirmations · re-noms · imbalance reports across Timely, Evening, ID-1, ID-2 cycles' },
      { title: 'Pipeline SCADA + Interconnect Flow Data', desc: 'real-time flow measurements · interconnect capacity · Waha, Agua Dulce, El Paso hub data' },
    ],
    governance: { title: 'Microsoft Purview', lines: ['NAESB audit trail', 'regulatory lineage'] },
    footerLeft: 'NomAgent · System Architecture',
  },

  {
    slug: 'ratecase-navigator',
    pairSlugs: ['ratecase-navigator', 'ratecase-navigator-partner'],
    title: 'RateCase Navigator',
    subtitle: 'REGULATORY AFFAIRS INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Utilities · IOU regulatory affairs',
    userLayer: [
      { title: 'Docket Workspace', desc: 'proceeding folio · commitments', kicker: 'WEB' },
      { title: 'Word + Copilot', desc: 'testimony drafting · briefs', kicker: 'M365' },
      { title: 'Outlook', desc: 'regulatory inbox · DR responses', kicker: 'M365' },
      { title: 'Microsoft Teams', desc: 'witness + SME coordination', kicker: 'M365' },
    ],
    agents: [
      { title: 'DISCOVERY RESPONSE AGENT', lines: ['drafts intervenor data request', 'responses citing testimony +', 'workpapers · pre-filled in Word'] },
      { title: 'COMMITMENT TRACKING AGENT', lines: ['captures commitments from', 'transcripts, Teams, email · tracks', 'status to closure with reminders'] },
      { title: 'FILING ASSEMBLY AGENT', lines: ['assembles filings against', 'procedural schedules · surfaces', 'deadline risk + dependencies'] },
    ],
    aiServices: [
      { title: 'Azure OpenAI', lines: ['drafting · summarization', 'witness Q&A prep'] },
      { title: 'Azure AI Search', lines: ['regulatory corpus · testimony,', 'workpaper, order retrieval'] },
    ],
    dataServices: [
      { title: 'Microsoft Graph', lines: ['M365 activity ingestion ·', 'email, Teams, calendars'] },
      { title: 'SharePoint Online', lines: ['12,400+ document corpus', 'filing repository'] },
      { title: 'Microsoft Fabric', lines: ['proceeding analytics · DR', 'aging · commitment status'] },
    ],
    businessApp: { title: 'Microsoft 365', titleLine2: '+ Copilot', desc: 'docket workspace' },
    eventSources: [
      { title: 'Filings, Orders, Testimony Transcripts', desc: 'PUC dockets · intervenor filings · commission orders · transcripts · workpapers · prior-case archive' },
      { title: 'Witness + SME Activity', desc: 'Teams conversations · email archives · captured commitments · calendar entries · workpaper edits' },
    ],
    governance: { title: 'Microsoft Purview', lines: ['regulatory audit', 'doc classification'] },
    footerLeft: 'RateCase Navigator · System Architecture',
  },

  {
    slug: 'safesignal',
    pairSlugs: ['safesignal', 'safesignal-partner'],
    title: 'SafeSignal',
    subtitle: 'CONVERSATIONAL SAFETY INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'O&G · HSE field + manager',
    userLayer: [
      { title: 'Field Worker Chat', desc: 'mobile · Teams · 60-sec capture', kicker: 'iOS · ANDROID · M365' },
      { title: 'HSE Manager Dashboard', desc: 'site heatmap · trends', kicker: 'WEB' },
      { title: 'Microsoft Teams', desc: 'alerts · handoff · co-review', kicker: 'M365' },
      { title: 'Power BI', desc: 'HSE executive views · scorecards', kicker: 'M365' },
    ],
    agents: [
      { title: 'CONVERSATIONAL CAPTURE AGENT', lines: ['multi-turn near-miss + incident', 'conversations · clarifying Qs ·', 'auto-classifies hazard type'] },
      { title: 'OSHA CLASSIFICATION AGENT', lines: ['maps reports to 29 CFR standards', 'flags Tier-1 incidents · routes', 'to corrective action workflow'] },
      { title: 'CORRECTIVE ACTION AGENT', lines: ['drafts corrective action plans', 'routes to responsible parties ·', 'tracks closure + verification'] },
    ],
    aiServices: [
      { title: 'Copilot Studio', lines: ['multi-turn safety conversations', 'in Teams + mobile'] },
      { title: 'Azure OpenAI', lines: ['clarifying questions · OSHA', 'classification · narrative drafting'] },
    ],
    dataServices: [
      { title: 'Azure AI Language', lines: ['entity extraction · OSHA', 'code mapping'] },
      { title: 'Microsoft Fabric', lines: ['incident + corrective action', 'data · trend analytics'] },
      { title: 'Azure Data Lake Storage', lines: ['long-retention audit data', 'witness statements · photos'] },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: '+ Power Automate', desc: 'HSE case workflow' },
    eventSources: [
      { title: 'Field Worker Reports (text + voice)', desc: 'Teams chat · mobile voice capture · in-the-moment near-miss + incident descriptions from frontline workers' },
      { title: 'Incident Documentation', desc: 'photos · witness statements · pad-site GPS · timestamp + shift metadata · attached evidence files' },
    ],
    governance: { title: 'Microsoft Purview', lines: ['OSHA audit trail', 'data classification'] },
    footerLeft: 'SafeSignal · System Architecture',
  },
];

// =============================================================================
//  SVG TEMPLATE
//  Renders a config into a 1600×1000 SVG matching the approved Iron Scout
//  visual language. No commercial framing.
// =============================================================================

// Escape XML special characters in any user-supplied string. SVG is XML —
// a bare `&` (e.g. in "OS&D" or "Q&A") is a parse error in librsvg / sharp.
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderSVG(c) {
  // -- user layer: evenly distribute 4 cards across x=200..1280 --
  const userCards = c.userLayer.map((u, i) => {
    const x = 200 + i * 280;
    return `
      <rect x="${x}" y="140" width="240" height="80" rx="6" fill="#FFFFFF" stroke="#1A2B4A" stroke-width="1.5"/>
      <text x="${x + 120}" y="170" text-anchor="middle" font-size="13" font-weight="600" fill="#1A2B4A">${esc(u.title)}</text>
      <text x="${x + 120}" y="190" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(u.desc)}</text>
      <text x="${x + 120}" y="207" text-anchor="middle" font-size="10" fill="#9AA5B1" letter-spacing="0.5">${esc(u.kicker)}</text>`;
  }).join('');

  // -- user → lattice connectors (4 lines converging) --
  const userConnectors = c.userLayer.map((_, i) => {
    const sx = 320 + i * 280;
    const tx = 700 + i * 60 - 90; // gentle fan-in into the top of the lattice box
    return `<path d="M ${sx} 220 L ${sx} 270 L ${tx} 270 L ${tx} 305"/>`;
  }).join('');

  // -- agents: 3 cards inside the Lattice box --
  const agentCards = c.agents.map((a, i) => {
    const x = 240 + i * 300;
    return `
      <rect x="${x}" y="400" width="280" height="100" rx="6" fill="#FFFFFF" stroke="#1A2B4A" stroke-width="1.5"/>
      <text x="${x + 140}" y="425" text-anchor="middle" font-size="13" font-weight="700" fill="#1A2B4A" letter-spacing="0.5">${esc(a.title)}</text>
      <text x="${x + 140}" y="450" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(a.lines[0])}</text>
      <text x="${x + 140}" y="470" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(a.lines[1])}</text>
      <text x="${x + 140}" y="485" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(a.lines[2])}</text>`;
  }).join('');

  // -- agent → azure platform connectors (3 down-arrows) --
  const agentConnectors = c.agents.map((_, i) => {
    const x = 380 + i * 300;
    return `<path d="M ${x} 525 L ${x} 580"/>`;
  }).join('');

  // -- AI services: 2 cards in left group (x=200..650, group width=450) --
  const aiCards = c.aiServices.map((s, i) => {
    const x = 220 + i * 210;
    const w = 195;
    return `
      <rect x="${x}" y="620" width="${w}" height="80" rx="4" fill="#FFFFFF" stroke="#0078D4" stroke-width="1.5"/>
      <text x="${x + w/2}" y="648" text-anchor="middle" font-size="12" font-weight="700" fill="#0078D4">${esc(s.title)}</text>
      <text x="${x + w/2}" y="668" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(s.lines[0])}</text>
      <text x="${x + w/2}" y="682" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(s.lines[1])}</text>`;
  }).join('');

  // -- Data services: 3 cards in right group (x=680..1280, group width=600) --
  const dataCards = c.dataServices.map((s, i) => {
    const x = 700 + i * 195;
    const w = 180;
    return `
      <rect x="${x}" y="620" width="${w}" height="80" rx="4" fill="#FFFFFF" stroke="#5C6BC0" stroke-width="1.5"/>
      <text x="${x + w/2}" y="648" text-anchor="middle" font-size="12" font-weight="700" fill="#5C6BC0">${esc(s.title)}</text>
      <text x="${x + w/2}" y="668" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(s.lines[0])}</text>
      <text x="${x + w/2}" y="682" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(s.lines[1])}</text>`;
  }).join('');

  // -- event sources: 2 cards in horizontal row at bottom --
  const eventCards = c.eventSources.map((e, i) => {
    const x = 220 + i * 540;
    return `
      <rect x="${x}" y="800" width="500" height="60" rx="4" fill="#FFFFFF" stroke="#87A878" stroke-width="1.5"/>
      <text x="${x + 250}" y="822" text-anchor="middle" font-size="13" font-weight="600" fill="#3D5A3F">${esc(e.title)}</text>
      <text x="${x + 250}" y="842" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(e.desc)}</text>`;
  }).join('');

  // -- event → data layer connectors (dashed, fan-in) --
  const eventConnectors = `
    <path d="M 470 800 L 470 750 L 790 750 L 790 700"/>
    <path d="M 1010 800 L 1010 750 L 985 750 L 985 700"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif">
  <defs>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="0" dy="2" result="offset"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.10"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="latticeFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#C5E8E9"/>
      <stop offset="100%" stop-color="#A8DADC"/>
    </linearGradient>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1A2B4A"/>
    </marker>
    <marker id="arrowMuted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#9AA5B1"/>
    </marker>
  </defs>

  <!-- background -->
  <rect width="1600" height="1000" fill="#FAF7F2"/>

  <!-- header -->
  <text x="80" y="62" font-family="Newsreader, 'Source Serif Pro', Georgia, serif"
        font-size="40" font-weight="600" fill="#1A2B4A">${esc(c.title)}</text>
  <text x="80" y="92" font-size="15" fill="#6B5D4F" letter-spacing="0.5">${esc(c.subtitle)}</text>
  <line x1="80" y1="115" x2="1520" y2="115" stroke="#1A2B4A" stroke-width="1.5"/>

  <text x="1520" y="62" text-anchor="end" font-family="Newsreader, Georgia, serif"
        font-size="14" fill="#6B2C2C" font-style="italic">${esc(c.topRight)}</text>
  <text x="1520" y="84" text-anchor="end" font-size="11" fill="#6B5D4F" letter-spacing="0.8">
    ECHELIX  ·  LATTICE-POWERED  ·  AZURE NATIVE STACK
  </text>

  <!-- left-margin section labels -->
  <g font-size="10" font-weight="700" letter-spacing="1.5" fill="#6B5D4F">
    <text x="30" y="180" transform="rotate(-90 30 180)" text-anchor="middle">USER LAYER</text>
    <text x="30" y="395" transform="rotate(-90 30 395)" text-anchor="middle">ECHELIX LATTICE</text>
    <text x="30" y="640" transform="rotate(-90 30 640)" text-anchor="middle">AZURE PLATFORM</text>
    <text x="30" y="860" transform="rotate(-90 30 860)" text-anchor="middle">EVENT SOURCES</text>
  </g>

  <!-- USER LAYER -->
  <g filter="url(#cardShadow)">${userCards}</g>

  <!-- user → lattice connectors -->
  <g stroke="#1A2B4A" stroke-width="1.5" fill="none" marker-end="url(#arrow)">${userConnectors}</g>

  <!-- ECHELIX LATTICE (hero) -->
  <g filter="url(#cardShadow)">
    <rect x="200" y="305" width="1080" height="220" rx="10"
          fill="url(#latticeFill)" stroke="#1A2B4A" stroke-width="2.5"/>
    <text x="240" y="345" font-family="Newsreader, Georgia, serif"
          font-size="26" font-weight="600" fill="#1A2B4A">Echelix Lattice</text>
    <text x="240" y="368" font-size="13" fill="#1A2B4A" font-style="italic" opacity="0.7">
      Agent orchestration · state machine · audit trail · governance
    </text>
    ${agentCards}
  </g>

  <!-- lattice → azure platform -->
  <g stroke="#1A2B4A" stroke-width="1.5" fill="none" marker-end="url(#arrow)">${agentConnectors}</g>

  <!-- AZURE AI SERVICES group -->
  <g>
    <rect x="200" y="580" width="450" height="140" rx="6" fill="#FFFFFF" stroke="#0078D4" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="220" y="603" font-size="10" font-weight="700" letter-spacing="1.5" fill="#0078D4">AZURE AI SERVICES</text>
    <g filter="url(#cardShadow)">${aiCards}</g>
  </g>

  <!-- AZURE DATA SERVICES group -->
  <g>
    <rect x="680" y="580" width="600" height="140" rx="6" fill="#FFFFFF" stroke="#5C6BC0" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="700" y="603" font-size="10" font-weight="700" letter-spacing="1.5" fill="#5C6BC0">AZURE DATA SERVICES</text>
    <g filter="url(#cardShadow)">${dataCards}</g>
  </g>

  <!-- Business app (right of lattice) -->
  <g filter="url(#cardShadow)">
    <rect x="1310" y="395" width="210" height="105" rx="6" fill="#FFFFFF" stroke="#D83B01" stroke-width="1.5"/>
    <text x="1415" y="420" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1.5" fill="#D83B01">BUSINESS APP</text>
    <text x="1415" y="448" text-anchor="middle" font-size="13" font-weight="700" fill="#D83B01">${esc(c.businessApp.title)}</text>
    <text x="1415" y="466" text-anchor="middle" font-size="13" font-weight="700" fill="#D83B01">${esc(c.businessApp.titleLine2)}</text>
    <text x="1415" y="486" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(c.businessApp.desc)}</text>
  </g>
  <g stroke="#D83B01" stroke-width="1.5" fill="none" marker-end="url(#arrow)" marker-start="url(#arrow)">
    <path d="M 1280 447 L 1310 447"/>
  </g>

  <!-- EVENT SOURCES group -->
  <g>
    <rect x="200" y="760" width="1080" height="120" rx="6" fill="#FFFFFF" stroke="#87A878" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="220" y="783" font-size="10" font-weight="700" letter-spacing="1.5" fill="#87A878">EVENT SOURCES · UPSTREAM SYSTEMS</text>
    <g filter="url(#cardShadow)">${eventCards}</g>
  </g>

  <!-- event → azure data connectors -->
  <g stroke="#9AA5B1" stroke-width="1.5" fill="none" marker-end="url(#arrowMuted)" stroke-dasharray="5,3">${eventConnectors}</g>

  <!-- GOVERNANCE -->
  <g>
    <rect x="1310" y="580" width="210" height="140" rx="6" fill="#FFFFFF" stroke="#6B5D4F" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="1330" y="603" font-size="10" font-weight="700" letter-spacing="1.5" fill="#6B5D4F">GOVERNANCE</text>
    <g filter="url(#cardShadow)">
      <rect x="1330" y="620" width="170" height="90" rx="4" fill="#FFFFFF" stroke="#6B5D4F" stroke-width="1.5"/>
      <text x="1415" y="650" text-anchor="middle" font-size="12" font-weight="700" fill="#6B5D4F">${esc(c.governance.title)}</text>
      <text x="1415" y="672" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(c.governance.lines[0])}</text>
      <text x="1415" y="688" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(c.governance.lines[1])}</text>
    </g>
  </g>

  <!-- LEGEND + FOOTER -->
  <line x1="80" y1="910" x2="1520" y2="910" stroke="#1A2B4A" stroke-width="0.5" opacity="0.3"/>
  <g font-size="11">
    <text x="80" y="946" font-size="10" font-weight="700" letter-spacing="1.5" fill="#6B5D4F">DATA FLOW LEGEND</text>
    <line x1="80" y1="970" x2="105" y2="970" stroke="#1A2B4A" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="115" y="974" fill="#6B5D4F">orchestrated data flow</text>
    <line x1="290" y1="970" x2="315" y2="970" stroke="#9AA5B1" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrowMuted)"/>
    <text x="325" y="974" fill="#6B5D4F">event ingestion / backfill</text>
    <line x1="500" y1="970" x2="525" y2="970" stroke="#D83B01" stroke-width="1.5" marker-end="url(#arrow)" marker-start="url(#arrow)"/>
    <text x="535" y="974" fill="#6B5D4F">bidirectional business-system sync</text>
  </g>
  <text x="1520" y="946" text-anchor="end" font-family="Newsreader, Georgia, serif"
        font-size="12" fill="#1A2B4A" font-style="italic">${esc(c.footerLeft)}</text>
  <text x="1520" y="974" text-anchor="end" font-size="10" fill="#9AA5B1" letter-spacing="0.5">
    ECHELIX LATTICE  ·  AZURE NATIVE STACK
  </text>
</svg>`;
}

// =============================================================================
//  PIPELINE: generate SVG → render PNG → upload → patch DB rows
// =============================================================================

const OUT_DIR = path.resolve(process.cwd(), 'public/architecture-diagrams');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function uploadPng(slug, pngBuffer) {
  const ts = Date.now();
  const filename = `${ts}-${slug}-architecture.png`;
  const storagePath = `architecture/${filename}`;

  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/demo-assets/${storagePath}`,
    {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'image/png',
        'x-upsert': 'false',
        'Cache-Control': '31536000',
      },
      body: pngBuffer,
    },
  );
  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`Upload failed for ${slug}: ${uploadRes.status} ${text}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/demo-assets/${storagePath}`;
}

async function patchDemo(slug, url) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/demos?slug=eq.${encodeURIComponent(slug)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        architecture_diagram_url: url,
        updated_at: new Date().toISOString(),
      }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Patch failed for ${slug}: ${res.status} ${text}`);
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`No row updated for slug=${slug}`);
  }
  return data[0];
}

console.log(`\n=== Architecture diagram pipeline · ${DEMOS.length} demos ===\n`);

for (const demo of DEMOS) {
  console.log(`▸ ${demo.slug}`);

  // 1. generate SVG
  const svg = renderSVG(demo);
  const svgPath = path.join(OUT_DIR, `${demo.slug}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`   svg  · ${(svg.length / 1024).toFixed(1)} KB · ${svgPath}`);

  // 2. render PNG @ 2x (3200×2000) using sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(3200, 2000, { fit: 'contain', background: { r: 250, g: 247, b: 242, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const pngPath = path.join(OUT_DIR, `${demo.slug}.png`);
  fs.writeFileSync(pngPath, pngBuffer);
  console.log(`   png  · ${(pngBuffer.length / 1024).toFixed(1)} KB · ${pngPath}`);

  // 3. upload to Supabase Storage
  const publicUrl = await uploadPng(demo.slug, pngBuffer);
  console.log(`   url  · ${publicUrl}`);

  // 4. patch both customer + partner rows
  for (const pairSlug of demo.pairSlugs) {
    const row = await patchDemo(pairSlug, publicUrl);
    console.log(`   ✓ patched  ${pairSlug.padEnd(35)}`);
  }
  console.log('');
}

console.log('=== Done ===');
