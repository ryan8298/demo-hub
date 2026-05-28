// =============================================================================
//  Architecture diagram pipeline · v3 foundation pattern
//
//  Each diagram shows:
//    • The application (agents + workload-specific Azure services + user
//      surfaces + event sources + integrated business app) in the upper
//      ~70% of the canvas — the visual focus.
//    • Echelix Lattice as a foundation slab in the lower band — present
//      and substantive, but not dominant. Lattice's six core capability
//      areas (per the sales deck slide 4) sit inside the band as dark chips.
//
//  Pipeline:
//   1. Generate SVG from per-demo config
//   2. Render PNG @ 3200×2000 via sharp
//   3. Upload PNG to Supabase Storage (demo-assets/architecture/…)
//   4. PATCH both customer + partner demo rows
//
//  Run:  node scripts/gen-arch-diagrams.mjs
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// --- env loader ---
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

// =============================================================================
//  LATTICE CAPABILITY AREAS — static across all 10 demos.
//  Verbatim from sales deck slide 4 ("What You Get — Six Core Capability Areas").
// =============================================================================

const LATTICE_CAPABILITIES = [
  { title: 'Secure Networking',  lines: ['Private VNet · WAF',         'Zero-Trust posture',         'Private DNS · VPN'] },
  { title: 'AKS Compute',         lines: ['auto-scaling Kubernetes',   'managed identities',         'NGINX or Istio mesh'] },
  { title: 'AI Services Stack',   lines: ['Azure OpenAI',              'AI Search (RAG)',            'Form Recognizer · custom models'] },
  { title: 'Agent Messaging',     lines: ['Service Bus (9 channels)',  'Web PubSub state sync',      'consensus + workflow'] },
  { title: 'Security & Identity', lines: ['Key Vault · Managed IDs',   'OWASP compliance',           'TLS 1.2+ enforced'] },
  { title: 'Monitoring',          lines: ['App Insights · Log Analytics', 'Container Insights',      'APIM diagnostics'] },
];

// =============================================================================
//  PER-DEMO CONFIGS
// =============================================================================

