import type { Metadata, Viewport } from "next";
import { Albert_Sans, Anybody, Bodoni_Moda, Martian_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Anybody's width axis (50-150) is the house signature: type that squeezes and stretches.
const anybody = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--font-anybody" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-bodoni" });
const albert = Albert_Sans({ subsets: ["latin"], variable: "--font-albert" });
const martian = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian" });

export const metadata: Metadata = {
  // On Vercel, use the deployment's real domain so share images resolve.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : site.url,
  ),
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    type: "website",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#140f12",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anybody.variable} ${bodoni.variable} ${albert.variable} ${martian.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
