"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { process, services } from "@/lib/content";
import { enter, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { FoldText, Mark, Seam } from "../motion/Fold";

const steps = [
  { n: "01", t: "Survey", d: "We measure, photograph and spend time on site before anything is drawn.", face: "bg-ochre", edge: "bg-[#b9861f]", img: 0 },
  { n: "02", t: "Draw", d: "By hand first, then in the model. Every room is drawn at 1:20 before it is built.", face: "bg-blush", edge: "bg-[#c99d8d]", img: 2 },
  { n: "03", t: "Build", d: "On site weekly until handover, and back a year later to see how it is lived in.", face: "bg-verdigris", edge: "bg-[#1f4a41]", img: 1 },
];

const fold = [0.7, 0, 0.2, 1] as const;

/**
 * How the practice works, shown as an exploded axonometric: three slabs of
 * the process stacked like floors, which pull apart as the section arrives.
 * Pointing at a step lifts its slab out of the stack.
 */
export function Practice() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [openService, setOpenService] = useState<number | null>(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rig = ref.current!.querySelector<HTMLElement>(".axo-rig")!;
        const gap = () => `${Math.round(Math.min(64, rig.offsetWidth * 0.2))}px`;
        gsap.set(rig, { rotateX: 58, rotateZ: -42 });
        gsap
          .timeline({ scrollTrigger: enter(".axo", "75%") })
          .fromTo(rig, { "--gap": "0px", rotateZ: -20 }, { "--gap": gap, rotateZ: -42, duration: 1.8, ease: "expo.inOut" }, 0)
          .from(".axo-slab", { opacity: 0, duration: 0.6, stagger: 0.12 }, 0)
          .from(".step", { x: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.12 }, 0.5)
          .add(() => rig.querySelectorAll(".axo-slab").forEach((s) => s.classList.add("is-ready")));
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="practice" aria-labelledby="practice-title" className="relative overflow-x-clip bg-plaster py-24 md:py-32">
      <Seam className="fill-plaster" />
      <div className="sheet">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="label text-rust lg:col-span-2">03 / The practice</p>
          <div className="lg:col-span-10">
            <FoldText as="h2" id="practice-title" by="chars" className="display text-[clamp(2.4rem,5vw,5.2rem)]">
              One practice, <span className="serif font-normal text-verdigris">three</span> <Mark kind="under" tone="text-cobalt">layers</Mark> deep.
            </FoldText>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] text-ink/75">
              Five disciplines under one roof, so the building, the interior and the landscape are drawn by the same people, in the same order every
              time.
            </p>
          </div>
        </div>

        {/* Exploded axonometric + steps */}
        <div className="mt-14 grid grid-cols-1 items-center gap-12 md:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="axo relative mx-auto aspect-square w-full max-w-[min(30rem,68svh)] [perspective:2400px] lg:col-span-6">
            <div
              className="axo-rig preserve absolute inset-x-[20%] bottom-[10%] top-[30%]"
              style={{ "--gap": "56px", transform: "rotateX(58deg) rotateZ(-42deg)" } as CSSProperties}
            >
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  className="axo-slab preserve absolute inset-0 [&.is-ready]:transition-transform [&.is-ready]:duration-700 [&.is-ready]:ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `translateZ(calc(var(--gap) * ${i} + ${active === i ? 36 : 0}px))` }}
                >
                  {/* slab thickness */}
                  <div className={`absolute inset-0 ${s.edge}`} style={{ transform: "translateZ(-9px)" }} />
                  <div className={`absolute inset-0 border-[1.5px] border-ink p-[7%] ${s.face}`}>
                    <div className="relative h-full w-full overflow-hidden border border-ink/40">
                      <Image
                        src={process[s.img].src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 18vw, 40vw"
                        className={`grade object-cover ${s.img === 2 ? "object-[50%_100%]" : ""}`}
                      />
                    </div>
                    <span aria-hidden className="label absolute -top-px left-[7%] hidden -translate-y-full bg-ink px-1.5 py-0.5 text-[0.625rem] text-paper sm:block">
                      {s.n} {s.t}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ol className="lg:col-span-5 lg:col-start-8">
            {steps.map((s, i) => (
              <li key={s.n} className="step border-t border-ink/20 last:border-b">
                <button
                  type="button"
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                  onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={(e) => {
                    // Mouse: hover already lifted it. Keyboard: focus did. Touch/pen: each tap toggles it.
                    const type = (e.nativeEvent as PointerEvent).pointerType;
                    if (e.detail > 0 && type && type !== "mouse") setActive((a) => (a === i ? null : i));
                  }}
                  aria-pressed={active === i}
                  className="grid w-full grid-cols-[3rem_1fr] gap-x-3 py-6 text-left"
                >
                  <span className={`label grid h-9 w-9 place-items-center border border-ink transition-colors duration-300 ${active === i ? `${s.face} ${i === 2 ? "text-paper" : "text-ink"}` : ""}`}>{s.n}</span>
                  <span>
                    <span className="display block text-[1.6rem] tracking-[-0.03em]">{s.t}</span>
                    <span className="mt-1.5 block max-w-[40ch] text-ink/75">{s.d}</span>
                  </span>
                </button>
              </li>
            ))}
            <p className="label mt-4 text-ink/60">Point at (or tap) a step to lift its layer out of the stack.</p>
          </ol>
        </div>

        {/* Services: each one folds open */}
        <div className="mt-24 md:mt-32">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-3">
            <h3 className="display text-[1.5rem] tracking-[-0.03em]">Schedule of services</h3>
            <p className="label text-ink/60">Open any line for scope and deliverables</p>
          </div>
          <ul>
            {services.map((s, i) => {
              const isOpen = openService === i;
              return (
                <li key={s.name} className="border-b border-ink/15">
                  <h4>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`svc-${i}`}
                      onClick={() => setOpenService(isOpen ? null : i)}
                      className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 py-5 text-left md:grid-cols-[3rem_1fr_12rem_auto]"
                    >
                      <span className="label text-rust">0{i + 1}</span>
                      <span className="display text-[clamp(1.3rem,2.4vw,2.1rem)] tracking-[-0.03em] transition-colors group-hover:text-cobalt">{s.name}</span>
                      <span className="label hidden text-ink/65 md:block">{s.duration}</span>
                      <span aria-hidden className={`grid h-9 w-9 place-items-center border border-ink text-lg transition-[transform,background-color,color] duration-500 ease-out-expo ${isOpen ? "rotate-45 bg-ink text-paper" : ""}`}>
                        +
                      </span>
                    </button>
                  </h4>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`svc-${i}`}
                        key="c"
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.6, ease: fold }}
                        className="fold-stage overflow-hidden"
                      >
                        <motion.div
                          initial={{ rotateX: -80, opacity: 0 }}
                          animate={{ rotateX: 0, opacity: 1 }}
                          exit={{ rotateX: -80, opacity: 0 }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          style={{ transformOrigin: "50% 0%" }}
                          className="grid gap-6 pb-8 pl-[2.75rem] md:grid-cols-3 md:pl-[3.75rem]"
                        >
                          <div>
                            <p className="label text-ink/55">Scope</p>
                            <p className="mt-1.5 text-ink/85">{s.scope}</p>
                          </div>
                          <div>
                            <p className="label text-ink/55">Deliverables</p>
                            <p className="mt-1.5 text-ink/85">{s.deliverables}</p>
                          </div>
                          <div>
                            <p className="label text-ink/55">Typical duration</p>
                            <p className="mt-1.5 inline-block bg-ochre px-2 py-0.5 text-ink">{s.duration}</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
