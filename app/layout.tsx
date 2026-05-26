import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fraunces",
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/echelix-logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
