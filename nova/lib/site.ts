// ─────────────────────────────────────────────────────────────
// Studio details for the NOVA demo. Fictional placeholders.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "NOVA",
  tagline: "Design & creative technology studio",
  description:
    "NOVA is a small studio for websites, brand systems and interactive work: designers and engineers in one room. A demo website template.",
  url: "https://nova.example.com",
  email: "hello@nova.example",
  location: "Lisbon / remote",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Method", href: "#method" },
  { label: "Contact", href: "#contact" },
] as const;
