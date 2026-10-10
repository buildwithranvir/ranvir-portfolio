// Replaces em and en dashes with plain hyphens in the showcase's source comments and config.
// Run after copy edits: node scripts/sweep-dashes.mjs (from the TEMPLATES folder).
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const base = "showcase";
const dirs = ["app", "lib", "components"];
const extra = [".env.example"];
const exts = new Set([".ts", ".tsx", ".css", ".mjs"]);

const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : exts.has(extname(p)) ? [p] : [];
  });

const files = [...dirs.flatMap((d) => walk(join(base, d))), ...extra.map((f) => join(base, f))];
let changed = 0;
for (const f of files) {
  const s = readFileSync(f, "utf8");
  const t = s.replace(/ [—–] /g, " - ").replace(/[—–]/g, "-");
  if (t !== s) {
    writeFileSync(f, t, "utf8");
    changed++;
    console.log("swept", f);
  }
}
console.log(`${changed} file(s) swept`);
