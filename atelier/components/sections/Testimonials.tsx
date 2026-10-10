"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "@/lib/content";
import { FoldText, Seam } from "../motion/Fold";

const expo = [0.16, 1, 0.3, 1] as const;

/** Client notes on folded cards: each one turns over like a page on its left hinge. */
export function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const t = testimonials[i];
  const go = (d: number) => {
    setDir(d);
    setI((v) => (v + d + testimonials.length) % testimonials.length);
  };

  return (
    <section aria-labelledby="t-title" aria-roledescription="carousel" className="relative bg-verdigris py-24 text-paper md:py-32">
      <Seam className="fill-verdigris" />
      <div className="sheet grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="label text-paper">04 / Client notes</p>
          <FoldText as="h2" id="t-title" by="chars" className="display mt-5 text-[clamp(2.2rem,4vw,3.8rem)]">
            Said <span className="serif font-normal text-blush">after</span> the keys.
          </FoldText>
          <p className="label mt-5 text-paper/70">Fictional notes, for demo purposes</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="fold-stage relative min-h-[17rem] sm:min-h-[15rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.figure
                key={i}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ rotateY: d > 0 ? 75 : -75, opacity: 0 }),
                  show: { rotateY: 0, opacity: 1 },
                  leave: (d: number) => ({ rotateY: d > 0 ? -75 : 75, opacity: 0 }),
                }}
                initial="enter"
                animate="show"
                exit="leave"
                transition={{ duration: 0.6, ease: expo }}
                style={{ transformOrigin: "0% 50%" }}
                className="relative bg-paper p-7 text-ink [clip-path:polygon(0_0,calc(100%-2.5rem)_0,100%_2.5rem,100%_100%,0_100%)] md:p-10"
              >
                {/* the folded corner */}
                <span aria-hidden className="absolute right-0 top-0 h-10 w-10 bg-blush [clip-path:polygon(0_0,0_100%,100%_100%)]" />
                <blockquote className="serif text-[clamp(1.45rem,2.6vw,2.3rem)] leading-[1.22]">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="label mt-7 flex flex-wrap items-center gap-x-4 gap-y-1 text-ink/65">
                  <span className="bg-ink px-2 py-0.5 text-paper">{t.name}</span>
                  <span>{t.project}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="label mt-8 flex items-center gap-4">
            <button type="button" onClick={() => go(-1)} aria-label="Previous note" className="grid h-11 w-11 place-items-center border border-paper/40 transition-colors hover:bg-paper hover:text-verdigris">
              ←
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next note" className="grid h-11 w-11 place-items-center border border-paper/40 transition-colors hover:bg-paper hover:text-verdigris">
              →
            </button>
            <span className="ml-2 flex gap-1.5" aria-hidden>
              {testimonials.map((_, k) => (
                <span key={k} className={`h-2 w-2 rotate-45 transition-colors duration-500 ${k === i ? "bg-ochre" : "bg-paper/35"}`} />
              ))}
            </span>
            <span className="ml-auto tabular-nums text-paper/75">
              {String(i + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
