// ─────────────────────────────────────────────────────────────
// Portfolio configuration. Name, contact details, bio, services, projects,
// tools and demo URLs all live here — nothing else needs editing.
//
// Demo URLs come from environment variables so each deployed demo
// can live at its own address (see README). Locally they default to
// the ports used by `npm run dev:all`.
// ─────────────────────────────────────────────────────────────

export const studio = {
  name: "Ranvir Kawatra",
  shortName: "Ranvir",
  role: "Creative web developer",
  tagline: "Creative web developer, AI builder & content creator",
  description:
    "Ranvir Kawatra is a creative web developer from Delhi, India. He designs and builds websites, apps, AI automations and AI agents for clients worldwide, and makes tech content on YouTube.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Public email. Shown on Contact (leave empty to hide it everywhere). */
  email: "ranvirkawatra23@gmail.com",
  phone: "+91 85958 56713",
  phoneHref: "tel:+918595856713",
  whatsappHref: "https://wa.me/918595856713?text=Hi%20Ranvir%2C%20I%27d%20like%20to%20talk%20about%20a%20project.",
  /** Where every "Let's talk" button goes — WhatsApp for now (swap for a mailto: or booking page any time). */
  contactHref:
    process.env.NEXT_PUBLIC_CONTACT_URL ?? "https://wa.me/918595856713?text=Hi%20Ranvir%2C%20I%27d%20like%20to%20talk%20about%20a%20project.",
  location: "Delhi, India",
  reach: "Taking on clients worldwide",
  experienceYears: 3,
  socials: [
    { label: "Instagram", handle: "@buildwithranvir", href: "https://www.instagram.com/buildwithranvir/" },
    { label: "YouTube", handle: "@buildwithranvir", href: "https://www.youtube.com/@buildwithranvir" },
    { label: "GitHub", handle: "buildwithranvir", href: "https://github.com/buildwithranvir" },
    { label: "LinkedIn", handle: "Ranvir Kawatra", href: "https://www.linkedin.com/in/ranvir-kawatra-550337420/" },
  ],
} as const;

export const about = {
  /** The portrait (public/ranvir.jpg, 4:5). Used on About, Contact, the closing card and the share preview. */
  photo: "/ranvir.jpg" as string | null,
  paragraphs: [
    "I'm a creative web developer based in Delhi. I design and build websites that feel like the brands behind them, from the first sketch to the deployed site.",
    "I also build AI agents and automations that take repetitive work off a team's plate, and I make content about all of it on YouTube.",
    "I take on projects from clients around the world. Whatever the problem is, if it's tech, there's a good chance I can build it.",
  ],
  /** Production notes shown beside the bio — facts only. */
  notes: [
    ["Role", "Creative web developer"],
    ["Based", "Delhi, India"],
    ["Clients", "Worldwide"],
    ["Practice", "3+ years"],
    ["Also", "AI agents, automation & YouTube"],
  ] as [string, string][],
};

export const services = [
  { title: "Websites", body: "Custom, fast, responsive websites with their own design and motion. From a single landing page to a 30-page build." },
  { title: "Web apps", body: "Dashboards, portals and tools built to be used every day. Clean interfaces on solid, maintainable code." },
  { title: "AI automations", body: "Workflows that connect your tools and run on their own, so repetitive tasks stop eating your team's time." },
  { title: "AI agents", body: "Agents that answer, research, qualify and act for you, wired into the systems you already use." },
  { title: "Anything tech", body: "Got a technical problem that doesn't fit a box? Bring it. If it's tech, we'll figure out how to build it." },
];

export type Project = {
  id: string;
  name: string;
  kind: string;
  summary: string;
  /** The live link. While it is empty the row offers a walkthrough instead. */
  url: string;
};

