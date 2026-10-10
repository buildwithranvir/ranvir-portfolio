// ─────────────────────────────────────────────────────────────
// Demo content for NOIR, a fictional neighbourhood café and bakery.
// Every name, price and quote here is placeholder copy, so swap it
// out freely when adapting the template for a client.
// ─────────────────────────────────────────────────────────────
import type { StaticImageData } from "next/image";

import roaster from "@/public/images/n-roaster.jpg";
import window_ from "@/public/images/n-window.jpg";
import dough from "@/public/images/n-dough.jpg";
import above from "@/public/images/n-above.jpg";
import shopfront from "@/public/images/n-shopfront.jpg";
import banquette from "@/public/images/n-banquette.jpg";
import serving from "@/public/images/n-serving.jpg";
import barista from "@/public/images/n-barista.jpg";
import crowd from "@/public/images/n-crowd.jpg";
import grinder from "@/public/images/n-grinder.jpg";
import croissant from "@/public/images/n-croissant.jpg";
import tea from "@/public/images/n-tea.jpg";
import glass from "@/public/images/n-glass.jpg";
import bread from "@/public/images/n-bread.jpg";

export type Photo = { src: StaticImageData; alt: string };

/** One special per weekday, Monday first. Shown as a handwritten note in the hero. */
export const specials = [
  { day: "Monday", item: "Rye porridge, brown butter, plums", price: "6.50" },
  { day: "Tuesday", item: "Roast day: a free taster of the new beans", price: "0.00" },
  { day: "Wednesday", item: "Cardamom knots, still warm at nine", price: "3.80" },
  { day: "Thursday", item: "Espresso tonic with blood orange", price: "5.20" },
  { day: "Friday", item: "Sourdough focaccia, tomato, oregano", price: "5.50" },
  { day: "Saturday", item: "The long-table breakfast for two", price: "24.00" },
  { day: "Sunday", item: "Pastry until it runs out (it will)", price: "—" },
];

/** A day at the café, told as a sequence of moments. */
export const day: { time: string; title: string; text: string; photo: Photo }[] = [
  {
    time: "05:40",
    title: "The roaster warms up",
    text: "Tuesday is roast day. The drum turns in the back room before the street lights go off.",
    photo: { src: roaster, alt: "Freshly roasted coffee beans tumbling out of a drum roaster" },
  },
  {
    time: "06:10",
    title: "Dough on the bench",
    text: "Lamination by hand, cold butter, and a radio playing quietly. The cardamom knots go in last.",
    photo: { src: dough, alt: "Hands kneading a ball of dough on a floured wooden bench" },
  },
  {
    time: "07:00",
    title: "Doors open",
    text: "The first regulars take the window seat with a book and a filter coffee. It's quiet until eight.",
    photo: { src: window_, alt: "A window table with an open notebook and a cup of coffee in morning light" },
  },
  {
    time: "12:30",
    title: "The lunch rush",
    text: "Six people behind the bar, two grinders, and one long queue that never feels long.",
    photo: { src: above, alt: "Seen from above, baristas and customers crowd a busy coffee bar" },
  },
  {
    time: "17:00",
    title: "Last pour",
    text: "Lights low, chairs up, and whatever is left in the pastry case goes home with whoever's still here.",
    photo: { src: shopfront, alt: "A small café shopfront glowing at dusk with a bicycle parked outside" },
  },
];

/** This week's coffees, presented as bag labels rather than cup photos. */
export const beans = [
  {
    name: "Gakuyuni",
    country: "Kenya",
    region: "Kirinyaga",
    process: "Washed",
    altitude: "1,800 m",
    notes: ["blackcurrant", "rhubarb", "black tea"],
    use: "Filter",
    roasted: "Tue 29 Sep",
  },
  {
    name: "La Esperanza",
    country: "Colombia",
    region: "Huila",
    process: "Honey",
    altitude: "1,650 m",
    notes: ["panela", "red apple", "cocoa nib"],
    use: "Espresso",
    roasted: "Tue 29 Sep",
  },
  {
    name: "Bombe",
    country: "Ethiopia",
    region: "Sidama",
    process: "Natural",
    altitude: "2,100 m",
    notes: ["strawberry", "jasmine", "honey"],
    use: "Filter & cold brew",
    roasted: "Tue 22 Sep",
  },
];

export type MenuItem = { name: string; detail: string; price: string; note?: string };
export type MenuSection = { id: string; label: string; items: MenuItem[] };

export const menu: MenuSection[] = [
  {
    id: "espresso",
    label: "Espresso bar",
    items: [
      { name: "Espresso", detail: "La Esperanza, 18 g in, 36 out", price: "3.00" },
      { name: "Cortado", detail: "Equal parts, served in glass", price: "3.80", note: "our favourite" },
      { name: "Flat white", detail: "Double ristretto, thin milk", price: "4.40" },
      { name: "Cappuccino", detail: "Dry, with a dusting of cocoa", price: "4.20" },
      { name: "Espresso tonic", detail: "Over ice, orange peel", price: "5.20" },
      { name: "Oat, almond or whole milk", detail: "No charge, ever", price: "0.00" },
    ],
  },
  {
    id: "filter",
    label: "Filter & cold",
    items: [
      { name: "Batch brew", detail: "Refilled every forty minutes", price: "3.20" },
      { name: "V60 by hand", detail: "Any coffee on the shelf", price: "5.00", note: "try the Kenya" },
      { name: "Chemex for two", detail: "600 ml, two cups", price: "8.50" },
      { name: "Cold brew", detail: "Steeped overnight, served long", price: "4.80" },
      { name: "Hojicha latte", detail: "Roasted green tea and milk", price: "4.60" },
      { name: "Pot of loose-leaf tea", detail: "Ask what's open", price: "3.80" },
    ],
  },
  {
    id: "bakery",
    label: "From the oven",
    items: [
      { name: "Butter croissant", detail: "Cultured butter, three days", price: "3.40" },
      { name: "Cardamom knot", detail: "Pearl sugar, Swedish style", price: "3.80", note: "gone by 11" },
      { name: "Seeded rye", detail: "With salted butter and jam", price: "4.50" },
      { name: "Focaccia slice", detail: "Changes daily", price: "4.20" },
      { name: "Olive oil cake", detail: "Orange, crème fraîche", price: "4.60" },
      { name: "A loaf to take home", detail: "Sourdough or rye", price: "7.00" },
    ],
  },
];

export const room = {
  lead: { src: crowd, alt: "A busy, sunlit café with people at tables and staff behind the counter" },
  strip: [
    { src: banquette, alt: "A green velvet banquette beside a wall of potted plants" },
    { src: barista, alt: "A barista laughing behind the counter while preparing an order" },
    { src: serving, alt: "Two baristas serving drinks across a long wooden bar" },
    { src: grinder, alt: "A coffee grinder and shelves of cups on the back bar" },
    { src: croissant, alt: "Croissants on a dark slate, dusted with flour" },
    { src: bread, alt: "Loaves of seeded rye bread with stalks of wheat" },
  ] as Photo[],
  quotes: [
    { text: "I came for the wifi, stayed for the cardamom knots.", who: "Jonas, regular since 2019" },
    { text: "The only place that remembers I take my flat white short.", who: "Amira, Tuesdays" },
  ],
};

export const menuPhotos = {
  side: { src: glass, alt: "A small glass of iced coffee on a white table, striped with window shadows" },
  tea: { src: tea, alt: "A clay teapot and a glass of tea on a wooden tray" },
};
