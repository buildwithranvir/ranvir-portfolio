"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { method } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const WEEKS = 12;
const snap = [0.2, 0.9, 0.1, 1] as const;

/** A 12-week strip with one phase marked - used on each card on phones and tablets. */
function MiniStrip({ from, to }: { from: number; to: number }) {
  return (
    <span aria-hidden className="mt-4 grid grid-cols-12 gap-[3px]">
      {Array.from({ length: WEEKS }).map((_, w) => (
        <span key={w} className={`ms-cell h-1.5 origin-left rounded-full ${w + 1 >= from && w + 1 <= to ? "bg-signal" : "bg-white/10"}`} />
      ))}
    </span>
  );
}

/**
 * Method as mission control. A pinned panel holds a 12-week chart of the four
 * phases and a small monitor; as you scroll the steps, the playhead travels
 * across the weeks and the active phase lights up.
 */
export function Method() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const step = method[active];

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".method-step").forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setActive(i) });
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".mt-head > p", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".mt-head", start: "clamp(top 85%)", once: true } });
        // Phones and tablets: each card rises in, its weeks fill along the strip and its frame unmasks
        if (window.innerWidth < 1024) {
          gsap.utils.toArray<HTMLElement>(".method-step article").forEach((card) => {
            gsap
              .timeline({ scrollTrigger: { trigger: card, start: "clamp(top 86%)", once: true }, defaults: { ease: "power3.out" } })
              .fromTo(card, { y: 60, opacity: 0, rotateX: 10, transformPerspective: 1000, transformOrigin: "50% 100%" }, { y: 0, opacity: 1, rotateX: 0, transformPerspective: 1000, duration: 1, clearProps: "transform,opacity" }, 0)
              .from(card.querySelector(".m-num"), { xPercent: 30, opacity: 0, duration: 1.1 }, 0.1)
              .from(card.querySelectorAll(".m-chip"), { y: 10, opacity: 0, duration: 0.5, stagger: 0.06 }, 0.35)
              .from(card.querySelectorAll(".ms-cell"), { scaleX: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }, 0.4)
              .fromTo(card.querySelector(".m-img"), { clipPath: "inset(0% 100% 0% 0% round 16px)" }, { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.1, ease: "power4.inOut" }, 0.45)
              .from(card.querySelector(".m-img img"), { scale: 1.2, duration: 1.6 }, 0.45);
          });
        }
        gsap.from(".gantt-bar", { scaleX: 0, transformOrigin: "0% 50%", duration: 1, ease: "power3.inOut", stagger: 0.12, scrollTrigger: { trigger: ".gantt", start: "clamp(top 85%)", once: true } });
      });

      // The playhead follows the reader through the twelve weeks
      const head = ref.current!.querySelector<HTMLElement>(".playhead");
      const label = ref.current!.querySelector<HTMLElement>(".playhead-wk");
      if (head && label) {
        // transform only (no layout), eased so it glides rather than ticks
        const toX = gsap.quickTo(head, "x", { duration: 0.35, ease: "power3" });
        let shown = 0;
        ScrollTrigger.create({
          trigger: ".method-list",
          start: "top 55%",
          end: "bottom 55%",
          onUpdate: (self) => {
            const wk = 1 + self.progress * (WEEKS - 1);
            const track = head.parentElement!.clientWidth;
            toX(((wk - 0.5) / WEEKS) * track);
            const n = Math.round(wk);
            if (n !== shown) {
              shown = n;
              label.textContent = `wk ${String(n).padStart(2, "0")}`;
            }
          },
        });
        gsap.set(head, { x: (0.5 / WEEKS) * head.parentElement!.clientWidth });
      }
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="method" aria-labelledby="method-title" className="relative py-24 md:py-32">
      <div className="frame">
        <div className="mt-head flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <h2 id="method-title" className="reveal-title wide text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
            How it goes
          </h2>
          <p className="mono max-w-[40ch] text-mist">
            twelve weeks · four phases · a working demo every friday from week three
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-12 lg:gap-8">
          {/* Mission control (tablet and up) */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="glass glass-solid sticky top-24 overflow-hidden rounded-3xl">
              <div className="mono flex items-center justify-between border-b border-white/10 px-5 py-3 text-mist">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />
                  phase <span className="text-ice">{step.id}</span> / 0{method.length} · <span className="text-ice">{step.name.toLowerCase()}</span>
                </span>
                <span>{step.weeks}</span>
              </div>

              {/* 12-week chart */}
              <div className="gantt relative px-5 pb-9 pt-4" aria-hidden>
                <div className="mono grid grid-cols-12 text-[0.625rem] text-dim">
                  {Array.from({ length: WEEKS }).map((_, w) => (
                    <span key={w} className="border-l border-white/[0.06] pl-1">
                      {String(w + 1).padStart(2, "0")}
                    </span>
                  ))}
                </div>
                <div className="relative mt-2 space-y-2">
                  {/* week grid lines */}
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-12">
                    {Array.from({ length: WEEKS }).map((_, w) => (
                      <span key={w} className="border-l border-white/[0.06]" />
                    ))}
                  </div>
                  {method.map((m, i) => {
                    const state = i === active ? "now" : i < active ? "done" : "next";
                    return (
                      <div key={m.id} className="relative grid h-8 grid-cols-12">
                        <div
                          className={`gantt-bar mono relative flex items-center overflow-hidden rounded-lg px-2.5 text-[0.6875rem] transition-colors duration-500 ${
                            state === "now" ? "bg-signal text-void" : state === "done" ? "bg-ice/25 text-ice" : "bg-white/[0.06] text-mist"
                          }`}
                          style={{ gridColumn: `${m.from} / ${m.to + 1}` }}
                        >
                          {state === "now" && (
                            <span className="absolute inset-0 animate-[shimmer_2.4s_linear_infinite] bg-[linear-gradient(110deg,transparent_30%,rgb(255_255_255/0.35)_50%,transparent_70%)] will-change-transform" />
                          )}
                          <span className="relative truncate">
                            {m.id} {m.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {/* playhead */}
                  <div className="playhead pointer-events-none absolute -bottom-2 -top-2 left-0 w-px bg-ice will-change-transform" style={{ transform: `translateX(calc(${(0.5 / WEEKS) * 100} * 1%))` }}>
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-ice" />
                    <span className="playhead-wk mono absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ice px-1.5 py-0.5 text-[0.625rem] text-void">wk 01</span>
                  </div>
                </div>
              </div>

              {/* monitor */}
              <div className="relative mx-5 mb-5 aspect-[16/9] overflow-hidden rounded-2xl bg-graphite">
                {/* every frame stays mounted (decoded once), the active one wipes in over the rest */}
                {method.map((m, i) => (
                  <motion.div
                    key={m.id}
                    className="absolute inset-0"
                    style={{ zIndex: i === active ? 2 : 1 }}
                    initial={false}
                    animate={{ clipPath: i === active ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)", scale: i === active ? 1 : 1.06 }}
                    transition={{ duration: i === active ? 0.7 : 0.01, delay: i === active ? 0 : 0.7, ease: snap }}
                  >
                    <Image src={m.image.src} alt={i === active ? m.image.alt : ""} fill loading="eager" placeholder="blur" sizes="(min-width: 1024px) 40vw, 50vw" className="object-cover" />
                  </motion.div>
                ))}
                <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/85 via-void/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-4">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p key={step.id} className="wide text-[clamp(2rem,3.4vw,3.2rem)] leading-none" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.4, ease: snap }}>
                      {step.name}
                    </motion.p>
                  </AnimatePresence>
                  <span className="mono pb-1 text-mist">{step.weeks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol className="method-list grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:block">
            {method.map((m, i) => {
              const on = i === active;
              return (
                <li key={m.id} className="method-step lg:min-h-[52svh] lg:py-4 lg:last:min-h-0">
                  <article
                    className={`relative h-full overflow-hidden rounded-3xl border p-6 transition-[border-color,background-color,translate] duration-500 ease-snap md:p-7 ${
                      on ? "border-signal/60 bg-white/[0.04] lg:-translate-x-2" : "border-white/10 bg-white/[0.015]"
                    }`}
                  >
                    {/* big outlined number */}
                    <span
                      aria-hidden
                      className={`m-num wide pointer-events-none absolute right-5 top-4 text-[clamp(4.5rem,8vw,6.5rem)] leading-none transition-colors duration-500 ${on ? "text-signal/15" : "text-transparent"}`}
                      style={{ WebkitTextStroke: on ? "1px rgb(255 90 31 / 0.6)" : "1px rgb(255 255 255 / 0.12)" }}
                    >
                      {m.id}
                    </span>
                    <p className="mono relative flex items-center gap-3 text-mist">
                      <span className={`grid h-7 w-7 place-items-center rounded-full border transition-colors duration-500 ${on ? "border-signal bg-signal text-void" : "border-white/20"}`}>{m.id}</span>
                      <span className="rounded-full border border-white/10 px-2.5 py-0.5">{m.weeks}</span>
                    </p>
                    <h3 className={`condensed relative mt-5 text-[clamp(2.2rem,4vw,3.4rem)] leading-none transition-colors duration-500 ${on ? "text-ice" : "text-ice/55"}`}>{m.name}</h3>
                    <p className="relative mt-3 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ice/80">{m.text}</p>
                    <ul className="mono relative mt-5 flex flex-wrap gap-1.5">
                      {m.deliverables.map((d) => (
                        <li key={d} className={`m-chip rounded-md border px-2 py-1 transition-colors duration-500 ${on ? "border-signal/40 text-ice" : "border-white/10 text-mist"}`}>
                          {d}
                        </li>
                      ))}
                    </ul>
                    {/* phones: the step's own frame and timeline */}
                    <div className="lg:hidden">
                      <MiniStrip from={m.from} to={m.to} />
                      <div className="m-img relative mt-5 aspect-[16/9] overflow-hidden rounded-2xl">
                        <Image src={m.image.src} alt={m.image.alt} fill placeholder="blur" sizes="90vw" className="object-cover" />
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
