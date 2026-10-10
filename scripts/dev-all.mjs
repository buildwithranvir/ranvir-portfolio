// Starts every project's dev server on its own port with prefixed output.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { projects } from "./projects.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const children = projects.map(({ name, port }) => {
  const child = spawn("npm", ["run", "dev"], { cwd: path.join(root, name), shell: true });
  const prefix = `[${name}:${port}]`.padEnd(17);
  const pipe = (stream, out) =>
    stream.on("data", (buf) =>
      buf.toString().split(/\r?\n/).filter(Boolean).forEach((line) => out.write(`${prefix} ${line}\n`)),
    );
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  return child;
});

console.log(projects.map(({ name, port }) => `  ${name.padEnd(9)} http://localhost:${port}`).join("\n"));

const stop = () => {
  children.forEach((c) => c.kill());
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
