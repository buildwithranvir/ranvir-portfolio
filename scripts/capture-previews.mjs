// Re-captures the screenshots used on the showcase homepage.
// 1. Start every site:  npm run build:all  then start each (or npm run dev:all)
// 2. Run:               npx --yes playwright@1 install chromium   (first time only)
//                       node scripts/capture-previews.mjs
// Writes PNGs into showcase/public/previews — convert to JPG (or keep PNG and
// update the imports in showcase/lib/previews.ts).
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../showcase/public/previews");
const demos = [
  { name: "noir", port: 3001, section: "#menu", offset: -60 },
  { name: "vanta", port: 3002, section: "#edit", offset: 120 },
  { name: "atelier", port: 3003, section: "#details", offset: 0 },
  { name: "nova", port: 3004, section: "#work", offset: 140 },
];

const browser = await chromium.launch();
for (const d of demos) {
  for (const [kind, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: kind === "mobile" ? 2 : 1.25 });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${d.port}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(6000); // let intros finish
    await page.screenshot({ path: `${out}/${d.name}-${kind}.png` });
    if (kind === "desktop") {
      const y = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, d.section);
      for (let t = 0; t <= y + d.offset; t += 400) {
        await page.evaluate((t) => window.scrollTo(0, t), t);
        await page.waitForTimeout(90);
      }
      await page.waitForTimeout(2600);
      await page.screenshot({ path: `${out}/${d.name}-section.png` });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`Saved previews to ${out}`);
