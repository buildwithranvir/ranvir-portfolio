// ─────────────────────────────────────────────────────────────
// Demo content for NOVA. Clients, projects, figures and quotes are
// fictional placeholders.
// ─────────────────────────────────────────────────────────────
import type { StaticImageData } from "next/image";

import wApp from "@/public/images/w-app.jpg";
import wRetro from "@/public/images/w-retro.jpg";
import wSwatch from "@/public/images/w-swatch.jpg";
import wScreens from "@/public/images/w-screens.jpg";
import wSketch from "@/public/images/w-sketch.jpg";
import wWire from "@/public/images/w-wire.jpg";

type Img = { src: StaticImageData; alt: string };

export type Project = {
  id: string;
  code: string;
  name: string;
  client: string;
  discipline: string;
  year: string;
  line: string;
  summary: string;
  stack: string[];
  outcome: string;
  image: Img;
};

export const projects: Project[] = [
  {
    id: "halo",
    code: "N-031",
    name: "Halo",
    client: "Halo Money (fictional)",
    discipline: "Product design",
    year: "2026",
    line: "Banking for people paid irregularly.",
    summary: "A finance app for freelancers that forecasts tax, splits every invoice into pots and stays calm about money.",
    stack: ["Design system", "iOS / Android", "Launch site"],
    outcome: "4.8★ at launch (demo figure)",
    image: { src: wApp, alt: "A hand holding a phone showing a finance dashboard" },
  },
  {
    id: "arcadia",
    code: "N-028",
    name: "Arcadia",
    client: "Arcadia Games (fictional)",
    discipline: "Identity & motion",
    year: "2025",
    line: "A retro back catalogue, made new.",
    summary: "An identity and motion toolkit for an indie publisher, built from the pixel grids of its own old games.",
    stack: ["Identity", "Motion toolkit", "Website"],
    outcome: "3 trailers, 1 type family",
    image: { src: wRetro, alt: "Retro consoles and a vintage computer lit in pink and blue" },
  },
  {
    id: "spectrum",
    code: "N-024",
    name: "Spectrum",
    client: "Spectrum Paints (fictional)",
    discipline: "Creative technology",
    year: "2025",
    line: "Four hundred colours, on your own wall.",
    summary: "A browser tool that relights a photo of your room in real time, so you can test paint before buying a tin.",
    stack: ["WebGL", "Colour science", "E-commerce"],
    outcome: "2× sample orders (demo figure)",
    image: { src: wSwatch, alt: "Paint swatch cards fanned out on a desk next to a tablet" },
  },
  {
    id: "orbit",
    code: "N-019",
    name: "Orbit",
    client: "Orbit Labs (fictional)",
    discipline: "Web engineering",
    year: "2024",
    line: "Docs that load before you blink.",
    summary: "A documentation and marketing platform for a developer-tools company, rebuilt to load in under a second worldwide.",
    stack: ["Headless CMS", "Edge rendering", "Search"],
    outcome: "0.6 s median load (demo figure)",
    image: { src: wScreens, alt: "A wall of glowing screens in a dark room" },
  },
];

export const capabilities = [
  { id: "01", name: "Websites", detail: "Marketing sites and editorial platforms, designed and built in-house.", tools: ["Next.js", "Headless CMS", "Accessibility"] },
  { id: "02", name: "Brand systems", detail: "Identities that are drawn for screens first: type, colour, motion rules.", tools: ["Strategy", "Type", "Guidelines"] },
  { id: "03", name: "Product design", detail: "Interfaces for apps and tools, prototyped in code early.", tools: ["UX research", "Prototyping", "Design systems"] },
  { id: "04", name: "Interactive", detail: "Campaign pieces, WebGL and installations — when the brief needs something new.", tools: ["WebGL", "Generative", "Hardware"] },
];

export const method = [
  { id: "01", name: "Listen", weeks: "wk 1–2", from: 1, to: 2, deliverables: ["Interviews", "Audit", "Analytics review"], text: "Interviews, audits, a week inside your team. We learn the business until we can argue for it.", image: { src: wSketch, alt: "Hand sketching wireframes on paper" } },
  { id: "02", name: "Frame", weeks: "wk 2–3", from: 2, to: 3, deliverables: ["One-page brief", "Success metrics", "Moodboards"], text: "A one-page brief everyone signs: what we're making, for whom, and how we'll know it worked.", image: { src: wWire, alt: "Wireframes laid out on a desk" } },
  { id: "03", name: "Make", weeks: "wk 3–10", from: 3, to: 10, deliverables: ["Friday demos", "Design system", "Working build"], text: "Design and code together, demoed every Friday. You see working software from week three.", image: { src: wApp, alt: "A phone showing an app interface" } },
  { id: "04", name: "Ship", weeks: "wk 10–12", from: 10, to: 12, deliverables: ["Launch", "Measurement", "90-day care plan"], text: "Launch, measure, fix. Then a ninety-day care plan, because nothing is finished on launch day.", image: { src: wScreens, alt: "A wall of screens" } },
];

export const stats = [
  { value: 180, suffix: "+", label: "Projects shipped" },
  { value: 11, suffix: "", label: "Years running" },
  { value: 14, suffix: "", label: "People in the studio" },
  { value: 0.6, suffix: "s", label: "Median page load", decimals: 1 },
];

export const quotes = [
  { quote: "They made the product feel inevitable — and easier to use.", who: "Head of Product, Halo Money" },
  { quote: "Fast, fearless, and genuinely kind to work with.", who: "Founder, Arcadia Games" },
  { quote: "Our sample orders doubled the month the tool went live.", who: "Marketing Director, Spectrum Paints" },
  { quote: "They sweat details we didn't know existed.", who: "CTO, Orbit Labs" },
  { quote: "Design and engineering in one room. It changed how we work.", who: "COO, Northwind" },
];

export const contactServices = ["Website", "Brand system", "Product", "Interactive", "Not sure yet"];
export const budgets = ["< 25k", "25–60k", "60–150k", "150k +"];
