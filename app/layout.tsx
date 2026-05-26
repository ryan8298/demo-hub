import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Echelix Demo Hub",
  description: "Experience the future of agentic enterprise software.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}