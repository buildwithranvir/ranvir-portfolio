// Captures the preview images for one template on the templates site.
//
//   npm run capture -- <id> <live-url>
//   e.g. npm run capture -- noir https://noir-green-psi.vercel.app
//
// Writes four JPEGs to catalogue/public/t/<id>/ and records their sizes in
// catalogue/lib/previews.json, so the site needs no other edits.
// The pages are captured with reduced motion on, so every section is in its
// final, fully visible state.
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [id, url] = process.argv.slice(2);
if (!id || !/^[a-z0-9-]+$/.test(id) || !url?.startsWith("http")) {
  console.error("Usage: npm run capture -- <id> <live-url>   (id: lowercase letters, numbers, dashes)");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "catalogue", "public", "t", id);
const metaFile = path.join(root, "catalogue", "lib", "previews.json");
mkdirSync(out, { recursive: true });

const shots = [
  { file: "desktop.jpg", viewport: { width: 1440, height: 900 }, scale: 1, full: false },
  { file: "desktop-full.jpg", viewport: { width: 1440, height: 900 }, scale: 1, full: true, cap: 7000 },
  { file: "mobile.jpg", viewport: { width: 390, height: 844 }, scale: 2, full: false, mobile: true },
  { file: "mobile-full.jpg", viewport: { width: 390, height: 844 }, scale: 1.5, full: true, cap: 7000, mobile: true },
];

const browser = await chromium.launch();
const sizes = {};
for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: s.viewport,
    deviceScaleFactor: s.scale,
    isMobile: !!s.mobile,
    hasTouch: !!s.mobile,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  // walk down the page once so lazy images load, then return to the top
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  const h = s.full ? Math.min(await page.evaluate(() => document.documentElement.scrollHeight), s.cap) : s.viewport.height;
  await page.screenshot({
    path: path.join(out, s.file),
    type: "jpeg",
    quality: 82,
    fullPage: s.full,
    clip: { x: 0, y: 0, width: s.viewport.width, height: h },
  });
  sizes[s.file.replace(".jpg", "")] = { w: s.viewport.width, h };
  console.log(`  ${s.file.padEnd(17)} ${s.viewport.width} x ${h} (css px)`);
  await ctx.close();
}
await browser.close();

let meta = {};
try {
  meta = JSON.parse(readFileSync(metaFile, "utf8"));
} catch {}
meta[id] = sizes;
writeFileSync(metaFile, JSON.stringify(meta, null, 2) + "\n");
console.log(`Saved to catalogue/public/t/${id}/ and catalogue/lib/previews.json`);
