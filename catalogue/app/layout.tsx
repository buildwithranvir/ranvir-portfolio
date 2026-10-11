import type { Metadata, Viewport } from "next";
import { Big_Shoulders, DM_Mono, Figtree } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Big Shoulders reads like a condensed paint-can label; Figtree carries the text;
// DM Mono prints the chip codes and hex values.
const shoulders = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-shoulders" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : site.url),
  title: `${site.name} | Website designs by ${site.owner}`,
  description: site.description,
  openGraph: {
    title: `${site.name} | Website designs by ${site.owner}`,
    description: site.description,
    type: "website",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f3eee4",
};

// Before first paint: mark the page as scripted, and shorten the loader for a
// visitor who has already seen it in this browser session.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('rk-deck')==='1')d.classList.add('seen')}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${shoulders.variable} ${figtree.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
