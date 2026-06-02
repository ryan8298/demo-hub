/**
 * Industry-specific Embedded Agent Pilot one-pagers.
 *
 * The full PDFs live in Supabase Storage (uploaded via the storage API to
 * deterministic, upserted paths) so these public URLs stay stable. Clicking a
 * link opens the PDF inline in the browser (served as application/pdf), the
 * same as any PDF link online.
 *
 * Shared framing across all five (from the one-pagers themselves):
 *   60 days · one workflow · one operational KPI · $75K–$150K fixed-price.
 */

function onePagerUrl(slug: string): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  if (!base) return "";
  return `${base}/storage/v1/object/public/demo-assets/one-pagers/echelix-embedded-agent-pilot-${slug}.pdf`;
}

export const ONE_PAGER_SUMMARY = "60 days · one workflow · one KPI · $75K–$150K fixed price";

export interface OnePager {
  slug: string;
  industry: string;
  blurb: string;
  useCases: string[];
  pdfUrl: string;
}

export const ONE_PAGERS: OnePager[] = [
  {
    slug: "manufacturing",
    industry: "Manufacturing",
    blurb:
      "Ship one production-grade agentic workflow on the plant floor — measured against a KPI you choose.",
    useCases: [
      "Predictive maintenance & downtime",
      "Quality, scrap & defect reduction",
      "Frontline knowledge agent",
      "Root-cause analysis",
    ],
    pdfUrl: onePagerUrl("manufacturing"),
  },
  {
    slug: "oil-gas-energy",
    industry: "Oil, Gas & Energy",
    blurb:
      "Put an agent team on asset reliability and field operations — a fixed-fee pilot on one high-value workflow.",
    useCases: [
      "Predictive maintenance & asset reliability",
      "Pipeline integrity & leak detection",
      "Field & technician copilots",
      "Production optimization & forecasting",
    ],
    pdfUrl: onePagerUrl("oil-gas-energy"),
  },
  {
    slug: "utilities",
    industry: "Utilities",
    blurb:
      "Pilot agentic workflows for grid reliability and customer operations — proven on one KPI before you scale.",
    useCases: [
      "Outage prediction & prevention",
      "Storm response & crew optimization",
      "Load forecasting & demand management",
      "Asset health & predictive maintenance",
    ],
    pdfUrl: onePagerUrl("utilities"),
  },
  {
    slug: "financial-services",
    industry: "Financial Services",
    blurb:
      "Stand up one agentic workflow against a real risk, service, or compliance problem — outcome-based, fast.",
    useCases: [
      "Fraud detection & transaction monitoring",
      "Credit risk & underwriting automation",
      "Customer 360 & relationship intelligence",
      "Regulatory compliance & reporting",
    ],
    pdfUrl: onePagerUrl("financial-services"),
  },
  {
    slug: "distribution-logistics",
    industry: "Distribution & Transportation",
    blurb:
      "Embed an agent team in delivery, warehouse, or field operations — one workflow, one measurable result.",
    useCases: [
      "Delivery planning & route optimization",
      "Real-time visibility & exception management",
      "Warehouse & DC operations",
      "Demand forecasting & capacity planning",
    ],
    pdfUrl: onePagerUrl("distribution-logistics"),
  },
];
