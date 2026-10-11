// ─────────────────────────────────────────────────────────────
// Demo content for VANTA, a fictional independent label that
// publishes each collection as an "issue". Products, prices,
// people and quotes are all placeholders.
// ─────────────────────────────────────────────────────────────
import type { StaticImageData } from "next/image";

import cover from "@/public/images/v-cover.jpg";
import collar from "@/public/images/v-collar.jpg";
import knit from "@/public/images/v-knit.jpg";
import dark from "@/public/images/v-dark.jpg";
import burgundy from "@/public/images/v-burgundy.jpg";
import rack from "@/public/images/v-rack.jpg";
import arcade from "@/public/images/hero-1.jpg";
import circle from "@/public/images/hero-2.jpg";
import street from "@/public/images/hero-3.jpg";
import neon from "@/public/images/look-neon.jpg";
import violet from "@/public/images/portrait-4.jpg";
import sheer from "@/public/images/portrait-1.jpg";
import pDenim from "@/public/images/p-denim.jpg";
import pRider from "@/public/images/p-rider.jpg";
import pBomber from "@/public/images/p-bomber.jpg";
import pKnit from "@/public/images/p-knit.jpg";
import pTee from "@/public/images/p-tee.jpg";
import pTrouser from "@/public/images/p-trouser.jpg";
import pShirt from "@/public/images/v-shirt.jpg";
import pHeels from "@/public/images/p-heels.jpg";
import bag from "@/public/images/bag.jpg";
import duo from "@/public/images/s-duo.jpg";
import cutlight from "@/public/images/s-cutlight.jpg";
import hands from "@/public/images/s-hands.jpg";
import tailor from "@/public/images/s-tailor.jpg";
import rosa from "@/public/images/s-rosa.jpg";
import mara from "@/public/images/t-mara.jpg";
import teodor from "@/public/images/t-teodor.jpg";
import ines from "@/public/images/t-ines.jpg";
import jonah from "@/public/images/t-jonah.jpg";
import dPinstripe from "@/public/images/d-pinstripe.jpg";
import dCutter from "@/public/images/d-cutter.jpg";
import dSketches from "@/public/images/d-sketches.jpg";
import dForms from "@/public/images/d-forms.jpg";
import dSewroom from "@/public/images/d-sewroom.jpg";

export type Img = { src: StaticImageData; alt: string };

/** The opening: the people behind the label, before any clothes. */
export const intro = {
  kicker: "Est. 2014 · Port District",
  lead: { src: duo, alt: "Two VANTA designers standing in the studio beside a dress form and a wall of pattern pieces" } as Img,
  hands: { src: hands, alt: "Close-up of hands cutting a paper pattern with tailoring shears" } as Img,
  tailor: { src: tailor, alt: "Black and white photograph of a master tailor sitting cross-legged on the cutting table, sewing by hand" } as Img,
  light: { src: cutlight, alt: "A designer laying out fabric on the cutting table in hard window light" } as Img,
};

export type Person = { name: string; role: string; since: string; note: string; favourite: string; image: Img; focus: string };

export const team: Person[] = [
  { name: "Mara Okonkwo", role: "Founder, creative director", since: "2014", note: "Started VANTA with one black coat.", favourite: "Rider Jacket", image: { src: mara, alt: "Portrait of Mara Okonkwo, chin resting on her hand" }, focus: "50% 22%" },
  { name: "Teodor Lisk", role: "Master tailor", since: "2015", note: "Forty-one years at the bench.", favourite: "Pleated Trouser", image: { src: teodor, alt: "Teodor Lisk at the cutting table, a tape measure round his neck" }, focus: "50% 50%" },
  { name: "Ines Marr", role: "Head of pattern", since: "2017", note: "Drafts every block by hand first.", favourite: "Open Knit", image: { src: ines, alt: "Portrait of Ines Marr in the studio, a tape measure round her neck" }, focus: "50% 30%" },
  { name: "Jonah Vell", role: "Cutter", since: "2021", note: "Never wastes a metre of cloth.", favourite: "Selvedge Trucker", image: { src: jonah, alt: "Portrait of Jonah Vell in the workshop" }, focus: "50% 40%" },
];

