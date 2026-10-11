// ─────────────────────────────────────────────────────────────
// Every template on the site lives in this one list. Each entry gets its own
// row in the index, its own section, a slot in the hero viewer, the live
// preview and the WhatsApp message, all automatically.
//
// To add a template:
//   1. npm run capture -- <id> <live-url>     (from the TEMPLATES folder)
//   2. Copy an entry below and fill it in. `id` must match the capture id.
//   3. git push
// ─────────────────────────────────────────────────────────────
import previews from "./previews.json";

export type Template = {
  /** Folder name under public/t/ (the capture id). */
  id: string;
  name: string;
  industry: string;
  /** One or two plain sentences, first person. */
  story: string;
  /** Kinds of business it suits. */
  goodFor: string;
  url: string;
  /** paint: the template's accent · bg and ink: its own background and text colours. */
  colors: { paint: string; bg: string; ink: string };
  palette: string[];
  fonts: string;
  features: string[];
};

export const templates: Template[] = [
  {
    id: "noir",
    name: "NOIR",
    industry: "Café & bakery",
    story:
      "A neighbourhood café told like its own printed menu. The day unfolds as a photo essay, with coffee bag labels, pencil notes, an opening-hours badge that is always current, and a booking slip at the end.",
    goodFor: "Cafés, bakeries, restaurants and bars",
    url: "https://noir-green-psi.vercel.app",
    colors: { paint: "#6E1F25", bg: "#EFE7DA", ink: "#22160F" },
    palette: ["#EFE7DA", "#22160F", "#43452A", "#6E1F25"],
    fonts: "Gloock, Familjen Grotesk & Reenie Beanie",
    features: ["Daily special", "Printed menu", "Photo essay", "Live opening hours", "Booking slip"],
  },
  {
    id: "vanta",
    name: "VANTA",
    industry: "Fashion studio",
    story:
      "An independent fashion label that introduces its people before its clothes. The wordmark stretches open, team portraits develop as you scroll, the founder's letter holds still while you read, and the shop follows your cursor.",
    goodFor: "Fashion labels, boutiques, makers and studios",
    url: "https://vanta-chi-two.vercel.app",
    colors: { paint: "#D6F34B", bg: "#140F12", ink: "#F2EEE7" },
    palette: ["#140F12", "#F2EEE7", "#2B1B26", "#D6F34B"],
    fonts: "Anybody, Bodoni Moda, Albert Sans & Martian Mono",
    features: ["Studio intro", "Stretching type", "Founder's letter", "Sideways campaign", "Cursor-led shop"],
  },
  {
    id: "atelier",
    name: "ATELIER",
    industry: "Architecture practice",
    story:
      "An architecture practice presented like a folded card model. An accordion screen opens the site, photos unfold along their crease, an exploded axonometric explains the process, and a blueprint room holds the details.",
    goodFor: "Architects, interior designers, builders and real estate",
    url: "https://atelier-pi-beige.vercel.app",
    colors: { paint: "#2A47C2", bg: "#EEE6D8", ink: "#17182B" },
    palette: ["#EEE6D8", "#17182B", "#2A47C2", "#D2532F", "#EBB13B", "#2E6B5E"],
    fonts: "Syne, Fraunces, Schibsted Grotesk & Azeret Mono",
    features: ["Folding screen", "Unfolding photos", "Exploded axonometric", "Blueprint details", "Project brief"],
  },
  {
    id: "nova",
    name: "NOVA",
    industry: "Creative technology studio",
    story:
      "A creative technology studio built like an instrument. A dot field reacts to your cursor, the project index plays in a live viewer, a 12-week mission-control timeline shows how the work runs, and the brief reads like a small program.",
    goodFor: "Agencies, tech studios, startups and freelancers",
    url: "https://nova-phi-blue.vercel.app",
    colors: { paint: "#FF5A1F", bg: "#0B0C0E", ink: "#E9EDF1" },
    palette: ["#0B0C0E", "#E9EDF1", "#8C949E", "#FF5A1F"],
    fonts: "Bricolage Grotesque & JetBrains Mono",
    features: ["Live dot field", "Project viewer", "Mission-control timeline", "Console brief"],
  },
];

/** "01" for the first template, and so on. */
export const num = (i: number) => String(i + 1).padStart(2, "0");

type Size = { w: number; h: number };
type Shots = Record<"desktop" | "desktop-full" | "mobile" | "mobile-full", Size>;
const sizes = previews as Record<string, Shots>;

/** The captured preview images for a template, with their pixel sizes. */
export function shots(t: Template) {
  const s = sizes[t.id];
  if (!s) throw new Error(`No previews for "${t.id}". Run: npm run capture -- ${t.id} ${t.url}`);
  const src = (k: keyof Shots) => ({ src: `/t/${t.id}/${k}.jpg`, width: s[k].w, height: s[k].h });
  return { desktop: src("desktop"), desktopFull: src("desktop-full"), mobile: src("mobile"), mobileFull: src("mobile-full") };
}

/** Black or white, whichever reads better on a colour. */
export function onColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return L > 0.36 ? "#0A0A0A" : "#EDEBE6";
}
