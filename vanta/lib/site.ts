// ─────────────────────────────────────────────────────────────
// Brand details for the VANTA demo. All fictional placeholders.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "VANTA",
  tagline: "Issue 07: Quiet Armour",
  description:
    "VANTA is an independent label that publishes every collection as an issue. Issue 07, Quiet Armour: tailoring, washed leather and wool crêpe for Spring / Summer 2026. A demo website template.",
  url: "https://vanta.example.com",
  email: "studio@vanta.example",
  press: "press@vanta.example",
  address: ["Atelier & showroom", "88 Rue Imaginaire", "Port District 2001"],
  stockists: ["Port District · the atelier", "Harbour City · Field Store", "North Bay · Maison Lune", "Online · by appointment"],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Pinterest", href: "https://www.pinterest.com/" },
  ],
} as const;

export const nav = [
  { label: "Studio", href: "#studio" },
  { label: "Lookbook", href: "#lookbook" },
  { label: "The Edit", href: "#edit" },
  { label: "Letter", href: "#letter" },
  { label: "Archive", href: "#issues" },
] as const;
