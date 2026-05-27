export interface Demo {
  id: string;
  title: string;
  description: string;
  preview_image_url?: string;
  demo_url: string;
  audience: string[];
  roi_summary?: string;
  roi_metrics?: {
    cost_savings?: string;
    time_to_value?: string;
    headcount_reduction?: string;
    other_metric?: string;
  };
  deployment_timeline?: {
    phase?: string;
    duration?: string;
    details?: string;
  }[];
  slug: string;
  featured: boolean;
  industry?: string;
  tags?: string[];
  view_count?: number;
  click_count?: number;
  // One-pager fields shown on /demo/[slug]
  problem_statement?: string;
  target_audience_description?: string;
  architecture_diagram_url?: string;
  /** When true, hub demo cards render `demo_url` as a scaled iframe
   *  instead of `preview_image_url`. Only set true for sites you know
   *  allow framing. */
  prefer_live_preview?: boolean;
  // -----------------------------------------------------------------
  // Structured enterprise storytelling fields — render on /demo/[slug]
  // as premium components instead of paragraph blocks. All optional.
  // -----------------------------------------------------------------
  kpi_metrics?: KpiMetric[];
  challenge_points?: string[];
  business_outcomes?: BusinessOutcome[];
  ai_capabilities?: AiCapability[];
  tech_stack?: string[];
  agent_timeline?: AgentEvent[];
  architecture_flow?: ArchitectureStep[];
  operational_stats?: OperationalStat[];
  created_at: string;
  updated_at: string;
}

export type KpiMetric = { label: string; value: string };
export type BusinessOutcome = { label: string; value?: string; description?: string };
export type AiCapability = { label: string; description?: string };
export type AgentEventStatus = 'pending' | 'in_progress' | 'completed' | 'alert';
export type AgentEvent = { timestamp?: string; event: string; status?: AgentEventStatus };
export type ArchitectureStep = { step: string; description?: string };
export type OperationalStat = { label: string; value: string };

export interface VisitorSession {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  is_microsoft: boolean;
  session_token: string;
}