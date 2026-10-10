// ─────────────────────────────────────────────────────────────
// Business details for the NOIR demo. All fictional placeholders.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "NOIR",
  tagline: "Kaffebar & Bageri",
  description:
    "NOIR is a neighbourhood café and bakery on Alder Lane: light-roast coffee from our own roaster, bread from our own oven, and a long table by the window. A demo website template.",
  url: "https://noir.example.com",
  address: {
    line1: "27 Alder Lane",
    line2: "Old Market Quarter",
    city: "Harbour City 10115",
    mapsQuery: "27 Alder Lane, Old Market Quarter",
  },
  phone: "+00 (0)20 555 0127",
  email: "hello@noir.example",
  // Monday first.
  hours: [
    { day: "Monday", open: "07:00", close: "17:00" },
    { day: "Tuesday", open: "07:00", close: "17:00" },
    { day: "Wednesday", open: "07:00", close: "17:00" },
    { day: "Thursday", open: "07:00", close: "18:00" },
    { day: "Friday", open: "07:00", close: "18:00" },
    { day: "Saturday", open: "08:00", close: "17:00" },
    { day: "Sunday", open: "09:00", close: "15:00" },
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Spotify", href: "https://open.spotify.com/" },
  ],
} as const;

export const nav = [
  { label: "The day", href: "#day" },
  { label: "Beans", href: "#beans" },
  { label: "Menu", href: "#menu" },
  { label: "The room", href: "#room" },
  { label: "Visit", href: "#visit" },
] as const;
