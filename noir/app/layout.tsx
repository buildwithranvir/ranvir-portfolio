import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Gloock, Reenie_Beanie } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const gloock = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-gloock" });
const familjen = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-familjen" });
const reenie = Reenie_Beanie({ subsets: ["latin"], weight: "400", variable: "--font-reenie" });

export const metadata: Metadata = {
  // On Vercel, use the deployment's real domain so share images resolve.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : site.url,
  ),
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#efe7da",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gloock.variable} ${familjen.variable} ${reenie.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
