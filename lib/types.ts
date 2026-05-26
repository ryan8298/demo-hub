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
  created_at: string;
  updated_at: string;
}

export interface VisitorSession {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  is_microsoft: boolean;
  session_token: string;
}