export const stats = [
  { value: 12, suffix: "", label: "years on the same cutting table" },
  { value: 9, suffix: "", label: "people, every one named on the label" },
  { value: 3, suffix: "", label: "family workshops within 40 km" },
  { value: 0, suffix: "", label: "pieces ever put on sale" },
];

export const workshop: (Img & { caption: string })[] = [
  { src: dCutter, alt: "A pattern cutter at her desk between dress forms and rolls of paper", caption: "Pattern room, Tuesday" },
  { src: dPinstripe, alt: "Hands guiding pinstripe wool through an industrial sewing machine", caption: "Wool crêpe, first seam" },
  { src: dSketches, alt: "Fitting photographs and sketches pinned in a grid on the studio wall", caption: "The fitting wall" },
  { src: dForms, alt: "Dress forms seen through a gap in the workshop shelving", caption: "Forms waiting for Issue 08" },
  { src: dSewroom, alt: "A seamstress bent over her work in a bright sewing room", caption: "Finishing, by hand" },
];

export const studioPortrait = { src: rosa, alt: "A VANTA designer standing in the studio beside a toile on a dress form" } as Img;

export const issue = {
  number: "07",
  title: "Quiet Armour",
  season: "Spring / Summer 2026",
  standfirst: "Clothes for people who would rather not be looked at, and usually are.",
  cover: { src: cover, alt: "A model in a long black coat and wide-brimmed hat against a white wall cut by a red diagonal" } as Img,
  inset: { src: collar, alt: "Close portrait of a model in a white collar and patterned jacket" } as Img,
};

/** Table of contents, which doubles as the site navigation. */
export const contents = [
  { n: "02", title: "Hard Light", note: "The campaign, in eight plates", href: "#lookbook" },
  { n: "18", title: "The Edit", note: "Nine pieces from the collection", href: "#edit" },
  { n: "34", title: "Letter from the studio", note: "On making less", href: "#letter" },
  { n: "40", title: "Back issues", note: "Every collection since 2014", href: "#issues" },
] as const;

export const plates: (Img & { caption: string; credit: string; shape: "tall" | "wide" | "square" })[] = [
  { src: arcade, alt: "A woman in a long camel coat walking through a vaulted stone arcade", caption: "Wool-silk coat, worn open", credit: "Plate 01", shape: "tall" },
  { src: collar, alt: "Portrait of a model in a crisp white collar and printed jacket", caption: "Poplin collar, detachable", credit: "Plate 02", shape: "tall" },
  { src: neon, alt: "A woman leaning against a teal wall in black and white striped wide trousers", caption: "Pinstripe trouser, high waist", credit: "Plate 03", shape: "tall" },
  { src: knit, alt: "A woman in a fitted black knit dress and chain necklace against grey", caption: "Ribbed knit top, wrap skirt", credit: "Plate 04", shape: "tall" },
  { src: circle, alt: "A young man in a dark jacket seated in front of a circular window", caption: "Washed leather blouson", credit: "Plate 05", shape: "square" },
  { src: burgundy, alt: "A woman in an off-shoulder burgundy dress seated against violet light", caption: "Off-shoulder satin dress", credit: "Plate 06", shape: "tall" },
  { src: dark, alt: "Portrait of a man in a dark shawl-collar knit against black", caption: "Shawl-collar cardigan", credit: "Plate 07", shape: "tall" },
  { src: sheer, alt: "A woman in a sheer black blouse with her hand in her hair", caption: "Sheer crêpe blouse", credit: "Plate 08", shape: "tall" },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Outerwear" | "Tops" | "Bottoms" | "Accessories";
  collection: string;
  material: string;
  description: string;
  image: Img;
};

