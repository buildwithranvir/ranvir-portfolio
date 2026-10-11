import { templates } from "@/lib/templates";

/** A slow strip of the businesses the templates are made for. Grows as templates are added. */
export function Marquee() {
  const items = templates.map((t) => t.goodFor.split(/,| and /)[0].trim());
  const run = (hidden: boolean) => (
    <span aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {[...items, ...items].map((x, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 text-[clamp(1.6rem,4vw,3.2rem)] font-medium tracking-[-0.03em] text-fg/90 md:px-10">{x}</span>
          <span className="h-2 w-2 rounded-full bg-accent" />
        </span>
      ))}
    </span>
  );
  return (
    <div className="mt-20 overflow-hidden border-y border-white/10 py-6 md:mt-28 md:py-8" aria-label={`Templates for ${items.join(", ")}`}>
      <div className="marquee flex w-max" style={{ ["--marquee-time" as string]: `${Math.max(30, items.length * 9)}s` }}>
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
