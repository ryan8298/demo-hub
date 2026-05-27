-- =============================================================================
--  ACR rationale — schema + backfill for all 9 partner tiles.
--
--  Paste this entire block into the Supabase SQL editor and Run.
--  Idempotent: re-running just no-ops on the column add and re-applies the
--  same backfill text.
-- =============================================================================

-- 1. Schema
ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS acr_breakdown TEXT;

-- 2. Backfill — one rationale per partner tile
UPDATE public.demos SET acr_breakdown =
  'Sized for a midstream operator monitoring ~47 compressor/pipeline assets at 1,247 events/sec, 24/7. Dominant Azure consumption: IoT Hub Standard S2 (~$30K/yr) for sensor ingest, Microsoft Fabric RTI capacity F32–F64 (~$60–120K/yr) for stream processing, Azure AI Foundry anomaly inference, ADLS Gen2 telemetry archive, and Dynamics 365 Field Service work-order automation. Excludes pre-existing M365/D365 base licensing — counts incremental Azure spend only.'
WHERE slug = 'iron-scout-rti-partner';

UPDATE public.demos SET acr_breakdown =
  'Sized for a $50M–$500M CPG brand running 3 AI agents (demand sensing, supplier risk, deduction recovery). Dominant Azure consumption: Microsoft Fabric F32 for retailer + supplier data unification, Azure Data Factory pipelines for EDI 856 + POS ingest, Azure OpenAI (mixed GPT-4o + 4o-mini to control inference cost), Azure Service Bus, and Power Automate premium connectors. D365 Supply Chain seats counted separately if net-new.'
WHERE slug = 'chainiq-partner';

UPDATE public.demos SET acr_breakdown =
  'Sized for a multi-specialty group (50–200 physicians) processing 60K+ prior-auths/year. Dominant Azure consumption: Azure Health Data Services tiered (FHIR R4 ingest from EHR), Azure API Management for routing across 900+ payer portals, Azure OpenAI for auth packet drafting + appeal narratives, Azure AI Search index over payer policy corpus, Microsoft Fabric for clinical + admin data joins, and Copilot Studio for the orchestration layer.'
WHERE slug = 'clearpath-ai-partner';

UPDATE public.demos SET acr_breakdown =
  'Sized for a 50-attorney firm anchored by M365 E3→E5 + Copilot seat upsell (~$78K/yr at 100 users). Additional Azure spend: Azure OpenAI for matter intelligence + contract review (with caching and mixed model tiers to control cost), Azure AI Search index over the firm corpus, Copilot Studio orchestration, and Power Automate premium. Fastest ACR-to-revenue ratio in the portfolio (4:1) — most spend lands on M365 seats the firm already has a budget line for.'
WHERE slug = 'counsel-iq-partner';

UPDATE public.demos SET acr_breakdown =
  'Sized for a midstream/upstream operator running ~94 deliveries/day across ~12 pad sites. Dominant Azure consumption: Azure AI Vision per-image transactions (object identification + counting), Azure OpenAI multi-modal for PO reconciliation, Power Apps premium field licenses (~50 users), incremental D365 Supply Chain seats, and image storage for chain-of-custody. Lower than streaming use cases because workloads are event-driven, not 24/7.'
WHERE slug = 'deliveriq-partner';

UPDATE public.demos SET acr_breakdown =
  'Sized for a community bank ($500M–$5B AUM). Dominant Azure consumption: Microsoft Fabric for transaction + KYC data joins (heavy lift — 5–7 source systems unified), Azure OpenAI for SAR narrative generation and loan-document underwriting, Microsoft Purview for lineage + classification (required for examiner-ready audit trails), Copilot Studio for AML case orchestration, and M365 Copilot seat upsell for compliance + lending teams. Excludes core banking system licensing.'
WHERE slug = 'finshield-ai-partner';

UPDATE public.demos SET acr_breakdown =
  'Sized for a mid-market manufacturer (1–5 production lines, ~400 sensors total) running predictive maintenance + quality + frontline knowledge agents. Dominant Azure consumption: IoT Hub Standard S2 (~$30K/yr) for sensor ingest, Azure AI Foundry models per asset type ($50–80K/yr), Microsoft Fabric historian for telemetry + maintenance data joins, Azure OpenAI for the frontline knowledge agent (captures retiring-tech expertise + serves it via Teams), and D365 Field Service for technician dispatch.'
WHERE slug = 'forge-ai-partner';

UPDATE public.demos SET acr_breakdown =
  'Sized for a midstream operator with 4 cycles + 11 counterparties + modest nomination throughput (~7 re-noms/day). Dominant Azure consumption: Microsoft Fabric RTI capacity (lighter than Iron Scout — nominations only, not full asset telemetry), Azure Event Hub for shipper feeds, Azure OpenAI for variance detection + NAESB-compliant re-nom drafting, Copilot Studio for shipper coordination workflow, and Dynamics 365 customer-service seats for desk coordination.'
WHERE slug = 'nomagent-partner';

UPDATE public.demos SET acr_breakdown =
  'Sized for a single O&G site capturing ~10K safety reports/year via conversational interface. Dominant Azure consumption: Copilot Studio messages (multi-turn safety conversations average 8–12 messages each), Azure AI Language for OSHA classification + entity extraction, Azure OpenAI for clarifying questions + narrative drafting, Power Automate for the corrective-action loop, Power BI Premium for HSE manager dashboards, and modest Speech-to-Text for voice capture. Lowest in the portfolio because conversation-driven workloads have a small compute footprint vs. streaming or transactional use cases.'
WHERE slug = 'safesignal-partner';
