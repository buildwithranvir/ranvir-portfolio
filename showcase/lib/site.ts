// ─────────────────────────────────────────────────────────────
// Portfolio configuration. Name, contact details, bio, services, projects,
// tools and demo URLs all live here - nothing else needs editing.
//
// Demo URLs come from environment variables so each deployed demo
// can live at its own address (see README). Locally they default to
// the ports used by `npm run dev:all`.
// ─────────────────────────────────────────────────────────────

export const studio = {
  name: "Ranvir Kawatra",
  shortName: "Ranvir",
  role: "Creative web developer",
  tagline: "Websites, apps and AI agents, designed and built end to end",
  description:
    "Ranvir Kawatra is a creative web developer in Delhi. He designs and builds websites, web apps, AI automations and AI agents for businesses around the world, and shows how the work is done on YouTube.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Public email. Shown on Contact (leave empty to hide it everywhere). */
  email: "ranvirkawatra23@gmail.com",
  phone: "+91 85958 56713",
  phoneHref: "tel:+918595856713",
  whatsappHref: "https://wa.me/918595856713?text=Hi%20Ranvir%2C%20I%27d%20like%20to%20talk%20about%20a%20project.",
  /** Where every "Let's talk" button goes - WhatsApp for now (swap for a mailto: or booking page any time). */
  contactHref:
    process.env.NEXT_PUBLIC_CONTACT_URL ?? "https://wa.me/918595856713?text=Hi%20Ranvir%2C%20I%27d%20like%20to%20talk%20about%20a%20project.",
  location: "Delhi, India",
  reach: "Taking on clients worldwide",
  /** The templates site, linked from the work section. */
  templatesUrl: "https://templatesbyranvir.vercel.app",
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
    "I'm a creative web developer in Delhi. Most projects start the same way: a business whose website no longer sounds like the business. I take it from the first sketch to the live site myself, so nothing gets lost between the idea and the code.",
    "Over three years the work has grown past websites. I build the web apps teams open every morning, and the AI agents and automations that take repetitive work off their desks. On YouTube, I show how it's done.",
    "I work with clients in India and abroad, over calls and WhatsApp. If the problem can be solved with technology, there's a good chance I can build the fix.",
  ],
  /** Production notes shown beside the bio - facts only. */
  notes: [
    ["Role", "Creative web developer"],
    ["Based", "Delhi, India"],
    ["Clients", "Worldwide"],
    ["Practice", "3+ years"],
    ["Also", "AI agents, automation and YouTube"],
  ] as [string, string][],
};

export const services = [
  { title: "Websites", body: "Sites with their own design and motion, built to load fast on any phone. From a single landing page to a 30-page build like RYS." },
  { title: "Web apps", body: "Dashboards, portals and internal tools your team opens every morning. Clear screens on code that stays easy to change." },
  { title: "AI automations", body: "Your tools, connected. Orders, leads and reports move on their own, so nobody spends the afternoon copying data between tabs." },
  { title: "AI agents", body: "Agents that answer customers, research, qualify leads and take action inside the systems you already use." },
  { title: "Anything tech", body: "Some problems don't fit a category. Describe yours, and we'll work out how to build the fix." },
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
    summary: "The official website of Rajdhani Yuva Sansad, India's youth parliament initiative. Thirty pages, designed and built from a blank page.",
    url: "https://www.rajdhaniyuvasansad.com/",
  },
  {
    id: "saunth",
    name: "SAUNTH",
    kind: "AI automation · Menu builder",
    summary: "A menu builder for SAUNTH, with automation behind it that takes the repetitive updates off the team's hands.",
    url: "https://saunth-menu-builder.vercel.app/",
  },
  {
    id: "client-portfolio",
    name: "Scarlet by Priyanka",
    kind: "Portfolio website",
    summary: "A portfolio for Priyanka Narula, a makeup artist in Delhi, showing her bridal, engagement, celebrity and party work.",
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
      "A neighbourhood café told like its own printed menu. The day unfolds as a photo essay, with coffee bag labels, pencil notes, an opening-hours badge that is always current, and a booking slip at the end.",
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
      "An independent fashion label that introduces its people before its clothes. The wordmark stretches open, team portraits develop as you scroll, the founder's letter holds still while you read, the campaign runs sideways and the shop follows your cursor.",
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
      "An architecture practice presented like a folded card model. An accordion screen opens the site, photos unfold along their crease, an exploded axonometric explains the process, and a blueprint room holds the details.",
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
      "A creative technology studio built like an instrument. A dot field reacts to your cursor, the project index plays in a live viewer, a 12-week mission-control timeline shows how the work runs, and the brief reads like a small program.",
    url: process.env.NEXT_PUBLIC_NOVA_URL ?? "http://localhost:3004",
    palette: ["#0B0C0E", "#E9EDF1", "#8C949E", "#FF5A1F"],
    fonts: "Bricolage Grotesque & JetBrains Mono",
    features: ["Live dot field", "Project viewer", "Console brief"],
  },
];

export const principles = [
  { title: "Original design", body: "Every brand gets its own type, grid and motion. Nothing comes from a template, so the site looks like the business and nobody else." },
  { title: "Motion with a purpose", body: "Animation points the eye to what matters, and it steps aside for anyone whose device asks for reduced motion." },
  { title: "Speed", body: "Compressed images, lean JavaScript and pages rendered ahead of time, so the site opens fast on a patchy mobile connection." },
  { title: "Made for every screen", body: "Phone, tablet and desktop each get a layout of their own. Nothing is simply shrunk to fit." },
  { title: "Automation where it helps", body: "AI agents and workflows that save real hours, and simple enough that your team keeps using them after launch." },
  { title: "Built to bring in business", body: "Clear calls to action, forms that actually reach you, and content you can update yourself." },
];

/** The page's sections, in order - drives the HUD, the index menu and every section number. */
export const scenes = [
  { id: "top", title: "Intro", blurb: "Name, role and selected work" },
  { id: "about", title: "About", blurb: "Who I am and where I work from" },
  { id: "craft", title: "Services", blurb: "Websites, apps, AI automations and agents" },
  { id: "work", title: "Selected work", blurb: "Every site side by side" },
  { id: "noir", title: "NOIR", blurb: "Café & bakery" },
  { id: "vanta", title: "VANTA", blurb: "Fashion studio" },
  { id: "atelier", title: "ATELIER", blurb: "Architecture practice" },
  { id: "nova", title: "NOVA", blurb: "Creative technology studio" },
  { id: "offscreen", title: "Client work", blurb: "Live projects for real clients" },
  { id: "kit", title: "Toolkit", blurb: "The tools behind the work" },
  { id: "method", title: "Process", blurb: "Six principles I build by" },
  { id: "contact", title: "Contact", blurb: "Start a project on WhatsApp or by phone" },
] as const;

export type SceneId = (typeof scenes)[number]["id"];

/** "04" for the fourth section, and so on. */
export const sceneNo = (id: SceneId) => String(scenes.findIndex((s) => s.id === id) + 1).padStart(2, "0");
