import type { Metadata, Viewport } from "next";
import { Azeret_Mono, Fraunces, Schibsted_Grotesk, Syne } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Syne for display (its weight axis also widens the letters), Fraunces italic for
// emphasis, Schibsted Grotesk for reading, Azeret Mono for drawing annotations.
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "WONK", "opsz"], variable: "--font-fraunces" });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted" });
const azeret = Azeret_Mono({ subsets: ["latin"], variable: "--font-azeret" });

export const metadata: Metadata = {
  // On Vercel, use the deployment's real domain so share images resolve.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : site.url,
  ),
  title: `${site.fullName} | ${site.tagline}`,
  description: site.description,
  openGraph: {
    title: `${site.fullName} | ${site.tagline}`,
    description: site.description,
    type: "website",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#eee6d8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${syne.variable} ${fraunces.variable} ${schibsted.variable} ${azeret.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Marks the page as scripted before first paint, so the intro and fold-ins only ever apply when JavaScript runs */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
