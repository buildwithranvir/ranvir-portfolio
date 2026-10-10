// ─────────────────────────────────────────────────────────────
// Studio details for the ATELIER demo. Fictional placeholders.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "ATELIER",
  fullName: "Atelier Morrow & Vale",
  tagline: "Architecture & Interiors",
  description:
    "Atelier Morrow & Vale is an architecture and interiors practice in Northbank, designing houses, workplaces and cultural buildings. A demo website template.",
  url: "https://atelier.example.com",
  email: "studio@atelier.example",
  phone: "+00 (0)20 555 0190",
  address: ["14 Quarry Row, Studio 3", "Northbank 4021"],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
} as const;

export const nav = [
  { label: "Projects", href: "#projects" },
  { label: "Details", href: "#details" },
  { label: "Practice", href: "#practice" },
  { label: "Contact", href: "#contact" },
] as const;
