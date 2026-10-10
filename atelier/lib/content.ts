// ─────────────────────────────────────────────────────────────
// Demo content for ATELIER, a fictional architecture practice.
// Projects, clients, figures and quotes are placeholders.
// ─────────────────────────────────────────────────────────────
import type { StaticImageData } from "next/image";

import arches from "@/public/images/a-arches.jpg";
import curve from "@/public/images/a-curve.jpg";
import glassfacade from "@/public/images/a-glassfacade.jpg";
import lantern from "@/public/images/a-lantern.jpg";
import bath from "@/public/images/a-bath.jpg";
import clerestory from "@/public/images/a-clerestory.jpg";
import glasshouse from "@/public/images/a-glasshouse.jpg";
import office from "@/public/images/a-office.jpg";
import vault from "@/public/images/a-vault.jpg";
import twin from "@/public/images/a-twin.jpg";
import renovation from "@/public/images/a-renovation.jpg";
import framing from "@/public/images/a-framing.jpg";
import up from "@/public/images/a-up.jpg";
import white from "@/public/images/p-white.jpg";
import stairs from "@/public/images/i-stairs.jpg";
import brick from "@/public/images/p-brick.jpg";
import facade from "@/public/images/p-facade.jpg";
import drawing from "@/public/images/drawing.jpg";

export type Img = { src: StaticImageData; alt: string };

export const hero = {
  // The four leaves of the folding screen
  screen: [
    { src: arches, alt: "Casa Arco, a white plaster stair rising through arched openings" },
    { src: lantern, alt: "Lantern House, a dark-clad house glowing at dusk" },
    { src: white, alt: "Harbour Pavilion, an angular white folded façade" },
    { src: glasshouse, alt: "Winter Glasshouse, a glass house lit on a snowy evening" },
  ] as Img[],
};

export type Project = {
  id: string;
  no: string;
  name: string;
  typology: "Residential" | "Cultural" | "Commercial" | "Interior";
  location: string;
  year: string;
  status: "Completed" | "On site" | "In design";
  area: string;
  summary: string;
  cover: Img;
  gallery: Img[];
};

export const projects: Project[] = [
  {
    id: "casa-arco",
    no: "A-114",
    name: "Casa Arco",
    typology: "Residential",
    location: "Coastal Ridge",
    year: "2025",
    status: "Completed",
    area: "380 m²",
    summary:
      "A family house organised around one long lime-plaster stair. Every room opens off it, so light from the roof lantern reaches the hallway on all three floors.",
    cover: { src: vault, alt: "A white rendered house with a curved parapet and a small garden" },
    gallery: [
      { src: arches, alt: "The arched plaster stair inside Casa Arco" },
      { src: bath, alt: "A minimal bathroom with a freestanding tub under a high window" },
    ],
  },
  {
    id: "lantern-house",
    no: "A-109",
    name: "Lantern House",
    typology: "Residential",
    location: "Northbank",
    year: "2024",
    status: "Completed",
    area: "260 m²",
    summary:
      "Charred larch, a deep entrance porch and a stair lit from the side. At night the house reads as two lanterns stacked on a dark base.",
    cover: { src: lantern, alt: "A dark-clad house glowing at dusk through a tall stair window" },
    gallery: [{ src: clerestory, alt: "A long living room under a continuous clerestory window" }],
  },
  {
    id: "harbour-pavilion",
    no: "C-031",
    name: "Harbour Pavilion",
    typology: "Cultural",
    location: "Harbour District",
    year: "2024",
    status: "Completed",
    area: "2,800 m²",
    summary:
      "A gallery whose folded aluminium skin catches the harbour light differently each hour. Inside, a single ramp connects three exhibition levels.",
    cover: { src: white, alt: "An angular white pavilion with a folded façade under a pale sky" },
    gallery: [{ src: glassfacade, alt: "A white glass façade made of stacked translucent panels" }],
  },
  {
    id: "glasshouse",
    no: "A-121",
    name: "Winter Glasshouse",
    typology: "Residential",
    location: "Upper Valley",
    year: "2026",
    status: "On site",
    area: "190 m²",
    summary: "A two-storey glass box on a concrete plinth, designed to disappear into the treeline in summer and glow in winter.",
    cover: { src: glasshouse, alt: "A glass-walled house lit from inside on a snowy evening" },
    gallery: [],
  },
  {
    id: "meridian",
    no: "B-047",
    name: "Meridian Offices",
    typology: "Commercial",
    location: "Old Town",
    year: "2023",
    status: "Completed",
    area: "1,150 m²",
    summary: "A 1960s office floor reworked around a steel-and-glass spine, with meeting rooms that borrow daylight from the street.",
    cover: { src: office, alt: "A corridor lined with black steel-framed glass partitions" },
    gallery: [],
  },
  {
    id: "ribbon",
    no: "A-133",
    name: "The Ribbon",
    typology: "Residential",
    location: "Riverside",
    year: "2027",
    status: "In design",
    area: "12,400 m²",
    summary: "Ninety-two apartments in two curving ribbons of balconies, each one angled to face the river.",
    cover: { src: curve, alt: "Two curving residential towers with continuous white balcony bands" },
    gallery: [],
  },
];