export const projects: Project[] = [
  {
    id: "rys",
    name: "RYS",
    kind: "30-page website",
    summary: "The official website of Rajdhani Yuva Sansad, India's youth parliament initiative — 30 pages, designed and built from scratch.",
    url: "https://www.rajdhaniyuvasansad.com/",
  },
  {
    id: "saunth",
    name: "SAUNTH",
    kind: "AI automation · Menu builder",
    summary: "A menu builder for SAUNTH, with automation behind it to take repetitive work off the team.",
    url: "https://saunth-menu-builder.vercel.app/",
  },
  {
    id: "client-portfolio",
    name: "Scarlet by Priyanka",
    kind: "Portfolio website",
    summary: "A portfolio for Priyanka Narula, a Delhi makeup artist — bridal, engagement, celebrity and party looks.",
    url: "https://scarlet-by-priyanka.vercel.app/",
  },
];

export const tools = [
  {
    group: "Web",
    items: ["Next.js", "React", "TypeScript", "JavaScript", "HTML & CSS", "Tailwind CSS", "GSAP", "Framer Motion", "Lenis", "Three.js", "React Three Fiber", "WebGL & shaders", "Vite", "Astro", "Node.js", "Express", "REST APIs", "GraphQL", "Webflow", "WordPress", "Shopify"],
  },
  {
    group: "Apps & data",
    items: ["React Native", "Expo", "PWAs", "Supabase", "Firebase", "PostgreSQL", "MongoDB", "Prisma", "Redis", "Stripe & Razorpay", "Auth & logins", "Dashboards & CMS", "Chrome extensions"],
  },
  {
    group: "AI & automation",
    items: ["Claude API", "OpenAI API", "Gemini", "AI agents", "MCP servers", "LangChain", "RAG & vector search", "Pinecone", "Prompt engineering", "Voice agents", "ElevenLabs", "Chatbots", "n8n", "Make", "Zapier", "Python", "FastAPI", "Webhooks & APIs", "WhatsApp API", "Telegram bots", "Web scraping", "Google Sheets automation"],
  },
  {
    group: "Design",
    items: ["Figma", "UI / UX", "Design systems", "Responsive design", "Motion design", "Prototyping", "Brand identity", "Accessibility"],
  },
  {
    group: "Delivery",
    items: ["Vercel", "Netlify", "Cloudflare", "AWS", "Docker", "Git & GitHub", "GitHub Actions", "SEO", "Core Web Vitals", "Analytics", "Playwright testing", "Domains & hosting"],
  },
  {
    group: "Content",
    items: ["YouTube", "Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut", "OBS", "Canva", "Photoshop", "Thumbnails", "Scripting & storytelling", "Screen-recorded tutorials"],
  },
];

export type Demo = {
  id: "noir" | "vanta" | "atelier" | "nova";
  /** The project's own environment on the portfolio: background, text and accent. */
  scene: { bg: string; fg: string; accent: string };
  /** Captions for the five tour screenshots (lib/previews.ts), in order. */
  tour: string[];
  name: string;
  industry: string;
  description: string;
  url: string;
  palette: string[];
  fonts: string;
  features: string[];
};

