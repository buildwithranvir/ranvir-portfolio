import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { studio } from "@/lib/site";
import "./globals.css";

// Archivo's width axis (62-125) gives the film-credit display type its stretch;
// Newsreader italic is the editorial "voice"; Plex Mono is the camera HUD.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-newsreader" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex" });

export const metadata: Metadata = {
  // On Vercel, use the deployment's real domain so share images resolve.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : studio.url,
  ),
  title: `${studio.name} | ${studio.role}`,
  description: studio.description,
  openGraph: {
    title: `${studio.name} | ${studio.tagline}`,
    description: studio.description,
    type: "website",
    siteName: studio.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
};

// Runs before first paint: marks the page as scripted, sets the lighting the
// visitor chose last time (dark unless they switched the lights up), and skips
// the opening titles if they've already played in this browser session.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('marks-live');d.dataset.theme='dark';try{if(localStorage.getItem('rk-theme')==='light')d.dataset.theme='light'}catch(e){}try{if(sessionStorage.getItem('rk-intro')==='1')d.classList.add('intro-seen')}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable} ${plex.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