export const products: Product[] = [
  { id: "v-001", name: "Rider Jacket", price: 980, category: "Outerwear", collection: "Quiet Armour", material: "Vegetable-tanned lambskin", description: "A boxy rider in washed lambskin, with an asymmetric zip and horn hardware. Soft from the first wear.", image: { src: pRider, alt: "A man seated on a ledge in a black leather rider jacket and dark jeans" } },
  { id: "v-002", name: "Selvedge Trucker", price: 420, category: "Outerwear", collection: "Nocturne", material: "14 oz Japanese selvedge", description: "Cut longer through the body, with a corduroy collar and hand-hammered buttons.", image: { src: pDenim, alt: "A dark denim jacket with a corduroy collar on a hanger against black" } },
  { id: "v-003", name: "Copper Bomber", price: 560, category: "Outerwear", collection: "Line & Void", material: "Dry nylon twill", description: "A light bomber with ribbed hems and an inside pocket. Packs into itself.", image: { src: pBomber, alt: "A rust-coloured bomber jacket held up on a hanger" } },
  { id: "v-004", name: "Open Knit", price: 340, category: "Tops", collection: "Quiet Armour", material: "Undyed organic cotton", description: "An open-stitch knit in undyed cotton, fringed at the hem. Weighs almost nothing.", image: { src: pKnit, alt: "A cream open-knit poncho with fringe on a wooden hanger" } },
  { id: "v-005", name: "Heavy Tee", price: 95, category: "Tops", collection: "Line & Void", material: "280 gsm loopback cotton", description: "The only T-shirt we make. Dense, slightly cropped, and the collar keeps its shape.", image: { src: pTee, alt: "A man in a heavyweight white T-shirt" } },
  { id: "v-006", name: "Chambray Shirt", price: 260, category: "Tops", collection: "Nocturne", material: "Garment-dyed chambray", description: "A relaxed shirt with a single pocket, washed until it feels borrowed.", image: { src: pShirt, alt: "A pale blue patterned shirt on a hanger against grey" } },
  { id: "v-007", name: "Pleated Trouser", price: 310, category: "Bottoms", collection: "Quiet Armour", material: "Wool crêpe", description: "High-rise, double-pleated and tapered to the ankle. Cuffs finished by hand.", image: { src: pTrouser, alt: "A model in high-waisted tapered trousers and strappy heels" } },
  { id: "v-008", name: "Studio Pump", price: 450, category: "Accessories", collection: "Nocturne", material: "Printed duchess satin", description: "A pointed pump on a 95 mm heel, in a floral we printed for one season only.", image: { src: pHeels, alt: "A pair of printed satin heels against a pale blue backdrop" } },
  { id: "v-009", name: "Quilted Bag", price: 690, category: "Accessories", collection: "Line & Void", material: "Quilted calfskin", description: "A structured shoulder bag with a sliding chain strap.", image: { src: bag, alt: "A quilted black shoulder bag with sunglasses and jewellery around it" } },
];

export const collections = ["All", "Quiet Armour", "Nocturne", "Line & Void"] as const;

export const letter = {
  title: "On making less",
  portrait: { src: mara, alt: "Portrait of Mara Okonkwo, founder" } as Img,
  signature: "Mara Okonkwo, founder",
  paragraphs: [
    "We started VANTA in 2014 with one black coat and a promise to ourselves: make fewer things, make them slowly, and make them to be worn for a decade.",
    "Twelve years later, every piece still begins on the same cutting table. We sample by hand, produce in runs small enough to know every workshop by name, and never put anything on sale. If a piece sells out, we make it again.",
    "This issue is about armour, though not the loud kind. It's about a coat with the right weight on the shoulders, a collar that holds its line all day, a trouser cut close enough that you forget it. Clothes that let you stop thinking about clothes.",
  ],
  pull: "A good coat should feel like a decision you only had to make once.",
};

export const backIssues: { n: string; title: string; season: string; pieces: number; filter: (typeof collections)[number]; image: Img }[] = [
  { n: "07", title: "Quiet Armour", season: "SS26", pieces: 24, filter: "Quiet Armour", image: { src: cover, alt: "Issue 07 cover: a model in a black coat and hat" } },
  { n: "06", title: "Nocturne", season: "AW25", pieces: 31, filter: "Nocturne", image: { src: street, alt: "Issue 06 cover: a woman in a dark coat on a city street" } },
  { n: "05", title: "Line & Void", season: "SS25", pieces: 18, filter: "Line & Void", image: { src: violet, alt: "Issue 05 cover: portrait of a woman in a black crewneck under violet light" } },
  { n: "01-04", title: "The Archive", season: "2014-2024", pieces: 140, filter: "All", image: { src: rack, alt: "A rail of garments in a bright white studio" } },
];
