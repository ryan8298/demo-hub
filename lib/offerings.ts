/**
 * Offerings shown on the public /offerings page.
 *
 * EDIT ME: only the Embedded Agent Pilot has a confirmed public figure
 * ($75K, from the sales deck). The infrastructure/build offerings are set to
 * "Custom" — replace `price`/`priceNote` with real figures if you want hard
 * numbers shown publicly.
 */

export type OfferingTimelineStep = { when: string; title: string };

export interface Offering {
  slug: string;
  name: string;
  tagline: string;
  /** Headline figure, e.g. "$75K" or "Custom". */
  price: string;
  /** Small qualifier under the price, e.g. "fixed-fee pilot". */
  priceNote: string;
  bullets: string[];
  /** Optional week-by-week strip (used by the pilot card). */
  timeline?: OfferingTimelineStep[];
  /** Renders larger / full-width when true. */
  featured?: boolean;
  /** Optional extra CTA beyond the shared Book-a-call / Sign-in. */
  cta?: { label: string; href: string };
}

export const OFFERINGS: Offering[] = [
  {
    slug: 'embedded-agent-pilot',
    name: 'Embedded Agent Pilot',
    tagline:
      'A working, production-grade agentic solution embedded in your environment — in weeks, not quarters. One workflow, measured end to end.',
    price: '$75K–$150K',
    priceNote: 'fixed-price pilot',
    featured: true,
    bullets: [
      'Map your highest-value workflow and baseline the KPI',
      'Agents built against your data, integrated with Microsoft 365 + Azure',
      'Live in production with human-in-the-loop oversight',
      'Signed report quantifying impact — no black boxes',
    ],
    timeline: [
      { when: 'Week 1', title: 'Map the workflow' },
      { when: 'Weeks 2–5', title: 'Build against your data' },
      { when: 'Weeks 6–7', title: 'Live, human-in-the-loop' },
      { when: 'Week 8', title: 'Signed impact report' },
    ],
    cta: { label: 'Submit your use case →', href: '/pilot' },
  },
  {
    slug: 'echelix-lattice',
    name: 'Echelix Lattice',
    tagline:
      'Bicep infrastructure-as-code that provisions a private, secure Azure environment with AI-agent coordination built in from day one.',
    price: 'Custom',
    priceNote: 'scoped per environment',
    bullets: [
      'Private VNet, AKS, Azure OpenAI + AI Search, Service Bus messaging',
      'Security, identity, and monitoring wired in by default',
      '100% code-defined — reproducible across environments',
      'Stood up in 2–4 weeks',
    ],
  },
  {
    slug: 'echelix-cortex',
    name: 'Echelix Cortex',
    tagline:
      'The agent orchestration and API layer that runs on top of Lattice — the brain that powers every Echelix solution.',
    price: 'Custom',
    priceNote: 'per solution',
    bullets: [
      'Multi-agent workflows with consensus and handoff',
      'Retrieval over your knowledge, documents, and systems',
      'Governed, auditable, human-in-the-loop by design',
      'Integrates with Dynamics 365, M365, and line-of-business apps',
    ],
  },
  {
    slug: 'production-solution-build',
    name: 'Production Solution Build',
    tagline:
      'Take any Echelix demo from prototype to a fully deployed, integrated production solution on your own tenant.',
    price: 'Custom',
    priceNote: 'fixed-scope engagement',
    bullets: [
      'Hardening, integration, and change management',
      'Deployed on your Azure tenant via Lattice',
      'Knowledge transfer and managed-support options',
      'Built on the same architecture you see in the demos',
    ],
  },
];