export const demos: Demo[] = [
  {
    id: "noir",
    tour: ["A day at Noir", "Beans of the week", "The printed menu", "The room", "Book a table"],
    scene: { bg: "#efe7da", fg: "#22160f", accent: "#6e1f25" },
    name: "NOIR",
    industry: "Café & bakery",
    description:
      "A neighbourhood café told like a printed menu: a day-in-the-life photo essay, coffee bag labels, pencil notes, a live opening-hours badge and a booking slip.",
    url: process.env.NEXT_PUBLIC_NOIR_URL ?? "http://localhost:3001",
    palette: ["#EFE7DA", "#22160F", "#43452A", "#6E1F25"],
    fonts: "Gloock, Familjen Grotesk & Reenie Beanie",
    features: ["Daily special", "Printed menu", "Booking slip"],
  },
  {
    id: "vanta",
    tour: ["Meet the studio", "Letter from the founder", "The campaign", "The edit", "The archive"],
    scene: { bg: "#140f12", fg: "#f2eee7", accent: "#d6f34b" },
    name: "VANTA",
    industry: "Fashion studio",
    description:
      "An independent fashion label that opens with its people: a wordmark that stretches open, team portraits that develop as you scroll, a pinned founder's letter, a sideways campaign and a cursor-led shop.",
    url: process.env.NEXT_PUBLIC_VANTA_URL ?? "http://localhost:3002",
    palette: ["#140F12", "#F2EEE7", "#2B1B26", "#D6F34B"],
    fonts: "Anybody, Bodoni Moda, Albert Sans & Martian Mono",
    features: ["Studio intro", "Stretching type", "Cursor-led shop"],
  },
  {
    id: "atelier",
    tour: ["Projects on folded cards", "Details on blueprint", "Exploded axonometric", "Note on method", "The project brief"],
    scene: { bg: "#eee6d8", fg: "#17182b", accent: "#2a47c2" },
    name: "ATELIER",
    industry: "Architecture practice",
    description:
      "An architecture practice built like a folded card model: an accordion-screen intro, photos that unfold on their crease, an exploded axonometric of the process and a blueprint detail room.",
    url: process.env.NEXT_PUBLIC_ATELIER_URL ?? "http://localhost:3003",
    palette: ["#EEE6D8", "#17182B", "#2A47C2", "#D2532F", "#EBB13B", "#2E6B5E"],
    fonts: "Syne, Fraunces, Schibsted Grotesk & Azeret Mono",
    features: ["Folding screen", "Exploded axonometric", "Project brief"],
  },
  {
    id: "nova",
    tour: ["Project viewer", "What we make", "Mission-control timeline", "Numbers & client notes", "The brief console"],
    scene: { bg: "#0b0c0e", fg: "#e9edf1", accent: "#ff5a1f" },
    name: "NOVA",
    industry: "Creative technology studio",
    description:
      "A studio site built like an instrument: a cursor-reactive dot field, a project index with a live viewer, a 12-week mission-control timeline and a brief written like a small program.",
    url: process.env.NEXT_PUBLIC_NOVA_URL ?? "http://localhost:3004",
    palette: ["#0B0C0E", "#E9EDF1", "#8C949E", "#FF5A1F"],
    fonts: "Bricolage Grotesque & JetBrains Mono",
    features: ["Live dot field", "Project viewer", "Console brief"],
  },
];

export const principles = [
  { title: "Original design", body: "Every brand gets its own typography, grid and motion language. No recycled layouts, no generic templates." },
  { title: "Premium interactions", body: "Animation that guides attention and feels considered, and always respects reduced-motion settings." },
  { title: "Performance", body: "Optimised images, lean JavaScript and static rendering, so sites feel instant on any connection." },
  { title: "Responsive development", body: "Layouts composed separately for phone, tablet and desktop, not simply squeezed to fit." },
  { title: "Automation where it helps", body: "AI agents and workflows that save real hours, built to be simple enough that your team actually uses them." },
  { title: "Business-focused", body: "Clear calls to action, working forms and content that's easy to update, built to bring in customers." },
];

/** The page's sections, in order — drives the HUD, the index menu and every section number. */
export const scenes = [
  { id: "top", title: "Intro", blurb: "Name, role and selected work at a glance" },
  { id: "about", title: "About", blurb: "Who I am and where I work from" },
  { id: "craft", title: "Services", blurb: "Websites, apps, AI automations and agents" },
  { id: "work", title: "Selected work", blurb: "Every site side by side" },
  { id: "noir", title: "NOIR", blurb: "Café & bakery" },
  { id: "vanta", title: "VANTA", blurb: "Fashion studio" },
  { id: "atelier", title: "ATELIER", blurb: "Architecture practice" },
  { id: "nova", title: "NOVA", blurb: "Creative technology studio" },
  { id: "offscreen", title: "Client work", blurb: "Projects built for real clients" },
  { id: "kit", title: "Toolkit", blurb: "The tools behind the work" },
  { id: "method", title: "Process", blurb: "Six principles I build by" },
  { id: "contact", title: "Contact", blurb: "Start a project — WhatsApp or call" },
] as const;

export type SceneId = (typeof scenes)[number]["id"];

/** "04" for the fourth section, and so on. */
export const sceneNo = (id: SceneId) => String(scenes.findIndex((s) => s.id === id) + 1).padStart(2, "0");
