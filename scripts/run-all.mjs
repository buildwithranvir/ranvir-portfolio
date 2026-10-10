// Runs `npm install` or an npm script in every project, one after another.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { projects } from "./projects.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const task = process.argv[2];
const args = task === "install" ? ["install"] : ["run", task];
const failed = [];

for (const { name } of projects) {
  console.log(`\n▸ ${name}: npm ${args.join(" ")}`);
  const res = spawnSync("npm", args, { cwd: path.join(root, name), stdio: "inherit", shell: true });
  if (res.status !== 0) failed.push(name);
}

if (failed.length) {
  console.error(`\nFailed: ${failed.join(", ")}`);
  process.exit(1);
}
console.log("\nAll projects done.");
