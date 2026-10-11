// Replaces em and en dashes with plain hyphens in source comments, config and READMEs.
// Run after copy edits, from the TEMPLATES folder:
//   node scripts/sweep-dashes.mjs                 (the portfolio)
//   node scripts/sweep-dashes.mjs noir vanta      (any project folders)
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const bases = process.argv.slice(2).length ? process.argv.slice(2) : ["showcase"];
const dirs = ["app", "lib", "components"];
const extra = [".env.example", "README.md"];
const exts = new Set([".ts", ".tsx", ".css", ".mjs"]);

const walk = (d) =>
  existsSync(d)
    ? readdirSync(d).flatMap((n) => {
        const p = join(d, n);
        return statSync(p).isDirectory() ? walk(p) : exts.has(extname(p)) ? [p] : [];
      })
    : [];

let changed = 0;
for (const base of bases) {
  const files = [...dirs.flatMap((d) => walk(join(base, d))), ...extra.map((f) => join(base, f)).filter((f) => existsSync(f))];
  for (const f of files) {
    const s = readFileSync(f, "utf8");
    const t = s.replace(/ [—–] /g, " - ").replace(/[—–]/g, "-");
    if (t !== s) {
      writeFileSync(f, t, "utf8");
      changed++;
      console.log("swept", f);
    }
  }
}
console.log(`${changed} file(s) swept`);
