"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { demos, scenes, studio } from "@/lib/site";
import { previews } from "@/lib/previews";

const expo = [0.16, 1, 0.3, 1] as const;
const no = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The index: every section of the page in two groups, set in the serif voice
 * with mono numbers. On larger screens a glass preview on the left shows what
 * you're pointing at - the real screenshot for a project, a title card for
 * everything else.
 */
export function IndexMenu({ current, onGo, onClose }: { current: number; onGo: (id: string) => void; onClose: () => void }) {
  const [peek, setPeek] = useState(current);
  const ps = scenes[peek];
  const pd = demos.find((d) => d.id === ps.id);
  // contiguous runs of the page, in page order
  const groups = [
    { label: "Introduction", from: 0, to: 2 },
    { label: "Selected work", from: 3, to: 7 },
    { label: "More", from: 8, to: scenes.length - 1 },
  ];

  return (
    <motion.div
      id="scenes"
      role="dialog"
      aria-modal="true"
      aria-label="Index"
      data-lenis-prevent
      className="fixed inset-0 z-[90] overflow-y-auto bg-void/85 text-tungsten backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      transition={{ duration: 0.4 }}
    >
      <div className="frame flex min-h-full flex-col py-5 md:py-6">
        <div className="flex items-center justify-between">
          <p className="hud text-dust">
            {studio.name} · {scenes.length} sections
          </p>
          <button type="button" onClick={onClose} className="glass hud h-10 rounded-full px-4 transition-colors hover:text-amber">
            Close · Esc
          </button>
        </div>

        <div className="mt-8 grid flex-1 grid-cols-1 gap-10 md:mt-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: title + preview */}
          <motion.div className="hidden flex-col self-start lg:sticky lg:top-6 lg:col-span-5 lg:flex" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: expo, delay: 0.05 }}>
            <h2 className="voice text-[clamp(2.7rem,4.5vw,4.14rem)] leading-none">Index</h2>
            <p className="mt-3 max-w-[32ch] text-dust">Jump to any part of the page, or straight into one of the sites.</p>

            <div className="glass mt-8 overflow-hidden rounded-2xl p-2">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                {pd ? (
                  <Image key={pd.id} src={previews[pd.id].desktop} alt="" fill sizes="38vw" className="object-cover object-top" />
                ) : (
                  <div key={ps.id} className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(circle_at_75%_20%,rgb(var(--glow-a)/0.2),transparent_60%),linear-gradient(160deg,var(--color-reel),var(--color-void))] p-6">
                    <span className="hud text-dust">Section {no(peek)}</span>
                    <div>
                      <p className="credit text-[clamp(3.06rem,5.4vw,4.86rem)] text-amber [--w:110]">{no(peek)}</p>
                      <p className="voice mt-2 text-[1.9rem] leading-tight">{ps.title}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-between gap-4 px-3 pb-2 pt-3">
                <p className="voice text-[1.25rem]">{ps.title}</p>
                <p className="hud text-right text-dust">{ps.blurb}</p>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-8">
              <a href={studio.whatsappHref} target="_blank" rel="noreferrer" className="hud link-draw text-tungsten">
                WhatsApp ↗
              </a>
              <a href={studio.phoneHref} className="hud link-draw text-tungsten">
                {studio.phone}
              </a>
              <span className="hud text-dust">{studio.location}</span>
            </div>
          </motion.div>

          {/* Right: the sections */}
          <nav aria-label="Sections" className="lg:col-span-7 lg:col-start-6">
            {groups.map((g, gi) => (
              <div key={g.label} className={gi ? "mt-7" : ""}>
                <p className="hud mb-2 flex items-center gap-3 text-dust">
                  <span className="h-px w-6 bg-dust/50" />
                  {g.label}
                </p>
                <motion.ol initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.04, delayChildren: 0.12 + gi * 0.12 } } }}>
                  {scenes.map((sc, i) => {
                    if (i < g.from || i > g.to) return null;
                    const here = i === current;
                    return (
                      <motion.li key={sc.id} variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }} transition={{ duration: 0.55, ease: expo }} className="border-t border-tungsten/10">
                        <button
                          id={`scene-${i}`}
                          type="button"
                          onClick={() => onGo(sc.id)}
                          onPointerEnter={() => setPeek(i)}
                          onFocus={() => setPeek(i)}
                          className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 py-3.5 text-left lg:py-2.5"
                        >
                          <span className={`hud transition-colors ${here ? "text-amber" : "text-dust group-hover:text-amber"}`}>{no(i)}</span>
                          <span className="flex min-w-0 flex-col lg:flex-row lg:items-baseline lg:justify-between lg:gap-6">
                            <span className={`voice block truncate text-[clamp(1.4rem,1.98vw,1.8rem)] leading-tight transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-1.5 ${here ? "text-amber" : "group-hover:text-amber"}`}>
                              {sc.title}
                            </span>
                            <span className="mt-0.5 block truncate text-[0.875rem] text-dust lg:mt-0 lg:text-right">{sc.blurb}</span>
                          </span>
                          <span className="hud flex items-center gap-2 text-dust">
                            {here && (
                              <span className="flex items-center gap-1.5 text-amber">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber" /> <span className="hidden sm:inline">You&rsquo;re here</span>
                              </span>
                            )}
                            <span aria-hidden className="translate-x-[-6px] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                              →
                            </span>
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </motion.ol>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </motion.div>
  );
}
