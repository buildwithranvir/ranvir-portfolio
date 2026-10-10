"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { sceneNo, tools } from "@/lib/site";
import { Flip, gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Mark } from "@/components/ui/Mark";

const notes: Record<string, string> = {
  Web: "Websites and web apps — from the first layout to the last animation.",
  "Apps & data": "Mobile apps, databases, payments and the back ends behind them.",
  "AI & automation": "Agents and workflows that connect your tools and take repetitive work away.",
  Design: "Designing the experience before a single line of code.",
  Delivery: "Shipping it fast, findable, tested and easy to look after.",
  Content: "Making the YouTube videos that show how it's all built.",
};

// one colour per discipline, like the families of a periodic table
// (theme variables: bright in the dark, deeper inks in daylight — see globals.css)
const hues: Record<string, string> = {
  Web: "var(--k-web)",
  "Apps & data": "var(--k-apps)",
  "AI & automation": "var(--k-ai)",
  Design: "var(--k-design)",
  Delivery: "var(--k-delivery)",
  Content: "var(--k-content)",
};
const tint = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`;

type Element = { n: number; name: string; sym: string; group: string; gi: number };

/** Every tool becomes an element: a number, a two-letter symbol (unique), a family. */
const table: Element[] = (() => {
  const used = new Set<string>();
  let n = 0;
  return tools.flatMap((g, gi) =>
    g.items.map((name) => {
      const letters = name.replace(/[^A-Za-z0-9]/g, "");
      const words = name.split(/[\s&/.+-]+/).filter(Boolean);
      const tries = [
        ...(words.length > 1 ? [words[0][0] + words[1][0]] : []),
        ...letters
          .slice(1)
          .split("")
          .map((c) => letters[0] + c),
      ];
      const sym = tries.map((c) => c[0].toUpperCase() + c[1].toLowerCase()).find((c) => !used.has(c)) ?? letters.slice(0, 2);
      used.add(sym);
      return { n: ++n, name, sym, group: g.group, gi };
    }),
  );
})();
const total = table.length;

// The three bands of the marquee, each a mix of disciplines
const bands = [[...tools[0].items, ...tools[1].items], [...tools[2].items], [...tools[3].items, ...tools[4].items, ...tools[5].items]];

function Band({ items, i }: { items: string[]; i: number }) {
  const run = (hidden: boolean) => (
    <span aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t, k) => (
        // phones carry a shorter band (lighter to draw); both copies match, so the loop stays seamless
        <span key={t} className={`flex items-center ${k >= 12 ? "[@media(pointer:coarse)]:hidden" : ""}`}>
          <span
            className={
              (k + i) % 3 === 1
                ? "voice px-[0.35em] text-[clamp(1.62rem,3.78vw,3.6rem)] leading-[1.15] text-amber"
                : (k + i) % 3 === 2
                  ? "credit px-[0.35em] text-[clamp(1.44rem,3.42vw,3.24rem)] text-transparent [-webkit-text-stroke:1px_rgb(var(--line)/0.55)] [--w:118]"
                  : "credit px-[0.35em] text-[clamp(1.44rem,3.42vw,3.24rem)] [--w:96]"
            }
          >
            {t}
          </span>
          <span aria-hidden className="text-[clamp(0.72rem,1.26vw,1.08rem)] text-rec">
            ✦
          </span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="kit-band flex w-max will-change-transform">
      {run(false)}
      {run(true)}
    </div>
  );
}

/**
 * The toolkit as a periodic table. Three bands of tools race past (faster when
 * you scroll faster), then every tool is an element in its family's colour.
 * Point at (or tap) one and the readout shows it; pick a family and its
 * elements fly to the front of the table (GSAP Flip).
 */
export function Kit() {
  const ref = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLOListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [active, setActive] = useState<Element>(table[0]);
  const ordered = group ? [...table.filter((e) => e.group === group), ...table.filter((e) => e.group !== group)] : table;

  const pick = (g: string | null) => {
    if (window.matchMedia(MOTION_OK).matches && tableRef.current) flipState.current = Flip.getState(tableRef.current.querySelectorAll(".pt-tile"));
    setGroup(g);
    if (g) setActive(table.find((e) => e.group === g)!);
  };

  // the family flies to the front: every tile glides from where it was to where it is now
  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, { duration: 0.8, ease: "expo.inOut", stagger: 0.004, prune: true });
    flipState.current = null;
  }, [group]);

  // the readout re-sets itself when a new element is chosen
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!window.matchMedia(MOTION_OK).matches) return;
    gsap.fromTo(
      ref.current!.querySelectorAll(".pt-read-in"),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "expo.out", stagger: 0.04, overwrite: true },
    );
  }, [active]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".kit-head > *", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "clamp(top 78%)", once: true },
        });

        // the bands: endless loops, alternating direction, pushed by the scroll's speed
        const loops = gsap.utils
          .toArray<HTMLElement>(".kit-band")
          .map((b, i) =>
            gsap.fromTo(b, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 60 + i * 12, ease: "none", repeat: -1, paused: true }),
          );
        // a quick shove on a fast scroll, then back to cruising speed
        let push = 1;
        let speed = 1;
        const st = ScrollTrigger.create({
          trigger: ".kit-bands",
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
          onUpdate: (self) => {
            push = Math.max(push, gsap.utils.clamp(1, 7, 1 + Math.abs(self.getVelocity()) / 250));
          },
        });
        // the speed eases back to cruising on the ticker (no new tweens per scroll event)
        const glide = () => {
          if (!st.isActive) return;
          speed += (push - speed) * 0.2;
          push += (1 - push) * 0.06;
          if (Math.abs(speed - loops[0].timeScale()) > 0.01) loops.forEach((l) => l.timeScale(speed));
        };
        gsap.ticker.add(glide);
        gsap.from(".kit-band", {
          xPercent: (i) => (i % 2 ? -12 : 12),
          opacity: 0,
          duration: 1.6,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".kit-bands", start: "clamp(top 88%)", once: true },
        });

        // the table is set: elements tip up out of the page, rippling out from the centre of the grid
        const fine = window.matchMedia("(pointer: fine)").matches;
        // phones: the whole table rises as one piece (87 separate tiles is too much work for a phone)
        if (!fine)
          gsap.from(".pt-table", {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".pt-table", start: "clamp(top 90%)", once: true },
          });
        else
          gsap.from(".pt-tile", {
            opacity: 0,
            y: fine ? 30 : 16,
            scale: fine ? 0.5 : 0.85,
            rotateX: fine ? -75 : 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: { amount: fine ? 1.1 : 0.7, grid: "auto", from: "center" },
            scrollTrigger: { trigger: ".pt-table", start: "clamp(top 85%)", once: true },
          });
        gsap.from(".pt-read", {
          x: -30,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".pt-table", start: "clamp(top 85%)", once: true },
        });
        return () => {
          st.kill();
          gsap.ticker.remove(glide);
        };
      });
    },
    { scope: ref },
  );

  const hue = hues[active.group];
  return (
    <section ref={ref} id="kit" aria-labelledby="kit-title" className="wash tone-fog relative overflow-clip bg-void py-20 text-tungsten md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(var(--glow-a)/0.11),transparent_68%)] [[data-theme=light]_&]:hidden"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(var(--glow-b)/0.09),transparent_68%)] [[data-theme=light]_&]:bg-[radial-gradient(circle,rgb(var(--glow-c)/0.24),transparent_68%)]"
      />

      <div className="frame relative">
        <div className="kit-head grid grid-cols-1 gap-8 text-center lg:grid-cols-12 lg:items-end lg:text-left">
          <div className="lg:col-span-6">
            <p className="hud text-dust">{sceneNo("kit")} — Toolkit</p>
            <h2 id="kit-title" className="credit mt-4 text-[clamp(1.98rem,3.96vw,3.6rem)] [--w:80]">
              What I build{" "}
              <span className="voice normal-case text-amber">
                <Mark kind="circle" tone="blue">
                  with
                </Mark>
              </span>
            </h2>
            <p className="hud mt-4 text-dust">
              <span className="text-tungsten">{total} elements</span> · {tools.length} families · one person
            </p>
          </div>
          <div className="lg:col-span-6">
            <div role="group" aria-label="Bring a family forward" className="flex flex-wrap justify-center gap-2 lg:justify-end">
              {[null, ...tools.map((g) => g.group)].map((g) => (
                <button
                  key={g ?? "all"}
                  type="button"
                  aria-pressed={group === g}
                  onClick={() => pick(g)}
                  className={`hud flex h-10 items-center gap-2 rounded-full px-4 transition-colors duration-300 ${group === g ? "bg-tungsten text-void" : "glass hover:text-amber"}`}
                >
                  {g && <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: hues[g] }} />}
                  {g ?? "Everything"}
                  <span className={group === g ? "text-void/60" : "text-dust"}>{g ? tools.find((x) => x.group === g)!.items.length : total}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The bands */}
      <div aria-hidden className="kit-bands relative mt-14 -rotate-[2deg] space-y-1 py-6 md:mt-20 md:space-y-2">
        {bands.map((b, i) => (
          <Band key={i} items={b} i={i} />
        ))}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[12vw] bg-gradient-to-r from-void to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[12vw] bg-gradient-to-l from-void to-transparent" />
      </div>

      {/* The periodic table */}
      {/* the table sits on graph paper */}
      <div className="graph frame relative mt-14 grid grid-cols-1 gap-6 py-4 md:mt-20 lg:grid-cols-12 lg:gap-8">
        {/* the readout: sticks to the top on phones so a tapped element is always explained */}
        <aside aria-live="polite" className="pt-read sticky top-16 z-10 self-start md:top-20 lg:col-span-3 lg:top-28">
          <div
            className="glass relative overflow-hidden rounded-2xl p-4 lg:p-6"
            // solid, so tiles scrolling beneath it never show through
            style={{ "--hue": hue, background: "var(--read-bg)" } as CSSProperties}
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: hue }} />
            <div className="flex items-center gap-4 lg:block">
              <div
                className="grid aspect-square w-20 shrink-0 place-items-center rounded-xl border lg:w-full lg:max-w-[12rem]"
                style={{ borderColor: tint(hue, 40), background: tint(hue, 7) }}
              >
                <div className="pt-read-in flex w-full flex-col items-center px-2">
                  <span className="self-stretch text-left font-mono text-[0.6rem] text-dust lg:text-[0.7rem]">{String(active.n).padStart(2, "0")}</span>
                  <span className="credit text-[2rem] normal-case leading-none [--w:100] lg:text-[4.2rem]" style={{ color: hue }}>
                    {active.sym}
                  </span>
                  <span className="mt-1 hidden truncate font-mono text-[0.7rem] text-tungsten/75 lg:block">{active.name}</span>
                </div>
              </div>
              <div className="min-w-0 lg:mt-5">
                <p className="pt-read-in hud flex items-center gap-2" style={{ color: hue }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: hue }} />
                  {active.group}
                </p>
                <p className="pt-read-in voice mt-1 truncate text-[1.5rem] leading-tight lg:mt-2 lg:text-[2rem]">{active.name}</p>
                <p className="pt-read-in mt-1 text-[0.9rem] leading-relaxed text-tungsten/65 lg:mt-3">{notes[active.group]}</p>
              </div>
            </div>
          </div>
        </aside>

        <ol
          ref={tableRef}
          aria-label="Tools"
          className="pt-table grid grid-cols-[repeat(auto-fill,minmax(3.6rem,1fr))] gap-1.5 [perspective:1200px] sm:grid-cols-[repeat(auto-fill,minmax(4.6rem,1fr))] md:gap-2 lg:col-span-9"
        >
          {ordered.map((e) => {
            const h = hues[e.group];
            const on = !group || group === e.group;
            const here = active.name === e.name;
            return (
              <li key={e.name} data-flip-id={e.name} className="pt-tile">
                <button
                  type="button"
                  aria-label={`${e.name} — ${e.group}`}
                  aria-pressed={here}
                  onPointerEnter={(ev) => ev.pointerType === "mouse" && setActive(e)}
                  onFocus={() => setActive(e)}
                  onClick={() => setActive(e)}
                  className={`pt-cell relative flex aspect-square w-full flex-col justify-between rounded-md border p-1 text-left sm:p-1.5 ${on ? "" : "opacity-25"} ${here ? "is-here" : ""}`}
                  style={{ "--hue": h } as CSSProperties}
                >
                  <span className="flex justify-between font-mono text-[0.5rem] leading-none text-dust sm:text-[0.56rem]">
                    <span>{e.n}</span>
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: h }} />
                  </span>
                  <span className="credit text-center text-[clamp(1.05rem,1.5vw,1.45rem)] normal-case leading-none [--w:100]" style={{ color: h }}>
                    {e.sym}
                  </span>
                  <span className="truncate text-center text-[0.5rem] leading-tight text-tungsten/70 sm:text-[0.56rem]">{e.name}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
