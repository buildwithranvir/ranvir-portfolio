// Contact details and links for the templates site. Same details as the portfolio.

const PHONE = "918595856713";

export const site = {
  name: "Ranvir's Templates",
  owner: "Ranvir Kawatra",
  description:
    "Ready-made website designs by Ranvir Kawatra, a creative web developer in Delhi. Pick the one that feels like your business, and he rebuilds it around your name, words and photos.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://templatesbyranvir.vercel.app",
  portfolio: "https://buildwithranvir.vercel.app",
  phone: "+91 85958 56713",
  phoneHref: `tel:+${PHONE}`,
  email: "ranvirkawatra23@gmail.com",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/buildwithranvir/" },
    { label: "YouTube", href: "https://www.youtube.com/@buildwithranvir" },
    { label: "GitHub", href: "https://github.com/buildwithranvir" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ranvir-kawatra-550337420/" },
  ],
} as const;

/** A WhatsApp link with a ready-made message. */
export const whatsapp = (text = "Hi Ranvir, I'd like to talk about a website for my business.") =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;

/** The message sent when a client picks a template. */
export const wantThis = (name: string) => whatsapp(`Hi Ranvir, I'd like a website like ${name} for my business.`);

/** The shop's own paint colours (no purples anywhere on this site). */
export const shop = {
  tomato: "#F2542D",
  cobalt: "#1F4FD8",
  sun: "#F6C12E",
  mint: "#21B07E",
  bubble: "#FF8FB1",
  tangerine: "#FF9A1F",
  teal: "#0F8B8D",
} as const;