export const details: (Img & { title: string; ref: string; typology: Project["typology"] })[] = [
  { src: stairs, alt: "A timber stair with steel balustrade lit from above", title: "Stair, Lantern House", ref: "D-01", typology: "Interior" },
  { src: glassfacade, alt: "Stacked translucent glass panels on a white façade", title: "Façade module, Harbour Pavilion", ref: "D-02", typology: "Cultural" },
  { src: bath, alt: "A freestanding tub under a high horizontal window", title: "Bath, Casa Arco", ref: "D-03", typology: "Interior" },
  { src: twin, alt: "Two slender residential towers against a teal sky", title: "Massing study, Riverside", ref: "D-04", typology: "Residential" },
  { src: brick, alt: "The corner of a grey brick building against a deep blue sky", title: "Brick corner, Kiln Yard", ref: "D-05", typology: "Commercial" },
  { src: facade, alt: "Stacked white volumes of an apartment building", title: "Stacked volumes, Meridian Housing", ref: "D-06", typology: "Residential" },
  { src: clerestory, alt: "A long living room under a clerestory window", title: "Living room, Lantern House", ref: "D-07", typology: "Interior" },
  { src: up, alt: "Looking up between dark glass towers into fog", title: "Site visit, financial district", ref: "D-08", typology: "Commercial" },
];

export const services = [
  { name: "Architecture", scope: "New buildings, extensions and adaptive reuse", duration: "12 – 36 months", deliverables: "Feasibility, planning, technical design, site supervision" },
  { name: "Interiors", scope: "Joinery, lighting, materials and furniture, drawn with the building", duration: "4 – 14 months", deliverables: "Layouts, finish schedules, lighting, bespoke joinery" },
  { name: "Residential planning", scope: "Briefing and planning for private houses", duration: "2 – 6 months", deliverables: "Brief, site analysis, massing, planning application" },
  { name: "Commercial projects", scope: "Workplaces, hospitality and retail fit-outs", duration: "6 – 18 months", deliverables: "Workplace strategy, design, phased delivery" },
  { name: "Consultation", scope: "Second opinions for owners, developers and architects", duration: "1 – 4 weeks", deliverables: "Design review, daylight study, material advice" },
];

export const process: Img[] = [
  { src: renovation, alt: "A house under renovation with walls opened back to the brick" },
  { src: framing, alt: "Timber framing of a multi-storey building under construction" },
  { src: drawing, alt: "An architect drawing plans by hand with a scale ruler" },
];

export const philosophy =
  "A building should be quiet enough to hear the light move through it. We draw slowly, build carefully, and leave room for the people who live there to finish the work.";

export const testimonials = [
  { quote: "They listened for weeks before drawing a line. The house feels like it has always been on that hill.", name: "E. & M. Rossi", project: "Casa Arco, 2025" },
  { quote: "Planning, budget and an impossible site, handled with total calm. We would not build with anyone else.", name: "Harbour Arts Trust", project: "Harbour Pavilion, 2024" },
  { quote: "Our team arrives earlier and stays later. Nothing about the space was forced.", name: "Head of Operations", project: "Meridian Offices, 2023" },
];

export const facts = [
  { k: "Practice", v: "Est. 2008" },
  { k: "Built", v: "140 projects" },
  { k: "Studio", v: "12 people" },
  { k: "Office", v: "Northbank" },
];
