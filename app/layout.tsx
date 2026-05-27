import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { EchelixAtmosphere } from "@/components/EchelixAtmosphere";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Newsreader — modern editorial serif, closest free analogue to the
// PP Editorial New / Tiempos Headline family used on echelix.com.
// If we ever license PP Editorial New, this is the one place to swap.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces", // keep the same CSS variable name so we don't have to update globals.css
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://echelix.app"),
  title: {
    default: "Echelix Demo Hub",
    template: "%s | Echelix",
  },
  description:
    "Experience the future of agentic enterprise software. Explore live, interactive demonstrations of Echelix solutions — purpose-built to modernize operations, embed AI, and deliver measurable business value.",
  applicationName: "Echelix Demo Hub",
  authors: [{ name: "Echelix" }],
  keywords: [
    "Echelix",
    "agentic AI",
    "enterprise software",
    "Microsoft Partner",
    "solution demos",
    "AI integration",
    "Azure",
  ],
  // Favicon and apple-touch-icon are auto-wired by app/icon.tsx and
  // app/apple-icon.tsx — no manual icons block needed.
  openGraph: {
    type: "website",
    url: "https://echelix.app",
    siteName: "Echelix Demo Hub",
    title: "Echelix Demo Hub",
    description:
      "Experience the future of agentic enterprise software. Explore live, interactive demonstrations of Echelix solutions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Echelix — Modernize. Build Agentic Apps. Deliver Business Value.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Echelix Demo Hub",
    description: "Experience the future of agentic enterprise software.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        {/* Global background — renders behind everything via position: fixed
            + z-index: -10. Applies to every route in the app. */}
        <EchelixAtmosphere />
        {children}
        {/* Vercel observability — free, no PII, no setup beyond enabling in dashboard */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