const DEMOS = [
  {
    slug: 'iron-scout-rti',
    pairSlugs: ['iron-scout-rti', 'iron-scout-rti-partner'],
    title: 'Iron Scout RTI',
    subtitle: 'REAL-TIME MIDSTREAM OPERATIONS INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Permian Basin · 47 monitored assets',
    userLayer: [
      { title: 'Operator Control Room', desc: 'mission-control wall display', kicker: 'WEB · DESKTOP' },
      { title: 'Field Tech Mobile',     desc: 'ruggedized tablet · in-field', kicker: 'iOS · ANDROID' },
      { title: 'Microsoft Teams',       desc: 'work-order alerts · acknowledgment', kicker: 'M365' },
      { title: 'Shift Handoff Digest',  desc: 'Outlook · email summary', kicker: 'M365' },
    ],
    agents: [
      { title: 'ANOMALY DETECTION AGENT', lines: ['monitors 47 assets · 1,247 events/sec', 'detects bearing harmonics, pressure', 'drift, flow variance · 4-min latency'] },
      { title: 'WORK ORDER DISPATCH AGENT', lines: ['drafts WO with AI rationale, parts', 'list, cost estimate · routes to crew', 'via D365 Field Service + Teams'] },
      { title: 'CREW COORDINATION AGENT', lines: ['routes crew assignments · captures', 'acknowledgment + sign-off · closes', 'loop on MTTR + cost actuals'] },
    ],
    workloadServices: [
      { title: 'Azure AI Foundry',     lines: ['custom anomaly detection models',  'edge inference'],         cat: 'ai' },
      { title: 'Azure OpenAI',         lines: ['rationale generation · WO drafting','gpt-4o + 4o-mini mixed tier'], cat: 'ai' },
      { title: 'Azure IoT Hub S2',     lines: ['sensor ingest · 47 assets',         '1,247 events/sec capacity'], cat: 'data' },
      { title: 'Microsoft Fabric RTI', lines: ['F32–F64 capacity · stream proc.',   'KQL real-time queries'],  cat: 'data' },
      { title: 'ADLS Gen2',            lines: ['telemetry archive',                 'long-retention storage'], cat: 'data' },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Field Service', desc: 'work order lifecycle · external M365 SaaS' },
    eventSources: [
      { title: '47 Compressor + Pipeline Assets · Permian Basin', desc: 'vibration · discharge pressure · temperature · flow · gas composition' },
      { title: 'OSIsoft PI Historian  ·  legacy SCADA integration', desc: 'backfill · historical replay · cross-system audit trail' },
    ],
    footerRight: 'Iron Scout RTI · System Architecture',
  },

  {
    slug: 'chainiq',
    pairSlugs: ['chainiq', 'chainiq-partner'],
    title: 'ChainIQ',
    subtitle: 'AGENTIC SUPPLY CHAIN INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'CPG · multi-retailer scope',
    userLayer: [
      { title: 'Planner Cockpit',       desc: 'overnight decision review',      kicker: 'WEB' },
      { title: 'Microsoft Teams',       desc: 'decision alerts · approvals',    kicker: 'M365' },
      { title: 'Outlook',               desc: 'overnight summary digest',       kicker: 'M365' },
      { title: 'Power BI',              desc: 'executive supply chain views',   kicker: 'M365' },
    ],
    agents: [
      { title: 'DEMAND SENSING AGENT',     lines: ['monitors POS + EDI 856 across',    'top retailers · reconciles forecasts', 'against actuals in real time'] },
      { title: 'SUPPLIER RISK AGENT',      lines: ['continuous monitoring of tier-1',  'through tier-3 suppliers · weather,',  'logistics, commodity signals'] },
      { title: 'DEDUCTION RECOVERY AGENT', lines: ['adjudicates retailer chargebacks', 'against contract terms, OS&D',         'records, trade-promo schedules'] },
    ],
    workloadServices: [
      { title: 'Azure OpenAI',       lines: ['decision rationale ·',         'dispute drafting'],          cat: 'ai' },
      { title: 'Azure AI Search',    lines: ['retailer + supplier',          'knowledge retrieval'],       cat: 'ai' },
      { title: 'Microsoft Fabric',   lines: ['POS + EDI 856 unification',    'across retailer feeds'],     cat: 'data' },
      { title: 'Azure Data Factory', lines: ['EDI 856 + POS pipelines',      'orchestration'],             cat: 'data' },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Supply Chain', desc: 'order · replenishment · AR' },
    eventSources: [
      { title: 'Retailer POS + EDI 856 Feeds', desc: 'Walmart Retail Link · Target Vendor Portal · Kroger · Albertsons · HEB · Publix · Costco · Sams Club' },
      { title: 'Supplier Risk Intelligence',   desc: 'weather forecasts · port congestion · commodity prices · supplier financial signals' },
    ],
    footerRight: 'ChainIQ · System Architecture',
  },

  {
    slug: 'clearpath-ai',
    pairSlugs: ['clearpath-ai', 'clearpath-ai-partner'],
    title: 'ClearPath AI',
    subtitle: 'AUTONOMOUS PRIOR AUTHORIZATION  ·  SYSTEM ARCHITECTURE',
    topRight: 'Multi-specialty · 60K+ auths/yr',
    userLayer: [
      { title: 'Specialist Inbox',  desc: 'triple-pane case workspace',     kicker: 'WEB' },
      { title: 'Microsoft Teams',   desc: 'escalation channel · MD review', kicker: 'M365' },
      { title: 'Outlook',           desc: 'denial summary · daily digest',  kicker: 'M365' },
      { title: 'Power BI',          desc: 'RCM + denial trend dashboards',  kicker: 'M365' },
    ],
    agents: [
      { title: 'PRIOR AUTH DRAFTING AGENT', lines: ['extracts clinical evidence from',   'chart notes · assembles auth packet', 'per payer-specific medical policy'] },
      { title: 'SUBMISSION ROUTING AGENT',  lines: ['routes auth to correct payer',      'across 900+ commercial, Medicare,',   'and Medicaid portals'] },
      { title: 'APPEAL DRAFTING AGENT',     lines: ['drafts denial appeals citing',      'payer medical policy + clinical',     'precedent · tracks decisions'] },
    ],
    workloadServices: [
      { title: 'Azure OpenAI',              lines: ['auth packet drafting',     'appeal narrative gen'],     cat: 'ai' },
      { title: 'Azure AI Search',           lines: ['payer medical policy',     'semantic retrieval'],       cat: 'ai' },
      { title: 'Azure Health Data Services', lines: ['FHIR R4 ingest from EHRs', 'clinical context'],         cat: 'data' },
      { title: 'Azure API Management',      lines: ['900+ payer portal routing','submission + status polling'], cat: 'data' },
      { title: 'Microsoft Fabric',          lines: ['clinical + admin joins',   'denial pattern analytics'], cat: 'data' },
    ],
    businessApp: { title: 'Copilot Studio', titleLine2: '+ Power Automate', desc: 'orchestration + corrective workflow' },
    eventSources: [
      { title: 'EHR Systems (FHIR R4 ingest)',  desc: 'Epic · Cerner · Athenahealth · eClinicalWorks · NextGen — chart notes, diagnoses, CPT codes' },
      { title: 'Payer Portals (900+ supported)', desc: 'commercial · Medicare · Medicaid · auth submission, status polling, denial retrieval' },
    ],
    footerRight: 'ClearPath AI · System Architecture',
  },

  {
    slug: 'counsel-iq',
    pairSlugs: ['counsel-iq', 'counsel-iq-partner'],
    title: 'Counsel IQ',
    subtitle: 'MATTER & BILLING INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Law firm · M365 native',
    userLayer: [
      { title: 'Matter Workspace',  desc: 'matter folio · firm-wide',          kicker: 'WEB' },
      { title: 'Word + Copilot',    desc: 'drafting · clause comparison',      kicker: 'M365' },
      { title: 'Outlook',           desc: 'matter inbox · time-entry capture', kicker: 'M365' },
      { title: 'Microsoft Teams',   desc: 'matter coordination · co-counsel',  kicker: 'M365' },
    ],
    agents: [
      { title: 'MATTER INTELLIGENCE AGENT', lines: ['surfaces relevant documents,',   'summarizes filings, drafts research', 'memos against firm corpus'] },
      { title: 'TIME ENTRY CAPTURE AGENT',  lines: ['captures billable activity from','Outlook, Teams, Word, Excel ·',       'drafts narratives for review'] },
      { title: 'CONTRACT REVIEW AGENT',     lines: ['flags risk clauses · suggests',  'redlines · compares against firm',    'precedent + market standards'] },
    ],
    workloadServices: [
      { title: 'Azure OpenAI',      lines: ['drafting · summarization',  'narrative generation'],     cat: 'ai' },
      { title: 'Azure AI Search',   lines: ['firm corpus · institutional','memory retrieval'],         cat: 'ai' },
      { title: 'Microsoft Graph',   lines: ['M365 activity ingestion',   'Outlook, Teams, Word'],     cat: 'data' },
      { title: 'SharePoint Online', lines: ['firm document library',     'matter file repository'],   cat: 'data' },
      { title: 'Microsoft Fabric',  lines: ['matter analytics · WIP,',   'realization, utilization'], cat: 'data' },
    ],
    businessApp: { title: 'Microsoft 365', titleLine2: '+ Copilot', desc: 'firm-wide productivity · external M365 SaaS' },
    eventSources: [
      { title: 'M365 Activity Stream',     desc: 'Outlook email · Teams calls + chat · Word + Excel docs · calendar — captures billable activity automatically' },
      { title: 'Document Repositories',    desc: 'NetDocuments · iManage · DMS connectors — matter files, prior work product, firm precedent library' },
    ],
    footerRight: 'Counsel IQ · System Architecture',
  },

  {
    slug: 'deliveriq',
    pairSlugs: ['deliveriq', 'deliveriq-partner'],
    title: 'DeliverIQ',
    subtitle: 'AI MATERIAL VERIFICATION  ·  SYSTEM ARCHITECTURE',
    topRight: 'O&G · field receiving',
    userLayer: [
      { title: 'Field Capture',            desc: 'mobile tablet · camera capture', kicker: 'iOS · ANDROID' },
      { title: 'Materials Manager Console', desc: 'review queue · drilldowns',     kicker: 'WEB' },
      { title: 'Microsoft Teams',          desc: 'driver notifications · alerts',  kicker: 'M365' },
      { title: 'Power BI',                 desc: 'procurement + AP dashboards',    kicker: 'M365' },
    ],
    agents: [
      { title: 'ITEM DETECTION AGENT',         lines: ['computer-vision identification',  'and counting of delivered items',    'from captured tablet frames'] },
      { title: 'PO RECONCILIATION AGENT',      lines: ['matches detected items to PO',    'line items · flags shortages,',      'missing items, wrong-spec parts'] },
      { title: 'DISCREPANCY RESOLUTION AGENT', lines: ['opens vendor tickets · drafts',   'communications · tracks resolution', 'and credits / re-deliveries'] },
    ],
    workloadServices: [
      { title: 'Azure AI Vision',   lines: ['object detection + counting','per-image transactions'],    cat: 'ai' },
      { title: 'Azure OpenAI',      lines: ['multi-modal PO reconciliation','vendor comm drafting'],   cat: 'ai' },
      { title: 'Azure Blob Storage', lines: ['image archive · chain-of-',  'custody evidence'],          cat: 'data' },
      { title: 'Microsoft Fabric',  lines: ['delivery + PO + vendor',     'unification'],               cat: 'data' },
      { title: 'Power Automate',    lines: ['discrepancy workflow',       'corrective action loop'],    cat: 'integration' },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Supply Chain', desc: 'PO + AP reconciliation' },
    eventSources: [
      { title: 'Field Tablet Captures (ruggedized)', desc: 'iOS / Android camera frames · driver BOL · chain-of-custody signature · pad-site GPS' },
      { title: 'Purchase Order System + Vendor Data', desc: 'PO line items · expected delivery windows · vendor BOL feeds · driver manifests' },
    ],
    footerRight: 'DeliverIQ · System Architecture',
  },

  {
    slug: 'finshield-ai',
    pairSlugs: ['finshield-ai', 'finshield-ai-partner'],
    title: 'FinShield AI',
    subtitle: 'AML & LOAN INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Community bank · BSA / AML',
    userLayer: [
      { title: 'Investigator Workstation', desc: 'case workspace · entity graph', kicker: 'WEB' },
      { title: 'MLRO Review Portal',       desc: 'SAR approval · escalation',     kicker: 'WEB' },
      { title: 'Microsoft Teams',          desc: 'escalation channel · co-review', kicker: 'M365' },
      { title: 'Outlook',                  desc: 'FinCEN deadline alerts',        kicker: 'M365' },
    ],
    agents: [
      { title: 'AML DETECTION AGENT',     lines: ['monitors transactions for',   'structuring, velocity anomalies,',  'sanctions hits, shell indicators'] },
      { title: 'KYC REFRESH AGENT',       lines: ['continuous beneficial-owner', 'scan · PEP screening · watch-',     'list + sanctions list checks'] },
      { title: 'LOAN UNDERWRITING AGENT', lines: ['extracts financials · runs OFAC','+ credit screens · generates',   'decision rationale + packet'] },
    ],
    workloadServices: [
      { title: 'Azure OpenAI',      lines: ['SAR narrative · loan doc',  'underwriting · review summ.'],  cat: 'ai' },
      { title: 'Azure AI Search',   lines: ['regulatory corpus',         'entity graph retrieval'],        cat: 'ai' },
      { title: 'Microsoft Fabric',  lines: ['transaction + KYC join',    '5–7 source systems'],            cat: 'data' },
      { title: 'Microsoft Purview', lines: ['lineage + classification',  'examiner-ready audit'],          cat: 'data' },
      { title: 'Copilot Studio',    lines: ['case orchestration',        'reviewer routing'],              cat: 'integration' },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Finance', desc: 'case + loan workflow' },
    eventSources: [
      { title: 'Core Banking Systems',                 desc: 'transactions · accounts · KYC documents · beneficial ownership records · loan application data' },
      { title: 'External Watchlists + Regulatory Feeds', desc: 'OFAC SDN · PEP databases · FinCEN advisories · sanctions lists · adverse media' },
    ],
    footerRight: 'FinShield AI · System Architecture',
  },

  {
    slug: 'forge-ai',
    pairSlugs: ['forge-ai', 'forge-ai-partner'],
    title: 'Forge AI',
    subtitle: 'PLANT FLOOR INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Mid-market mfg · 400 sensors',
    userLayer: [
      { title: 'Andon Wall Display',     desc: '50" wall-mounted · shift view',     kicker: 'WEB' },
      { title: 'Maintenance Tech Mobile', desc: 'tablet · in-shop · machine-side',  kicker: 'iOS · ANDROID' },
      { title: 'Microsoft Teams',         desc: 'WO alerts · knowledge chat',       kicker: 'M365' },
      { title: 'Power BI',                desc: 'plant manager dashboards',         kicker: 'M365' },
    ],
    agents: [
      { title: 'PREDICTIVE MAINTENANCE AGENT', lines: ['vibration, temperature, current','draw anomaly detection · predicts','failures 4–24h ahead of event'] },
      { title: 'QUALITY AGENT',                lines: ['dimensional drift detection from','CMM data · flags parts · suggests','CNC offset adjustments inline'] },
      { title: 'FRONTLINE KNOWLEDGE AGENT',    lines: ['captured tribal knowledge served','via Teams · multi-turn machine-','specific Q&A · captures new fixes'] },
    ],
    workloadServices: [
      { title: 'Azure AI Foundry', lines: ['predictive models per',  'asset type · edge inference'],     cat: 'ai' },
      { title: 'Azure OpenAI',     lines: ['knowledge agent · WO',   'narrative · capture-from-convo'],  cat: 'ai' },
      { title: 'Azure IoT Hub',    lines: ['sensor ingest · 400',    'sensors per line'],                 cat: 'data' },
      { title: 'Microsoft Fabric', lines: ['historian + maintenance','data joins · OEE analytics'],       cat: 'data' },
      { title: 'ADLS Gen2',        lines: ['telemetry archive · long-','retention training data'],        cat: 'data' },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Field Service', desc: 'technician dispatch' },
    eventSources: [
      { title: 'Production Line Sensors (~400 per line)', desc: 'vibration · temperature · current draw · spindle speed · cycle time across CNC, milling, drilling stations' },
      { title: 'Inspection Equipment + Historian',        desc: 'Zeiss CMM · in-line gauges · part barcode scans · OSIsoft PI / Wonderware historian feeds' },
    ],
    footerRight: 'Forge AI · System Architecture',
  },

  {
    slug: 'nomagent',
    pairSlugs: ['nomagent', 'nomagent-partner'],
    title: 'NomAgent',
    subtitle: 'AGENTIC PIPELINE SCHEDULING  ·  SYSTEM ARCHITECTURE',
    topRight: 'Midstream · 11 shippers · 4 cycles',
    userLayer: [
      { title: 'Scheduling Board',      desc: 'cycle clock · variance grid',   kicker: 'WEB' },
      { title: 'Commercial Dashboard',  desc: 'counterparty exposure · margin', kicker: 'WEB' },
      { title: 'Microsoft Teams',       desc: 'shipper coordination · co-noms', kicker: 'M365' },
      { title: 'Outlook',               desc: 'cycle confirmations · NAESB digest', kicker: 'M365' },
    ],
    agents: [
      { title: 'VARIANCE DETECTION AGENT',     lines: ['monitors actual vs. confirmed',  'nominations across 4 NAESB cycles', '· surfaces drift within window'] },
      { title: 'RE-NOMINATION DRAFTING AGENT', lines: ['drafts NAESB-compliant re-noms', 'with regulatory-tone rationale ·',  '94% confidence average'] },
      { title: 'SHIPPER COORDINATION AGENT',   lines: ['auto-responds to shipper queries','drafts confirmations · tracks',     'counterparty exposure + margin'] },
    ],
    workloadServices: [
      { title: 'Azure OpenAI',         lines: ['variance analysis ·',     'NAESB-compliant re-nom drafting'], cat: 'ai' },
      { title: 'Copilot Studio',       lines: ['shipper coordination',    'workflow orchestration'],          cat: 'integration' },
      { title: 'Microsoft Fabric RTI', lines: ['nominations + flow data', 'real-time stream processing'],      cat: 'data' },
      { title: 'Azure Event Hub',      lines: ['shipper feeds · EDI',     'exchange ingestion'],               cat: 'data' },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: 'Customer Service', desc: 'shipper desk coordination' },
    eventSources: [
      { title: 'NAESB EDI Exchanges (11 shipper counterparties)', desc: 'nominations · confirmations · re-noms · imbalance reports across Timely, Evening, ID-1, ID-2 cycles' },
      { title: 'Pipeline SCADA + Interconnect Flow Data',         desc: 'real-time flow measurements · interconnect capacity · Waha, Agua Dulce, El Paso hub data' },
    ],
    footerRight: 'NomAgent · System Architecture',
  },

  {
    slug: 'ratecase-navigator',
    pairSlugs: ['ratecase-navigator', 'ratecase-navigator-partner'],
    title: 'RateCase Navigator',
    subtitle: 'REGULATORY AFFAIRS INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'Utilities · IOU regulatory affairs',
    userLayer: [
      { title: 'Docket Workspace',  desc: 'proceeding folio · commitments', kicker: 'WEB' },
      { title: 'Word + Copilot',    desc: 'testimony drafting · briefs',    kicker: 'M365' },
      { title: 'Outlook',           desc: 'regulatory inbox · DR responses', kicker: 'M365' },
      { title: 'Microsoft Teams',   desc: 'witness + SME coordination',     kicker: 'M365' },
    ],
    agents: [
      { title: 'DISCOVERY RESPONSE AGENT',  lines: ['drafts intervenor data request',   'responses citing testimony +',     'workpapers · pre-filled in Word'] },
      { title: 'COMMITMENT TRACKING AGENT', lines: ['captures commitments from',        'transcripts, Teams, email · tracks','status to closure with reminders'] },
      { title: 'FILING ASSEMBLY AGENT',     lines: ['assembles filings against',        'procedural schedules · surfaces',  'deadline risk + dependencies'] },
    ],
    workloadServices: [
      { title: 'Azure OpenAI',      lines: ['drafting · summarization',     'witness Q&A prep'],          cat: 'ai' },
      { title: 'Azure AI Search',   lines: ['regulatory corpus · testimony,','workpaper, order retrieval'], cat: 'ai' },
      { title: 'Microsoft Graph',   lines: ['M365 activity ingestion ·',    'email, Teams, calendars'],    cat: 'data' },
      { title: 'SharePoint Online', lines: ['12,400+ document corpus',      'filing repository'],          cat: 'data' },
      { title: 'Microsoft Fabric',  lines: ['proceeding analytics · DR',    'aging · commitment status'],  cat: 'data' },
    ],
    businessApp: { title: 'Microsoft 365', titleLine2: '+ Copilot', desc: 'docket workspace · external M365 SaaS' },
    eventSources: [
      { title: 'Filings, Orders, Testimony Transcripts', desc: 'PUC dockets · intervenor filings · commission orders · transcripts · workpapers · prior-case archive' },
      { title: 'Witness + SME Activity',                 desc: 'Teams conversations · email archives · captured commitments · calendar entries · workpaper edits' },
    ],
    footerRight: 'RateCase Navigator · System Architecture',
  },

  {
    slug: 'safesignal',
    pairSlugs: ['safesignal', 'safesignal-partner'],
    title: 'SafeSignal',
    subtitle: 'CONVERSATIONAL SAFETY INTELLIGENCE  ·  SYSTEM ARCHITECTURE',
    topRight: 'O&G · HSE field + manager',
    userLayer: [
      { title: 'Field Worker Chat',   desc: 'mobile · Teams · 60-sec capture',  kicker: 'iOS · ANDROID · M365' },
      { title: 'HSE Manager Dashboard', desc: 'site heatmap · trends',          kicker: 'WEB' },
      { title: 'Microsoft Teams',     desc: 'alerts · handoff · co-review',     kicker: 'M365' },
      { title: 'Power BI',            desc: 'HSE executive views · scorecards', kicker: 'M365' },
    ],
    agents: [
      { title: 'CONVERSATIONAL CAPTURE AGENT', lines: ['multi-turn near-miss + incident',  'conversations · clarifying Qs ·',  'auto-classifies hazard type'] },
      { title: 'OSHA CLASSIFICATION AGENT',    lines: ['maps reports to 29 CFR standards', 'flags Tier-1 incidents · routes',  'to corrective action workflow'] },
      { title: 'CORRECTIVE ACTION AGENT',      lines: ['drafts corrective action plans',   'routes to responsible parties ·',  'tracks closure + verification'] },
    ],
    workloadServices: [
      { title: 'Copilot Studio',            lines: ['multi-turn safety conversations','in Teams + mobile'],           cat: 'integration' },
      { title: 'Azure OpenAI',              lines: ['clarifying questions · OSHA',   'classification · narrative'],   cat: 'ai' },
      { title: 'Azure AI Language',         lines: ['entity extraction ·',           'OSHA code mapping'],             cat: 'ai' },
      { title: 'Microsoft Fabric',          lines: ['incident + corrective action',  'data · trend analytics'],       cat: 'data' },
      { title: 'Azure Data Lake Storage',   lines: ['long-retention audit data',     'witness statements · photos'],  cat: 'data' },
    ],
    businessApp: { title: 'Dynamics 365', titleLine2: '+ Power Automate', desc: 'HSE case workflow' },
    eventSources: [
      { title: 'Field Worker Reports (text + voice)', desc: 'Teams chat · mobile voice capture · in-the-moment near-miss + incident descriptions from frontline workers' },
      { title: 'Incident Documentation',              desc: 'photos · witness statements · pad-site GPS · timestamp + shift metadata · attached evidence files' },
    ],
    footerRight: 'SafeSignal · System Architecture',
  },
];

// =============================================================================
//  SVG GENERATOR  ·  v3 foundation pattern
// =============================================================================

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const CAT_COLORS = {
  ai:          '#0078D4',
  data:        '#5C6BC0',
  integration: '#2E7D32',
};

function renderSVG(c) {
  // -- USER LAYER (4 cards fixed) --
  const userCards = c.userLayer.map((u, i) => {
    const x = 200 + i * 280;
    return `
      <rect x="${x}" y="148" width="240" height="76" rx="6" fill="#FFFFFF" stroke="#1A2B4A" stroke-width="1.5"/>
      <text x="${x + 120}" y="174" text-anchor="middle" font-size="13" font-weight="600" fill="#1A2B4A">${esc(u.title)}</text>
      <text x="${x + 120}" y="192" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(u.desc)}</text>
      <text x="${x + 120}" y="210" text-anchor="middle" font-size="9" fill="#9AA5B1" letter-spacing="0.5">${esc(u.kicker)}</text>`;
  }).join('');

  // User → Agents connectors (fan in)
  const userConn = [320, 600, 880, 1160].map((sx, i) => {
    const targets = [380, 660, 940, 1100];
    return `<path d="M ${sx} 224 L ${sx} 248 L ${targets[i]} 248 L ${targets[i]} 280"/>`;
  }).join('');

  // -- AGENTS (3 prominent cards) --
  // x positions: 200, 540, 880 (320 wide × 110 tall)
  const agentCards = c.agents.map((a, i) => {
    const x = 200 + i * 340;
    return `
      <rect x="${x}" y="282" width="320" height="110" rx="6" fill="#FFFFFF" stroke="#1A2B4A" stroke-width="2"/>
      <text x="${x + 160}" y="307" text-anchor="middle" font-size="13" font-weight="700" fill="#1A2B4A" letter-spacing="0.5">${esc(a.title)}</text>
      <text x="${x + 160}" y="333" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(a.lines[0])}</text>
      <text x="${x + 160}" y="352" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(a.lines[1])}</text>
      <text x="${x + 160}" y="371" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(a.lines[2])}</text>`;
  }).join('');

  // Agents → Workload Services connectors (3 down-arrows)
  const agentConn = [360, 700, 1040].map(x => `<path d="M ${x} 392 L ${x} 425"/>`).join('');

  // -- WORKLOAD SERVICES (4 or 5 cards) --
  const wsCount = c.workloadServices.length;
  // Available width 1280 (x=200 to x=1480). Gap=20.
  const wsWidth = Math.floor((1280 - (wsCount - 1) * 20) / wsCount);
  const wsCards = c.workloadServices.map((s, i) => {
    const x = 200 + i * (wsWidth + 20);
    const color = CAT_COLORS[s.cat] || '#6B5D4F';
    return `
      <rect x="${x}" y="430" width="${wsWidth}" height="76" rx="6" fill="#FFFFFF" stroke="${color}" stroke-width="1.5"/>
      <text x="${x + wsWidth/2}" y="455" text-anchor="middle" font-size="12" font-weight="700" fill="${color}">${esc(s.title)}</text>
      <text x="${x + wsWidth/2}" y="475" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(s.lines[0])}</text>
      <text x="${x + wsWidth/2}" y="491" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(s.lines[1])}</text>`;
  }).join('');

  // -- EVENT SOURCES (2 cards) --
  // Left card x=200, width=600. Right card x=820, width=660.
  const eventCards = `
    <rect x="200" y="552" width="600" height="68" rx="6" fill="#FFFFFF" stroke="#87A878" stroke-width="1.5"/>
    <text x="500" y="578" text-anchor="middle" font-size="13" font-weight="600" fill="#3D5A3F">${esc(c.eventSources[0].title)}</text>
    <text x="500" y="599" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(c.eventSources[0].desc)}</text>

    <rect x="820" y="552" width="660" height="68" rx="6" fill="#FFFFFF" stroke="#87A878" stroke-width="1.5"/>
    <text x="1150" y="578" text-anchor="middle" font-size="13" font-weight="600" fill="#3D5A3F">${esc(c.eventSources[1].title)}</text>
    <text x="1150" y="599" text-anchor="middle" font-size="11" fill="#6B5D4F">${esc(c.eventSources[1].desc)}</text>`;

  // Event sources → workload services connectors (dashed, fan in)
  const eventConn = `
    <path d="M 500 552 L 500 530 L 840 530 L 840 506"/>
    <path d="M 1150 552 L 1150 530 L 1100 530 L 1100 506"/>`;

  // -- LATTICE FOUNDATION BAND (static 6 capabilities) --
  // Band: y=675-895. Chips: y=780-870.
  // 6 chips horizontal: width=225, gap=8. Total 6*225 + 5*8 = 1390. Start at x=105.
  const capChips = LATTICE_CAPABILITIES.map((cap, i) => {
    const x = 105 + i * 233;
    return `
      <rect x="${x}" y="780" width="225" height="90" rx="4" fill="#FFFFFF" fill-opacity="0.08" stroke="#A8DADC" stroke-width="1"/>
      <text x="${x + 112}" y="803" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">${esc(cap.title)}</text>
      <text x="${x + 112}" y="822" text-anchor="middle" font-size="10" fill="#A8DADC">${esc(cap.lines[0])}</text>
      <text x="${x + 112}" y="837" text-anchor="middle" font-size="10" fill="#A8DADC">${esc(cap.lines[1])}</text>
      <text x="${x + 112}" y="852" text-anchor="middle" font-size="10" fill="#A8DADC">${esc(cap.lines[2])}</text>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif">
  <defs>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="0" dy="2" result="offset"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.10"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="latticeFoundation" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#1A2B4A"/>
      <stop offset="100%" stop-color="#2A3D60"/>
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
  <text x="80" y="58" font-family="Newsreader, Georgia, serif"
        font-size="38" font-weight="600" fill="#1A2B4A">${esc(c.title)}</text>
  <text x="80" y="86" font-size="14" fill="#6B5D4F" letter-spacing="0.5">${esc(c.subtitle)}</text>
  <line x1="80" y1="105" x2="1520" y2="105" stroke="#1A2B4A" stroke-width="1.5"/>
  <text x="1520" y="58" text-anchor="end" font-family="Newsreader, Georgia, serif"
        font-size="13" fill="#6B2C2C" font-style="italic">${esc(c.topRight)}</text>
  <text x="1520" y="78" text-anchor="end" font-size="10" fill="#6B5D4F" letter-spacing="0.8">
    BUILT ON ECHELIX LATTICE  ·  AZURE NATIVE
  </text>

  <!-- USER LAYER -->
  <text x="80" y="135" font-size="10" font-weight="700" letter-spacing="1.5" fill="#6B5D4F">USER LAYER</text>
  <g filter="url(#cardShadow)">${userCards}</g>
  <g stroke="#1A2B4A" stroke-width="1.5" fill="none" marker-end="url(#arrow)">${userConn}</g>

  <!-- AGENTS -->
  <text x="80" y="270" font-size="10" font-weight="700" letter-spacing="1.5" fill="#6B5D4F">AGENTS  ·  THE APPLICATION</text>
  <g filter="url(#cardShadow)">${agentCards}</g>

  <!-- BUSINESS APP (right of agents) -->
  <g filter="url(#cardShadow)">
    <rect x="1240" y="282" width="280" height="110" rx="6" fill="#FFFFFF" stroke="#D83B01" stroke-width="1.5"/>
    <text x="1380" y="304" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="1.5" fill="#D83B01">INTEGRATED BUSINESS APP</text>
    <text x="1380" y="332" text-anchor="middle" font-size="14" font-weight="700" fill="#D83B01">${esc(c.businessApp.title)}</text>
    <text x="1380" y="350" text-anchor="middle" font-size="14" font-weight="700" fill="#D83B01">${esc(c.businessApp.titleLine2)}</text>
    <text x="1380" y="372" text-anchor="middle" font-size="10" fill="#6B5D4F">${esc(c.businessApp.desc)}</text>
  </g>
  <g stroke="#D83B01" stroke-width="1.5" fill="none" marker-end="url(#arrow)" marker-start="url(#arrow)">
    <path d="M 1200 337 L 1240 337"/>
  </g>

  <!-- agents → workload services -->
  <g stroke="#1A2B4A" stroke-width="1.5" fill="none" marker-end="url(#arrow)">${agentConn}</g>

  <!-- WORKLOAD SERVICES -->
  <text x="80" y="418" font-size="10" font-weight="700" letter-spacing="1.5" fill="#6B5D4F">WORKLOAD SERVICES  ·  AZURE SERVICES THIS APPLICATION USES</text>
  <g filter="url(#cardShadow)">${wsCards}</g>

  <!-- EVENT SOURCES -->
  <text x="80" y="540" font-size="10" font-weight="700" letter-spacing="1.5" fill="#6B5D4F">EVENT SOURCES  ·  EXTERNAL SYSTEMS</text>
  <g filter="url(#cardShadow)">${eventCards}</g>
  <g stroke="#9AA5B1" stroke-width="1.5" fill="none" marker-end="url(#arrowMuted)" stroke-dasharray="5,3">${eventConn}</g>

  <!-- ECHELIX LATTICE FOUNDATION BAND -->
  <text x="800" y="658" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="2" fill="#6B5D4F">
    ▼  EVERYTHING ABOVE IS DEPLOYED ON THE LATTICE FOUNDATION  ▼
  </text>
  <rect x="80" y="675" width="1440" height="220" rx="10"
        fill="url(#latticeFoundation)" stroke="#0A1628" stroke-width="2"/>
  <text x="105" y="710" font-family="Newsreader, Georgia, serif"
        font-size="24" font-weight="600" fill="#FFFFFF">Echelix Lattice</text>
  <text x="290" y="710" font-size="13" fill="#A8DADC" font-style="italic">
    Azure Infrastructure Foundation
  </text>
  <text x="1500" y="710" text-anchor="end" font-size="11" fill="#A8DADC" letter-spacing="0.8">
    BICEP IaC  ·  2–4 WEEK DEPLOYMENT  ·  100% CODE-DEFINED
  </text>
  <text x="105" y="731" font-size="11" fill="#A8DADC" opacity="0.85">
    Provisions a secure, private Azure environment with security, governance, and AI-agent coordination built in from day one.
  </text>
  <line x1="105" y1="747" x2="1495" y2="747" stroke="#A8DADC" stroke-width="0.5" opacity="0.3"/>
  <text x="105" y="767" font-size="9" font-weight="700" letter-spacing="1.5" fill="#A8DADC" opacity="0.7">SIX CORE CAPABILITY AREAS  ·  PROVISIONED BY BICEP</text>
  ${capChips}

  <!-- FOOTER -->
  <line x1="80" y1="930" x2="1520" y2="930" stroke="#1A2B4A" stroke-width="0.5" opacity="0.2"/>
  <text x="80" y="955" font-size="10" fill="#6B5D4F" letter-spacing="0.4">
    The application above is deployed on Echelix Lattice — Lattice provisions the Azure environment via Bicep IaC.
  </text>
  <text x="80" y="975" font-size="10" fill="#6B5D4F" letter-spacing="0.4">
    Workload-specific services configure Lattice's core capability areas for this deployment.
  </text>
  <text x="1520" y="975" text-anchor="end" font-family="Newsreader, Georgia, serif"
        font-size="11" fill="#1A2B4A" font-style="italic">${esc(c.footerRight)}</text>
</svg>`;
}

// =============================================================================
//  PIPELINE
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

console.log(`\n=== Architecture diagram pipeline (v3 foundation pattern) · ${DEMOS.length} demos ===\n`);

for (const demo of DEMOS) {
  console.log(`▸ ${demo.slug}`);

  // 1. SVG
  const svg = renderSVG(demo);
  const svgPath = path.join(OUT_DIR, `${demo.slug}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`   svg  · ${(svg.length / 1024).toFixed(1)} KB`);

  // 2. PNG @ 2x
  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(3200, 2000, { fit: 'contain', background: { r: 250, g: 247, b: 242, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const pngPath = path.join(OUT_DIR, `${demo.slug}.png`);
  fs.writeFileSync(pngPath, pngBuffer);
  console.log(`   png  · ${(pngBuffer.length / 1024).toFixed(1)} KB`);

  // 3. Upload
  const publicUrl = await uploadPng(demo.slug, pngBuffer);

  // 4. Patch both rows
  for (const pairSlug of demo.pairSlugs) {
    await patchDemo(pairSlug, publicUrl);
    console.log(`   ✓ patched  ${pairSlug}`);
  }
  console.log('');
}

console.log('=== Done ===');
