import type { NextConfig } from "next";

/**
 * Security & performance headers applied to every response.
 *
 * - CSP is intentionally permissive on script-src ('unsafe-inline') because
 *   Next.js inlines hydration scripts. To tighten further we'd switch to
 *   nonce-based CSP via middleware — not worth it at this stage.
 * - frame-src is wide-open because the hub embeds arbitrary demo URLs in
 *   iframes for preview tiles.
 * - img-src allows https: so og:image previews from arbitrary domains work.
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" }, // echelix.app should never be embedded
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co https://*.vercel-insights.com https://va.vercel-scripts.com",
      "frame-src https:",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  poweredByHeader: false,
  compress: true,

  images: {
    // Allow external og:image hosts for demo previews
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
